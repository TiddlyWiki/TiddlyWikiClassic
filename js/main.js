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
var installedPlugins = []; // Information filled in when plugins are executed

// Starting up
function main()
{
	var now, then = new Date();
	window.onbeforeunload = function(e) {if(window.confirmExit) return confirmExit();};
	var storeArea = document.getElementById("storeArea");
	if(storeArea)
		storeArea.style.display = "none";
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
	var pluginProblem = loadSystemConfig();
	formatter = new Formatter(config.formatters);
	readOnly = (window.location.protocol == "file:") ? false : config.options.chkHttpReadOnly;
	invokeParamifier(params,"onconfig");
	store.notifyAll();
	restart();
	if(pluginProblem)
		{
		displayTiddler(null,"PluginStatus");
		displayMessage(config.messages.customConfigError);
		}
	// Just for the beta
	now = new Date();
	displayMessage("TiddlyWiki startup in " + (now-then) + " milliseconds");
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
	installedPlugins = [];
	var hadProblem = false;
	for(var t=0; t<configTiddlers.length; t++)
		{
		var tiddler = configTiddlers[t];
		var p = getPluginInfo(tiddler);
		if(p.executed)
			{
			var ex = processConfig(tiddler.text);
			if(ex)
				{
				p.log.push(config.messages.customConfigError.format([p.title,ex]));
				p.error = true;
				hadProblem = true;
				}
			else
				p.error = false;
			}
		else
			hadProblem = true;
		installedPlugins.push(p);
		}
	return hadProblem;
}

function getPluginInfo(tiddler)
{
	var p = store.getTiddlerSlices(tiddler.title,["Name","Description","Version","CoreVersion","Date","Source","Author","License","Browsers"]);
	p.tiddler = tiddler;
	p.title = tiddler.title;
	p.log = [];
	p.executed = verifyPlugin(p);
	return p;
}

// Verify that a particular plugin is OK to execute
function verifyPlugin(plugin)
{
	if(plugin.tiddler.isTagged("disableSystemConfig"))
		return verifyTail(plugin,false,"Not executed because disabled via 'disableSystemConfig' tag");
	if(plugin.tiddler.isTagged("forceSystemConfig"))
		return verifyTail(plugin,true,"Executed because forced via 'forceSystemConfig' tag");
	if(!plugin["CoreVersion"])
		return verifyTail(plugin,false,"Not executed because CoreVersion property is missing");
	var coreVersion = plugin["CoreVersion"].split(".");
	if(parseInt(coreVersion[0]) < version.major || parseInt(coreVersion[1]) < version.minor || parseInt(coreVersion[2]) < version.revision)
		return verifyTail(plugin,false,"Not executed because specified CoreVersion is too old");
	return true;
}

function verifyTail(plugin,result,message)
{
	plugin.log.push(message);
	return result;
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
		return(exceptionText(e));
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

