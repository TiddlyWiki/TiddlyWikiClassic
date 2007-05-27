//--
//-- Main
//--

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
	var t9,t8,t7,t6,t5,t4,t3,t2,t1,t0 = new Date();
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
	t1 = new Date();
	store.loadFromDiv("storeArea","store",true);
	t2 = new Date();
	loadShadowTiddlers();
	t3 = new Date();
	invokeParamifier(params,"onload");
	t4 = new Date();
	readOnly = (window.location.protocol == "file:") ? false : config.options.chkHttpReadOnly;
	var pluginProblem = loadPlugins();
	t5 = new Date();
	formatter = new Formatter(config.formatters);
	invokeParamifier(params,"onconfig");
	t6 = new Date();
	store.notifyAll();
	t7 = new Date();
	restart();
	t8 = new Date();
	if(pluginProblem) {
		story.displayTiddler(null,"PluginManager");
		displayMessage(config.messages.customConfigError);
	}
	for(var m in config.macros) {
		if(config.macros[m].init)
			config.macros[m].init();
	}
	if(!readOnly)
		backstage.init();
	t9 = new Date();
	if(config.options.chkDisplayStartupTime) {
		displayMessage("Load in " + (t2-t1) + " ms");
		displayMessage("Loadshadows in " + (t3-t2) + " ms");
		displayMessage("Loadplugins in " + (t5-t4) + " ms");
		displayMessage("Notify in " + (t7-t6) + " ms");
		displayMessage("Restart in " + (t8-t7) + " ms");
		displayMessage("Total startup in " + (t9-t0) + " ms");
	}
	startingUp = false;
}

// Restarting
function restart()
{
	invokeParamifier(params,"onstart");
	if(story.isEmpty()) {
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

function loadShadowTiddlers()
{
	var shadows = new TiddlyWiki();
	shadows.loadFromDiv("shadowArea","shadows",true);
	shadows.forEachTiddler(function(title,tiddler){config.shadowTiddlers[title] = tiddler.text;});
	delete shadows;
}

function loadPlugins()
{
	if(safeMode)
		return false;
	var tiddlers = store.getTaggedTiddlers("systemConfig");
	var toLoad = [];
	var nLoaded = 0;
	var map = {};
	var nPlugins = tiddlers.length;
	installedPlugins = [];
	for(var i=0; i<nPlugins; i++) {
		var p = getPluginInfo(tiddlers[i]);
		installedPlugins[i] = p;
		var n = p.Name;
		if(n) 
			map[n] = p;
		if(n = p.Source) 
			map[n] = p;
	}
	var visit = function(p) {
		if(!p || p.done)
			return;
		p.done = 1;
		var reqs = p.Requires;
		if(reqs) {
			reqs = reqs.readBracketedList();
			for(var i=0; i<reqs.length; i++)
				visit(map[reqs[i]]);
		}
		toLoad.push(p);
	};
	for(i=0; i<nPlugins; i++) 
		visit(installedPlugins[i]);	
	for(i=0; i<toLoad.length; i++) {
		p = toLoad[i];
		pluginInfo = p;
		tiddler = p.tiddler;
		if(isPluginExecutable(p)) {
			if(isPluginEnabled(p)) {
				p.executed = true;
				var startTime = new Date();
				try {
					if(tiddler.text)
						window.eval(tiddler.text);
					nLoaded++;
				} catch(ex) {
					p.log.push(config.messages.pluginError.format([exceptionText(ex)]));
					p.error = true;
				}
				pluginInfo.startupTime = String((new Date()) - startTime) + "ms"; 
			} else {
				nPlugins--;
			}
		} else {
			p.warning = true;
		}
	}
	return nLoaded != nPlugins;
}

function getPluginInfo(tiddler)
{
	var p = store.getTiddlerSlices(tiddler.title,["Name","Description","Version","Requires","CoreVersion","Date","Source","Author","License","Browsers"]);
	p.tiddler = tiddler;
	p.title = tiddler.title;
	p.log = [];
	return p;
}

// Check that a particular plugin is valid for execution
function isPluginExecutable(plugin)
{
	if(plugin.tiddler.isTagged("systemConfigForce"))
		return verifyTail(plugin,true,config.messages.pluginForced);
	if(plugin["CoreVersion"]) {
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

function isPluginEnabled(plugin)
{
	if(plugin.tiddler.isTagged("systemConfigDisable"))
		return verifyTail(plugin,false,config.messages.pluginDisabled);
	return true;
}

function verifyTail(plugin,result,message)
{
	plugin.log.push(message);
	return result;
}

function invokeMacro(place,macro,params,wikifier,tiddler)
{
	try {
		var m = config.macros[macro];
		if(m && m.handler)
			m.handler(place,macro,params.readMacroParams(),wikifier,params,tiddler);
		else
			createTiddlyError(place,config.messages.macroError.format([macro]),config.messages.macroErrorDetails.format([macro,config.messages.missingMacro]));
	} catch(ex) {
		createTiddlyError(place,config.messages.macroError.format([macro]),config.messages.macroErrorDetails.format([macro,ex.toString()]));
	}
}

