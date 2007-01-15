// ---------------------------------------------------------------------------------
// Options cookie stuff
// ---------------------------------------------------------------------------------

config.optionHandlers = {
	'txt': {
 		export: function(name) {return encodeCookie(config.options[name].toString());},
		import: function(name,value) {config.options[name] = decodeCookie(value);}
	},
	'chk': {
 		export: function(name) {return config.options[name] ? "true" : "false";},
		import: function(name,value) {config.options[name] = value == "true";}	
	}	
};

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
			var optType = name.substr(0,3);
			if (config.optionHandlers[optType] && config.optionHandlers[optType].import)
				config.optionHandlers[optType].import(name,value);
			}
		}
}

function saveOptionCookie(name)
{
	if(safeMode)
		return;
	var c = name + "=";
	var optType = name.substr(0,3);
	if (config.optionHandlers[optType] && config.optionHandlers[optType].export)
		c += config.optionHandlers[optType].export(name);
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
