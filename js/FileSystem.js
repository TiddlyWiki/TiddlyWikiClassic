
// UTF-8 encoding rules:
// 0x0000 - 0x007F:	0xxxxxxx
// 0x0080 - 0x07FF:	110xxxxx 10xxxxxx
// 0x0800 - 0xFFFF:	1110xxxx 10xxxxxx 10xxxxxx

function convertUTF8ToUnicode(u)
{
	if(window.Components)
		return mozConvertUTF8ToUnicode(u);
	else
		return manualConvertUTF8ToUnicode(u);
}

function manualConvertUTF8ToUnicode(u)
{
	var s = "";
	var t = 0;
	var b1, b2, b3;
	while(t < u.length)
		{
		b1 = u.charCodeAt(t++);
		if(b1 < 0x80)
			s += String.fromCharCode(b1);
		else if(b1 < 0xE0)
			{
			b2 = u.charCodeAt(t++);
			s += String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F));
			}
		else
			{
			b2 = u.charCodeAt(t++);
			b3 = u.charCodeAt(t++);
			s += String.fromCharCode(((b1 & 0xF) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
			}
	}
	return(s);
}

function mozConvertUTF8ToUnicode(u)
{
	if (window.netscape == undefined)
		return manualConvertUTF8ToUnicode(u); // fallback
	try
		{
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
	catch(e)
		{
		return manualConvertUTF8ToUnicode(u);
		} // fallback
	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";
	var s = converter.ConvertToUnicode(u);
	var fin = converter.Finish();
	return (fin.length > 0) ? s+fin : s;
}

function convertUnicodeToUTF8(s)
{
	if(saveUsingSafari)
		return s;
	else if(window.Components)
		return mozConvertUnicodeToUTF8(s);
	else
		return manualConvertUnicodeToUTF8(s);
}

function manualConvertUnicodeToUTF8(s)
{
	var re = /[^\u0000-\u007F]/g ;
	return s.replace(re, function($0) {return("&#" + $0.charCodeAt(0).toString() + ";");})
}

function mozConvertUnicodeToUTF8(s)
{
	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";
	var u = converter.ConvertFromUnicode(s);
	var fin = converter.Finish();
	if(fin.length > 0)
		return u + fin;
	else
		return u;
}

function saveFile(fileUrl, content)
{
	var r = null;
	if(saveUsingSafari)
		r = safariSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = mozillaSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = ieSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = operaSaveFile(fileUrl, content);
	return(r);
}

function loadFile(fileUrl)
{
	var r = null;
	if(saveUsingSafari)
		r = safariLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = mozillaLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = ieLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = operaLoadFile(fileUrl);
	return(r);
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function ieSaveFile(filePath, content)
{
	try
		{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		}
	catch(e)
		{
		//alert("Exception while attempting to save\n\n" + e.toString());
		return(null);
		}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return(true);
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function ieLoadFile(filePath)
{
	try
		{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath,1);
		var content = file.ReadAll();
		file.Close();
		}
	catch(e)
		{
		//alert("Exception while attempting to load\n\n" + e.toString());
		return(null);
		}
	return(content);
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function mozillaSaveFile(filePath, content)
{
	if(window.Components)
		try
			{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if (!file.exists())
				file.create(0, 0664);
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file, 0x20 | 0x02, 00004,null);
			out.write(content, content.length);
			out.flush();
			out.close();
			return(true);
			}
		catch(e)
			{
			//alert("Exception while attempting to save\n\n" + e);
			return(false);
			}
	return(null);
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function mozillaLoadFile(filePath)
{
	if(window.Components)
		try
			{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if (!file.exists())
				return(null);
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(file, 0x01, 00004, null);
			var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			sInputStream.init(inputStream);
			return(sInputStream.read(sInputStream.available()));
			}
		catch(e)
			{
			//alert("Exception while attempting to load\n\n" + e);
			return(false);
			}
	return(null);
}

function operaUrlToFilename(url)
{
	var f = "//localhost";
	if(url.indexOf(f) == 0)
		return url.substring(f.length);
	var i = url.indexOf(":");
	if(i > 0)
		return url.substring(i-1);
	return url;
}

function operaSaveFile(filePath, content)
{
	try
		{
		var s = new java.io.PrintStream(new java.io.FileOutputStream(operaUrlToFilename(filePath)));
		s.print(content);
		s.close();
		}
	catch(e)
		{
		if(window.opera)
			opera.postError(e);
		return null;
		}
	return true;
}

function operaLoadFile(filePath)
{
	var content = [];
	try
		{
		var r = new java.io.BufferedReader(new java.io.FileReader(operaUrlToFilename(filePath)));
		var line;
		while ((line = r.readLine()) != null)
			content.push(new String(line));
		r.close();
		}
	catch(e)
		{
		if(window.opera)
			opera.postError(e);
		return null;
		}
	return content.join("\n");
}

function safariFilenameToUrl(filename) {
	return ("file://" + filename);
}

function safariLoadFile(url)
{
	url = safariFilenameToUrl(url);
	var plugin = document.embeds["tiddlyWikiSafariSaver"];
	return plugin.readURL(url);
}

function safariSaveFile(url,content)
{
	url = safariFilenameToUrl(url);
	var plugin = document.embeds["tiddlyWikiSafariSaver"];
	return plugin.writeStringToURL(content,url);
}

// Lifted from http://developer.apple.com/internet/webcontent/detectplugins.html
function detectPlugin()
{
	var daPlugins = detectPlugin.arguments;
	var pluginFound = false;
	if (navigator.plugins && navigator.plugins.length > 0)
		{
		var pluginsArrayLength = navigator.plugins.length;
		for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ )
			{
			var numFound = 0;
			for(var namesCounter=0; namesCounter < daPlugins.length; namesCounter++)
				{
				if( (navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter]) >= 0) ||
						(navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter]) >= 0) )
					numFound++;
				}
			if(numFound == daPlugins.length)
				{
				pluginFound = true;
				break;
				}
			}
	}
	return pluginFound;
}

