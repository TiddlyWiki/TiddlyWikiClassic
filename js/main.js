// ---------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------

var params = null; // Command line parameters
var store = null; // TiddlyWiki storage
var story = null; // Main story
var formatter = null; // Default formatters for the wikifier
config.parsers = {}; // Hashmap of alternative parsers for the wikifier
var anim = new Animator(); // Animation engine
var readOnly = false; // Whether we're in readonly mode
var highlightHack = null; // Embarrassing hack department...
var hadConfirmExit = false; // Don't warn more than once
var safeMode = false; // Disable all plugins and cookies
var installedPlugins = []; // Information filled in when plugins are executed
var startingUp = false; // Whether we're in the process of starting up
var pluginInfo,tiddler; // Used to pass information to plugins in loadPlugins()

// Whether to use the JavaSaver applet
var useJavaSaver = config.browser.isSafari || config.browser.isOpera;

// Starting up
function main()
{
	var now, then = new Date();
	startingUp = true;
	window.onbeforeunload = function(e) {if(window.confirmExit) return confirmExit();};
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
	store.loadFromDiv("storeArea","store",true);
	invokeParamifier(params,"onload");
	var pluginProblem = loadPlugins();
	formatter = new Formatter(config.formatters);
	readOnly = (window.location.protocol == "file:") ? false : config.options.chkHttpReadOnly;
	invokeParamifier(params,"onconfig");
	store.notifyAll();
	restart();
	if(pluginProblem)
		{
		story.displayTiddler(null,"PluginManager");
		displayMessage(config.messages.customConfigError);
		}
	for(var m in config.macros)
		if(config.macros[m].init)
			config.macros[m].init();
	now = new Date();
	if(config.displayStartupTime)
		displayMessage("TiddlyWiki startup in " + (now-then)/1000 + " seconds");
	startingUp = false;
}

// Restarting
function restart()
{
	invokeParamifier(params,"onstart");
	if(story.isEmpty())
		{
		var defaultParams = store.getTiddlerText("DefaultTiddlers").parseParams("open",null,false);
		invokeParamifierAsync(defaultParams,"onstart");
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

function loadPlugins()
{
	if(safeMode)
		return false;
	var configTiddlers = store.getTaggedTiddlers("systemConfig");
	installedPlugins = [];
	var hadProblem = false;
	for(var t=0; t<configTiddlers.length; t++)
		{
		tiddler = configTiddlers[t];
		pluginInfo = getPluginInfo(tiddler);
		if(isPluginExecutable(pluginInfo))
			{
			pluginInfo.executed = true;
			pluginInfo.error = false;
			try
				{
				if(tiddler.text && tiddler.text != "")
					window.eval(tiddler.text);
				}
			catch(e)
				{
				pluginInfo.log.push(config.messages.pluginError.format([exceptionText(e)]));
				pluginInfo.error = true;
				hadProblem = true;
				}
			}
		else
			pluginInfo.warning = true;
		installedPlugins.push(pluginInfo);
		}
	return hadProblem;
}

function getPluginInfo(tiddler)
{
	var p = store.getTiddlerSlices(tiddler.title,["Name","Description","Version","CoreVersion","Date","Source","Author","License","Browsers"]);
	p.tiddler = tiddler;
	p.title = tiddler.title;
	p.log = [];
	return p;
}

// Check that a particular plugin is valid for execution
function isPluginExecutable(plugin)
{
	if(plugin.tiddler.isTagged("systemConfigDisable"))
		return verifyTail(plugin,false,config.messages.pluginDisabled);
	if(plugin.tiddler.isTagged("systemConfigForce"))
		return verifyTail(plugin,true,config.messages.pluginForced);
	if(plugin["CoreVersion"])
		{
		var coreVersion = plugin["CoreVersion"].split(".");
		var w = parseInt(coreVersion[0]) - version.major;
		if(w == 0 && coreVersion[1])
			w = parseInt(coreVersion[1]) - version.minor;
		if(w == 0 && coreVersion[2])
		 	w = parseInt(coreVersion[2]) - version.revision;
		if(w > 0)
			return verifyTail(plugin,false,config.messages.pluginVersionError);
		}
	return true;
}

function verifyTail(plugin,result,message)
{
	plugin.log.push(message);
	return result;
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

