//--
//-- Paramifiers
//--

function getParameters()
{
	var p = null;
	if(window.location.hash) {
		p = decodeURI(window.location.hash.substr(1));
		if(config.browser.firefoxDate != null && config.browser.firefoxDate[1] < "20051111")
			p = convertUTF8ToUnicode(p);
	}
	return p;
}

function invokeParamifier(params,handler)
{
	if(!params || params.length == undefined || params.length <= 1)
		return;
	for(var t=1; t<params.length; t++) {
		var p = config.paramifiers[params[t].name];
		if(p && p[handler] instanceof Function)
			p[handler](params[t].value);
	}
}

function AsyncParamifier(p,h)
{
	this.params = p;
	this.handler = h;
	this.index = 1; // p[0] is not used
	if(!p || p.length == undefined || p.length <= 1)
		this.params.length = 0;
	return this;
}

AsyncParamifier.prototype.tick = function()
{
	if(this.index<this.params.length) {
		var p = config.paramifiers[this.params[this.index].name];
		if(p && p[this.handler] instanceof Function)
			p[this.handler](this.params[this.index].value,this.index);
		this.index++;
		return true;
	}
	return false;
};

function invokeParamifierAsync(params,handler)
{
	anim.startAnimating(new AsyncParamifier(params,handler));
}

config.paramifiers = {};

config.paramifiers.start = {
	oninit: function(v) {
		safeMode = v.toLowerCase() == "safe";
	}
};

config.paramifiers.open = {
	onstart: function(v,i) {
		story.displayTiddler(i == 1 ? null : "bottom",v,null,false,null);
	}
};

config.paramifiers.story = {
	onstart: function(v) {
		var list = store.getTiddlerText(v,"").parseParams("open",null,false);
		invokeParamifier(list,"onstart");
	}
};

config.paramifiers.search = {
	onstart: function(v) {
		story.search(v,false,false);
	}
};

config.paramifiers.searchRegExp = {
	onstart: function(v) {
		story.prototype.search(v,false,true);
	}
};

config.paramifiers.tag = {
	onstart: function(v) {
		var tagged = store.getTaggedTiddlers(v,"title");
		for(var t=0; t<tagged.length; t++)
			story.displayTiddler("bottom",tagged[t].title,null,false,null);
	}
};

config.paramifiers.newTiddler = {
	onstart: function(v) {
		if(!readOnly) {
			story.displayTiddler(null,v,DEFAULT_EDIT_TEMPLATE);
			story.focusTiddler(v,"text");
		}
	}
};

config.paramifiers.newJournal = {
	onstart: function(v) {
		if(!readOnly) {
			var now = new Date();
			var title = now.formatString(v.trim());
			story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE);
			story.focusTiddler(title,"text");
		}
	}
};

config.paramifiers.readOnly = {
	onconfig: function(v) {
		var p = v.toLowerCase();
		readOnly = p == "yes" ? true : (p == "no" ? false : readOnly);
	}
};
