// ---------------------------------------------------------------------------------
// Options cookie stuff
// ---------------------------------------------------------------------------------

function loadOptionsCookie()
{
	if(safeMode)
		return;
	var cookies = document.cookie.split(";");
	for(var c=0; c<cookies.length; c++)
		{
		var p = cookies[c].indexOf("=");
		if(p != -1)
			{
			var name = cookies[c].substr(0,p).trim();
			var value = cookies[c].substr(p+1).trim();
			switch(name.substr(0,3))
				{
				case "txt":
					config.options[name] = decodeCookie(value);
					break;
				case "chk":
					config.options[name] = value == "true";
					break;
				}
			}
		}
}

function saveOptionCookie(name)
{
	if(safeMode)
		return;
	var c = name + "=";
	switch(name.substr(0,3))
		{
		case "txt":
			c += encodeCookie(config.options[name].toString());
			break;
		case "chk":
			c += config.options[name] ? "true" : "false";
			break;
		}
	c += "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/";
	document.cookie = c;
}

function encodeCookie(s)
{
	return escape(manualConvertUnicodeToUTF8(s));
}

function decodeCookie(s)
{	
	s=unescape(s);
	var re = /&#[0-9]{1,5};/g;
	return s.replace(re, function($0) {return(String.fromCharCode(eval($0.replace(/[&#;]/g,""))));});
}
