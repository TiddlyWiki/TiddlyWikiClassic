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
	br: {}
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
config.textPrimitives.urlPattern = "(?:file|http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)";
config.textPrimitives.unWikiLink = "~";
config.textPrimitives.wikiLink = "(?:" + config.textPrimitives.unWikiLink + "{0,1})(?:(?:" + config.textPrimitives.upperLetter + "+" +
												  config.textPrimitives.lowerLetter + "+" +
												  config.textPrimitives.upperLetter +
												  config.textPrimitives.anyLetter + "*)|(?:" +
												  config.textPrimitives.upperLetter + "{2,}" +
												  config.textPrimitives.lowerLetter + "+))";

config.textPrimitives.cssLookahead = "(?:(" + config.textPrimitives.anyLetter + "+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:(" + config.textPrimitives.anyLetter + "+):([^;\\|\\n]+);)";
config.textPrimitives.cssLookaheadRegExp = new RegExp(config.textPrimitives.cssLookahead,"mg");

// ---------------------------------------------------------------------------------
// Shadow tiddlers for emergencies
// ---------------------------------------------------------------------------------

config.shadowTiddlers = {
	StyleSheetColors: "/***\n!Colors Used\n*@@bgcolor(#8cf): #8cf - Background blue@@\n*@@bgcolor(#18f): #18f - Top blue@@\n*@@bgcolor(#04b): #04b - Mid blue@@\n*@@bgcolor(#014):color(#fff): #014 - Bottom blue@@\n*@@bgcolor(#ffc): #ffc - Bright yellow@@\n*@@bgcolor(#fe8): #fe8 - Highlight yellow@@\n*@@bgcolor(#db4): #db4 - Background yellow@@\n*@@bgcolor(#841): #841 - Border yellow@@\n*@@bgcolor(#703):color(#fff): #703 - Title red@@\n*@@bgcolor(#866): #866 - Subtitle grey@@\n!Generic Rules /%==============================================%/\n***/\n/*{{{*/\nbody {\n	background: #fff;\n	color: #000;\n}\n\na{\n	color: #04b;\n}\n\na:hover{\n	background: #04b;\n	color: #fff;\n}\n\na img{\n	border: 0;\n}\n\nh1,h2,h3,h4,h5 {\n	color: #703;\n	background: #8cf;\n}\n\n.button {\n	color: #014;\n	border: 1px solid #fff;\n}\n\n.button:hover {\n	color: #014;\n	background: #fe8;\n	border-color: #db4;\n}\n\n.button:active {\n	color: #fff;\n	background: #db4;\n	border: 1px solid #841;\n}\n\n/*}}}*/\n/***\n!Header /%==================================================%/\n***/\n/*{{{*/\n.header {\n	background: #04b;\n}\n\n.headerShadow {\n	color: #000;\n}\n\n.headerShadow a {\n	font-weight: normal;\n	color: #000;\n}\n\n.headerForeground {\n	color: #fff;\n}\n\n.headerForeground a {\n	font-weight: normal;\n	color: #8cf;\n}\n\n/*}}}*/\n/***\n!General tabs /%=================================================%/\n***/\n/*{{{*/\n\n.tabSelected{\n	color: #014;\n	background: #eee;\n	border-left: 1px solid #ccc;\n	border-top: 1px solid #ccc;\n	border-right: 1px solid #ccc;\n}\n\n.tabUnselected {\n	color: #fff;\n	background: #999;\n}\n\n.tabContents {\n	color: #014;\n	background: #eee;\n	border: 1px solid #ccc;\n}\n\n.tabContents .button {\n	 border: 0;}\n\n/*}}}*/\n/***\n!Sidebar options /%=================================================%/\n~TiddlyLinks and buttons are treated identically in the sidebar and slider panel\n***/\n/*{{{*/\n#sidebar {\n}\n\n#sidebarOptions input {\n	border: 1px solid #04b;\n}\n\n#sidebarOptions .sliderPanel {\n	background: #8cf;\n}\n\n#sidebarOptions .sliderPanel a {\n	border: none;\n	color: #04b;\n}\n\n#sidebarOptions .sliderPanel a:hover {\n	color: #fff;\n	background: #04b;\n}\n\n#sidebarOptions .sliderPanel a:active {\n	color: #04b;\n	background: #fff;\n}\n/*}}}*/\n/***\n!Message Area /%=================================================%/\n***/\n/*{{{*/\n#messageArea {\n	border: 1px solid #841;\n	background: #db4;\n	color: #014;\n}\n\n#messageArea .button {\n	padding: 0.2em 0.2em 0.2em 0.2em;\n	color: #014;\n	background: #fff;\n}\n\n/*}}}*/\n/***\n!Popup /%=================================================%/\n***/\n/*{{{*/\n.popup {\n	background: #18f;\n	border: 1px solid #04b;\n}\n\n.popup hr {\n	color: #014;\n	background: #014;\n	border-bottom: 1px;\n}\n\n.popup li.disabled {\n	color: #04b;\n}\n\n.popup li a, .popup li a:visited {\n	color: #eee;\n	border: none;\n}\n\n.popup li a:hover {\n	background: #014;\n	color: #fff;\n	border: none;\n}\n/*}}}*/\n/***\n!Tiddler Display /%=================================================%/\n***/\n/*{{{*/\n.tiddler .defaultCommand {\n font-weight: bold;\n}\n\n.shadow .title {\n	color: #866;\n}\n\n.title {\n	color: #703;\n}\n\n.subtitle {\n	color: #866;\n}\n\n.toolbar {\n	color: #04b;\n}\n\n.tagging, .tagged {\n	border: 1px solid #eee;\n	background-color: #eee;\n}\n\n.selected .tagging, .selected .tagged {\n	background-color: #ddd;\n	border: 1px solid #bbb;\n}\n\n.tagging .listTitle, .tagged .listTitle {\n	color: #014;\n}\n\n.tagging .button, .tagged .button {\n		border: none;\n}\n\n.footer {\n	color: #ddd;\n}\n\n.selected .footer {\n	color: #888;\n}\n\n.sparkline {\n	background: #8cf;\n	border: 0;\n}\n\n.sparktick {\n	background: #014;\n}\n\n.errorButton {\n	color: #ff0;\n	background: #f00;\n}\n\n.cascade {\n	background: #eef;\n	color: #aac;\n	border: 1px solid #aac;\n}\n\n.imageLink, #displayArea .imageLink {\n	background: transparent;\n}\n\n/*}}}*/\n/***\n''The viewer is where the tiddler content is displayed'' /%------------------------------------------------%/\n***/\n/*{{{*/\n\n.viewer .listTitle {list-style-type: none; margin-left: -2em;}\n\n.viewer .button {\n	border: 1px solid #db4;\n}\n\n.viewer blockquote {\n	border-left: 3px solid #666;\n}\n\n.viewer table {\n	border: 2px solid #333;\n}\n\n.viewer th, thead td {\n	background: #db4;\n	border: 1px solid #666;\n	color: #fff;\n}\n\n.viewer td, .viewer tr {\n	border: 1px solid #666;\n}\n\n.viewer pre {\n	border: 1px solid #fe8;\n	background: #ffc;\n}\n\n.viewer code {\n	color: #703;\n}\n\n.viewer hr {\n	border: 0;\n	border-top: dashed 1px #666;\n	color: #666;\n}\n\n.highlight, .marked {\n	background: #fe8;\n}\n/*}}}*/\n/***\n''The editor replaces the viewer in the tiddler'' /%------------------------------------------------%/\n***/\n/*{{{*/\n.editor input {\n	border: 1px solid #04b;\n}\n\n.editor textarea {\n	border: 1px solid #04b;\n	width: 100%;\n}\n\n.editorFooter {\n	color: #aaa;\n}\n\n/*}}}*/",
	StyleSheetLayout: "/***\n!Sections in this Tiddler:\n*Generic rules\n**Links styles\n**Link Exceptions\n*Header\n*Main menu\n*Sidebar\n**Sidebar options\n**Sidebar tabs\n*Message area\n*Popup\n*Tabs\n*Tiddler display\n**Viewer\n**Editor\n*Misc. rules\n!Generic Rules /%==============================================%/\n***/\n/*{{{*/\nbody {\n	font-size: .75em;\n	font-family: arial,helvetica;\n	margin: 0;\n	padding: 0;\n}\n\nh1,h2,h3,h4,h5 {\n	font-weight: bold;\n	text-decoration: none;\n	padding-left: 0.4em;\n}\n\nh1 {font-size: 1.35em;}\nh2 {font-size: 1.25em;}\nh3 {font-size: 1.1em;}\nh4 {font-size: 1em;}\nh5 {font-size: .9em;}\n\nhr {\n	height: 1px;\n}\n\na{\n	text-decoration: none;\n}\n\nol { list-style-type: decimal }\nol ol { list-style-type: lower-alpha }\nol ol ol { list-style-type: lower-roman }\nol ol ol ol { list-style-type: decimal }\nol ol ol ol ol { list-style-type: lower-alpha }\nol ol ol ol ol ol { list-style-type: lower-roman }\nol ol ol ol ol ol ol { list-style-type: decimal }\n/*}}}*/\n/***\n''General Link Styles'' /%-----------------------------------------------------------------------------%/\n***/\n/*{{{*/\n.externalLink {\n	text-decoration: underline;\n}\n\n.tiddlyLinkExisting {\n	font-weight: bold;\n}\n\n.tiddlyLinkNonExisting {\n	font-style: italic;\n}\n\n/* the 'a' is required for IE, otherwise it renders the whole tiddler a bold */\na.tiddlyLinkNonExisting.shadow {\n	font-weight: bold;\n}\n/*}}}*/\n/***\n''Exceptions to common link styles'' /%------------------------------------------------------------------%/\n***/\n/*{{{*/\n\n#mainMenu .tiddlyLinkExisting, \n#mainMenu .tiddlyLinkNonExisting,\n#sidebarTabs .tiddlyLinkNonExisting{\n font-weight: normal;\n font-style: normal;\n}\n\n#sidebarTabs .tiddlyLinkExisting {\n font-weight: bold;\n font-style: normal;\n}\n\n/*}}}*/\n/***\n!Header /%==================================================%/\n***/\n/*{{{*/\n\n.header {\n		position: relative;\n}\n\n.header a:hover {\n	background: transparent;\n}\n\n.headerShadow {\n	position: relative;\n	padding: 4.5em 0em 1em 1em;\n	left: -1px;\n	top: -1px;\n}\n\n.headerForeground {\n	position: absolute;\n	padding: 4.5em 0em 1em 1em;\n	left: 0px;\n	top: 0px;\n}\n\n.siteTitle {\n	font-size: 3em;\n}\n\n.siteSubtitle {\n	font-size: 1.2em;\n}\n\n/*}}}*/\n/***\n!Main menu /%==================================================%/\n***/\n/*{{{*/\n#mainMenu {\n	position: absolute;\n	left: 0;\n	width: 10em;\n	text-align: right;\n	line-height: 1.6em;\n	padding: 1.5em 0.5em 0.5em 0.5em;\n	font-size: 1.1em;\n}\n\n/*}}}*/\n/***\n!Sidebar rules /%==================================================%/\n***/\n/*{{{*/\n#sidebar {\n	position: absolute;\n	right: 3px;\n	width: 16em;\n	font-size: .9em;\n}\n/*}}}*/\n/***\n''Sidebar options'' /%----------------------------------------------------------------------------------%/\n***/\n/*{{{*/\n#sidebarOptions {\n	padding-top: 0.3em;\n}\n\n#sidebarOptions a {\n	margin: 0em 0.2em;\n	padding: 0.2em 0.3em;\n	display: block;\n}\n\n#sidebarOptions input {\n	margin: 0.4em 0.5em;\n}\n\n#sidebarOptions .sliderPanel {\n	margin-left: 1em;\n	padding: 0.5em;\n	font-size: .85em;\n}\n\n#sidebarOptions .sliderPanel a {\n	font-weight: bold;\n	display: inline;\n	padding: 0;\n}\n\n#sidebarOptions .sliderPanel input {\n	margin: 0 0 .3em 0;\n}\n/*}}}*/\n/***\n''Sidebar tabs'' /%-------------------------------------------------------------------------------------%/\n***/\n/*{{{*/\n\n#sidebarTabs .tabContents {\n	width: 15em;\n	overflow: hidden;\n}\n\n/*}}}*/\n/***\n!Message area /%==================================================%/\n***/\n/*{{{*/\n#messageArea {\nposition:absolute; top:0; right:0; margin: 0.5em; padding: 0.5em;\n}\n\n*[id='messageArea'] {\nposition:fixed !important; z-index:99;}\n\n.messageToolbar {\ndisplay: block;\ntext-align: right;\n}\n\n#messageArea a{\n	text-decoration: underline;\n}\n/*}}}*/\n/***\n!Popup /%==================================================%/\n***/\n/*{{{*/\n.popup {\n	font-size: .9em;\n	padding: 0.2em;\n	list-style: none;\n	margin: 0;\n}\n\n.popup hr {\n	display: block;\n	height: 1px;\n	width: auto;\n	padding: 0;\n	margin: 0.2em 0em;\n}\n\n.popup li.disabled {\n	padding: 0.2em;\n}\n\n.popup li a{\n	display: block;\n	padding: 0.2em;\n}\n/*}}}*/\n/***\n!Tabs /%==================================================%/\n***/\n/*{{{*/\n.tabset {\n	padding: 1em 0em 0em 0.5em;\n}\n\n.tab {\n	margin: 0em 0em 0em 0.25em;\n	padding: 2px;\n}\n\n.tabContents {\n	padding: 0.5em;\n}\n\n.tabContents ul, .tabContents ol {\n	margin: 0;\n	padding: 0;\n}\n\n.txtMainTab .tabContents li {\n	list-style: none;\n}\n\n.tabContents li.listLink {\n	 margin-left: .75em;\n}\n/*}}}*/\n/***\n!Tiddler display rules /%==================================================%/\n***/\n/*{{{*/\n#displayArea {\n	margin: 1em 17em 0em 14em;\n}\n\n\n.toolbar {\n	text-align: right;\n	font-size: .9em;\n	visibility: hidden;\n}\n\n.selected .toolbar {\n	visibility: visible;\n}\n\n.tiddler {\n	padding: 1em 1em 0em 1em;\n}\n\n.missing .viewer,.missing .title {\n	font-style: italic;\n}\n\n.title {\n	font-size: 1.6em;\n	font-weight: bold;\n}\n\n.missing .subtitle {\n display: none;\n}\n\n.subtitle {\n	font-size: 1.1em;\n}\n\n/* I'm not a fan of how button looks in tiddlers... */\n.tiddler .button {\n	padding: 0.2em 0.4em;\n}\n\n.tagging {\nmargin: 0.5em 0.5em 0.5em 0;\nfloat: left;\ndisplay: none;\n}\n\n.isTag .tagging {\ndisplay: block;\n}\n\n.tagged {\nmargin: 0.5em;\nfloat: right;\n}\n\n.tagging, .tagged {\nfont-size: 0.9em;\npadding: 0.25em;\n}\n\n.tagging ul, .tagged ul {\nlist-style: none;margin: 0.25em;\npadding: 0;\n}\n\n.tagClear {\nclear: both;\n}\n\n.footer {\n	font-size: .9em;\n}\n\n.footer li {\ndisplay: inline;\n}\n/***\n''The viewer is where the tiddler content is displayed'' /%------------------------------------------------%/\n***/\n/*{{{*/\n* html .viewer pre {\n	width: 99%;\n	padding: 0 0 1em 0;\n}\n\n.viewer {\n	line-height: 1.4em;\n	padding-top: 0.5em;\n}\n\n.viewer .button {\n	margin: 0em 0.25em;\n	padding: 0em 0.25em;\n}\n\n.viewer blockquote {\n	line-height: 1.5em;\n	padding-left: 0.8em;\n	margin-left: 2.5em;\n}\n\n.viewer ul, .viewer ol{\n	margin-left: 0.5em;\n	padding-left: 1.5em;\n}\n\n.viewer table {\n	border-collapse: collapse;\n	margin: 0.8em 1.0em;\n}\n\n.viewer th, .viewer td, .viewer tr,.viewer caption{\n	padding: 3px;\n}\n\n.viewer pre {\n	padding: 0.5em;\n	margin-left: 0.5em;\n	font-size: 1.2em;\n	line-height: 1.4em;\n	overflow: auto;\n}\n\n.viewer code {\n	font-size: 1.2em;\n	line-height: 1.4em;\n}\n/*}}}*/\n/***\n''The editor replaces the viewer in the tiddler'' /%------------------------------------------------%/\n***/\n/*{{{*/\n.editor {\nfont-size: 1.1em;\n}\n\n.editor input, .editor textarea {\n	display: block;\n	width: 100%;\n	font: inherit;\n}\n\n.editorFooter {\n	padding: 0.25em 0em;\n	font-size: .9em;\n}\n\n.editorFooter .button {\npadding-top: 0px; padding-bottom: 0px;}\n\n.fieldsetFix {border: 0;\npadding: 0;\nmargin: 1px 0px 1px 0px;\n}\n/*}}}*/\n/***\n!Misc rules /%==================================================%/\n***/\n/*{{{*/\n.sparkline {\n	line-height: 1em;\n}\n\n.sparktick {\n	outline: 0;\n}\n\n.zoomer {\n	font-size: 1.1em;\n	position: absolute;\n	padding: 1em;\n}\n\n.cascade {\n	font-size: 1.1em;\n	position: absolute;\n	overflow: hidden;\n}\n/*}}}*/",
	StyleSheetPrint: "@media print {\n#mainMenu, #sidebar, #messageArea, .toolbar {display: none ! important;}\n#displayArea {margin: 1em 1em 0em 1em;}\n/* Fixes a feature in Firefox 1.5.0.2 where print preview displays the noscript content */\nnoscript {display:none;}\n}",
	PageTemplate: "<div class='header' macro='gradient vert #18f #04b'>\n<div class='headerShadow'>\n<span class='siteTitle' refresh='content' tiddler='SiteTitle'></span>&nbsp;\n<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'></span>\n</div>\n<div class='headerForeground'>\n<span class='siteTitle' refresh='content' tiddler='SiteTitle'></span>&nbsp;\n<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'></span>\n</div>\n</div>\n<div id='mainMenu' refresh='content' tiddler='MainMenu'></div>\n<div id='sidebar'>\n<div id='sidebarOptions' refresh='content' tiddler='SideBarOptions'></div>\n<div id='sidebarTabs' refresh='content' force='true' tiddler='SideBarTabs'></div>\n</div>\n<div id='displayArea'>\n<div id='messageArea'></div>\n<div id='tiddlerDisplay'></div>\n</div>",
	ViewTemplate: "<div class='toolbar' macro='toolbar closeTiddler closeOthers +editTiddler permalink references jump'></div>\n<div class='title' macro='view title'></div>\n<div class='subtitle'><span macro='view modifier link'></span>, <span macro='view modified date [[DD MMM YYYY]]'></span> (<span macro='message views.wikified.createdPrompt'></span> <span macro='view created date [[DD MMM YYYY]]'></span>)</div>\n<div class='tagging' macro='tagging'></div>\n<div class='tagged' macro='tags'></div>\n<div class='viewer' macro='view text wikified'></div>\n<div class='tagClear'></div>",
	EditTemplate: "<div class='toolbar' macro='toolbar +saveTiddler -cancelTiddler deleteTiddler'></div>\n<div class='title' macro='view title'></div>\n<div class='editor' macro='edit title'></div>\n<div class='editor' macro='edit text'></div>\n<div class='editor' macro='edit tags'></div><div class='editorFooter'><span macro='message views.editor.tagPrompt'></span><span macro='tagChooser'></span></div>",
	MarkupPreHead: "<link rel='alternate' type='application/rss+xml' title='RSS' href='index.xml'>",
	MarkupPostHead: "",
	MarkupPreBody: "",
	MarkupPostBody: ""
	};

