//--
//-- Refresh mechanism
//--

//# List of notification functions to be called when certain tiddlers are changed or deleted
config.notifyTiddlers = [
	{ name: "SystemSettings", notify: onSystemSettingsChange },
	{ name: "StyleSheetLayout", notify: refreshStyles },
	{ name: "StyleSheetColors", notify: refreshStyles },
	{ name: "StyleSheet", notify: refreshStyles },
	{ name: "StyleSheetPrint", notify: refreshStyles },
	{ name: "PageTemplate", notify: refreshPageTemplate },
	{ name: "SiteTitle", notify: refreshPageTitle },
	{ name: "SiteSubtitle", notify: refreshPageTitle },
	{ name: "WindowTitle", notify: refreshPageTitle },
	{ name: "ColorPalette", notify: refreshColorPalette },
	{ name: null, notify: refreshDisplay }
];

//# refresher functions
config.refreshers = {
	link: function(e, changeList) {
		var title = e.getAttribute("tiddlyLink");
		refreshTiddlyLink(e, title);
		return true;
	},

	tiddler: function(e, changeList) {
		if (startingUp) return true; // #147
		var title = e.getAttribute("tiddler");
		var template = e.getAttribute("template");
		if(changeList && (changeList.indexOf && changeList.indexOf(title) != -1) && !story.isDirty(title))
			story.refreshTiddler(title, template, true);
		else
			refreshElements(e, changeList);
		return true;
	},

	content: function(e, changeList) {
		var title = e.getAttribute("tiddler");
		var force = e.getAttribute("force");
		var args = e.macroArgs; // #154
		if(force != null || changeList == null || (changeList.indexOf && changeList.indexOf(title) != -1)) {
			jQuery(e).empty();
			config.macros.tiddler.transclude(e, title, args);
			return true;
		} else
			return false;
	},

	macro: function(e, changeList) {
		var macro = e.getAttribute("macroName");
		var params = e.getAttribute("params");
		if(macro)
			macro = config.macros[macro];
		if(macro && macro.refresh)
			macro.refresh(e, params);
		return true;
	}
};

config.refresherData = {
	styleSheet: "StyleSheet",
	defaultStyleSheet: "StyleSheet",
	pageTemplate: "PageTemplate",
	defaultPageTemplate: "PageTemplate",
	colorPalette: "ColorPalette",
	defaultColorPalette: "ColorPalette"
};

function refreshElements(root, changeList) {
	var i, nodes = root.childNodes;
	for(i = 0; i < nodes.length; i++) {
		var e = nodes[i], type = null;
		if(e.getAttribute && (e.tagName ? e.tagName != "IFRAME" : true))
			type = e.getAttribute("refresh");
		var refresher = config.refreshers[type];
		var refreshed = refresher ? refresher(e, changeList) : false;
		if(e.hasChildNodes() && !refreshed)
			refreshElements(e, changeList);
	}
}

function applyHtmlMacros(root, tiddler) {
	for(var e = root.firstChild; !!e; e = nextChild) {
		// macros can manipulate DOM, so we remember nextChild before invokeMacro
		var nextChild = e.nextSibling;
		if(e.getAttribute) {
			var macro = e.getAttribute("macro");
			if(macro) {
				e.removeAttribute("macro");
				var params = "";
				var p = macro.indexOf(" ");
				if(p != -1) {
					params = macro.substr(p + 1);
					macro = macro.substr(0, p);
				}
				invokeMacro(e, macro, params, null, tiddler);
			}
		}
		if(e.hasChildNodes()) applyHtmlMacros(e, tiddler);
	}
}

function refreshPageTemplate(title) {
	var stash = jQuery("<div/>").appendTo("body").hide()[0];
	var display = story.getContainer();
	var nodes, i;
	if(display) {
		nodes = display.childNodes;
		for(i = nodes.length - 1; i >= 0; i--)
			stash.appendChild(nodes[i]);
	}
	var wrapper = document.getElementById("contentWrapper");

	//# protect against non-existent pageTemplate
	if(!title || !store.isAvailable(title))
		title = config.refresherData.pageTemplate;
	if(!store.isAvailable(title))
		title = config.refresherData.defaultPageTemplate; //# this one is always avaialable

	wrapper.innerHTML = store.getRecursiveTiddlerText(title, null, 10);
	applyHtmlMacros(wrapper);
	refreshElements(wrapper);
	display = story.getContainer();
	jQuery(display).empty();
	if(!display)
		display = createTiddlyElement(wrapper, "div", story.containerId());
	nodes = stash.childNodes;
	for(i = nodes.length - 1; i >= 0; i--)
		display.appendChild(nodes[i]);
	jQuery(stash).remove();
}

function refreshDisplay(hint) {
	if(typeof hint == "string")
		hint = [hint];
	var e = document.getElementById("contentWrapper");
	refreshElements(e, hint);
	if(backstage.isPanelVisible()) {
		e = document.getElementById("backstage");
		refreshElements(e, hint);
	}
}

function refreshPageTitle() {
	document.title = getPageTitle();
}

function getPageTitle() {
	return wikifyPlainText(store.getTiddlerText("WindowTitle", ""), null, tiddler);
}

function refreshStyles(title, doc) {
	setStylesheet(title == null ? "" : store.getRecursiveTiddlerText(title, "", 10), title, doc || document);
}

function refreshColorPalette(title) {
	if(!startingUp)
		refreshAll();
}

function refreshAll() {
	refreshPageTemplate();
	refreshDisplay();
	refreshStyles("StyleSheetLayout");
	refreshStyles("StyleSheetColors");
	refreshStyles(config.refresherData.styleSheet);
	refreshStyles("StyleSheetPrint");
}

