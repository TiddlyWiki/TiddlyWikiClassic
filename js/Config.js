//--
//-- Configuration repository
//--

// Miscellaneous options
var config = {
	numRssItems: 20, // Number of items in the RSS feed
	animDuration: 400, // Duration of UI animations in milliseconds
	cascadeFast: 20, // Speed for cascade animations (higher == slower)
	cascadeSlow: 60, // Speed for EasterEgg cascade animations
	cascadeDepth: 5 // Depth of cascade animation
};

// Adaptors
config.adaptors = {};

// Backstage tasks
config.tasks = {};

// Annotations
config.annotations = {};

// Custom fields to be automatically added to new tiddlers
config.defaultCustomFields = {};

// Messages
config.messages = {
	messageClose: {},
	dates: {},
	tiddlerPopup: {}
};

// Options that can be set in the options panel and/or cookies
config.options = {
	chkRegExpSearch: false,
	chkCaseSensitiveSearch: false,
	chkAnimate: true,
	chkSaveBackups: true,
	chkAutoSave: false,
	chkGenerateAnRssFeed: false,
	chkSaveEmptyTemplate: false,
	chkOpenInNewWindow: true,
	chkToggleLinks: false,
	chkHttpReadOnly: true,
	chkForceMinorUpdate: false,
	chkConfirmDelete: true,
	chkInsertTabs: false,
	chkUsePreForStorage: true, // Whether to use <pre> format for storage
	chkDisplayStartupTime: false,
	txtBackupFolder: "",
	txtMainTab: "tabTimeline",
	txtMoreTab: "moreTabAll",
	txtMaxEditRows: "30",
	txtFileSystemCharSet: "UTF-8"
	};
config.optionsDesc = {};
	
// List of notification functions to be called when certain tiddlers are changed or deleted
config.notifyTiddlers = [
	{name: "StyleSheetLayout", notify: refreshStyles},
	{name: "StyleSheetColors", notify: refreshStyles},
	{name: "StyleSheet", notify: refreshStyles},
	{name: "StyleSheetPrint", notify: refreshStyles},
	{name: "PageTemplate", notify: refreshPageTemplate},
	{name: "SiteTitle", notify: refreshPageTitle},
	{name: "SiteSubtitle", notify: refreshPageTitle},
	{name: "ColorPalette", notify: refreshColorPalette},
	{name: null, notify: refreshDisplay}
];

// Default tiddler templates
var DEFAULT_VIEW_TEMPLATE = 1;
var DEFAULT_EDIT_TEMPLATE = 2;
config.tiddlerTemplates = {
	1: "ViewTemplate",
	2: "EditTemplate"
};

// More messages (rather a legacy layout that shouldn't really be like this)
config.views = {
	wikified: {
		tag: {}
	},
	editor: {
		tagChooser: {}
	}
};

// Backstage tasks
config.backstageTasks = ["save","sync","importTask","tweak","plugins"];

// Macros; each has a 'handler' member that is inserted later
config.macros = {
	today: {},
	version: {},
	search: {sizeTextbox: 15},
	tiddler: {},
	tag: {},
	tags: {},
	tagging: {},
	timeline: {},
	allTags: {},
	list: {
		all: {},
		missing: {},
		orphans: {},
		shadowed: {},
		touched: {}
	},
	closeAll: {},
	permaview: {},
	saveChanges: {},
	slider: {},
	option: {},
	options: {},
	newTiddler: {},
	newJournal: {},
	sparkline: {},
	tabs: {},
	gradient: {},
	message: {},
	view: {},
	edit: {},
	tagChooser: {},
	toolbar: {},
	br: {},
	plugins: {},
	refreshDisplay: {},
	importTiddlers: {},
	sync: {},
	annotations: {}
};

// Commands supported by the toolbar macro
config.commands = {
	closeTiddler: {},
	closeOthers: {},
	editTiddler: {},
	saveTiddler: {hideReadOnly: true},
	cancelTiddler: {},
	deleteTiddler: {hideReadOnly: true},
	permalink: {},
	references: {type: "popup"},
	jump: {type: "popup"},
	syncing: {type: "popup"},
	fields: {type: "popup"}
};

// Browser detection... In a very few places, there's nothing else for it but to know what browser we're using.
config.userAgent = navigator.userAgent.toLowerCase();
config.browser = {
	isIE: config.userAgent.indexOf("msie") != -1 && config.userAgent.indexOf("opera") == -1,
	isGecko: config.userAgent.indexOf("gecko") != -1,
	ieVersion: /MSIE (\d.\d)/i.exec(config.userAgent), // config.browser.ieVersion[1], if it exists, will be the IE version string, eg "6.0"
	isSafari: config.userAgent.indexOf("applewebkit") != -1,
	isBadSafari: !((new RegExp("[\u0150\u0170]","g")).test("\u0150")),
	firefoxDate: /gecko\/(\d{8})/i.exec(config.userAgent), // config.browser.firefoxDate[1], if it exists, will be Firefox release date as "YYYYMMDD"
	isOpera: config.userAgent.indexOf("opera") != -1,
	isLinux: config.userAgent.indexOf("linux") != -1,
	isUnix: config.userAgent.indexOf("x11") != -1,
	isMac: config.userAgent.indexOf("mac") != -1,
	isWindows: config.userAgent.indexOf("win") != -1
};

// Basic regular expressions
config.textPrimitives = {
	upperLetter: "[A-Z\u00c0-\u00de\u0150\u0170]",
	lowerLetter: "[a-z0-9_\\-\u00df-\u00ff\u0151\u0171]",
	anyLetter:   "[A-Za-z0-9_\\-\u00c0-\u00de\u00df-\u00ff\u0150\u0170\u0151\u0171]",
	anyLetterStrict: "[A-Za-z0-9\u00c0-\u00de\u00df-\u00ff\u0150\u0170\u0151\u0171]"
};
if(config.browser.isBadSafari) {
	config.textPrimitives = {
		upperLetter: "[A-Z\u00c0-\u00de]",
		lowerLetter: "[a-z0-9_\\-\u00df-\u00ff]",
		anyLetter:   "[A-Za-z0-9_\\-\u00c0-\u00de\u00df-\u00ff]",
		anyLetterStrict: "[A-Za-z0-9\u00c0-\u00de\u00df-\u00ff]"
	};
}
config.textPrimitives.sliceSeparator = "::";
config.textPrimitives.urlPattern = "[a-z]{3,8}:[^\\s:'\"][^\\s'\"]*(?:/|\\b)";
config.textPrimitives.unWikiLink = "~";
config.textPrimitives.wikiLink = "(?:(?:" + config.textPrimitives.upperLetter + "+" +
	config.textPrimitives.lowerLetter + "+" +
	config.textPrimitives.upperLetter +
	config.textPrimitives.anyLetter + "*)|(?:" +
	config.textPrimitives.upperLetter + "{2,}" +
	config.textPrimitives.lowerLetter + "+))";

config.textPrimitives.cssLookahead = "(?:(" + config.textPrimitives.anyLetter + "+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:(" + config.textPrimitives.anyLetter + "+):([^;\\|\\n]+);)";
config.textPrimitives.cssLookaheadRegExp = new RegExp(config.textPrimitives.cssLookahead,"mg");

config.textPrimitives.brackettedLink = "\\[\\[([^\\]]+)\\]\\]";
config.textPrimitives.titledBrackettedLink = "\\[\\[([^\\[\\]\\|]+)\\|([^\\[\\]\\|]+)\\]\\]";
config.textPrimitives.tiddlerForcedLinkRegExp = new RegExp("(?:" + config.textPrimitives.titledBrackettedLink + ")|(?:" +
	config.textPrimitives.brackettedLink + ")|(?:" + 
	config.textPrimitives.urlPattern + ")","mg");
config.textPrimitives.tiddlerAnyLinkRegExp = new RegExp("("+ config.textPrimitives.wikiLink + ")|(?:" +
	config.textPrimitives.titledBrackettedLink + ")|(?:" +
	config.textPrimitives.brackettedLink + ")|(?:" +
	config.textPrimitives.urlPattern + ")","mg");

config.glyphs = {
	browsers: [
		function() {return config.browser.isIE;},
		function() {return true;}
	],
	currBrowser: null,
	codes: {
		downTriangle: ["\u25BC","\u25BE"],
		downArrow: ["\u2193","\u2193"],
		bentArrowLeft: ["\u2190","\u21A9"],
		bentArrowRight: ["\u2192","\u21AA"]
	}
};

//--
//-- Shadow tiddlers
//--

config.shadowTiddlers = {
	StyleSheet: "",
	MarkupPreHead: "<!--{{{-->\n<link rel='alternate' type='application/rss+xml' title='RSS' href='index.xml'/>\n<!--}}}-->",
	MarkupPostHead: "",
	MarkupPreBody: "",
	MarkupPostBody: "",
	TabTimeline: '<<timeline>>',
	TabAll: '<<list all>>',
	TabTags: '<<allTags excludeLists>>',
	TabMoreMissing: '<<list missing>>',
	TabMoreOrphans: '<<list orphans>>',
	TabMoreShadowed: '<<list shadowed>>',
	AdvancedOptions: '<<options>>',
	PluginManager: '<<plugins>>',
	ImportTiddlers: '<<importTiddlers>>'
};

