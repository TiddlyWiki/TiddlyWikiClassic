//--
//-- Paramifiers
//--

function getParameters() {
	return window.location.hash ? decodeURIComponent(window.location.hash.substr(1)) : null;
}

function invokeParamifier(params, handler) {
	if(!params || params.length == undefined || params.length <= 1)
		return;

	for(var i = 1; i < params.length; i++) {
		var name = params[i].name,
		    value = params[i].value;
		var p = config.paramifiers[name];
		if(p && p[handler] instanceof Function)
			p[handler](value);
		else {
			//# not a paramifier with handler()... check for an 'option' prefix
			var h = config.optionHandlers[name.substr(0, 3)];
			if(h && h.set instanceof Function)
				h.set(name, value);
		}
	}
}

config.paramifiers = {};

config.paramifiers.start = {
	oninit: function(v) {
		safeMode = v.toLowerCase() == "safe";
	}
};

config.paramifiers.open = {
	onstart: function(title) {
		if(!readOnly || store.tiddlerExists(title) || store.isShadowTiddler(title))
			story.displayTiddler("bottom", title, null, false, null);
	}
};

config.paramifiers.story = {
	onstart: function(title) {
		var list = store.getTiddlerText(title, "").parseParams("open", null, false);
		invokeParamifier(list, "onstart");
	}
};

config.paramifiers.search = {
	onstart: function(query) {
		story.search(query, false, false);
	}
};

config.paramifiers.searchRegExp = {
	onstart: function(v) {
		story.prototype.search(v, false, true);
	}
};

config.paramifiers.tag = {
	onstart: function(tag) {
		story.displayTiddlers(null, store.filterTiddlers("[tag[" + tag + "]]"), null, false, null);
	}
};

config.paramifiers.newTiddler = {
	onstart: function(v) {
		if(readOnly) return;
		var args = v.parseParams("anon", null, null)[0];
		var title = args.title ? args.title[0] : v;
		var customFields = args.fields ? args.fields[0] : null;

		story.displayTiddler(null, title, DEFAULT_EDIT_TEMPLATE, false, null, customFields);
		story.focusTiddler(title, "text");
		var i, tags = args.tag || [];
		for(i = 0; i < tags.length; i++) {
			story.setTiddlerTag(title, tags[i], +1);
		}
	}
};

config.paramifiers.newJournal = {
	onstart: function(titleTemplate) {
		if(readOnly) return;
		var now = new Date();
		var title = now.formatString(titleTemplate.trim());
		story.displayTiddler(null, title, DEFAULT_EDIT_TEMPLATE);
		story.focusTiddler(title, "text");
	}
};

config.paramifiers.readOnly = {
	onconfig: function(v) {
		var p = v.toLowerCase();
		readOnly = p == "yes" ? true : (p == "no" ? false : readOnly);
	}
};

config.paramifiers.theme = {
	onconfig: function(themeTitle) {
		story.switchTheme(themeTitle);
	}
};

config.paramifiers.upgrade = {
	onstart: function(v) {
		upgradeFrom(v);
	}
};

config.paramifiers.recent = {
	onstart: function(limit) {
		var titles = [];
		var i, tiddlers = store.getTiddlers("modified", "excludeLists").reverse();
		for(i = 0; i < limit && i < tiddlers.length; i++)
			titles.push(tiddlers[i].title);
		story.displayTiddlers(null, titles);
	}
};

config.paramifiers.filter = {
	onstart: function(filterExpression) {
		story.displayTiddlers(null, store.filterTiddlers(filterExpression), null, false);
	}
};

