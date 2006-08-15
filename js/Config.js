// ---------------------------------------------------------------------------------
// Configuration repository
// ---------------------------------------------------------------------------------

// Miscellaneous options
var config = {
	numRssItems: 20, // Number of items in the RSS feed
	animFast: 0.12, // Speed for animations (lower == slower)
	animSlow: 0.01, // Speed for EasterEgg animations
	cascadeFast: 20, // Speed for cascade animations (higher == slower)
	cascadeSlow: 60, // Speed for EasterEgg cascade animations
	cascadeDepth: 5 // Depth of cascade animation
	};

// Messages
config.messages = {
	messageClose: {},
	dates: {}
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
	txtBackupFolder: "",
	txtMainTab: "tabTimeline",
	txtMoreTab: "moreTabAll",
	txtMaxEditRows: "30"
	};
	
// List of notification functions to be called when certain tiddlers are changed or deleted
config.notifyTiddlers = [
	{name: "StyleSheetLayout", notify: refreshStyles},
	{name: "StyleSheetColors", notify: refreshStyles},
	{name: "StyleSheet", notify: refreshStyles},
	{name: "StyleSheetPrint", notify: refreshStyles},
	{name: "PageTemplate", notify: refreshPageTemplate},
	{name: "SiteTitle", notify: refreshPageTitle},
	{name: "SiteSubtitle", notify: refreshPageTitle},
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
		shadowed: {}
		},
	closeAll: {},
	permaview: {},
	saveChanges: {},
	slider: {},
	option: {},
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
	importTiddlers: {}
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
	references: {},
	jump: {}
	};

// Browser detection... In a very few places, there's nothing else for it but to
// know what browser we're using.
config.userAgent = navigator.userAgent.toLowerCase();
config.browser = {
	isIE: config.userAgent.indexOf("msie") != -1 && config.userAgent.indexOf("opera") == -1,
	ieVersion: /MSIE (\d.\d)/i.exec(config.userAgent), // config.browser.ieVersion[1], if it exists, will be the IE version string, eg "6.0"
	isSafari: config.userAgent.indexOf("applewebkit") != -1,
	isBadSafari: !((new RegExp("[\u0150\u0170]","g")).test("\u0150")),
	firefoxDate: /Gecko\/(\d{8})/i.exec(config.userAgent), // config.browser.firefoxDate[1], if it exists, will be Firefox release date as "YYYYMMDD"
	isLinux: config.userAgent.indexOf("linux") != -1,
	isUnix: config.userAgent.indexOf("x11") != -1,
	isMac: config.userAgent.indexOf("mac") != -1,
	isWindows: config.userAgent.indexOf("win") != -1
	};

// Basic regular expressions
config.textPrimitives = {
	upperLetter: "[A-Z\u00c0-\u00de\u0150\u0170]",
	lowerLetter: "[a-z0-9\\-\u00df-\u00ff\u0151\u0171]",
	anyLetter:   "[A-Za-z0-9\\-\u00c0-\u00de\u00df-\u00ff\u0150\u0170\u0151\u0171]"
	};
if(config.browser.isBadSafari)
	config.textPrimitives = {
		upperLetter: "[A-Z\u00c0-\u00de]",
		lowerLetter: "[a-z0-9\\-\u00df-\u00ff]",
		anyLetter:   "[A-Za-z0-9\\-\u00c0-\u00de\u00df-\u00ff]"
		}
config.textPrimitives.sliceSeparator = "::";
config.textPrimitives.urlPattern = "(?:file|http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)";
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

// ---------------------------------------------------------------------------------
// Shadow tiddlers
// ---------------------------------------------------------------------------------

config.shadowTiddlers = {
	ColorPalette: "<<refreshDisplay>>\n" +
				  "Background: #fff\n" + 
				  "Foreground: #000\n" +
				  "PrimaryPale: #8cf\n" +
				  "PrimaryLight: #18f\n" +
				  "PrimaryMid: #04b\n" +
				  "PrimaryDark: #014\n" +
				  "SecondaryPale: #ffc\n" +
				  "SecondaryLight: #fe8\n" +
				  "SecondaryMid: #db4\n" +
				  "SecondaryDark: #841\n" +
				  "TertiaryPale: #eee\n" +
				  "TertiaryLight: #ccc\n" +
				  "TertiaryMid: #999\n" +
				  "TertiaryDark: #666\n" +
				  "Error: #f88\n",
	StyleSheet: ".viewer table.listView {\n	font-size: 0.85em;	margin: 0.8em 1.0em;\n}\n\n.viewer table.listView th, .viewer table.listView td, .viewer table.listView tr {\n	padding: 0px 3px 0px 3px;\n\n}\n\n.wizard {\n	background: [[ColorPalette::SecondaryLight]];\n	padding: 0.1em 0em 0em 2em;\n	border-top: 1px solid [[ColorPalette::SecondaryMid]];\n	border-left: 1px solid [[ColorPalette::SecondaryMid]];\n}\n\n.wizard h1 {\n	font-size: 2em;	font-weight: bold;\n	background: none;\n	color: [[ColorPalette::SecondaryDark]];\n	padding: 0em 0em 0em 0em;\n	margin: 0.4em 0em 0.2em 0em;\n}\n\n.wizard h2 {\n	font-size: 1.2em;	font-weight: bold;\n	background: none;\n	color: [[ColorPalette::Foreground]];\n	padding: 0em 0em 0em 0em;\n	margin: 0.2em 0em 0.2em 0em;\n}\n\n.wizardStep {\n	background: [[ColorPalette::Background]];	padding: 1em 1em 1em 1em;\n	border-top: 1px solid [[ColorPalette::SecondaryMid]];\n	border-bottom: 1px solid [[ColorPalette::SecondaryMid]];\n	border-left: 1px solid [[ColorPalette::SecondaryMid]];\n}\n\n.wizard .button {\n	text-align: right;\n}\n\n",
	StyleSheetColors: "/*{{{*/\nbody {\n	background: [[ColorPalette::Background]];\n	color: [[ColorPalette::Foreground]];\n}\n\na{\n	color: [[ColorPalette::PrimaryMid]];\n}\n\na:hover{\n	background: [[ColorPalette::PrimaryMid]];\n	color: [[ColorPalette::Background]];\n}\n\na img{\n	border: 0;\n}\n\nh1,h2,h3,h4,h5 {\n	color: [[ColorPalette::SecondaryDark]];\n	background: [[ColorPalette::PrimaryPale]];\n}\n\n.button {\n	color: [[ColorPalette::PrimaryDark]];\n	border: 1px solid [[ColorPalette::Background]];\n}\n\n.button:hover {\n	color: [[ColorPalette::PrimaryDark]];\n	background: [[ColorPalette::SecondaryLight]];\n	border-color: [[ColorPalette::SecondaryMid]];\n}\n\n.button:active {\n	color: [[ColorPalette::Background]];\n	background: [[ColorPalette::SecondaryMid]];\n	border: 1px solid [[ColorPalette::SecondaryDark]];\n}\n\n.header {\n	background: [[ColorPalette::PrimaryMid]];\n}\n\n.headerShadow {\n	color: [[ColorPalette::Foreground]];\n}\n\n.headerShadow a {\n	font-weight: normal;\n	color: [[ColorPalette::Foreground]];\n}\n\n.headerForeground {\n	color: [[ColorPalette::Background]];\n}\n\n.headerForeground a {\n	font-weight: normal;\n	color: [[ColorPalette::PrimaryPale]];\n}\n\n.tabSelected{\n	color: [[ColorPalette::PrimaryDark]];\n	background: [[ColorPalette::TertiaryPale]];\n	border-left: 1px solid [[ColorPalette::TertiaryLight]];\n	border-top: 1px solid [[ColorPalette::TertiaryLight]];\n	border-right: 1px solid [[ColorPalette::TertiaryLight]];\n}\n\n.tabUnselected {\n	color: [[ColorPalette::Background]];\n	background: [[ColorPalette::TertiaryMid]];\n}\n\n.tabContents {\n	color: [[ColorPalette::PrimaryDark]];\n	background: [[ColorPalette::TertiaryPale]];\n	border: 1px solid [[ColorPalette::TertiaryLight]];\n}\n\n.tabContents .button {\n	 border: 0;}\n\n#sidebar {\n}\n\n#sidebarOptions input {\n	border: 1px solid [[ColorPalette::PrimaryMid]];\n}\n\n#sidebarOptions .sliderPanel {\n	background: [[ColorPalette::PrimaryPale]];\n}\n\n#sidebarOptions .sliderPanel a {\n	border: none;\n	color: [[ColorPalette::PrimaryMid]];\n}\n\n#sidebarOptions .sliderPanel a:hover {\n	color: [[ColorPalette::Background]];\n	background: [[ColorPalette::PrimaryMid]];\n}\n\n#sidebarOptions .sliderPanel a:active {\n	color: [[ColorPalette::PrimaryMid]];\n	background: [[ColorPalette::Background]];\n}\n\n.wizard {\n	background: [[ColorPalette::SecondaryLight]];\n	border-top: 1px solid [[ColorPalette::SecondaryMid]];\n	border-left: 1px solid [[ColorPalette::SecondaryMid]];\n}\n\n.wizard h1 {\n	color: [[ColorPalette::SecondaryDark]];\n}\n\n.wizard h2 {\n	color: [[ColorPalette::Foreground]];\n}\n\n.wizardStep {\n	background: [[ColorPalette::Background]];\n	border-top: 1px solid [[ColorPalette::SecondaryMid]];\n	border-bottom: 1px solid [[ColorPalette::SecondaryMid]];\n	border-left: 1px solid [[ColorPalette::SecondaryMid]];\n}\n\n.wizard .button {\n	color: [[ColorPalette::Background]];\n	background: [[ColorPalette::PrimaryMid]];\n	border-top: 1px solid [[ColorPalette::PrimaryLight]];\n	border-right: 1px solid [[ColorPalette::PrimaryDark]];\n	border-bottom: 1px solid [[ColorPalette::PrimaryDark]];\n	border-left: 1px solid [[ColorPalette::PrimaryLight]];\n}\n\n.wizard .button:hover {\n	color: [[ColorPalette::PrimaryLight]];\n	background: [[ColorPalette::PrimaryDark]];\n	border-color: [[ColorPalette::PrimaryLight]];\n}\n\n.wizard .button:active {\n	color: [[ColorPalette::Background]];\n	background: [[ColorPalette::PrimaryMid]];\n	border-top: 1px solid [[ColorPalette::PrimaryLight]];\n	border-right: 1px solid [[ColorPalette::PrimaryDark]];\n	border-bottom: 1px solid [[ColorPalette::PrimaryDark]];\n	border-left: 1px solid [[ColorPalette::PrimaryLight]];\n}\n\n#messageArea {\n	border: 1px solid [[ColorPalette::SecondaryDark]];\n	background: [[ColorPalette::SecondaryMid]];\n	color: [[ColorPalette::PrimaryDark]];\n}\n\n#messageArea .button {\n	padding: 0.2em 0.2em 0.2em 0.2em;\n	color: [[ColorPalette::PrimaryDark]];\n	background: [[ColorPalette::Background]];\n}\n\n.popup {\n	background: [[ColorPalette::PrimaryLight]];\n	border: 1px solid [[ColorPalette::PrimaryMid]];\n}\n\n.popup hr {\n	color: [[ColorPalette::PrimaryDark]];\n	background: [[ColorPalette::PrimaryDark]];\n	border-bottom: 1px;\n}\n\n.popup li.disabled {\n	color: [[ColorPalette::PrimaryMid]];\n}\n\n.popup li a, .popup li a:visited {\n	color: [[ColorPalette::TertiaryPale]];\n	border: none;\n}\n\n.popup li a:hover {\n	background: [[ColorPalette::PrimaryDark]];\n	color: [[ColorPalette::Background]];\n	border: none;\n}\n\n.tiddler .defaultCommand {\n font-weight: bold;\n}\n\n.shadow .title {\n	color: [[ColorPalette::TertiaryDark]];\n}\n\n.title {\n	color: [[ColorPalette::SecondaryDark]];\n}\n\n.subtitle {\n	color: [[ColorPalette::TertiaryDark]];\n}\n\n.toolbar {\n	color: [[ColorPalette::PrimaryMid]];\n}\n\n.tagging, .tagged {\n	border: 1px solid [[ColorPalette::TertiaryPale]];\n	background-color: [[ColorPalette::TertiaryPale]];\n}\n\n.selected .tagging, .selected .tagged {\n	background-color: [[ColorPalette::TertiaryLight]];\n	border: 1px solid [[ColorPalette::TertiaryMid]];\n}\n\n.tagging .listTitle, .tagged .listTitle {\n	color: [[ColorPalette::PrimaryDark]];\n}\n\n.tagging .button, .tagged .button {\n		border: none;\n}\n\n.footer {\n	color: [[ColorPalette::TertiaryLight]];\n}\n\n.selected .footer {\n	color: [[ColorPalette::TertiaryMid]];\n}\n\n.sparkline {\n	background: [[ColorPalette::PrimaryPale]];\n	border: 0;\n}\n\n.sparktick {\n	background: [[ColorPalette::PrimaryDark]];\n}\n\n.error, .errorButton {\n	color: [[ColorPalette::Foreground]];\n	background: [[ColorPalette::Error]];\n}\n\n.warning {\n	color: [[ColorPalette::Foreground]];\n	background: [[ColorPalette::SecondaryPale]];\n}\n\n.cascade {\n	background: [[ColorPalette::TertiaryPale]];\n	color: [[ColorPalette::TertiaryMid]];\n	border: 1px solid [[ColorPalette::TertiaryMid]];\n}\n\n.imageLink, #displayArea .imageLink {\n	background: transparent;\n}\n\n.viewer .listTitle {list-style-type: none; margin-left: -2em;}\n\n.viewer .button {\n	border: 1px solid [[ColorPalette::SecondaryMid]];\n}\n\n.viewer blockquote {\n	border-left: 3px solid [[ColorPalette::TertiaryDark]];\n}\n\n.viewer table {\n	border: 2px solid [[ColorPalette::TertiaryDark]];\n}\n\n.viewer th, thead td {\n	background: [[ColorPalette::SecondaryMid]];\n	border: 1px solid [[ColorPalette::TertiaryDark]];\n	color: [[ColorPalette::Background]];\n}\n\n.viewer td, .viewer tr {\n	border: 1px solid [[ColorPalette::TertiaryDark]];\n}\n\n.viewer pre {\n	border: 1px solid [[ColorPalette::SecondaryLight]];\n	background: [[ColorPalette::SecondaryPale]];\n}\n\n.viewer code {\n	color: [[ColorPalette::SecondaryDark]];\n}\n\n.viewer hr {\n	border: 0;\n	border-top: dashed 1px [[ColorPalette::TertiaryDark]];\n	color: [[ColorPalette::TertiaryDark]];\n}\n\n.highlight, .marked {\n	background: [[ColorPalette::SecondaryLight]];\n}\n\n.editor input {\n	border: 1px solid [[ColorPalette::PrimaryMid]];\n}\n\n.editor textarea {\n	border: 1px solid [[ColorPalette::PrimaryMid]];\n	width: 100%;\n}\n\n.editorFooter {\n	color: [[ColorPalette::TertiaryMid]];\n}\n\n/*}}}*/",
	StyleSheetLayout: "/*{{{*/\nbody {\n	font-size: .75em;\n	font-family: arial,helvetica;\n	margin: 0;\n	padding: 0;\n}\n\nh1,h2,h3,h4,h5 {\n	font-weight: bold;\n	text-decoration: none;\n	padding-left: 0.4em;\n}\n\nh1 {font-size: 1.35em;}\nh2 {font-size: 1.25em;}\nh3 {font-size: 1.1em;}\nh4 {font-size: 1em;}\nh5 {font-size: .9em;}\n\nhr {\n	height: 1px;\n}\n\na{\n	text-decoration: none;\n}\n\ndt {font-weight: bold;}\n\nol { list-style-type: decimal }\nol ol { list-style-type: lower-alpha }\nol ol ol { list-style-type: lower-roman }\nol ol ol ol { list-style-type: decimal }\nol ol ol ol ol { list-style-type: lower-alpha }\nol ol ol ol ol ol { list-style-type: lower-roman }\nol ol ol ol ol ol ol { list-style-type: decimal }\n\n.externalLink {\n	text-decoration: underline;\n}\n\n.indent {margin-left:3em;}\n.outdent {margin-left:3em; text-indent:-3em;}\ncode.escaped {white-space:nowrap;}\n\n.tiddlyLinkExisting {\n	font-weight: bold;\n}\n\n.tiddlyLinkNonExisting {\n	font-style: italic;\n}\n\n/* the 'a' is required for IE, otherwise it renders the whole tiddler a bold */\na.tiddlyLinkNonExisting.shadow {\n	font-weight: bold;\n}\n\n#mainMenu .tiddlyLinkExisting, \n#mainMenu .tiddlyLinkNonExisting,\n#sidebarTabs .tiddlyLinkNonExisting{\n font-weight: normal;\n font-style: normal;\n}\n\n#sidebarTabs .tiddlyLinkExisting {\n font-weight: bold;\n font-style: normal;\n}\n\n.header {\n		position: relative;\n}\n\n.header a:hover {\n	background: transparent;\n}\n\n.headerShadow {\n	position: relative;\n	padding: 4.5em 0em 1em 1em;\n	left: -1px;\n	top: -1px;\n}\n\n.headerForeground {\n	position: absolute;\n	padding: 4.5em 0em 1em 1em;\n	left: 0px;\n	top: 0px;\n}\n\n.siteTitle {\n	font-size: 3em;\n}\n\n.siteSubtitle {\n	font-size: 1.2em;\n}\n\n#mainMenu {\n	position: absolute;\n	left: 0;\n	width: 10em;\n	text-align: right;\n	line-height: 1.6em;\n	padding: 1.5em 0.5em 0.5em 0.5em;\n	font-size: 1.1em;\n}\n\n#sidebar {\n	position: absolute;\n	right: 3px;\n	width: 16em;\n	font-size: .9em;\n}\n\n#sidebarOptions {\n	padding-top: 0.3em;\n}\n\n#sidebarOptions a {\n	margin: 0em 0.2em;\n	padding: 0.2em 0.3em;\n	display: block;\n}\n\n#sidebarOptions input {\n	margin: 0.4em 0.5em;\n}\n\n#sidebarOptions .sliderPanel {\n	margin-left: 1em;\n	padding: 0.5em;\n	font-size: .85em;\n}\n\n#sidebarOptions .sliderPanel a {\n	font-weight: bold;\n	display: inline;\n	padding: 0;\n}\n\n#sidebarOptions .sliderPanel input {\n	margin: 0 0 .3em 0;\n}\n\n#sidebarTabs .tabContents {\n	width: 15em;\n	overflow: hidden;\n}\n\n.wizard {\n	padding: 0.1em 0em 0em 2em;\n}\n\n.wizard h1 {\n	font-size: 2em;\n	font-weight: bold;\n	background: none;\n	padding: 0em 0em 0em 0em;\n	margin: 0.4em 0em 0.2em 0em;\n}\n\n.wizard h2 {\n	font-size: 1.2em;\n	font-weight: bold;\n	background: none;\n	padding: 0em 0em 0em 0em;\n	margin: 0.2em 0em 0.2em 0em;\n}\n\n.wizardStep {\n	padding: 1em 1em 1em 1em;\n}\n\n.wizard .button {\n	margin: 0.5em 0em 0em 0em;\n	font-size: 1.2em;\n}\n\n#messageArea {\nposition:absolute; top:0; right:0; margin: 0.5em; padding: 0.5em;\n}\n\n*[id='messageArea'] {\nposition:fixed !important; z-index:99;}\n\n.messageToolbar {\ndisplay: block;\ntext-align: right;\n}\n\n#messageArea a{\n	text-decoration: underline;\n}\n\n.popup {\n	font-size: .9em;\n	padding: 0.2em;\n	list-style: none;\n	margin: 0;\n}\n\n.popup hr {\n	display: block;\n	height: 1px;\n	width: auto;\n	padding: 0;\n	margin: 0.2em 0em;\n}\n\n.popup li.disabled {\n	padding: 0.2em;\n}\n\n.popup li a{\n	display: block;\n	padding: 0.2em;\n}\n\n.tabset {\n	padding: 1em 0em 0em 0.5em;\n}\n\n.tab {\n	margin: 0em 0em 0em 0.25em;\n	padding: 2px;\n}\n\n.tabContents {\n	padding: 0.5em;\n}\n\n.tabContents ul, .tabContents ol {\n	margin: 0;\n	padding: 0;\n}\n\n.txtMainTab .tabContents li {\n	list-style: none;\n}\n\n.tabContents li.listLink {\n	 margin-left: .75em;\n}\n\n#displayArea {\n	margin: 1em 17em 0em 14em;\n}\n\n\n.toolbar {\n	text-align: right;\n	font-size: .9em;\n	visibility: hidden;\n}\n\n.selected .toolbar {\n	visibility: visible;\n}\n\n.tiddler {\n	padding: 1em 1em 0em 1em;\n}\n\n.missing .viewer,.missing .title {\n	font-style: italic;\n}\n\n.title {\n	font-size: 1.6em;\n	font-weight: bold;\n}\n\n.missing .subtitle {\n display: none;\n}\n\n.subtitle {\n	font-size: 1.1em;\n}\n\n.tiddler .button {\n	padding: 0.2em 0.4em;\n}\n\n.tagging {\nmargin: 0.5em 0.5em 0.5em 0;\nfloat: left;\ndisplay: none;\n}\n\n.isTag .tagging {\ndisplay: block;\n}\n\n.tagged {\nmargin: 0.5em;\nfloat: right;\n}\n\n.tagging, .tagged {\nfont-size: 0.9em;\npadding: 0.25em;\n}\n\n.tagging ul, .tagged ul {\nlist-style: none;margin: 0.25em;\npadding: 0;\n}\n\n.tagClear {\nclear: both;\n}\n\n.footer {\n	font-size: .9em;\n}\n\n.footer li {\ndisplay: inline;\n}\n\n* html .viewer pre {\n	width: 99%;\n	padding: 0 0 1em 0;\n}\n\n.viewer {\n	line-height: 1.4em;\n	padding-top: 0.5em;\n}\n\n.viewer .button {\n	margin: 0em 0.25em;\n	padding: 0em 0.25em;\n}\n\n.viewer blockquote {\n	line-height: 1.5em;\n	padding-left: 0.8em;\n	margin-left: 2.5em;\n}\n\n.viewer ul, .viewer ol{\n	margin-left: 0.5em;\n	padding-left: 1.5em;\n}\n\n.viewer table {\n	border-collapse: collapse;\n	margin: 0.8em 1.0em;\n}\n\n.viewer th, .viewer td, .viewer tr,.viewer caption{\n	padding: 3px;\n}\n\n.viewer table.listView {\n	font-size: 0.85em;\n	margin: 0.8em 1.0em;\n}\n\n.viewer table.listView th, .viewer table.listView td, .viewer table.listView tr {\n	padding: 0px 3px 0px 3px;\n}\n\n.viewer pre {\n	padding: 0.5em;\n	margin-left: 0.5em;\n	font-size: 1.2em;\n	line-height: 1.4em;\n	overflow: auto;\n}\n\n.viewer code {\n	font-size: 1.2em;\n	line-height: 1.4em;\n}\n\n.editor {\nfont-size: 1.1em;\n}\n\n.editor input, .editor textarea {\n	display: block;\n	width: 100%;\n	font: inherit;\n}\n\n.editorFooter {\n	padding: 0.25em 0em;\n	font-size: .9em;\n}\n\n.editorFooter .button {\npadding-top: 0px; padding-bottom: 0px;}\n\n.fieldsetFix {border: 0;\npadding: 0;\nmargin: 1px 0px 1px 0px;\n}\n\n.sparkline {\n	line-height: 1em;\n}\n\n.sparktick {\n	outline: 0;\n}\n\n.zoomer {\n	font-size: 1.1em;\n	position: absolute;\n	padding: 1em;\n}\n\n.cascade {\n	font-size: 1.1em;\n	position: absolute;\n	overflow: hidden;\n}\n/*}}}*/",
	StyleSheetPrint: "@media print {\n#mainMenu, #sidebar, #messageArea, .toolbar {display: none ! important;}\n#displayArea {margin: 1em 1em 0em 1em;}\n/* Fixes a feature in Firefox 1.5.0.2 where print preview displays the noscript content */\nnoscript {display:none;}\n}",
	PageTemplate: "<div class='header' macro='gradient vert [[ColorPalette::PrimaryLight]] [[ColorPalette::PrimaryMid]]'>\n<div class='headerShadow'>\n<span class='siteTitle' refresh='content' tiddler='SiteTitle'></span>&nbsp;\n<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'></span>\n</div>\n<div class='headerForeground'>\n<span class='siteTitle' refresh='content' tiddler='SiteTitle'></span>&nbsp;\n<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'></span>\n</div>\n</div>\n<div id='mainMenu' refresh='content' tiddler='MainMenu'></div>\n<div id='sidebar'>\n<div id='sidebarOptions' refresh='content' tiddler='SideBarOptions'></div>\n<div id='sidebarTabs' refresh='content' force='true' tiddler='SideBarTabs'></div>\n</div>\n<div id='displayArea'>\n<div id='messageArea'></div>\n<div id='tiddlerDisplay'></div>\n</div>",
	ViewTemplate: "<div class='toolbar' macro='toolbar closeTiddler closeOthers +editTiddler permalink references jump'></div>\n<div class='title' macro='view title'></div>\n<div class='subtitle'><span macro='view modifier link'></span>, <span macro='view modified date [[DD MMM YYYY]]'></span> (<span macro='message views.wikified.createdPrompt'></span> <span macro='view created date [[DD MMM YYYY]]'></span>)</div>\n<div class='tagging' macro='tagging'></div>\n<div class='tagged' macro='tags'></div>\n<div class='viewer' macro='view text wikified'></div>\n<div class='tagClear'></div>",
	EditTemplate: "<div class='toolbar' macro='toolbar +saveTiddler -cancelTiddler deleteTiddler'></div>\n<div class='title' macro='view title'></div>\n<div class='editor' macro='edit title'></div>\n<div class='editor' macro='edit text'></div>\n<div class='editor' macro='edit tags'></div><div class='editorFooter'><span macro='message views.editor.tagPrompt'></span><span macro='tagChooser'></span></div>",
	MarkupPreHead: "<link rel='alternate' type='application/rss+xml' title='RSS' href='index.xml'/>",
	MarkupPostHead: "",
	MarkupPreBody: "",
	MarkupPostBody: ""
	};

