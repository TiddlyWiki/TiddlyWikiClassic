//--
//-- Filesystem code
//--
//#
//# This code is designed to be reusable, but please take care,
//# there are some intricacies that make it tricky to use these
//# functions with full UTF-8 files. For more details, see:
//#
//# http://trac.tiddlywiki.org/ticket/99
//#
//#

// Copy a file in filesystem [Preemption]
window.copyFile = window.copyFile || function(dest,source)
{
	return config.browser.isIE ? ieCopyFile(dest,source) : false;
}


// Save a file in filesystem [Preemption]
window.saveFile = window.saveFile || function(fileUrl,content)
{
	var r = mozillaSaveFile(fileUrl,content);
	if(!r)
		r = ieSaveFile(fileUrl,content);
	if(!r)
		r = javaSaveFile(fileUrl,content);
	if(!r)
		r = HTML5DownloadSaveFile(fileUrl,content);
	if(!r)
		r = manualSaveFile(fileUrl,content);
	return r;
}

// Load a file from filesystem [Preemption]
window.loadFile = window.loadFile || function(fileUrl)
{
	var r = mozillaLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = ieLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = javaLoadFile(fileUrl);
	return r;
}

function ieCreatePath(path)
{
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}

	//# Remove the filename, if present. Use trailing slash (i.e. "foo\bar\") if no filename.
	var pos = path.lastIndexOf("\\");
	if(pos==-1)
		pos = path.lastIndexOf("/");
	if(pos!=-1)
		path = path.substring(0,pos+1);

	//# Walk up the path until we find a folder that exists
	var scan = [path];
	var parent = fso.GetParentFolderName(path);
	while(parent && !fso.FolderExists(parent)) {
		scan.push(parent);
		parent = fso.GetParentFolderName(parent);
	}

	//# Walk back down the path, creating folders
	for(i=scan.length-1;i>=0;i--) {
		if(!fso.FolderExists(scan[i])) {
			fso.CreateFolder(scan[i]);
		}
	}
	return true;
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function ieSaveFile(filePath,content)
{
	ieCreatePath(filePath);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		//# alert("Exception while attempting to save\n\n" + ex.toString());
		return null;
	}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return true;
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function ieLoadFile(filePath)
{
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath,1);
		var content = file.ReadAll();
		file.Close();
	} catch(ex) {
		//# alert("Exception while attempting to load\n\n" + ex.toString());
		return null;
	}
	return content;
}

function ieCopyFile(dest,source)
{
	ieCreatePath(dest);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		fso.GetFile(source).Copy(dest);
	} catch(ex) {
		return false;
	}
	return true;
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function mozillaSaveFile(filePath,content)
{
	if(window.Components) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				file.create(0,0x01B4);// 0x01B4 = 0664
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file,0x22,0x04,null);
			out.write(content,content.length);
			out.flush();
			out.close();
			return true;
		} catch(ex) {
			//# alert("Exception while attempting to save\n\n" + ex);
			return false;
		}
	}
	return null;
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function mozillaLoadFile(filePath)
{
	if(window.Components) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				return null;
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(file,0x01,0x04,null);
			var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			sInputStream.init(inputStream);
			var contents = sInputStream.read(sInputStream.available());
			sInputStream.close();
			inputStream.close();
			return contents;
		} catch(ex) {
			//# alert("Exception while attempting to load\n\n" + ex);
			return false;
		}
	}
	return null;
}

function javaUrlToFilename(url)
{
	var f = "//localhost";
	if(url.indexOf(f) == 0)
		return url.substring(f.length);
	var i = url.indexOf(":");
	return i > 0 ? url.substring(i-1) : url;
}

/*
 *
 * in between when the applet has been started
 * and the user has given permission to run the applet
 * we get an applet object, but it doesn't have the methods
 * we expect yet.
 *
 */
var LOG_TIDDLYSAVER = true;
function logTiddlySaverException(msg, ex) {
	var applet = document.applets['TiddlySaver'];
	console.log(msg + ": " + ex);
	if (LOG_TIDDLYSAVER && applet) {
		try {
			console.log(msg + ": " + applet.getLastErrorMsg());
			console.log(msg + ": " + applet.getLastErrorStackTrace());
		} catch (ex) {}
	}
}

function javaDebugInformation () {
	var applet = document.applets['TiddlySaver'];
	var what = [
		["Java Version", applet.getJavaVersion],
		["Last Exception", applet.getLastErrorMsg], // #156
		["Last Exception Stack Trace", applet.getLastErrorStackTrace],
		["System Properties", applet.getSystemProperties] ];

	function formatItem (description, method) {
		try {
			 result = String(method.call(applet));
		} catch (ex) {
			 result = String(ex)
		}
		return description + ": " + result
	}

	return jQuery.map(what, function (item) { return formatItem.apply(this, item) })
			.join('\n\n')
}

function javaSaveFile(filePath,content)
{
	var applet = document.applets['TiddlySaver'];
	try {
		if (applet && filePath) 
			return applet.saveFile(javaUrlToFilename(filePath), "UTF-8", content);
	} catch(ex) {
		logTiddlySaverException("javaSaveFile", ex);
	}
	// is this next block working anywhere ? -- grmble
	try {
		var s = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(filePath)));
		s.print(content);
		s.close();
	} catch(ex2) {
		return null;
	}
	return true;
}

function javaLoadFile(filePath)
{
	var applet = document.applets['TiddlySaver'];
	try {
		if (applet && filePath) {
			var ret = applet.loadFile(javaUrlToFilename(filePath),"UTF-8");
			if(!ret)
				return null;
			return String(ret);
		}
	} catch(ex) {
		logTiddlySaverException("javaLoadFile", ex);
	}
	// is this next block working anywhere ? -- grmble
	var content = [];
	try {
		var r = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(filePath)));
		var line;
		while((line = r.readLine()) != null)
			content.push(String(line));
		r.close();
	} catch(ex2) {
		return null;
	}
	return content.join("\n");
}

function HTML5DownloadSaveFile(filePath,content)
{
	if(document.createElement("a").download !== undefined) {
		config.saveByDownload=true;
		var slashpos=filePath.lastIndexOf("/");
		if (slashpos==-1) slashpos=filePath.lastIndexOf("\\"); 
		var filename=filePath.substr(slashpos+1);
		var uri = getDataURI(content);
		var link = document.createElement("a");
		link.setAttribute("target","_blank");
		link.setAttribute("href",uri);
		link.setAttribute("download",filename);
		document.body.appendChild(link); link.click(); document.body.removeChild(link);
		return true;
	}
	return null;
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function manualSaveFile(filePath,content)
{
	// FALLBACK for showing a link to data: URI
	config.saveByManualDownload=true;
	var slashpos=filePath.lastIndexOf("/");
	if (slashpos==-1) slashpos=filePath.lastIndexOf("\\"); 
	var filename=filePath.substr(slashpos+1);
	var uri = getDataURI(content);
	displayMessage(config.messages.mainDownloadManual,uri);
	return true;
}

// construct data URI (using base64 encoding to preserve multi-byte encodings)
function getDataURI(data) {
	if (config.browser.isIE)
		return "data:text/html,"+encodeURIComponent(data);
	else
		return "data:text/html;base64,"+encodeBase64(data);
}

function encodeBase64(data) {
	if (!data) return "";
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var out = "";
	var chr1,chr2,chr3="";
	var enc1,enc2,enc3,enc4="";
	for (var count=0,i=0; i<data.length; ) {
		chr1=data.charCodeAt(i++);
		chr2=data.charCodeAt(i++);
		chr3=data.charCodeAt(i++);
		enc1=chr1 >> 2;
		enc2=((chr1 & 3) << 4) | (chr2 >> 4);
		enc3=((chr2 & 15) << 2) | (chr3 >> 6);
		enc4=chr3 & 63;
		if (isNaN(chr2)) enc3=enc4=64;
		else if (isNaN(chr3)) enc4=64;
		out+=keyStr.charAt(enc1)+keyStr.charAt(enc2)+keyStr.charAt(enc3)+keyStr.charAt(enc4);
		chr1=chr2=chr3=enc1=enc2=enc3=enc4="";
	}
	return out;
}