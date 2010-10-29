//--
//-- Options stuff
//--

config.optionHandlers = {
	'txt': {
		get: function(name) {return config.options[name].toString();},
		set: function(name,value) {config.options[name] = value;}
	},
	'chk': {
		get: function(name) {return config.options[name] ? "true" : "false";},
		set: function(name,value) {config.options[name] = value == "true";}
	}
};

function setOption(name,value)
{
	var optType = name.substr(0,3);
	if(config.optionHandlers[optType] && config.optionHandlers[optType].set)
		config.optionHandlers[optType].set(name,value);
}

// Gets the value of an option as a string. Most code should just read from config.options.* directly 
function getOption(name)
{
	var optType = name.substr(0,3);
	return config.optionHandlers[optType] && config.optionHandlers[optType].get ? config.optionHandlers[optType].get(name) : null;
} 

//# Loads config.options from cookies and SystemSettings 
function loadOptions()
{
	if(safeMode)
		return;
	loadSystemSettings();
	loadCookies();
}
// Deprecated name for backwards compatibility 
var loadOptionsCookie = loadOptions;

function getCookies()
{
	var cookieList = document.cookie.split(";");
	var cookies = {};
	for(var i=0; i<cookieList.length; i++) {
		var p = cookieList[i].indexOf("=");
		if(p != -1) {
			var name = cookieList[i].substr(0,p).trim();
			var value = cookieList[i].substr(p+1).trim()
			cookies[name] = decodeCookie(value);
		}
	}
	return cookies;
}

function loadCookies()
{
	var cookies = getCookies();
	if(cookies["TiddlyWiki"]) {
		cookies = cookies["TiddlyWiki"].decodeHashMap();
	}
	for(var i in cookies) {
		if(config.optionSource[i] == 'cookie') {
			setOption(i,cookies[i]);
		}
	}
}

function loadSystemSettings()
{
	var settings = store.calcAllSlices("SystemSettings");
	for(var key in settings) {
		var pos = key.indexOf('_');
		var name = key;
		var source = "setting";
		if(pos !== -1) {
			source = key.substr(pos+1);
			name = key.substr(0,pos);
		} 
		setOption(name,settings[key]);
		config.optionSource[name] = source;
	} 
}

function onSystemSettingsChange()
{
	if(!startingUp) {
		loadSystemSettings();
	}
}

function saveOption(name)
{
	if(safeMode)
		return;
	if(name.match(/[()\s]/g, "_")) {
		alert(config.messages.invalidCookie.format([name]));
		return;
	}
	if(config.optionSource[name] == 'cookie') {
		saveCookie(name);
	} else {
		saveSystemSetting(name);
	}
}
// Deprecated names for backwards compatibility
var saveOptionCookie = saveOption;

function removeCookie(name)
{
	document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;";
}

function saveCookie(name)
{
	var cookies = {};
	for(var key in config.options) {
		if(config.optionSource[key] == "cookie") {
			var value = getOption(key);
			value = value == null ? "" : value;
			cookies[key] = value;
		}
	}
	document.cookie = "TiddlyWiki=" + encodeCookie(String.encodeHashMap(cookies)) + "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/";
	cookies = getCookies();
	for(var i in cookies) {
		if(i != "TiddlyWiki")
			removeCookie(i);
	} 
} 

function saveSystemSetting(name)
{
	var settings = store.calcAllSlices("SystemSettings");
	var key;
	for(key in config.options) {
		if(config.optionSource[key] == undefined || config.optionSource[key] == "setting") {
			var value = getOption(key);
			value = value == null ? "" : value;
			if(settings[key] !== value)
				settings[key] = value;
		}
	}
	var text = [];
	for(key in settings) {
		text.push("%0: %1".format([key,settings[key]]));
	}
	text.sort();
	store.saveTiddler("SystemSettings","SystemSettings",text.join("\n"),"System",new Date());
	autoSaveChanges();
}

//# Flatten cookies to ANSI character set by substituting html character entities for non-ANSI characters 
function encodeCookie(s)
{
	return escape(convertUnicodeToHtmlEntities(s));
}

//# Decode any html character entities to their unicode equivalent 
function decodeCookie(s)
{
	s = unescape(s);
	var re = /&#[0-9]{1,5};/g;
	return s.replace(re,function($0) {return String.fromCharCode(eval($0.replace(/[&#;]/g,"")));});
}

config.macros.option.genericCreate = function(place,type,opt,className,desc)
{
	var typeInfo = config.macros.option.types[type];
	var c = document.createElement(typeInfo.elementType);
	if(typeInfo.typeValue)
		c.setAttribute("type",typeInfo.typeValue);
	c[typeInfo.eventName] = typeInfo.onChange;
	c.setAttribute("option",opt);
	c.className = className || typeInfo.className;
	if(config.optionsDesc[opt])
		c.setAttribute("title",config.optionsDesc[opt]);
	place.appendChild(c);
	if(desc != "no")
		createTiddlyText(place,config.optionsDesc[opt] || opt);
	c[typeInfo.valueField] = config.options[opt];
	return c;
};

config.macros.option.genericOnChange = function(e)
{
	var opt = this.getAttribute("option");
	if(opt) {
		var optType = opt.substr(0,3);
		var handler = config.macros.option.types[optType];
		if(handler.elementType && handler.valueField)
			config.macros.option.propagateOption(opt,handler.valueField,this[handler.valueField],handler.elementType,this);
	}
	return true;
};

config.macros.option.types = {
	'txt': {
		elementType: "input",
		valueField: "value",
		eventName: "onchange",
		className: "txtOptionInput",
		create: config.macros.option.genericCreate,
		onChange: config.macros.option.genericOnChange
	},
	'chk': {
		elementType: "input",
		valueField: "checked",
		eventName: "onclick",
		className: "chkOptionInput",
		typeValue: "checkbox",
		create: config.macros.option.genericCreate,
		onChange: config.macros.option.genericOnChange
	}
};

config.macros.option.propagateOption = function(opt,valueField,value,elementType,elem)
{
	config.options[opt] = value;
	saveOptionCookie(opt);
	var nodes = document.getElementsByTagName(elementType);
	for(var t=0; t<nodes.length; t++) {
		var optNode = nodes[t].getAttribute("option");
		if(opt == optNode && nodes[t]!=elem)
			nodes[t][valueField] = value;
	}
};

config.macros.option.handler = function(place,macroName,params,wikifier,paramString)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var opt = (params[1] && params[1].name == "anon") ? params[1].value : getParam(params,"name",null);
	var className = (params[2] && params[2].name == "anon") ? params[2].value : getParam(params,"class",null);
	var desc = getParam(params,"desc","no");
	var type = opt.substr(0,3);
	var h = config.macros.option.types[type];
	if(h && h.create)
		h.create(place,type,opt,className,desc);
};

config.macros.options.handler = function(place,macroName,params,wikifier,paramString)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var showUnknown = getParam(params,"showUnknown","no");
	var wizard = new Wizard();
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var chkUnknown = wizard.getElement("chkUnknown");
	chkUnknown.checked = showUnknown == "yes";
	chkUnknown.onchange = this.onChangeUnknown;
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	wizard.setValue("listWrapper",listWrapper);
	this.refreshOptions(listWrapper,showUnknown == "yes");
};

config.macros.options.refreshOptions = function(listWrapper,showUnknown)
{
	var opts = [];
	for(var n in config.options) {
		var opt = {};
		opt.option = "";
		opt.name = n;
		opt.lowlight = !config.optionsDesc[n];
		opt.description = opt.lowlight ? this.unknownDescription : config.optionsDesc[n];
		if(!opt.lowlight || showUnknown)
			opts.push(opt);
	}
	opts.sort(function(a,b) {return a.name.substr(3) < b.name.substr(3) ? -1 : (a.name.substr(3) == b.name.substr(3) ? 0 : +1);});
	var listview = ListView.create(listWrapper,opts,this.listViewTemplate);
	for(n=0; n<opts.length; n++) {
		var type = opts[n].name.substr(0,3);
		var h = config.macros.option.types[type];
		if(h && h.create) {
			h.create(opts[n].colElements['option'],type,opts[n].name,null,"no");
		}
	}
};

config.macros.options.onChangeUnknown = function(e)
{
	var wizard = new Wizard(this);
	var listWrapper = wizard.getValue("listWrapper");
	removeChildren(listWrapper);
	config.macros.options.refreshOptions(listWrapper,this.checked);
	return false;
};

