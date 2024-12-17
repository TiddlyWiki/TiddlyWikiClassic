//--
//-- Search macro
//--

config.macros.search.handler = function(place, macroName, params, wikifier, paramString, tiddler) {
	params = paramString.parseParams("anon", null, false, false, false);
	createTiddlyButton(place, this.label, this.prompt, this.onClick, "button searchButton");

	var attributes = {
		size: this.sizeTextbox,
		accessKey: getParam(params, "accesskey", this.accessKey),
		autocomplete: "off",
		lastSearchText: "",
		placeholder: getParam(params, "placeholder", this.placeholder)
	};
	if(config.browser.isSafari) {
		attributes.type = "search";
		attributes.results = "5";
	} else {
		attributes.type = "text";
	}

	var input = createTiddlyElement(place, "input", null, "txtOptionInput searchField", null, attributes);
	input.value = getParam(params, "anon", "");
	input.onkeyup = this.onKeyPress;
	input.onfocus = this.onFocus;
};

// Global because there's only ever one outstanding incremental search timer
config.macros.search.timeout = null;

config.macros.search.doSearch = function(input) {
	if(input.value.length == 0) return;
	story.search(input.value, config.options.chkCaseSensitiveSearch, config.options.chkRegExpSearch);
	input.setAttribute("lastSearchText", input.value);
};

config.macros.search.onClick = function(e) {
	config.macros.search.doSearch(this.nextSibling);
	return false;
};

config.macros.search.onKeyPress = function(ev) {
	var me = config.macros.search;
	var e = ev || window.event;
	switch(e.keyCode) {
		case 9: // Tab
			return;
		case 13: // Ctrl-Enter
		case 10: // Ctrl-Enter on IE PC
			me.doSearch(this);
			break;
		case 27: // Escape
			this.value = "";
			clearMessage();
			break;
	}
	if(config.options.chkIncrementalSearch) {
		if(this.value.length > 2) {
			if(this.value != this.getAttribute("lastSearchText")) {
				if(me.timeout) clearTimeout(me.timeout);
				var input = this;
				me.timeout = setTimeout(function() { me.doSearch(input) }, 500);
			}
		} else {
			if(me.timeout) clearTimeout(me.timeout);
		}
	}
};

config.macros.search.onFocus = function(e) {
	this.select();
};

