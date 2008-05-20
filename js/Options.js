//--
//-- Options stuff
//--

config.optionHandlers = {
	'txt': {
		get: function(name) {return encodeCookie(config.options[name].toString());},
		set: function(name,value) {config.options[name] = decodeCookie(value);}
	},
	'chk': {
		get: function(name) {return config.options[name] ? "true" : "false";},
		set: function(name,value) {config.options[name] = value == "true";}
	}
};

function loadOptionsCookie()
{
	if(safeMode)
		return;
	var cookies = document.cookie.split(";");
	for(var c=0; c<cookies.length; c++) {
		var p = cookies[c].indexOf("=");
		if(p != -1) {
			var name = cookies[c].substr(0,p).trim();
			var value = cookies[c].substr(p+1).trim();
			var optType = name.substr(0,3);
			if(config.optionHandlers[optType] && config.optionHandlers[optType].set)
				config.optionHandlers[optType].set(name,value);
		}
	}
}

function saveOptionCookie(name)
{
	if(safeMode)
		return;
	var c = name + "=";
	var optType = name.substr(0,3);
	if(config.optionHandlers[optType] && config.optionHandlers[optType].get)
		c += config.optionHandlers[optType].get(name);
	c += "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/";
	document.cookie = c;
}

function encodeCookie(s)
{
	return escape(convertUnicodeToHtmlEntities(s));
}

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
			config.macros.option.propagateOption(opt,handler.valueField,this[handler.valueField],handler.elementType);
	}
	return true;
};

config.macros.option.types = {
	'txt': {
		elementType: "input",
		valueField: "value",
		eventName: "onkeyup",
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

config.macros.option.propagateOption = function(opt,valueField,value,elementType)
{
	config.options[opt] = value;
	saveOptionCookie(opt);
	var nodes = document.getElementsByTagName(elementType);
	for(var t=0; t<nodes.length; t++) {
		var optNode = nodes[t].getAttribute("option");
		if(opt == optNode)
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

