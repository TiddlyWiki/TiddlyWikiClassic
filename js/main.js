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

// Options that can be set in the options panel and/or cookies
config.options = {
	chkRegExpSearch: false,
	chkCaseSensitiveSearch: false,
	chkAnimate: true,
	txtUserName: "YourName",
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
	{name: null, notify: refreshDisplay}
	];

// Default tiddler templates
var DEFAULT_VIEW_TEMPLATE = 1;
var DEFAULT_EDIT_TEMPLATE = 2;
config.tiddlerTemplates = {
	1: "ViewTemplate",
	2: "EditTemplate"
	};

// Messages
config.messages = {
	customConfigError: "Error in systemConfig tiddler '%1' - %0",
	savedSnapshotError: "It appears that this TiddlyWiki has been incorrectly saved. Please see http://www.tiddlywiki.com/#DownloadSoftware for details",
	subtitleUnknown: "(unknown)",
	undefinedTiddlerToolTip: "The tiddler '%0' doesn't yet exist",
	shadowedTiddlerToolTip: "The tiddler '%0' doesn't yet exist, but has a pre-defined shadow value",
	tiddlerLinkTooltip: "%0 - %1, %2",
	externalLinkTooltip: "External link to %0",
	noTags: "There are no tagged tiddlers",
	notFileUrlError: "You need to save this TiddlyWiki to a file before you can save changes",
	cantSaveError: "It's not possible to save changes. This could be because your browser doesn't support saving (instead, use FireFox if you can), or because the pathname to your TiddlyWiki file contains illegal characters",
	invalidFileError: "The original file '%0' does not appear to be a valid TiddlyWiki",
	backupSaved: "Backup saved",
	backupFailed: "Failed to save backup file",
	rssSaved: "RSS feed saved",
	rssFailed: "Failed to save RSS feed file",
	emptySaved: "Empty template saved",
	emptyFailed: "Failed to save empty template file",
	mainSaved: "Main TiddlyWiki file saved",
	mainFailed: "Failed to save main TiddlyWiki file. Your changes have not been saved",
	macroError: "Error in macro <<%0>>",
	macroErrorDetails: "Error while executing macro <<%0>>:\n%1",
	missingMacro: "No such macro",
	overwriteWarning: "A tiddler named '%0' already exists. Choose OK to overwrite it",
	unsavedChangesWarning: "WARNING! There are unsaved changes in TiddlyWiki\n\nChoose OK to save\nChoose CANCEL to discard",
	confirmExit: "--------------------------------\n\nThere are unsaved changes in TiddlyWiki. If you continue you will lose those changes\n\n--------------------------------",
	saveInstructions: "SaveChanges",
	messageClose: {text: "close", tooltip: "close this message area"},
	dates: {
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"],
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		}
	};

// More messages (rather a legacy layout that shouldn't really be like this)
config.views = {
	wikified: {
		tag: {labelNoTags: "no tags", labelTags: "tags: ", openTag: "Open tag '%0'", tooltip: "Show tiddlers tagged with '%0'", openAllText: "Open all", openAllTooltip: "Open all of these tiddlers", popupNone: "No other tiddlers tagged with '%0'"},
		defaultText: "The tiddler '%0' doesn't yet exist. Double-click to create it",
		defaultModifier: "(missing)",
		shadowModifier: "(shadow)"
		},
	editor: {
		tagPrompt: "Type tags separated with spaces, [[use double square brackets]] if necessary, or add existing",
		tagChooser: {text: "tags", tooltip: "Choose existing tags to add to this tiddler", popupNone: "There are no tags defined", tagTooltip: "Add the tag '%0'"},
		defaultText: "Type the text for '%0'"
		}
	};

// Macros; each has a 'handler' member that is inserted later
config.macros = {
	today: {},
	version: {},
	search: {label: "search", prompt: "Search this TiddlyWiki", sizeTextbox: 15, accessKey: "F", successMsg: "%0 tiddlers found matching %1", failureMsg: "No tiddlers found matching %0"},
	tiddler: {},
	tag: {},
	tags: {},
	tagging: {label: "tagging:", labelNotTag: "not tagging", tooltip: "List of tiddlers tagged with '%0'"},
	timeline: {dateFormat: "DD MMM YYYY"},
	allTags: {tooltip: "Show tiddlers tagged with '%0'", noTags: "There are no tagged tiddlers"},
	list: {
		all: {prompt: "All tiddlers in alphabetical order"},
		missing: {prompt: "Tiddlers that have links to them but are not defined"},
		orphans: {prompt: "Tiddlers that are not linked to from any other tiddlers"},
		shadowed: {prompt: "Tiddlers shadowed with default contents"}
		},
	closeAll: {label: "close all", prompt: "Close all displayed tiddlers (except any that are being edited)"},
	permaview: {label: "permaview", prompt: "Link to an URL that retrieves all the currently displayed tiddlers"},
	saveChanges: {label: "save changes", prompt: "Save all tiddlers to create a new TiddlyWiki", accessKey: "S"},
	slider: {},
	option: {},
	newTiddler: {label: "new tiddler", prompt: "Create a new tiddler", title: "New Tiddler", accessKey: "N"},
	newJournal: {label: "new journal", prompt: "Create a new tiddler from the current date and time", accessKey: "J"},
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
	closeTiddler: {text: "close", tooltip: "Close this tiddler"},
	closeOthers: {text: "close others", tooltip: "Close all other tiddlers"},
	editTiddler: {text: "edit", tooltip: "Edit this tiddler", readOnlyText: "view", readOnlyTooltip: "View the source of this tiddler"},
	saveTiddler: {text: "done", tooltip: "Save changes to this tiddler", hideReadOnly: true},
	cancelTiddler: {text: "cancel", tooltip: "Undo changes to this tiddler", warning: "Are you sure you want to abandon your changes to '%0'?", readOnlyText: "done", readOnlyTooltip: "View this tiddler normally"},
	deleteTiddler: {text: "delete", tooltip: "Delete this tiddler", warning: "Are you sure you want to delete '%0'?", hideReadOnly: true},
	permalink: {text: "permalink", tooltip: "Permalink for this tiddler"},
	references: {text: "references", tooltip: "Show tiddlers that link to this one", popupNone: "No references"},
	jump: {text: "jump", tooltip: "Jump to another open tiddler"}
	};

// Browser detection... In a very few places, there's nothing else for it but to
// know what browser we're using.
config.userAgent = navigator.userAgent.toLowerCase();
config.browser = {
	isIE: config.userAgent.indexOf("msie") != -1 && config.userAgent.indexOf("opera") == -1,
	isSafari: config.userAgent.indexOf("applewebkit") != -1,
	isBadSafari: !((new RegExp("[\u0150\u0170]","g")).test("\u0150")),
	firefoxDate: /Gecko\/(\d{8})/i.exec(config.userAgent),
	isLinux: config.userAgent.indexOf("linux") != -1,
	isUnix: config.userAgent.indexOf("x11") != -1,
	isMac: config.userAgent.indexOf("mac") != -1,
	isWindows: config.userAgent.indexOf("win") != -1
	};

// Basic regular expressions
config.textPrimitives = {
	upperLetter: "[A-Z\u00c0-\u00de\u0150\u0170]",
	lowerLetter: "[a-z\u00df-\u00ff_0-9\\-\u0151\u0171]",
	anyLetter: "[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-\u0150\u0170\u0151\u0171]"
	};
if(config.browser.isBadSafari)
	config.textPrimitives = {
		upperLetter: "[A-Z\u00c0-\u00de]",
		lowerLetter: "[a-z\u00df-\u00ff_0-9\\-]",
		anyLetter: "[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-]"
		}
config.textPrimitives.anyDigit = "[0-9]";
config.textPrimitives.anyNumberChar = "[0-9\\.E]";
config.textPrimitives.urlPattern = "(?:file|http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)";
config.textPrimitives.unWikiLink = "~";
config.textPrimitives.wikiLink = "(?:" + config.textPrimitives.unWikiLink + "{0,1})(?:(?:" + config.textPrimitives.upperLetter + "+" +
												  config.textPrimitives.lowerLetter + "+" +
												  config.textPrimitives.upperLetter +
												  config.textPrimitives.anyLetter + "*)|(?:" +
												  config.textPrimitives.upperLetter + "{2,}" +
												  config.textPrimitives.lowerLetter + "+))";

// ---------------------------------------------------------------------------------
// Shadow tiddlers for emergencies
// ---------------------------------------------------------------------------------

config.shadowTiddlers = {
	DefaultTiddlers: "GettingStarted",
	MainMenu: "GettingStarted",
	SiteTitle: "My TiddlyWiki",
	SiteSubtitle: "a reusable non-linear personal web notebook",
	SiteUrl: "http://www.tiddlywiki.com/",
	GettingStarted: "To get started with this blank TiddlyWiki, you'll need to modify the following tiddlers:\n* SiteTitle & SiteSubtitle: The title and subtitle of the site, as shown above (after saving, they will also appear in the browser title bar)\n* MainMenu: The menu (usually on the left)\n* DefaultTiddlers: Contains the names of the tiddlers that you want to appear when the TiddlyWiki is opened\nYou'll also need to enter your username for signing your edits: <<option txtUserName>>",
	SideBarOptions: "<<search>><<closeAll>><<permaview>><<newTiddler>><<newJournal 'DD MMM YYYY'>><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel 'options »' 'Change TiddlyWiki advanced options'>>",
	OptionsPanel: "These InterfaceOptions for customising TiddlyWiki are saved in your browser\n\nYour username for signing your edits. Write it as a WikiWord (eg JoeBloggs)\n\n<<option txtUserName>>\n<<option chkSaveBackups>> SaveBackups\n<<option chkAutoSave>> AutoSave\n<<option chkRegExpSearch>> RegExpSearch\n<<option chkCaseSensitiveSearch>> CaseSensitiveSearch\n<<option chkAnimate>> EnableAnimations\n\nSee AdvancedOptions",
	AdvancedOptions: "<<option chkGenerateAnRssFeed>> GenerateAnRssFeed\n<<option chkOpenInNewWindow>> OpenLinksInNewWindow\n<<option chkSaveEmptyTemplate>> SaveEmptyTemplate\n<<option chkToggleLinks>> Clicking on links to tiddlers that are already open causes them to close\n^^(override with Control or other modifier key)^^\n<<option chkHttpReadOnly>> HideEditingFeatures when viewed over HTTP\n<<option chkForceMinorUpdate>> Treat edits as MinorChanges by preserving date and time\n^^(override with Shift key when clicking 'done' or by pressing Ctrl-Shift-Enter^^\n<<option chkConfirmDelete>> ConfirmBeforeDeleting\nMaximum number of lines in a tiddler edit box: <<option txtMaxEditRows>>\nFolder name for backup files: <<option txtBackupFolder>>\n",
	SideBarTabs: "<<tabs txtMainTab Timeline Timeline TabTimeline All 'All tiddlers' TabAll Tags 'All tags' TabTags More 'More lists' TabMore>>",
	TabTimeline: "<<timeline>>",
	TabAll: "<<list all>>",
	TabTags: "<<allTags>>",
	TabMore: "<<tabs txtMoreTab Missing 'Missing tiddlers' TabMoreMissing Orphans 'Orphaned tiddlers' TabMoreOrphans Shadowed 'Shadowed tiddlers' TabMoreShadowed>>",
	TabMoreMissing: "<<list missing>>",
	TabMoreOrphans: "<<list orphans>>",
	TabMoreShadowed: "<<list shadowed>>",
	StyleSheet: "/***\nPlace your custom CSS here\n***/\n/*{{{*/\n\n/*}}}*/\n",
	StyleSheetColors: "/***\n!Colors Used\n*@@bgcolor(#8cf): #8cf - Background blue@@\n*@@bgcolor(#18f): #18f - Top blue@@\n*@@bgcolor(#04b): #04b - Mid blue@@\n*@@bgcolor(#014):color(#fff): #014 - Bottom blue@@\n*@@bgcolor(#ffc): #ffc - Bright yellow@@\n*@@bgcolor(#fe8): #fe8 - Highlight yellow@@\n*@@bgcolor(#db4): #db4 - Background yellow@@\n*@@bgcolor(#841): #841 - Border yellow@@\n*@@bgcolor(#703):color(#fff): #703 - Title red@@\n*@@bgcolor(#866): #866 - Subtitle grey@@\n!Generic Rules /%==============================================%/\n***/\n/*{{{*/\nbody {\n	background: #fff;\n	color: #000;\n}\n\na{\n	color: #04b;\n}\n\na:hover{\n	background: #04b;\n	color: #fff;\n}\n\na img{\n	border: 0;\n}\n\nh1,h2,h3,h4,h5 {\n	color: #703;\n	background: #8cf;\n}\n\n.button {\n	color: #014;\n	border: 1px solid #fff;\n}\n\n.button:hover {\n	color: #014;\n	background: #fe8;\n	border-color: #db4;\n}\n\n.button:active {\n	color: #fff;\n	background: #db4;\n	border: 1px solid #841;\n}\n\n/*}}}*/\n/***\n!Header /%==================================================%/\n***/\n/*{{{*/\n.header {\n	background: #04b;\n}\n\n.headerShadow {\n	color: #000;\n}\n\n.headerShadow a {\n	font-weight: normal;\n	color: #000;\n}\n\n.headerForeground {\n	color: #fff;\n}\n\n.headerForeground a {\n	font-weight: normal;\n	color: #8cf;\n}\n\n/*}}}*/\n/***\n!General tabs /%=================================================%/\n***/\n/*{{{*/\n\n.tabSelected{\n	color: #014;\n	background: #eee;\n	border-left: 1px solid #ccc;\n	border-top: 1px solid #ccc;\n	border-right: 1px solid #ccc;\n}\n\n.tabUnselected {\n	color: #fff;\n	background: #999;\n}\n\n.tabContents {\n	color: #014;\n	background: #eee;\n	border: 1px solid #ccc;\n}\n\n.tabContents .button {\n	 border: 0;}\n\n/*}}}*/\n/***\n!Sidebar options /%=================================================%/\n~TiddlyLinks and buttons are treated identically in the sidebar and slider panel\n***/\n/*{{{*/\n#sidebar {\n}\n\n#sidebarOptions input {\n	border: 1px solid #04b;\n}\n\n#sidebarOptions .sliderPanel {\n	background: #8cf;\n}\n\n#sidebarOptions .sliderPanel a {\n	border: none;\n	color: #04b;\n}\n\n#sidebarOptions .sliderPanel a:hover {\n	color: #fff;\n	background: #04b;\n}\n\n#sidebarOptions .sliderPanel a:active {\n	color: #04b;\n	background: #fff;\n}\n/*}}}*/\n/***\n!Message Area /%=================================================%/\n***/\n/*{{{*/\n#messageArea {\n	border: 1px solid #841;\n	background: #db4;\n	color: #014;\n}\n\n#messageArea .button {\n	padding: 0.2em 0.2em 0.2em 0.2em;\n	color: #014;\n	background: #fff;\n}\n\n/*}}}*/\n/***\n!Popup /%=================================================%/\n***/\n/*{{{*/\n.popup {\n	background: #18f;\n	border: 1px solid #04b;\n}\n\n.popup hr {\n	color: #014;\n	background: #014;\n	border-bottom: 1px;\n}\n\n.popup li.disabled {\n	color: #04b;\n}\n\n.popup li a, .popup li a:visited {\n	color: #eee;\n	border: none;\n}\n\n.popup li a:hover {\n	background: #014;\n	color: #fff;\n	border: none;\n}\n/*}}}*/\n/***\n!Tiddler Display /%=================================================%/\n***/\n/*{{{*/\n.tiddler .defaultCommand {\n font-weight: bold;\n}\n\n.shadow .title {\n	color: #866;\n}\n\n.title {\n	color: #703;\n}\n\n.subtitle {\n	color: #866;\n}\n\n.toolbar {\n	color: #04b;\n}\n\n.tagging, .tagged {\n	border: 1px solid #eee;\n	background-color: #eee;\n}\n\n.selected .tagging, .selected .tagged {\n	background-color: #ddd;\n	border: 1px solid #bbb;\n}\n\n.tagging .listTitle, .tagged .listTitle {\n	color: #014;\n}\n\n.tagging .button, .tagged .button {\n		border: none;\n}\n\n.footer {\n	color: #ddd;\n}\n\n.selected .footer {\n	color: #888;\n}\n\n.sparkline {\n	background: #8cf;\n	border: 0;\n}\n\n.sparktick {\n	background: #014;\n}\n\n.errorButton {\n	color: #ff0;\n	background: #f00;\n}\n\n.cascade {\n	background: #eef;\n	color: #aac;\n	border: 1px solid #aac;\n}\n\n.imageLink, #displayArea .imageLink {\n	background: transparent;\n}\n\n/*}}}*/\n/***\n''The viewer is where the tiddler content is displayed'' /%------------------------------------------------%/\n***/\n/*{{{*/\n\n.viewer .listTitle {list-style-type: none; margin-left: -2em;}\n\n.viewer .button {\n	border: 1px solid #db4;\n}\n\n.viewer blockquote {\n	border-left: 3px solid #666;\n}\n\n.viewer table {\n	border: 2px solid #333;\n}\n\n.viewer th, thead td {\n	background: #db4;\n	border: 1px solid #666;\n	color: #fff;\n}\n\n.viewer td, .viewer tr {\n	border: 1px solid #666;\n}\n\n.viewer pre {\n	border: 1px solid #fe8;\n	background: #ffc;\n}\n\n.viewer code {\n	color: #703;\n}\n\n.viewer hr {\n	border: 0;\n	border-top: dashed 1px #666;\n	color: #666;\n}\n\n.highlight, .marked {\n	background: #fe8;\n}\n/*}}}*/\n/***\n''The editor replaces the viewer in the tiddler'' /%------------------------------------------------%/\n***/\n/*{{{*/\n.editor input {\n	border: 1px solid #04b;\n}\n\n.editor textarea {\n	border: 1px solid #04b;\n	width: 100%;\n}\n\n.editorFooter {\n	color: #aaa;\n}\n\n/*}}}*/",
	StyleSheetLayout: "/***\n!Sections in this Tiddler:\n*Generic rules\n**Links styles\n**Link Exceptions\n*Header\n*Main menu\n*Sidebar\n**Sidebar options\n**Sidebar tabs\n*Message area\n*Popup\n*Tabs\n*Tiddler display\n**Viewer\n**Editor\n*Misc. rules\n!Generic Rules /%==============================================%/\n***/\n/*{{{*/\nbody {\n	font-size: .75em;\n	font-family: arial,helvetica;\n	position: relative;\n	margin: 0;\n	padding: 0;\n}\n\nh1,h2,h3,h4,h5 {\n	font-weight: bold;\n	text-decoration: none;\n	padding-left: 0.4em;\n}\n\nh1 {font-size: 1.35em;}\nh2 {font-size: 1.25em;}\nh3 {font-size: 1.1em;}\nh4 {font-size: 1em;}\nh5 {font-size: .9em;}\n\nhr {\n	height: 1px;\n}\n\na{\n	text-decoration: none;\n}\n\nol { list-style-type: decimal }\nol ol { list-style-type: lower-alpha }\nol ol ol { list-style-type: lower-roman }\nol ol ol ol { list-style-type: decimal }\nol ol ol ol ol { list-style-type: lower-alpha }\nol ol ol ol ol ol { list-style-type: lower-roman }\nol ol ol ol ol ol ol { list-style-type: decimal }\n/*}}}*/\n/***\n''General Link Styles'' /%-----------------------------------------------------------------------------%/\n***/\n/*{{{*/\n.externalLink {\n	text-decoration: underline;\n}\n\n.tiddlyLinkExisting {\n	font-weight: bold;\n}\n\n.tiddlyLinkNonExisting {\n	font-style: italic;\n}\n\n/* the 'a' is required for IE, otherwise it renders the whole tiddler a bold */\na.tiddlyLinkNonExisting.shadow {\n	font-weight: bold;\n}\n/*}}}*/\n/***\n''Exceptions to common link styles'' /%------------------------------------------------------------------%/\n***/\n/*{{{*/\n\n#mainMenu .tiddlyLinkExisting, \n#mainMenu .tiddlyLinkNonExisting,\n#sidebarTabs .tiddlyLinkExisting,\n#sidebarTabs .tiddlyLinkNonExisting{\n font-weight: normal;\n font-style: normal;\n}\n\n/*}}}*/\n/***\n!Header /%==================================================%/\n***/\n/*{{{*/\n\n.header {\n		position: relative;\n}\n\n.header a:hover {\n	background: transparent;\n}\n\n.headerShadow {\n	position: relative;\n	padding: 4.5em 0em 1em 1em;\n	left: -1px;\n	top: -1px;\n}\n\n.headerForeground {\n	position: absolute;\n	padding: 4.5em 0em 1em 1em;\n	left: 0px;\n	top: 0px;\n}\n\n.siteTitle {\n	font-size: 3em;\n}\n\n.siteSubtitle {\n	font-size: 1.2em;\n}\n\n/*}}}*/\n/***\n!Main menu /%==================================================%/\n***/\n/*{{{*/\n#mainMenu {\n	position: absolute;\n	left: 0;\n	width: 10em;\n	text-align: right;\n	line-height: 1.6em;\n	padding: 1.5em 0.5em 0.5em 0.5em;\n	font-size: 1.1em;\n}\n\n/*}}}*/\n/***\n!Sidebar rules /%==================================================%/\n***/\n/*{{{*/\n#sidebar {\n	position: absolute;\n	right: 3px;\n	width: 16em;\n	font-size: .9em;\n}\n/*}}}*/\n/***\n''Sidebar options'' /%----------------------------------------------------------------------------------%/\n***/\n/*{{{*/\n#sidebarOptions {\n	padding-top: 0.3em;\n}\n\n#sidebarOptions a {\n	margin: 0em 0.2em;\n	padding: 0.2em 0.3em;\n	display: block;\n}\n\n#sidebarOptions input {\n	margin: 0.4em 0.5em;\n}\n\n#sidebarOptions .sliderPanel {\n	margin-left: 1em;\n	padding: 0.5em;\n	font-size: .85em;\n}\n\n#sidebarOptions .sliderPanel a {\n	font-weight: bold;\n	display: inline;\n	padding: 0;\n}\n\n#sidebarOptions .sliderPanel input {\n	margin: 0 0 .3em 0;\n}\n/*}}}*/\n/***\n''Sidebar tabs'' /%-------------------------------------------------------------------------------------%/\n***/\n/*{{{*/\n\n#sidebarTabs .tabContents {\n	width: 15em;\n	overflow: hidden;\n}\n\n/*}}}*/\n/***\n!Message area /%==================================================%/\n***/\n/*{{{*/\n#messageArea {\nposition:absolute; top:0; right:0; margin: 0.5em; padding: 0.5em;\n}\n\n*[id='messageArea'] {\nposition:fixed !important; z-index:99;}\n\n.messageToolbar {\ndisplay: block;\ntext-align: right;\n}\n\n#messageArea a{\n	text-decoration: underline;\n}\n/*}}}*/\n/***\n!Popup /%==================================================%/\n***/\n/*{{{*/\n.popup {\n	font-size: .9em;\n	padding: 0.2em;\n	list-style: none;\n	margin: 0;\n}\n\n.popup hr {\n	display: block;\n	height: 1px;\n	width: auto;\n	padding: 0;\n	margin: 0.2em 0em;\n}\n\n.popup li.disabled {\n	padding: 0.2em;\n}\n\n.popup li a{\n	display: block;\n	padding: 0.2em;\n}\n/*}}}*/\n/***\n!Tabs /%==================================================%/\n***/\n/*{{{*/\n.tabset {\n	padding: 1em 0em 0em 0.5em;\n}\n\n.tab {\n	margin: 0em 0em 0em 0.25em;\n	padding: 2px;\n}\n\n.tabContents {\n	padding: 0.5em;\n}\n\n.tabContents ul, .tabContents ol {\n	margin: 0;\n	padding: 0;\n}\n\n.txtMainTab .tabContents li {\n	list-style: none;\n}\n\n.tabContents li.listLink {\n	 margin-left: .75em;\n}\n/*}}}*/\n/***\n!Tiddler display rules /%==================================================%/\n***/\n/*{{{*/\n#displayArea {\n	margin: 1em 17em 0em 14em;\n}\n\n\n.toolbar {\n	text-align: right;\n	font-size: .9em;\n	visibility: hidden;\n}\n\n.selected .toolbar {\n	visibility: visible;\n}\n\n.tiddler {\n	padding: 1em 1em 0em 1em;\n}\n\n.missing .viewer,.missing .title {\n	font-style: italic;\n}\n\n.title {\n	font-size: 1.6em;\n	font-weight: bold;\n}\n\n.missing .subtitle {\n display: none;\n}\n\n.subtitle {\n	font-size: 1.1em;\n}\n\n/* I'm not a fan of how button looks in tiddlers... */\n.tiddler .button {\n	padding: 0.2em 0.4em;\n}\n\n.tagging {\nmargin: 0.5em 0.5em 0.5em 0;\nfloat: left;\ndisplay: none;\n}\n\n.isTag .tagging {\ndisplay: block;\n}\n\n.tagged {\nmargin: 0.5em;\nfloat: right;\n}\n\n.tagging, .tagged {\nfont-size: 0.9em;\npadding: 0.25em;\n}\n\n.tagging ul, .tagged ul {\nlist-style: none;margin: 0.25em;\npadding: 0;\n}\n\n.tagClear {\nclear: both;\n}\n\n.footer {\n	font-size: .9em;\n}\n\n.footer li {\ndisplay: inline;\n}\n/***\n''The viewer is where the tiddler content is displayed'' /%------------------------------------------------%/\n***/\n/*{{{*/\n* html .viewer pre {\n	width: 99%;\n	padding: 0 0 1em 0;\n}\n\n.viewer {\n	line-height: 1.4em;\n	padding-top: 0.5em;\n}\n\n.viewer .button {\n	margin: 0em 0.25em;\n	padding: 0em 0.25em;\n}\n\n.viewer blockquote {\n	line-height: 1.5em;\n	padding-left: 0.8em;\n	margin-left: 2.5em;\n}\n\n.viewer ul, .viewer ol{\n	margin-left: 0.5em;\n	padding-left: 1.5em;\n}\n\n.viewer table {\n	border-collapse: collapse;\n	margin: 0.8em 1.0em;\n}\n\n.viewer th, .viewer td, .viewer tr,.viewer caption{\n	padding: 3px;\n}\n\n.viewer pre {\n	padding: 0.5em;\n	margin-left: 0.5em;\n	font-size: 1.2em;\n	line-height: 1.4em;\n	overflow: auto;\n}\n\n.viewer code {\n	font-size: 1.2em;\n	line-height: 1.4em;\n}\n/*}}}*/\n/***\n''The editor replaces the viewer in the tiddler'' /%------------------------------------------------%/\n***/\n/*{{{*/\n.editor {\nfont-size: 1.1em;\n}\n\n.editor input, .editor textarea {\n	display: block;\n	width: 100%;\n	font: inherit;\n}\n\n.editorFooter {\n	padding: 0.25em 0em;\n	font-size: .9em;\n}\n\n.editorFooter .button {\npadding-top: 0px; padding-bottom: 0px;}\n\n.fieldsetFix {border: 0;\npadding: 0;\nmargin: 1px 0px 1px 0px;\n}\n/*}}}*/\n/***\n!Misc rules /%==================================================%/\n***/\n/*{{{*/\n.sparkline {\n	line-height: 1em;\n}\n\n.sparktick {\n	outline: 0;\n}\n\n.zoomer {\n	font-size: 1.1em;\n	position: absolute;\n	padding: 1em;\n}\n\n.cascade {\n	font-size: 1.1em;\n	position: absolute;\n	overflow: hidden;\n}\n/*}}}*/",
	StyleSheetPrint: "@media print {\n#mainMenu, #sidebar, #messageArea {display: none ! important;}\n#displayArea {margin: 1em 1em 0em 1em;}\n/* Fixes a feature in Firefox 1.5.0.2 where print preview displays the noscript content */\nnoscript {display:none;}\n}",
	PageTemplate: "<div class='header' macro='gradient vert #18f #04b'>\n<div class='headerShadow'>\n<span class='siteTitle' refresh='content' tiddler='SiteTitle'></span>&nbsp;\n<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'></span>\n</div>\n<div class='headerForeground'>\n<span class='siteTitle' refresh='content' tiddler='SiteTitle'></span>&nbsp;\n<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'></span>\n</div>\n</div>\n<div id='mainMenu' refresh='content' tiddler='MainMenu'></div>\n<div id='sidebar'>\n<div id='sidebarOptions' refresh='content' tiddler='SideBarOptions'></div>\n<div id='sidebarTabs' refresh='content' force='true' tiddler='SideBarTabs'></div>\n</div>\n<div id='displayArea'>\n<div id='messageArea'></div>\n<div id='tiddlerDisplay'></div>\n</div>",
	ViewTemplate: "<div class='toolbar' macro='toolbar -closeTiddler closeOthers +editTiddler permalink references jump'></div>\n<div class='title' macro='view title'></div>\n<div class='subtitle'><span macro='view modifier link'></span>, <span macro='view modified date [[DD MMM YYYY]]'></span> (created <span macro='view created date [[DD MMM YYYY]]'></span>)</div>\n<div class='tagging' macro='tagging'></div>\n<div class='tagged' macro='tags'></div>\n<div class='viewer' macro='view text wikified'></div>\n<div class='tagClear'></div>",
	EditTemplate: "<div class='toolbar' macro='toolbar +saveTiddler -cancelTiddler deleteTiddler'></div>\n<div class='title' macro='view title'></div>\n<div class='editor' macro='edit title'></div>\n<div class='editor' macro='edit text'></div>\n<div class='editor' macro='edit tags'></div><div class='editorFooter'><span macro='message views.editor.tagPrompt'></span><span macro='tagChooser'></span></div>",
	MarkupPreHead: "<link rel='alternate' type='application/rss+xml' title='RSS' href='index.xml'>",
	MarkupPostHead: "",
	MarkupPreBody: "",
	MarkupPostBody: ""
	};

// ---------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------

var params = null; // Command line parameters
var store = null; // TiddlyWiki storage
var story = null; // Main story
var formatter = null; // Default formatters for the wikifier
var anim = new Animator(); // Animation engine
var readOnly = false; // Whether we're in readonly mode
var highlightHack = null; // Embarrassing hack department...
var hadConfirmExit = false; // Don't warn more than once
var safeMode = false; // Disable all plugins and cookies

// Starting up
function main()
{
	params = getParameters();
	if(params)
		params = params.parseParams("open",null,false);
	store = new TiddlyWiki();
	invokeParamifier(params,"oninit");
	story = new Story("tiddlerDisplay","tiddler");
	addEvent(document,"click",Popup.onDocumentClick);
	saveTest();
	loadOptionsCookie();
	for(var s=0; s<config.notifyTiddlers.length; s++)
		store.addNotification(config.notifyTiddlers[s].name,config.notifyTiddlers[s].notify);
	store.loadFromDiv("storeArea","store");
	invokeParamifier(params,"onload");
	loadSystemConfig();
	formatter = new Formatter(config.formatters);
	readOnly = (window.location.protocol == "file:") ? false : config.options.chkHttpReadOnly;
	invokeParamifier(params,"onconfig");
	store.notifyAll();
	restart();
}

// Restarting
function restart()
{
	invokeParamifier(params,"onstart");
	if(story.isEmpty())
		{
		var defaultParams = store.getTiddlerText("DefaultTiddlers").parseParams("open",null,false);
		invokeParamifier(defaultParams,"onstart");
		}
	window.scrollTo(0,0);
}

function saveTest()
{
	var saveTest = document.getElementById("saveTest");
	if(saveTest.hasChildNodes())
		alert(config.messages.savedSnapshotError);
	saveTest.appendChild(document.createTextNode("savetest"));
}

function loadSystemConfig()
{
	if(safeMode)
		return;
	var configTiddlers = store.getTaggedTiddlers("systemConfig");
	for(var t=0; t<configTiddlers.length; t++)
		{
		var ex = processConfig(configTiddlers[t].text);
		if(ex)
			displayMessage(config.messages.customConfigError.format([ex,configTiddlers[t].title]));
		}
}

// Merge a custom configuration over the top of the current configuration
// Returns a string error message or null if it went OK
function processConfig(customConfig)
{
	try
		{
		if(customConfig && customConfig != "")
			window.eval(customConfig);
		}
	catch(e)
		{
		return(e.description ? e.description : e.toString());
		}
	return null;
}

function invokeMacro(place,macro,params,wikifier,tiddler)
{
	try
		{
		var m = config.macros[macro];
		if(m && m.handler)
			m.handler(place,macro,params.readMacroParams(),wikifier,params,tiddler);
		else
			createTiddlyError(place,config.messages.macroError.format([macro]),config.messages.macroErrorDetails.format([macro,config.messages.missingMacro]));
		}
	catch(ex)
		{
		createTiddlyError(place,config.messages.macroError.format([macro]),config.messages.macroErrorDetails.format([macro,ex.toString()]));
		}
}

// ---------------------------------------------------------------------------------
// Paramifiers
// ---------------------------------------------------------------------------------

function getParameters()
{
	var p = null;
	if(window.location.hash)
		{
		p = decodeURI(window.location.hash.substr(1));
		if(config.browser.firefoxDate == null || config.browser.firefoxDate[1] < "20051111")
			p = convertUTF8ToUnicode(p);
		}
	return p;
}

function invokeParamifier(params,handler)
{
	if(!params || params.length == undefined || params.length <= 1)
		return;
	for(var t=1; t<params.length; t++)
		{
		var p = config.paramifiers[params[t].name];
		if(p && p[handler] instanceof Function)
			p[handler](params[t].value);
		}
}

config.paramifiers = {};

config.paramifiers.start = {
	oninit: function(v) {
		safeMode = v.toLowerCase() == "safe";
		}
};

config.paramifiers.open = {
	onstart: function(v) {
		story.displayTiddler("bottom",v,null,false,false);
		}
};

config.paramifiers.search = {
	onstart: function(v) {
		story.search(v,false,false);
		}
};

config.paramifiers.tag = {
	onstart: function(v) {
		var tagged = store.getTaggedTiddlers(v,"title");
		for(var t=0; t<tagged.length; t++)
			story.displayTiddler("bottom",tagged[t].title,null,false,false);
		}
};

config.paramifiers.newTiddler = {
	onstart: function(v) {
		if(!readOnly)
			{
			story.displayTiddler(null,v,DEFAULT_EDIT_TEMPLATE);
			story.focusTiddler(v,"text");
			}
		}
};

config.paramifiers.newJournal = {
	onstart: function(v) {
		if(!readOnly)
			{
			var now = new Date();
			var title = now.formatString(v.trim());
			story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE);
			story.focusTiddler(title,"text");
			}
		}
};

// ---------------------------------------------------------------------------------
// Macro definitions
// ---------------------------------------------------------------------------------

config.macros.today.handler = function(place,macroName,params)
{
	var now = new Date();
	var text;
	if(params[0])
		text = now.formatString(params[0].trim());
	else
		text = now.toLocaleString();
	createTiddlyElement(place,"span",null,null,text);
}

config.macros.version.handler = function(place)
{
	createTiddlyElement(place,"span",null,null,version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : ""));
}

config.macros.list.handler = function(place,macroName,params)
{
	var type = params[0] ? params[0] : "all";
	var theList = document.createElement("ul");
	place.appendChild(theList);
	if(this[type].prompt)
		createTiddlyElement(theList,"li",null,"listTitle",this[type].prompt);
	var results;
	if(this[type].handler)
		results = this[type].handler(params);
	for (var t = 0; t < results.length; t++)
		{
		theListItem = document.createElement("li")
		theList.appendChild(theListItem);
		if(typeof results[t] == "string")
			createTiddlyLink(theListItem,results[t],true);
		else
			createTiddlyLink(theListItem,results[t].title,true);
		}
}

config.macros.list.all.handler = function(params)
{
	return store.reverseLookup("tags","excludeLists",false,"title");
}

config.macros.list.missing.handler = function(params)
{
	return store.getMissingLinks();
}

config.macros.list.orphans.handler = function(params)
{
	return store.getOrphans();
}

config.macros.list.shadowed.handler = function(params)
{
	return store.getShadowed();
}

config.macros.allTags.handler = function(place,macroName,params)
{
	var tags = store.getTags();
	var theDateList = createTiddlyElement(place,"ul",null,null,null);
	if(tags.length == 0)
		createTiddlyElement(theDateList,"li",null,"listTitle",this.noTags);
	for(var t=0; t<tags.length; t++)
		{
		var theListItem =createTiddlyElement(theDateList,"li",null,null,null);
		var theTag = createTiddlyButton(theListItem,tags[t][0] + " (" + tags[t][1] + ")",this.tooltip.format([tags[t][0]]),onClickTag);
		theTag.setAttribute("tag",tags[t][0]);
		}
}

config.macros.timeline.handler = function(place,macroName,params)
{
	var field = params[0] ? params[0] : "modified";
	var tiddlers = store.reverseLookup("tags","excludeLists",false,field);
	var lastDay = "";
	var last = params[1] ? tiddlers.length-Math.min(tiddlers.length,parseInt(params[1])) : 0;
	for(var t=tiddlers.length-1; t>=last; t--)
		{
		var tiddler = tiddlers[t];
		var theDay = tiddler[field].convertToLocalYYYYMMDDHHMM().substr(0,8);
		if(theDay != lastDay)
			{
			var theDateList = document.createElement("ul");
			place.appendChild(theDateList);
			createTiddlyElement(theDateList,"li",null,"listTitle",tiddler[field].formatString(this.dateFormat));
			lastDay = theDay;
			}
		var theDateListItem = createTiddlyElement(theDateList,"li",null,"listLink",null);
		theDateListItem.appendChild(createTiddlyLink(place,tiddler.title,true));
		}
}

config.macros.search.handler = function(place,macroName,params)
{
	var searchTimeout = null;
	var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick);
	var txt = createTiddlyElement(place,"input",null,null,null);
	if(params[0])
		txt.value = params[0];
	txt.onkeyup = this.onKeyPress;
	txt.onfocus = this.onFocus;
	txt.setAttribute("size",this.sizeTextbox);
	txt.setAttribute("accessKey",this.accessKey);
	txt.setAttribute("autocomplete","off");
	txt.setAttribute("lastSearchText","");
	if(config.browser.isSafari)
		{
		txt.setAttribute("type","search");
		txt.setAttribute("results","5");
		}
	else
		txt.setAttribute("type","text");
}

// Global because there's only ever one outstanding incremental search timer
config.macros.search.timeout = null;

config.macros.search.doSearch = function(txt)
{
	if(txt.value.length > 0)
		{
		story.search(txt.value,config.options.chkCaseSensitiveSearch,config.options.chkRegExpSearch);
		txt.setAttribute("lastSearchText",txt.value);
		}
}

config.macros.search.onClick = function(e)
{
	config.macros.search.doSearch(this.nextSibling);
	return false;
}

config.macros.search.onKeyPress = function(e)
{
	if (!e) var e = window.event;
	switch(e.keyCode)
		{
		case 27:
			this.value = "";
			clearMessage();
			break;
		}
	if(this.value.length > 2)
		{
		if(this.value != this.getAttribute("lastSearchText"))
			{
			if(config.macros.search.timeout)
				clearTimeout(config.macros.search.timeout);
			var txt = this;
			config.macros.search.timeout = setTimeout(function() {config.macros.search.doSearch(txt);},500);
			}
		}
	else
		{
		if(config.macros.search.timeout)
			clearTimeout(config.macros.search.timeout);
		}
}

config.macros.search.onFocus = function(e)
{
	this.select();
}

config.macros.tiddler.handler = function(place,macroName,params)
{
	var wrapper = createTiddlyElement(place,"span",null,params[1] ? params[1] : null,null);
	var text = store.getTiddlerText(params[0]);
	if(text)
		{
		var tiddlerName = params[0];
		var stack = config.macros.tiddler.tiddlerStack;
		if(stack.find(tiddlerName) !== null)
			return;
		stack.push(tiddlerName);
		try
			{
			wikify(text,wrapper,null,store.getTiddler(tiddlerName));
			}
		finally
			{
			stack.pop();
			}
		}
}

config.macros.tiddler.tiddlerStack = [];

config.macros.tag.handler = function(place,macroName,params)
{
	createTagButton(place,params[0]);
}

config.macros.tags.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var theList = createTiddlyElement(place,"ul");
	if(params[0] && store.tiddlerExists[params[0]])
		tiddler = store.getTiddler(params[0]);
	var lingo = config.views.wikified.tag;
	var prompt = tiddler.tags.length == 0 ? lingo.labelNoTags : lingo.labelTags;
	createTiddlyElement(theList,"li",null,"listTitle",prompt.format([tiddler.title]));
	for(var t=0; t<tiddler.tags.length; t++)
		createTagButton(createTiddlyElement(theList,"li"),tiddler.tags[t],tiddler.title);
}

config.macros.tagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var theList = createTiddlyElement(place,"ul");
	var title = "";
	if(tiddler instanceof Tiddler)
        title = tiddler.title;
	if(params[0])
        title = params[0];
	theList.setAttribute("title",this.tooltip.format([title]));
	var tagged = store.getTaggedTiddlers(title);
	var prompt = tagged.length == 0 ? this.labelNotTag : this.label;
	createTiddlyElement(theList,"li",null,"listTitle",prompt.format([title]));
	for(var t=0; t<tagged.length; t++)
		createTiddlyLink(createTiddlyElement(theList,"li"),tagged[t].title,true);
}

config.macros.closeAll.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
}

config.macros.closeAll.onClick = function(e)
{
	story.closeAllTiddlers();
	return false;
}

config.macros.permaview.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
}

config.macros.permaview.onClick = function(e)
{
	story.permaView();
	return false;
}

config.macros.saveChanges.handler = function(place)
{
	if(!readOnly)
		createTiddlyButton(place,this.label,this.prompt,this.onClick,null,null,this.accessKey);
}

config.macros.saveChanges.onClick = function(e)
{
	saveChanges();
	return false;
}

config.macros.slider.onClickSlider = function(e)
{
	if (!e) var e = window.event;
	var n = this.nextSibling;
	var cookie = n.getAttribute("cookie");
	var isOpen = n.style.display != "none";
	if(config.options.chkAnimate)
		anim.startAnimating(new Slider(n,!isOpen,e.shiftKey || e.altKey,"none"));
	else
		n.style.display = isOpen ? "none" : "block";
	config.options[cookie] = !isOpen;
	saveOptionCookie(cookie);
	return false;
}

config.macros.slider.createSlider = function(place,cookie,title,tooltip)
{
	var cookie = cookie ? cookie : "";
	var btn = createTiddlyButton(place,title,tooltip,this.onClickSlider);
	var panel = createTiddlyElement(place,"div",null,"sliderPanel",null);
	panel.setAttribute("cookie",cookie);
	panel.style.display = config.options[cookie] ? "block" : "none";
	return panel;
}

config.macros.slider.handler = function(place,macroName,params)
{
	var panel = this.createSlider(place,params[0],params[2],params[3]);
	var text = store.getTiddlerText(params[1]);
	if(text)
		wikify(text,panel,null,store.getTiddler(params[1]));
}

config.macros.option.onChangeOption = function(e)
{
	var opt = this.getAttribute("option");
	var elementType,valueField;
	if(opt)
		{
		switch(opt.substr(0,3))
			{
			case "txt":
				elementType = "input";
				valueField = "value";
				break;
			case "chk":
				elementType = "input";
				valueField = "checked";
				break;
			}
		config.options[opt] = this[valueField];
		saveOptionCookie(opt);
		var nodes = document.getElementsByTagName(elementType);
		for(var t=0; t<nodes.length; t++)
			{
			var optNode = nodes[t].getAttribute("option");
			if(opt == optNode)
				nodes[t][valueField] = this[valueField];
			}
		}
	return(true);
}

config.macros.option.handler = function(place,macroName,params)
{
	var opt = params[0];
	if(config.options[opt] == undefined)
		return;
	var c;
	switch(opt.substr(0,3))
		{
		case "txt":
			c = document.createElement("input");
			c.onkeyup = this.onChangeOption;
			c.setAttribute("option",opt);
			c.size = 15;
			place.appendChild(c);
			c.value = config.options[opt];
			break;
		case "chk":
			c = document.createElement("input");
			c.setAttribute("type","checkbox");
			c.onclick = this.onChangeOption;
			c.setAttribute("option",opt);
			place.appendChild(c);
			c.checked = config.options[opt];
			break;
		}
}

config.macros.newTiddler.onClick = function()
{
	story.displayTiddler(null,config.macros.newTiddler.title,DEFAULT_EDIT_TEMPLATE);
	story.focusTiddler(config.macros.newTiddler.title,"title");
	return false;
}

config.macros.newTiddler.handler = function(place)
{
	if(!readOnly)
		createTiddlyButton(place,this.label,this.prompt,this.onClick,null,null,this.accessKey);
}

config.macros.newJournal.handler = function(place,macroName,params)
{
	if(!readOnly)
		{
		var now = new Date();
		var title = now.formatString(params[0].trim());
		var btn = createTiddlyButton(place,this.label,this.prompt,this.createJournal,null,null,this.accessKey);
		btn.setAttribute("journalTitle",title);
		btn.setAttribute("params",params.join("|"));
		}
}

config.macros.newJournal.createJournal = function(e)
{
	var title = this.getAttribute("journalTitle");
	var params = this.getAttribute("params").split("|");
	story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE);
	for(var t=1;t<params.length;t++)
		story.setTiddlerTag(title,params[t],+1);
	story.focusTiddler(title,"text");
	return false;
}

config.macros.sparkline.handler = function(place,macroName,params)
{
	var data = [];
	var min = 0;
	var max = 0;
	for(var t=0; t<params.length; t++)
		{
		var v = parseInt(params[t]);
		if(v < min)
			min = v;
		if(v > max)
			max = v;
		data.push(v);
		}
	if(data.length < 1)
		return;
	var box = createTiddlyElement(place,"span",null,"sparkline",String.fromCharCode(160));
	box.title = data.join(",");
	var w = box.offsetWidth;
	var h = box.offsetHeight;
	box.style.paddingRight = (data.length * 2 - w) + "px";
	box.style.position = "relative";
	for(var d=0; d<data.length; d++)
		{
		var tick = document.createElement("img");
		tick.border = 0;
		tick.className = "sparktick";
		tick.style.position = "absolute";
		tick.src = "data:image/gif,GIF89a%01%00%01%00%91%FF%00%FF%FF%FF%00%00%00%C0%C0%C0%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%01%00%01%00%40%02%02T%01%00%3B";
		tick.style.left = d*2 + "px";
		tick.style.width = "2px";
		var v = Math.floor(((data[d] - min)/(max-min)) * h);
		tick.style.top = (h-v) + "px";
		tick.style.height = v + "px";
		box.appendChild(tick);
		}
}

config.macros.tabs.handler = function(place,macroName,params)
{
	var cookie = params[0];
	var numTabs = (params.length-1)/3;
	var wrapper = createTiddlyElement(place,"div",null,cookie,null);
	var tabset = createTiddlyElement(wrapper,"div",null,"tabset",null);
	tabset.setAttribute("cookie",cookie);
	var validTab = false;
	for(var t=0; t<numTabs; t++)
		{
		var label = params[t*3+1];
		var prompt = params[t*3+2];
		var content = params[t*3+3];
		var tab = createTiddlyButton(tabset,label,prompt,this.onClickTab,"tab tabUnselected");
		tab.setAttribute("tab",label);
		tab.setAttribute("content",content);
		tab.title = prompt;
		if(config.options[cookie] == label)
			validTab = true;
		}
	if(!validTab)
		config.options[cookie] = params[1];
	this.switchTab(tabset,config.options[cookie]);
}

config.macros.tabs.onClickTab = function(e)
{
	config.macros.tabs.switchTab(this.parentNode,this.getAttribute("tab"));
	return false;
}

config.macros.tabs.switchTab = function(tabset,tab)
{
	var cookie = tabset.getAttribute("cookie");
	var theTab = null
	var nodes = tabset.childNodes;
	for(var t=0; t<nodes.length; t++)
		if(nodes[t].getAttribute && nodes[t].getAttribute("tab") == tab)
			{
			theTab = nodes[t];
			theTab.className = "tab tabSelected";
			}
		else
			nodes[t].className = "tab tabUnselected"
	if(theTab)
		{
		if(tabset.nextSibling && tabset.nextSibling.className == "tabContents")
			tabset.parentNode.removeChild(tabset.nextSibling);
		var tabContent = createTiddlyElement(null,"div",null,"tabContents",null);
		tabset.parentNode.insertBefore(tabContent,tabset.nextSibling);
		var contentTitle = theTab.getAttribute("content");
		wikify(store.getTiddlerText(contentTitle),tabContent,null,store.getTiddler(contentTitle));
		if(cookie)
			{
			config.options[cookie] = tab;
			saveOptionCookie(cookie);
			}
		}
}

// <<gradient [[tiddler name]] vert|horiz rgb rgb rgb rgb... >>
config.macros.gradient.handler = function(place,macroName,params,wikifier)
{
	var terminator = ">>";
	var panel;
	if(wikifier)
		panel = createTiddlyElement(place,"div",null,"gradient",null);
	else
		panel = place;
	panel.style.position = "relative";
	panel.style.overflow = "hidden";
	panel.style.zIndex = "0";
	var t;
	if(wikifier)
		{
		var styles = config.formatterHelpers.inlineCssHelper(wikifier);
		config.formatterHelpers.applyCssHelper(panel,styles);
		}
	var colours = [];
	for(t=1; t<params.length; t++)
		{
		var c = new RGB(params[t]);
		if(c)
			colours.push(c);
		}
	drawGradient(panel,params[0] != "vert",colours);
	if(wikifier)
		wikifier.subWikify(panel,terminator);
	if(document.all)
		{
		panel.style.height = "100%";
		panel.style.width = "100%";
		}
}

config.macros.message.handler = function(place,macroName,params)
{
	if(params[0])
		{
		var m = config;
		var p = params[0].split(".");
		for(var t=0; t<p.length; t++)
			{
			if(p[t] in m)
				m = m[p[t]];
			else
				break;
			}
		createTiddlyText(place,m.toString().format(params.splice(1)));
		}
}

config.macros.view.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if((tiddler instanceof Tiddler) && params[0] && (tiddler[params[0]] != undefined))
		{
		switch(params[1])
			{
			case undefined:
				highlightify(tiddler[params[0]],place,highlightHack);
				break;
			case "link":
				createTiddlyLink(place,tiddler[params[0]],true);
				break;
			case "wikified":
				wikify(tiddler[params[0]],place,highlightHack,tiddler);
				break;
			case "date":
				if(params[2])
					createTiddlyText(place,tiddler[params[0]].formatString(params[2]));
				else
					createTiddlyText(place,tiddler[params[0]]);
				break;
			}
		}
}

config.macros.edit.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var field = params[0];
	if((tiddler instanceof Tiddler) && field && (tiddler[field] != undefined))
		{
		story.setDirty(tiddler.title,true);
		switch(field)
			{
			case "title":
				var e = createTiddlyElement(place,"input");
				if(tiddler.isReadOnly())
					e.setAttribute("readOnly","readOnly");
				e.setAttribute("edit","title");
				e.setAttribute("type","text");
				e.value = tiddler.title;
				e.setAttribute("size","40");
				e.setAttribute("autocomplete","off");
				break;
			case "text":
				var wrapper1 = createTiddlyElement(place,"fieldset",null,"fieldsetFix",null);
				var wrapper2 = createTiddlyElement(wrapper1,"div",null,null,null);
				var e = createTiddlyElement(wrapper2,"textarea");
				if(tiddler.isReadOnly())
					e.setAttribute("readOnly","readOnly");
				e.value = tiddler.text;
				var rows = 10;
				var lines = tiddler.text.match(regexpNewLine);
				var maxLines = Math.max(parseInt(config.options.txtMaxEditRows),5);
				if(lines != null && lines.length > rows)
					rows = lines.length + 5;
				rows = Math.min(rows,maxLines);
				e.setAttribute("rows",rows);
				e.setAttribute("edit","text");
				break;
			case "tags":
				var e = createTiddlyElement(place,"input");
				if(tiddler.isReadOnly())
					e.setAttribute("readOnly","readOnly");
				e.setAttribute("edit","tags");
				e.setAttribute("type","text");
				e.value = tiddler.getTags();
				e.setAttribute("size","40");
				e.setAttribute("autocomplete","off");
				break;
			}
		}
}

config.macros.tagChooser.onClick = function(e)
{
	if (!e) var e = window.event;
	var lingo = config.views.editor.tagChooser;
	var popup = Popup.create(this);
	var tags = store.getTags();
	if(tags.length == 0)
		createTiddlyText(createTiddlyElement(popup,"li"),lingo.popupNone);
	for (var t=0; t<tags.length; t++)
		{
		var theTag = createTiddlyButton(createTiddlyElement(popup,"li"),tags[t][0],lingo.tagTooltip.format([tags[t][0]]),config.macros.tagChooser.onTagClick);
		theTag.setAttribute("tag",tags[t][0]);
		theTag.setAttribute("tiddler", this.getAttribute("tiddler"));
		}
	Popup.show(popup,false);
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return(false);
}

config.macros.tagChooser.onTagClick = function(e)
{
	if (!e) var e = window.event;
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	var tiddler = store.getTiddler(title);
	if(!readOnly)
		story.setTiddlerTag(title,tag,0);
	return(false);
}

config.macros.tagChooser.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(tiddler instanceof Tiddler)
		{
		var title = tiddler.title;
		var lingo = config.views.editor.tagChooser;
		var btn = createTiddlyButton(place,lingo.text,lingo.tooltip,this.onClick);
		btn.setAttribute("tiddler", title);
		}
}

// Create a toolbar command button
// place - parent DOM element
// command - reference to config.commands[] member -or- name of member
// tiddler - reference to tiddler that toolbar applies to
// theClass - the class to give the button
config.macros.toolbar.createCommand = function(place,commandName,tiddler,theClass)
{
	if(typeof commandName != "string")
		{
		var c = null;
		for(var t in config.commands)
			if(config.commands[t] == commandName)
				c = t;
		commandName = c;
		}
	if((tiddler instanceof Tiddler) && (typeof commandName == "string"))
		{
		var title = tiddler.title;
		var command = config.commands[commandName];
		var ro = tiddler.isReadOnly();
		var text = ro && command.readOnlyText ? command.readOnlyText : command.text;
		var tooltip = ro && command.readOnlyTooltip ? command.readOnlyTooltip : command.tooltip;
		if(!ro || (ro && !command.hideReadOnly))
			{
			var btn = createTiddlyButton(place,text,tooltip,this.onClickCommand);
			btn.setAttribute("commandName", commandName);
			btn.setAttribute("tiddler", title);
			if(theClass)
				addClass(btn,theClass);
			}
		}
}

config.macros.toolbar.onClickCommand = function(e)
{
	if (!e) var e = window.event;
	var command = config.commands[this.getAttribute("commandName")];
	return command.handler(e,this,this.getAttribute("tiddler"));
}

// Invoke the first command encountered from a given place that is tagged with a specified class
config.macros.toolbar.invokeCommand = function(place,theClass,event)
{
	var children = place.getElementsByTagName("a")
	for (var t=0; t<children.length; t++)
		{
		var c = children[t];
		if(hasClass(c,theClass) && c.getAttribute && c.getAttribute("commandName"))
			{
			if(c.onclick instanceof Function)
				c.onclick.call(c,event);
			break;
			}
		}
}

config.macros.toolbar.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	for(var t=0; t<params.length; t++)
		{
		var c = params[t];
		var theClass = "";
		switch(c.substr(0,1))
			{
			case "+":
				theClass = "defaultCommand";
				c = c.substr(1);
				break;
			case "-":
				theClass = "cancelCommand";
				c = c.substr(1);
				break;
			}
		if(c in config.commands)
			this.createCommand(place,c,tiddler,theClass);
		}
}

config.macros.br.handler = function(place)
{
	createTiddlyElement(place,"br");
}

// ---------------------------------------------------------------------------------
// Menu and toolbar commands
// ---------------------------------------------------------------------------------

config.commands.closeTiddler.handler = function(event,src,title)
{
	story.closeTiddler(title,true,event.shiftKey || event.altKey);
	return false;
}

config.commands.closeOthers.handler = function(event,src,title)
{
	story.closeAllTiddlers(title);
	return false;
}

config.commands.editTiddler.handler = function(event,src,title)
{
	clearMessage();
	story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE);
	story.focusTiddler(title,"text");
	return false;
}

config.commands.saveTiddler.handler = function(event,src,title)
{
	var newTitle = story.saveTiddler(title,event.shiftKey);
	if(newTitle)
	   story.displayTiddler(null,newTitle);
	return false;
}

config.commands.cancelTiddler.handler = function(event,src,title)
{
	if(story.hasChanges(title) && !readOnly)
		if(!confirm(this.warning.format([title])))
			return false;
	story.setDirty(title,false);
	story.displayTiddler(null,title);
	return false;
}

config.commands.deleteTiddler.handler = function(event,src,title)
{
	var deleteIt = true;
	if (config.options.chkConfirmDelete)
		deleteIt = confirm(this.warning.format([title]));
	if (deleteIt)
		{
		store.removeTiddler(title);
		story.closeTiddler(title,true,event.shiftKey || event.altKey);
		if(config.options.chkAutoSave)
			saveChanges();
		}
	return false;
}

config.commands.permalink.handler = function(event,src,title)
{
	var t = encodeURIComponent(String.encodeTiddlyLink(title));
	if(window.location.hash != t)
		window.location.hash = t;
	return false;
}

config.commands.references.handler = function(event,src,title)
{
	var popup = Popup.create(src);
	if(popup)
		{
		var references = store.getReferringTiddlers(title);
		var c = false;
		for(var r=0; r<references.length; r++)
			if(references[r].title != title && !references[r].isTagged("excludeLists"))
				{
				createTiddlyLink(createTiddlyElement(popup,"li"),references[r].title,true);
				c = true;
				}
		if(!c)
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),this.popupNone);
		}
	Popup.show(popup,false);
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
	return false;
}

config.commands.jump.handler = function(event,src,title)
{
	var popup = Popup.create(src);
	if(popup)
		{
		story.forEachTiddler(function(title,element) {
			createTiddlyLink(createTiddlyElement(popup,"li"),title,true);
			});
		}
	Popup.show(popup,false);
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
	return false;
}

// ---------------------------------------------------------------------------------
// Message area
// ---------------------------------------------------------------------------------

function displayMessage(text,linkText)
{
	var msgArea = document.getElementById("messageArea");
	if(!msgArea)
		{
		alert(text);
		return;
		}
	if(!msgArea.hasChildNodes())
		createTiddlyButton(createTiddlyElement(msgArea,"div",null,"messageToolbar"),config.messages.messageClose.text,config.messages.messageClose.tooltip,clearMessage);
	var msg;
	if(linkText)
		{
		msg = createTiddlyElement(msgArea,"div",null,null,null);
		var link = createTiddlyElement(msg,"a",null,null,text);
		link.href = linkText;
		link.target = "_blank";
		}
	else
		msg = createTiddlyElement(msgArea,"div",null,null,text);
	msgArea.style.display = "block";
}

function clearMessage()
{
	var msgArea = document.getElementById("messageArea");
	if(msgArea)
		{
		removeChildren(msgArea);
		msgArea.style.display = "none";
		}
	return false;
}

// ---------------------------------------------------------------------------------
// Refresh mechanism
// ---------------------------------------------------------------------------------

config.refreshers = {
	link: function(e,changeList)
		{
		var title = e.getAttribute("tiddlyLink");
		refreshTiddlyLink(e,title);
		},

	content: function(e,changeList)
		{
		var title = e.getAttribute("tiddler");
		var force = e.getAttribute("force");
		if(force != null || changeList == null || changeList.find(title) != null)
			{
			removeChildren(e);
			wikify(store.getTiddlerText(title,title),e,null,null);
			}
		}
};

function refreshElements(root,changeList)
{
	var nodes = root.childNodes;
	for(var c=0; c<nodes.length; c++)
		{
		var e = nodes[c],type;
		if(e.getAttribute)
			type = e.getAttribute("refresh");
		else
			type = null;
		var refresher = config.refreshers[type];
		if(refresher == undefined)
			{
			if(e.hasChildNodes())
				refreshElements(e,changeList);
			}
		else
			refresher(e,changeList);
		}
}

function applyHtmlMacros(root,tiddler)
{
	var e = root.firstChild;
	while(e)
		{
		var nextChild = e.nextSibling;
		if(e.getAttribute)
			{
			var macro = e.getAttribute("macro");
			if(macro)
				{
				var params = "";
				var p = macro.indexOf(" ");
				if(p != -1)
					{
					params = macro.substr(p+1);
					macro = macro.substr(0,p);
					}
				invokeMacro(e,macro,params,null,tiddler);
				}
			}
		if(e.hasChildNodes())
			applyHtmlMacros(e,tiddler);
		e = nextChild;
		}
}

function refreshPageTemplate(title)
{
	applyPageTemplate(title);
}

function applyPageTemplate(title)
{
	var stash = createTiddlyElement(document.body,"div");
	stash.style.display = "none";
	var display = document.getElementById("tiddlerDisplay");
	var nodes,t;
	if(display)
		{
		nodes = display.childNodes;
		for(t=nodes.length-1; t>=0; t--)
			stash.appendChild(nodes[t]);
		}
	var wrapper = document.getElementById("contentWrapper");
	if(!title)
		title = "PageTemplate";
	var html = store.getTiddlerText(title);
	wrapper.innerHTML = html;
	applyHtmlMacros(wrapper,null);
	refreshElements(wrapper,null);
	display = document.getElementById("tiddlerDisplay");
	removeChildren(display);
	if(!display)
		display = createTiddlyElement(wrapper,"div","tiddlerDisplay");
	nodes = stash.childNodes;
	for(t=nodes.length-1; t>=0; t--)
		display.appendChild(nodes[t]);
	stash.parentNode.removeChild(stash);
}

function refreshDisplay(hint)
{
	var e = document.getElementById("contentWrapper");
	refreshElements(e,hint == null ? null : [hint]);
}

function refreshPageTitle()
{
	document.title = wikifyPlain("SiteTitle") + " - " + wikifyPlain("SiteSubtitle");
}

function refreshStyles(title)
{
	setStylesheet(title == null ? "" : store.getRecursiveTiddlerText(title,"",10),title);
}

// ---------------------------------------------------------------------------------
// Options cookie stuff
// ---------------------------------------------------------------------------------

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
			switch(name.substr(0,3))
				{
				case "txt":
					config.options[name] = unescape(value);
					break;
				case "chk":
					config.options[name] = value == "true";
					break;
				}
			}
		}
}

function saveOptionCookie(name)
{
	if(safeMode)
		return;
	var c = name + "=";
	switch(name.substr(0,3))
		{
		case "txt":
			c += escape(config.options[name].toString());
			break;
		case "chk":
			c += config.options[name] ? "true" : "false";
			break;
		}
	c += "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/";
	document.cookie = c;
}

// ---------------------------------------------------------------------------------
// Saving
// ---------------------------------------------------------------------------------

var saveUsingSafari = false;
var startSaveArea = '<div id="' + 'storeArea">'; // Split up into two so that indexOf() of this source doesn't find it
var endSaveArea = '</d' + 'iv>';

// If there are unsaved changes, force the user to confirm before exitting
function confirmExit()
{
	hadConfirmExit = true;
	if(store && store.isDirty && store.isDirty())
		return config.messages.confirmExit;
}

// Give the user a chance to save changes before exitting
function checkUnsavedChanges()
{
	if(store && store.isDirty && store.isDirty() && window.hadConfirmExit === false)
		{
		if(confirm(config.messages.unsavedChangesWarning))
			saveChanges();
		}
}

// Save this tiddlywiki with the pending changes
function saveChanges()
{
	clearMessage();
	// Get the URL of the document
	var originalPath = document.location.toString();
	// Check we were loaded from a file URL
	if(originalPath.substr(0,5) != "file:")
		{
		alert(config.messages.notFileUrlError);
		if(store.tiddlerExists(config.messages.saveInstructions))
			displayTiddler(null,config.messages.saveInstructions);
		return;
		}
	var localPath = getLocalPath(originalPath);
	// Load the original file
	var original = loadFile(localPath);
	if(original == null)
		{
		alert(config.messages.cantSaveError);
		if(store.tiddlerExists(config.messages.saveInstructions))
			displayTiddler(null,config.messages.saveInstructions);
		return;
		}
	// Locate the storeArea div's
	var posOpeningDiv = original.indexOf(startSaveArea);
	var posClosingDiv = original.lastIndexOf(endSaveArea);
	if((posOpeningDiv == -1) || (posClosingDiv == -1))
		{
		alert(config.messages.invalidFileError.format([localPath]));
		return;
		}
	// Save the backup
	if(config.options.chkSaveBackups)
		{
		var backupPath = getBackupPath(localPath);
		var backup = saveFile(backupPath,original);
		if(backup)
			displayMessage(config.messages.backupSaved,"file://" + backupPath);
		else
			alert(config.messages.backupFailed);
		}
	// Save Rss
	if(config.options.chkGenerateAnRssFeed)
		{
		var rssPath = localPath.substr(0,localPath.lastIndexOf(".")) + ".xml";
		var rssSave = saveFile(rssPath,convertUnicodeToUTF8(generateRss()));
		if(rssSave)
			displayMessage(config.messages.rssSaved,"file://" + rssPath);
		else
			alert(config.messages.rssFailed);
		}
	// Save empty template
	if(config.options.chkSaveEmptyTemplate)
		{
		var emptyPath,p;
		if((p = localPath.lastIndexOf("/")) != -1)
			emptyPath = localPath.substr(0,p) + "/empty.html";
		else if((p = localPath.lastIndexOf("\\")) != -1)
			emptyPath = localPath.substr(0,p) + "\\empty.html";
		else
			emptyPath = localPath + ".empty.html";
		var empty = original.substr(0,posOpeningDiv + startSaveArea.length) + original.substr(posClosingDiv);
		var emptySave = saveFile(emptyPath,empty);
		if(emptySave)
			displayMessage(config.messages.emptySaved,"file://" + emptyPath);
		else
			alert(config.messages.emptyFailed);
		}
	// Save new file
	var revised = original.substr(0,posOpeningDiv + startSaveArea.length) +
				convertUnicodeToUTF8(allTiddlersAsHtml()) + "\n\t\t" +
				original.substr(posClosingDiv);
	var newSiteTitle = convertUnicodeToUTF8((wikifyPlain("SiteTitle") + " - " + wikifyPlain("SiteSubtitle")).htmlEncode());
	revised = revised.replaceChunk("<title"+">","</title"+">"," " + newSiteTitle + " ");
	revised = revised.replaceChunk("<!--PRE-HEAD-START--"+">","<!--PRE-HEAD-END--"+">","\n" + store.getTiddlerText("MarkupPreHead","") + "\n");
	revised = revised.replaceChunk("<!--POST-HEAD-START--"+">","<!--POST-HEAD-END--"+">","\n" + store.getTiddlerText("MarkupPostHead","") + "\n");
	revised = revised.replaceChunk("<!--PRE-BODY-START--"+">","<!--PRE-BODY-END--"+">","\n" + store.getTiddlerText("MarkupPreBody","") + "\n");
	revised = revised.replaceChunk("<!--POST-BODY-START--"+">","<!--POST-BODY-END--"+">","\n" + store.getTiddlerText("MarkupPostBody","") + "\n");
	var save = saveFile(localPath,revised);
	if(save)
		{
		displayMessage(config.messages.mainSaved,"file://" + localPath);
		store.setDirty(false);
		}
	else
		alert(config.messages.mainFailed);
}

function getLocalPath(originalPath)
{
	// Remove any location or query part of the URL
	var argPos = originalPath.indexOf("?");
	if(argPos != -1)
		originalPath = originalPath.substr(0,argPos);
	var hashPos = originalPath.indexOf("#");
	if(hashPos != -1)
		originalPath = originalPath.substr(0,hashPos);
	// Convert file://localhost/ to file:///
	if(originalPath.indexOf("file://localhost/") == 0)
		originalPath = "file://" + originalPath.substr(16);
	// Convert to a native file format assuming
	// "file:///x:/path/path/path..." - pc local file --> "x:\path\path\path..."
	// "file://///server/share/path/path/path..." - FireFox pc network file --> "\\server\share\path\path\path..."
	// "file:///path/path/path..." - mac/unix local file --> "/path/path/path..."
	// "file://server/share/path/path/path..." - pc network file --> "\\server\share\path\path\path..."
	var localPath;
	if(originalPath.charAt(9) == ":") // pc local file
		localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file://///") == 0) // FireFox pc network file
		localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file:///") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(7));
	else if(originalPath.indexOf("file:/") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(5));
	else // pc network file
		localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
	return localPath;
}

function getBackupPath(localPath)
{
	var backSlash = true;
	var dirPathPos = localPath.lastIndexOf("\\");
	if(dirPathPos == -1)
		{
		dirPathPos = localPath.lastIndexOf("/");
		backSlash = false;
		}
	var backupFolder = config.options.txtBackupFolder;
	if(!backupFolder || backupFolder == "")
		backupFolder = ".";
	var backupPath = localPath.substr(0,dirPathPos) + (backSlash ? "\\" : "/") + backupFolder + localPath.substr(dirPathPos);
	backupPath = backupPath.substr(0,backupPath.lastIndexOf(".")) + "." + (new Date()).convertToYYYYMMDDHHMMSSMMM() + ".html";
	return backupPath;
}

function generateRss()
{
	var s = [];
	var d = new Date();
	var u = store.getTiddlerText("SiteUrl",null);
	// Assemble the header
	s.push("<" + "?xml version=\"1.0\"?" + ">");
	s.push("<rss version=\"2.0\">");
	s.push("<channel>");
	s.push("<title>" + wikifyPlain("SiteTitle").htmlEncode() + "</title>");
	if(u)
		s.push("<link>" + u.htmlEncode() + "</link>");
	s.push("<description>" + wikifyPlain("SiteSubtitle").htmlEncode() + "</description>");
	s.push("<language>en-us</language>");
	s.push("<copyright>Copyright " + d.getFullYear() + " " + config.options.txtUserName.htmlEncode() + "</copyright>");
	s.push("<pubDate>" + d.toGMTString() + "</pubDate>");
	s.push("<lastBuildDate>" + d.toGMTString() + "</lastBuildDate>");
	s.push("<docs>http://blogs.law.harvard.edu/tech/rss</docs>");
	s.push("<generator>TiddlyWiki " + version.major + "." + version.minor + "." + version.revision + "</generator>");
	// The body
	var tiddlers = store.getTiddlers("modified","excludeLists");
	var n = config.numRssItems > tiddlers.length ? 0 : tiddlers.length-config.numRssItems;
	for (var t=tiddlers.length-1; t>=n; t--)
		s.push(tiddlers[t].saveToRss(u));
	// And footer
	s.push("</channel>");
	s.push("</rss>");
	// Save it all
	return s.join("\n");
}

function allTiddlersAsHtml()
{
	var savedTiddlers = [];
	var tiddlers = store.getTiddlers("title");
	for (var t = 0; t < tiddlers.length; t++)
		savedTiddlers.push(tiddlers[t].saveToDiv());
	return savedTiddlers.join("\n");
}

// UTF-8 encoding rules:
// 0x0000 - 0x007F:	0xxxxxxx
// 0x0080 - 0x07FF:	110xxxxx 10xxxxxx
// 0x0800 - 0xFFFF:	1110xxxx 10xxxxxx 10xxxxxx

function convertUTF8ToUnicode(u)
{
	if(window.Components)
		return mozConvertUTF8ToUnicode(u);
	else
		return manualConvertUTF8ToUnicode(u);
}

function manualConvertUTF8ToUnicode(u)
{
	var s = "";
	var t = 0;
	var b1, b2, b3;
	while(t < u.length)
		{
		b1 = u.charCodeAt(t++);
		if(b1 < 0x80)
			s += String.fromCharCode(b1);
		else if(b1 < 0xE0)
			{
			b2 = u.charCodeAt(t++);
			s += String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F));
			}
		else
			{
			b2 = u.charCodeAt(t++);
			b3 = u.charCodeAt(t++);
			s += String.fromCharCode(((b1 & 0xF) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
			}
	}
	return(s);
}

function mozConvertUTF8ToUnicode(u)
{
	if (window.netscape == undefined)
		return manualConvertUTF8ToUnicode(u); // fallback
	try
		{
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
	catch(e)
		{
		return manualConvertUTF8ToUnicode(u);
		} // fallback
	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";
	var s = converter.ConvertToUnicode(u);
	var fin = converter.Finish();
	return (fin.length > 0) ? s+fin : s;
}

function convertUnicodeToUTF8(s)
{
	if(saveUsingSafari)
		return s;
	else if(window.Components)
		return mozConvertUnicodeToUTF8(s);
	else
		return manualConvertUnicodeToUTF8(s);
}

function manualConvertUnicodeToUTF8(s)
{
	var re = /[^\u0000-\u007F]/g ;
	return s.replace(re, function($0) {return("&#" + $0.charCodeAt(0).toString() + ";");})
}

function mozConvertUnicodeToUTF8(s)
{
	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";
	var u = converter.ConvertFromUnicode(s);
	var fin = converter.Finish();
	if(fin.length > 0)
		return u + fin;
	else
		return u;
}

function saveFile(fileUrl, content)
{
	var r = null;
	if(saveUsingSafari)
		r = safariSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = mozillaSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = ieSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = operaSaveFile(fileUrl, content);
	return(r);
}

function loadFile(fileUrl)
{
	var r = null;
	if(saveUsingSafari)
		r = safariLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = mozillaLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = ieLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = operaLoadFile(fileUrl);
	return(r);
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function ieSaveFile(filePath, content)
{
	try
		{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		}
	catch(e)
		{
		//alert("Exception while attempting to save\n\n" + e.toString());
		return(null);
		}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return(true);
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function ieLoadFile(filePath)
{
	try
		{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath,1);
		var content = file.ReadAll();
		file.Close();
		}
	catch(e)
		{
		//alert("Exception while attempting to load\n\n" + e.toString());
		return(null);
		}
	return(content);
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function mozillaSaveFile(filePath, content)
{
	if(window.Components)
		try
			{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if (!file.exists())
				file.create(0, 0664);
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file, 0x20 | 0x02, 00004,null);
			out.write(content, content.length);
			out.flush();
			out.close();
			return(true);
			}
		catch(e)
			{
			//alert("Exception while attempting to save\n\n" + e);
			return(false);
			}
	return(null);
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function mozillaLoadFile(filePath)
{
	if(window.Components)
		try
			{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if (!file.exists())
				return(null);
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(file, 0x01, 00004, null);
			var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			sInputStream.init(inputStream);
			return(sInputStream.read(sInputStream.available()));
			}
		catch(e)
			{
			//alert("Exception while attempting to load\n\n" + e);
			return(false);
			}
	return(null);
}

function operaUrlToFilename(url)
{
	var f = "//localhost";
	if(url.indexOf(f) == 0)
		return url.substring(f.length);
	var i = url.indexOf(":");
	if(i > 0)
		return url.substring(i-1);
	return url;
}

function operaSaveFile(filePath, content)
{
	try
		{
		var s = new java.io.PrintStream(new java.io.FileOutputStream(operaUrlToFilename(filePath)));
		s.print(content);
		s.close();
		}
	catch(e)
		{
		if(window.opera)
			opera.postError(e);
		return null;
		}
	return true;
}

function operaLoadFile(filePath)
{
	var content = [];
	try
		{
		var r = new java.io.BufferedReader(new java.io.FileReader(operaUrlToFilename(filePath)));
		var line;
		while ((line = r.readLine()) != null)
			content.push(new String(line));
		r.close();
		}
	catch(e)
		{
		if(window.opera)
			opera.postError(e);
		return null;
		}
	return content.join("\n");
}

function safariFilenameToUrl(filename) {
	return ("file://" + filename);
}

function safariLoadFile(url)
{
	url = safariFilenameToUrl(url);
	var plugin = document.embeds["tiddlyWikiSafariSaver"];
	return plugin.readURL(url);
}

function safariSaveFile(url,content)
{
	url = safariFilenameToUrl(url);
	var plugin = document.embeds["tiddlyWikiSafariSaver"];
	return plugin.writeStringToURL(content,url);
}

// Lifted from http://developer.apple.com/internet/webcontent/detectplugins.html
function detectPlugin()
{
	var daPlugins = detectPlugin.arguments;
	var pluginFound = false;
	if (navigator.plugins && navigator.plugins.length > 0)
		{
		var pluginsArrayLength = navigator.plugins.length;
		for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ )
			{
			var numFound = 0;
			for(var namesCounter=0; namesCounter < daPlugins.length; namesCounter++)
				{
				if( (navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter]) >= 0) ||
						(navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter]) >= 0) )
					numFound++;
				}
			if(numFound == daPlugins.length)
				{
				pluginFound = true;
				break;
				}
			}
	}
	return pluginFound;
}

// ---------------------------------------------------------------------------------
// TiddlyWiki-specific utility functions
// ---------------------------------------------------------------------------------

function createTiddlyButton(theParent,theText,theTooltip,theAction,theClass,theId,theAccessKey)
{
	var theButton = document.createElement("a");
	theButton.className = "button";
	if(theAction)
		{
		theButton.onclick = theAction;
		theButton.setAttribute("href","javascript:;");
		}
	theButton.setAttribute("title",theTooltip);
	if(theText)
		theButton.appendChild(document.createTextNode(theText));
	if(theClass)
		theButton.className = theClass;
	if(theId)
		theButton.id = theId;
	if(theParent)
		theParent.appendChild(theButton);
	if(theAccessKey)
		theButton.setAttribute("accessKey",theAccessKey);
	return(theButton);
}

function createTiddlyLink(place,title,includeText,theClass)
{
	var text = includeText ? title : null;
	var btn = createTiddlyButton(place,text,null,onClickTiddlerLink,theClass);
	btn.setAttribute("refresh","link");
	btn.setAttribute("tiddlyLink",title);
	refreshTiddlyLink(btn,title);
	return(btn);
}

function refreshTiddlyLink(e,title)
{
	var subTitle, theClass = "tiddlyLink";
	var tiddler = store.fetchTiddler(title);
	if(tiddler)
		{
		subTitle = tiddler.getSubtitle();
		theClass += " tiddlyLinkExisting";
		}
	else
		{
		subTitle = config.messages.undefinedTiddlerToolTip.format([title]);
		theClass += " tiddlyLinkNonExisting";
		if(store.isShadowTiddler(title))
			{
			subTitle = config.messages.shadowedTiddlerToolTip.format([title]);
			theClass += " shadow";
			}
		else
			subTitle = config.messages.undefinedTiddlerToolTip.format([title]);
		}
	e.className = theClass;
	e.title = subTitle;
}

function createExternalLink(place,url)
{
	var theLink = document.createElement("a");
	theLink.className = "externalLink";
	theLink.href = url;
	theLink.title = config.messages.externalLinkTooltip.format([url]);
	if(config.options.chkOpenInNewWindow)
		theLink.target = "_blank";
	place.appendChild(theLink);
	return(theLink);
}

// Event handler for clicking on a tiddly link
function onClickTiddlerLink(e)
{
	if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var theLink = theTarget;
	var title = null;
	do {
		title = theLink.getAttribute("tiddlyLink");
		theLink = theLink.parentNode;
	} while(title == null && theLink != null);
	if(title)
		{
		var toggling = e.metaKey || e.ctrlKey;
		if(config.options.chkToggleLinks)
			toggling = !toggling;
		var opening;
		if(toggling && document.getElementById("tiddler" + title))
			story.closeTiddler(title,true,e.shiftKey || e.altKey);
		else
			story.displayTiddler(theTarget,title,null,true,e.shiftKey || e.altKey);
		}
	clearMessage();
	return(false);
}

// Create a button for a tag with a popup listing all the tiddlers that it tags
function createTagButton(place,tag,excludeTiddler)
{
	var theTag = createTiddlyButton(place,tag,config.views.wikified.tag.tooltip.format([tag]),onClickTag);
	theTag.setAttribute("tag",tag);
	if(excludeTiddler)
		theTag.setAttribute("tiddler",excludeTiddler);
	return(theTag);
}

// Event handler for clicking on a tiddler tag
function onClickTag(e)
{
	if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var popup = Popup.create(this);
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(popup && tag)
		{
		var tagged = store.getTaggedTiddlers(tag);
		var titles = [];
		var li,r;
		for(r=0;r<tagged.length;r++)
			if(tagged[r].title != title)
				titles.push(tagged[r].title);
		var lingo = config.views.wikified.tag;
		if(titles.length > 0)
			{
			var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
			openAll.setAttribute("tag",tag);
			createTiddlyElement(createTiddlyElement(popup,"li"),"hr");
			for(r=0; r<titles.length; r++)
				{
				createTiddlyLink(createTiddlyElement(popup,"li"),titles[r],true);
				}
			}
		else
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),lingo.popupNone.format([tag]));
		createTiddlyElement(createTiddlyElement(popup,"li"),"hr");
		var h = createTiddlyLink(createTiddlyElement(popup,"li"),tag,false);
		createTiddlyText(h,lingo.openTag.format([tag]));
		}
	Popup.show(popup,false);
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return(false);
}

// Event handler for 'open all' on a tiddler popup
function onClickTagOpenAll(e)
{
	if (!e) var e = window.event;
	var tag = this.getAttribute("tag");
	var tagged = store.getTaggedTiddlers(tag);
	for(var t=tagged.length-1; t>=0; t--)
		story.displayTiddler(this,tagged[t].title,null,false,e.shiftKey || e.altKey);
	return(false);
}

function onClickError(e)
{
	if (!e) var e = window.event;
	var popup = Popup.create(this);
	var lines = this.getAttribute("errorText").split("\n");
	for(var t=0; t<lines.length; t++)
		createTiddlyElement(popup,"li",null,null,lines[t]);
	Popup.show(popup,false);
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return false;
}

function createTiddlyError(place,title,text)
{
	var btn = createTiddlyButton(place,title,null,onClickError,"errorButton");
	if (text) btn.setAttribute("errorText",text);
}

// ---------------------------------------------------------------------------------
// Augmented methods for the JavaScript Number(), Array() and String() objects
// ---------------------------------------------------------------------------------

// Clamp a number to a range
Number.prototype.clamp = function(min,max)
{
	var c = this;
	if(c < min)
		c = min;
	if(c > max)
		c = max;
	return c;
}

// Find an entry in an array. Returns the array index or null
Array.prototype.find = function(item)
{
	for(var t=0; t<this.length; t++)
		if(this[t] == item)
			return t;
	return null;
}

// Return whether an entry exists in an array
Array.prototype.contains = function(item)
{
    return this.find(item) != null;
};

// Return whether one of a list of values exists in an array
Array.prototype.containsAny = function(items)
{
    for(var i=0; i<items.length; i++)
        if (this.contains(items[i]))
            return true;
    return false;
};

// Return wheter all of a list of values exists in an array
Array.prototype.containsAll = function(items)
{
    for (var i = 0; i<items.length; i++)
        if (!this.contains(items[i]))
            return false;
    return true;
};

// Push a new value into an array only if it is not already present in the array. If the optional unique parameter is false, it reverts to a normal push
Array.prototype.pushUnique = function(item,unique)
{
	if(unique != undefined && unique == false)
		this.push(item);
	else
		{
		if(this.find(item) == null)
			this.push(item);
		}
}

// Get characters from the right end of a string
String.prototype.right = function(n)
{
	if(n < this.length)
		return this.slice(this.length-n);
	else
		return this;
}

// Trim whitespace from both ends of a string
String.prototype.trim = function()
{
	return this.replace(/^\s*|\s*$/g,"");
}

// Convert a string from a CSS style property name to a JavaScript style name ("background-color" -> "backgroundColor")
String.prototype.unDash = function()
{
	var s = this.split("-");
	if(s.length > 1)
		for(var t=1; t<s.length; t++)
			s[t] = s[t].substr(0,1).toUpperCase() + s[t].substr(1);
	return s.join("");
}

// Substitute substrings from an array into a format string that includes '%1'-type specifiers
String.prototype.format = function(substrings)
{
	var subRegExp = new RegExp("(?:%(\\d+))","mg");
	var currPos = 0;
	var r = [];
	do {
		var match = subRegExp.exec(this);
		if(match && match[1])
			{
			if(match.index > currPos)
				r.push(this.substring(currPos,match.index));
			r.push(substrings[parseInt(match[1])]);
			currPos = subRegExp.lastIndex;
			}
	} while(match);
	if(currPos < this.length)
		r.push(this.substring(currPos,this.length));
	return r.join("");
}

// Escape any special RegExp characters with that character preceded by a backslash
String.prototype.escapeRegExp = function()
{
	var s = "\\^$*+?()=!|,{}[].";
	var c = this;
	for(var t=0; t<s.length; t++)
		c = c.replace(new RegExp("\\" + s.substr(t,1),"g"),"\\" + s.substr(t,1));
	return c;
}

// Convert & to "&amp;", < to "&lt;", > to "&gt;" and " to "&quot;"
String.prototype.htmlEncode = function()
{
	var regexpAmp = new RegExp("&","mg");
	var regexpLessThan = new RegExp("<","mg");
	var regexpGreaterThan = new RegExp(">","mg");
	var regexpQuote = new RegExp("\"","mg");
	return(this.replace(regexpAmp,"&amp;").replace(regexpLessThan,"&lt;").replace(regexpGreaterThan,"&gt;").replace(regexpQuote,"&quot;"));
}

// Convert "&amp;" to &, "&lt;" to <, "&gt;" to > and "&quot;" to "
String.prototype.htmlDecode = function()
{
	var regexpAmp = new RegExp("&amp;","mg");
	var regexpLessThan = new RegExp("&lt;","mg");
	var regexpGreaterThan = new RegExp("&gt;","mg");
	var regexpQuote = new RegExp("&quot;","mg");
	return(this.replace(regexpLessThan,"<").replace(regexpGreaterThan,">").replace(regexpQuote,"\"").replace(regexpAmp,"&"));
}

// Parse a space-separated string of name:value parameters where:
//   - the name or the value can be optional (and a separate default is used instead)
//     - in case of ambiguity, a lone word is taken to be a value
//   - if both the name and value are present they must be separated by a colon
//   - the name and the value may both be quoted with single- or double-quotes, double-square brackets
//   - names or values quoted with {{double-curly braces}} are evaluated as a JavaScript expression
// The result is an array of objects:
//   result[0] = object with a member for each parameter name, value of that member being an array of values
//   result[1..n] = one object for each parameter, with 'name' and 'value' members
String.prototype.parseParams = function(defaultName,defaultValue,allowEval,noNames)
{
	var parseToken = function(match,p)
		{
		var n;
		if(match[p]) // Double quoted
			n = match[p];
		else if(match[p+1]) // Single quoted
			n = match[p+1];
		else if(match[p+2]) // Double-square-bracket quoted
			n = match[p+2];
		else if(match[p+3]) // Double-brace quoted
			try
				{
				n = match[p+3];
				if(allowEval)
					n = window.eval(n);
				}
			catch(ex)
				{
				throw "Unable to evaluate {{" + match[p+3] + "}}: " + ex.toString();
				}
		else if(match[p+4]) // Unquoted
			n = match[p+4];
		return n;
		};
	var r = [{}];
	var dblQuote = "(?:\"((?:(?:\\\\\")|[^\"])*)\")";
	var sngQuote = "(?:'((?:(?:\\\\\')|[^'])*)')";
	var dblSquare = "(?:\\[\\[((?:\\s|\\S)*?)\\]\\])";
	var dblBrace = "(?:\\{\\{((?:\\s|\\S)*?)\\}\\})";
	var unQuoted = noNames ? "([^\"'\\s]\\S*)" : "([^\"':\\s][^\\s:]*)";
	var skipSpace = "(?:\\s*)";
	var token = "(?:" + dblQuote + "|" + sngQuote + "|" + dblSquare + "|" + dblBrace + "|" + unQuoted + ")";
	var re = noNames
		? new RegExp(token,"mg")
		: new RegExp(skipSpace + token + skipSpace + "(?:(\\:)" + skipSpace + token + "){0,1}","mg");
	var params = [];
	do {
		var match = re.exec(this);
		if(match)
			{
			var n = parseToken(match,1);
			if(noNames)
				r.push({name: "", value: n});
			else
				{
				var v = parseToken(match,7);
				if(v == null && defaultName)
					{
					v = n;
					n = defaultName;
					}
				else if(v == null && defaultValue)
					v = defaultValue;
				r.push({name: n, value: v});
				}
			}
	} while(match);
	// Summarise parameters into first element
	for(var t=1; t<r.length; t++)
		{
		if(r[0][r[t].name])
			r[0][r[t].name].push(r[t].value);
		else
			r[0][r[t].name] = [r[t].value];
		}
	return r;
}

// Process a string list of macro parameters into an array. Parameters can be quoted with "", '',
// [[]], {{ }} or left unquoted (and therefore space-separated). Double-braces {{}} results in
// an *evaluated* parameter: e.g. {{config.options.txtUserName}} results in the current user's name.
String.prototype.readMacroParams = function()
{
	var p = this.parseParams("list",null,true,true);
	var n = [];
	for(var t=1; t<p.length; t++)
		n.push(p[t].value);
	return n;
}

// Process a string list of unique tiddler names into an array. Tiddler names that have spaces in them must be [[bracketed]]
String.prototype.readBracketedList = function(unique)
{
	var p = this.parseParams("list",null,false,true);
	var n = [];
	for(var t=1; t<p.length; t++)
		n.pushUnique(p[t].value,unique);
	return n;
}

// Replace a chunk of a string given start and end markers
String.prototype.replaceChunk = function(start,end,sub)
{
	var s = this.indexOf(start);
	if(s != -1)
		{
		var e = this.indexOf(end,s + start.length);
		if(e != -1)
			return this.substring(0,s + start.length) + sub + this.substring(e);
		}
	return this;
}

// Static method to bracket a string with double square brackets if it contains a space
String.encodeTiddlyLink = function(title)
{
	if(title.indexOf(" ") == -1)
		return(title);
	else
		return("[[" + title + "]]");
}

// Static method to left-pad a string with 0s to a certain width
String.zeroPad = function(n,d)
{
	var s = n.toString();
	if(s.length < d)
		s = "000000000000000000000000000".substr(0,d-s.length) + s;
	return(s);
}

// ---------------------------------------------------------------------------------
// Augmented methods for the JavaScript Date() object
// ---------------------------------------------------------------------------------

// Substitute date components into a string
Date.prototype.formatString = function(template)
{
	template = template.replace(/YYYY/g,this.getFullYear());
	template = template.replace(/YY/g,String.zeroPad(this.getFullYear()-2000,2));
	template = template.replace(/MMM/g,config.messages.dates.months[this.getMonth()]);
	template = template.replace(/0MM/g,String.zeroPad(this.getMonth()+1,2));
	template = template.replace(/MM/g,this.getMonth()+1);
	template = template.replace(/DDD/g,config.messages.dates.days[this.getDay()]);
	template = template.replace(/0DD/g,String.zeroPad(this.getDate(),2));
	template = template.replace(/DDth/g,this.getDate()+this.daySuffix());
	template = template.replace(/DD/g,this.getDate());
	template = template.replace(/0hh/g,String.zeroPad(this.getHours(),2));
	template = template.replace(/hh/g,this.getHours());
	template = template.replace(/0mm/g,String.zeroPad(this.getMinutes(),2));
	template = template.replace(/mm/g,this.getMinutes());
	template = template.replace(/0ss/g,String.zeroPad(this.getSeconds(),2));
	template = template.replace(/ss/g,this.getSeconds());
	return template;
}

Date.prototype.daySuffix = function()
{
	var num = this.getDate();
	if (num >= 11 && num <= 13) return "th";
	else if (num.toString().substr(-1)=="1") return "st";
	else if (num.toString().substr(-1)=="2") return "nd";
	else if (num.toString().substr(-1)=="3") return "rd";
	return "th";
}

// Convert a date to local YYYYMMDDHHMM string format
Date.prototype.convertToLocalYYYYMMDDHHMM = function()
{
	return(String.zeroPad(this.getFullYear(),4) + String.zeroPad(this.getMonth()+1,2) + String.zeroPad(this.getDate(),2) + String.zeroPad(this.getHours(),2) + String.zeroPad(this.getMinutes(),2));
}

// Convert a date to UTC YYYYMMDDHHMM string format
Date.prototype.convertToYYYYMMDDHHMM = function()
{
	return(String.zeroPad(this.getUTCFullYear(),4) + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2));
}

// Convert a date to UTC YYYYMMDD.HHMMSSMMM string format
Date.prototype.convertToYYYYMMDDHHMMSSMMM = function()
{
	return(String.zeroPad(this.getUTCFullYear(),4) + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + "." + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2) + String.zeroPad(this.getUTCSeconds(),2) + String.zeroPad(this.getUTCMilliseconds(),4));
}

// Static method to create a date from a UTC YYYYMMDDHHMM format string
Date.convertFromYYYYMMDDHHMM = function(d)
{
	var theDate = new Date(Date.UTC(parseInt(d.substr(0,4),10),
							parseInt(d.substr(4,2),10)-1,
							parseInt(d.substr(6,2),10),
							parseInt(d.substr(8,2),10),
							parseInt(d.substr(10,2),10),0,0));
	return(theDate);
}

// ---------------------------------------------------------------------------------
// DOM utilities - many derived from www.quirksmode.org
// ---------------------------------------------------------------------------------

function drawGradient(place,horiz,colours)
{
	for(var t=0; t<= 100; t+=2)
		{
		var bar = document.createElement("div");
		place.appendChild(bar);
		bar.style.position = "absolute";
		bar.style.left = horiz ? t + "%" : 0;
		bar.style.top = horiz ? 0 : t + "%";
		bar.style.width = horiz ? (101-t) + "%" : "100%";
		bar.style.height = horiz ? "100%" : (101-t) + "%";
		bar.style.zIndex = -1;
		var f = t/100;
		var p = f*(colours.length-1);
		bar.style.backgroundColor = colours[Math.floor(p)].mix(colours[Math.ceil(p)],p-Math.floor(p)).toString();
		}
}

function createTiddlyText(theParent,theText)
{
	return theParent.appendChild(document.createTextNode(theText));
}

function createTiddlyElement(theParent,theElement,theID,theClass,theText)
{
	var e = document.createElement(theElement);
	if(theClass != null)
		e.className = theClass;
	if(theID != null)
		e.setAttribute("id",theID);
	if(theText != null)
		e.appendChild(document.createTextNode(theText));
	if(theParent != null)
		theParent.appendChild(e);
	return(e);
}

// Add an event handler
// Thanks to John Resig, via QuirksMode
function addEvent(obj,type,fn)
{
	if(obj.attachEvent)
		{
		obj['e'+type+fn] = fn;
		obj[type+fn] = function(){obj['e'+type+fn](window.event);}
		obj.attachEvent('on'+type,obj[type+fn]);
		}
	else
		obj.addEventListener(type,fn,false);
}

// Remove  an event handler
// Thanks to John Resig, via QuirksMode
function removeEvent(obj,type,fn)
{
	if(obj.detachEvent)
		{
		obj.detachEvent('on'+type,obj[type+fn]);
		obj[type+fn] = null;
		}
	else
		obj.removeEventListener(type,fn,false);
}

function addClass(e,theClass)
{
	removeClass(e,theClass);
	e.className += " " + theClass;
}

function removeClass(e,theClass)
{
	var newClass = [];
	var currClass = e.className.split(" ");
	for(var t=0; t<currClass.length; t++)
		if(currClass[t] != theClass)
			newClass.push(currClass[t]);
	e.className = newClass.join(" ");
}

function hasClass(e,theClass)
{
	var c = e.className;
	if(c)
		{
		c = c.split(" ");
		for(var t=0; t<c.length; t++)
			if(c[t] == theClass)
				return true;
		}
	return false;
}

// Resolve the target object of an event
function resolveTarget(e)
{
	var obj;
	if (e.target)
		obj = e.target;
	else if (e.srcElement)
		obj = e.srcElement;
	if (obj.nodeType == 3) // defeat Safari bug
		obj = obj.parentNode;
	return(obj);
}

// Return the content of an element as plain text with no formatting
function getPlainText(e)
{
	var text = "";
	if(e.innerText)
		text = e.innerText;
	else if(e.textContent)
		text = e.textContent;
	return text;
}

// Get the scroll position for window.scrollTo necessary to scroll a given element into view
function ensureVisible(e)
{
	var posTop = findPosY(e);
	var posBot = posTop + e.offsetHeight;
	var winTop = findScrollY();
	var winHeight = findWindowHeight();
	var winBot = winTop + winHeight;
	if(posTop < winTop)
		return(posTop);
	else if(posBot > winBot)
		{
		if(e.offsetHeight < winHeight)
			return(posTop - (winHeight - e.offsetHeight));
		else
			return(posTop);
		}
	else
		return(winTop);
}

// Get the current width of the display window
function findWindowWidth()
{
	return(window.innerWidth ? window.innerWidth : document.documentElement.clientWidth);
}

// Get the current height of the display window
function findWindowHeight()
{
	return(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight);
}

// Get the current horizontal page scroll position
function findScrollX()
{
	return(window.scrollX ? window.scrollX : document.documentElement.scrollLeft);
}

// Get the current vertical page scroll position
function findScrollY()
{
	return(window.scrollY ? window.scrollY : document.documentElement.scrollTop);
}

function findPosX(obj)
{
	var curleft = 0;
	while (obj.offsetParent)
		{
		curleft += obj.offsetLeft;
		obj = obj.offsetParent;
		}
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;
	while (obj.offsetParent)
		{
		curtop += obj.offsetTop;
		obj = obj.offsetParent;
		}
	return curtop;
}

// Blur a particular element
function blurElement(e)
{
	if(e != null && e.focus && e.blur)
		{
		e.focus();
		e.blur();
		}
}

// Create a non-breaking space
function insertSpacer(place)
{
	var e = document.createTextNode(String.fromCharCode(160));
	if(place)
		place.appendChild(e);
	return e;
}

// Remove all children of a node
function removeChildren(e)
{
	while(e.hasChildNodes())
		e.removeChild(e.firstChild);
}

// Add a stylesheet, replacing any previous custom stylesheet
function setStylesheet(s,id)
{
	if(!id)
		id = "customStyleSheet";
	var n = document.getElementById(id);
	if(document.createStyleSheet) // Test for IE's non-standard createStyleSheet method
		{
		if(n)
			n.parentNode.removeChild(n);
		// This failed without the &nbsp;
		document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeEnd","&nbsp;<style id='" + id + "'>" + s + "</style>");
		}
	else
		{
		if(n)
			n.replaceChild(document.createTextNode(s),n.firstChild);
		else
			{
			var n = document.createElement("style");
			n.type = "text/css";
			n.id = id;
			n.appendChild(document.createTextNode(s));
			document.getElementsByTagName("head")[0].appendChild(n);
			}
		}
}
