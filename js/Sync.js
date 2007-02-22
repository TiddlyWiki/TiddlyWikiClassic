// ---------------------------------------------------------------------------------
// Sync macro
// ---------------------------------------------------------------------------------

// Synchronisation handlers
config.syncers = {};

// Sync state. Members:
//	syncList - List of sync objects (title, tiddler, server, workspace, page, version)
//	wizard - reference to wizard object
//	listView - DOM element of the listView table
//	syncMachines - array of syncMachines
var currSync = null;

// sync macro
config.macros.sync.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!wikifier.isStatic)
		config.macros.sync.startSync(place);
}

config.macros.sync.startSync = function(place)
{
	// Cancel any outstanding sync
	if(currSync)
		config.macros.sync.cancelSync();
	currSync = {};
	// Get a list of all the syncable tiddlers
	currSync.syncList = config.macros.sync.getSyncableTiddlers();
	config.macros.sync.createSyncMachines();
	config.macros.sync.preProcessSyncableTiddlers();
	var wizard = new Wizard();
	currSync.wizard = wizard;
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	var listView = ListView.create(listWrapper,currSync.syncList,this.listViewTemplate);
	config.macros.sync.processSyncableTiddlers();
	wizard.setValue("listView",listView);
	wizard.setButtons([
			{caption: config.macros.sync.syncLabel, tooltip: config.macros.sync.syncPrompt, onClick: config.macros.sync.doSync}
		]);
}

config.macros.sync.getSyncableTiddlers = function ()
{
	var list = [];
	store.forEachTiddler(function(title,tiddler) {
		var syncItem = {};
		syncItem.serverType = tiddler.getServerType();
		syncItem.serverHost = tiddler.fields['server.host'];
		syncItem.serverWorkspace = tiddler.fields['server.workspace'];
		syncItem.tiddler = tiddler;
		syncItem.title = tiddler.title;
		syncItem.isTouched = tiddler.isTouched();
		syncItem.selected = syncItem.isTouched;
		syncItem.syncStatus = config.macros.sync.syncStatusList[syncItem.isTouched ? "changedLocally" : "none"]
		syncItem.status = syncItem.syncStatus.text;
		if(syncItem.serverType && syncItem.serverHost)
			list.push(syncItem);
		});
	list.sort(function(a,b) {return a.title < b.title ? -1 : (a.title == b.title ? 0 : +1);});
	return list;
}

config.macros.sync.preProcessSyncableTiddlers = function()
{
	for(var t=0; t<currSync.syncList.length; t++) {
		si = currSync.syncList[t];
		si.serverUrl = si.syncMachine.adaptor.generateTiddlerUri(si.tiddler);
	}
}

config.macros.sync.processSyncableTiddlers = function()
{
	for(var t=0; t<currSync.syncList.length; t++) {
		si = currSync.syncList[t];
		si.rowElement.style.backgroundColor = si.syncStatus.color;
	}
}

config.macros.sync.createSyncMachines = function()
{
	currSync.syncMachines = [];
	for(var t=0; t<currSync.syncList.length; t++) {
		var si = currSync.syncList[t];
		var r = null;
		for(var sm=0; sm<currSync.syncMachines.length; sm++) {
			var csm = currSync.syncMachines[sm];
			if(si.serverType == csm.serverType && si.serverHost == csm.serverHost && si.serverWorkspace == csm.serverWorkspace)
				r = csm;
		}
		if(r == null) {
			si.syncMachine = config.macros.sync.createSyncMachine(si);
			currSync.syncMachines.push(si.syncMachine);
		} else {
			si.syncMachine = r;
			r.syncItems.push(si);
		}
	}
}

config.macros.sync.createSyncMachine = function(syncItem)
{
//#	displayMessage("Creating adaptor for " + syncItem.serverType + " - " + syncItem.serverHost + " - " + syncItem.serverWorkspace);
	var sm = {};
	sm.serverType = syncItem.serverType;
	sm.serverHost = syncItem.serverHost;
	sm.serverWorkspace = syncItem.serverWorkspace;
	sm.syncItems = [syncItem];
	sm.adaptor = new config.adaptors[syncItem.serverType];
	var context = {};
	var r = sm.adaptor.openHost(sm.serverHost,context,sm,config.macros.sync.syncOnOpenHost);
	if(r !== true)
		displayMessage("Error from openHost: " + r);
	return sm;
}

config.macros.sync.syncOnOpenHost = function(context,syncMachine)
{
//#	displayMessage("syncOnOpenHost for " + syncMachine.serverType + " - " + syncMachine.serverHost + " - " + syncMachine.serverWorkspace);
	var r = syncMachine.adaptor.openWorkspace(syncMachine.serverWorkspace,context,syncMachine,config.macros.sync.syncOnOpenWorkspace);
	if(r !== true)
		displayMessage("Error from openWorkspace: " + r);
}

config.macros.sync.syncOnOpenWorkspace = function(context,syncMachine)
{
//#	displayMessage("syncOnOpenWorkspace for " + syncMachine.serverType + " - " + syncMachine.serverHost + " - " + syncMachine.serverWorkspace);
	var r = syncMachine.adaptor.getTiddlerList(context,syncMachine,config.macros.sync.syncOnGetTiddlerList);
	if(r !== true)
		displayMessage("Error from getTiddlerList: " + r);
}

config.macros.sync.syncOnGetTiddlerList = function(context,syncMachine)
{
//#	displayMessage("syncOnGetTiddlerList for " + syncMachine.serverType + " - " + syncMachine.serverHost + " - " + syncMachine.serverWorkspace);
	for(var t=0; t<syncMachine.syncItems.length; t++) {
		var si = syncMachine.syncItems[t];
		var f = context.tiddlers.findByField("title",si.title);
		if(f) {
			if(context.tiddlers[f].fields['server.page.version'] > si.tiddler.fields['server.page.version']) {
				si.syncStatus = config.macros.sync.syncStatusList[si.isTouched ? 'changedBoth' : 'changedServer'];
			}
		} else {
			si.syncStatus = config.macros.sync.syncStatusList.notFound;
		}
		var e = si.colElements["status"];
		removeChildren(e);
		createTiddlyText(e,si.syncStatus.text);
		si.rowElement.style.backgroundColor = si.syncStatus.color;
	}
}

config.macros.sync.cancelSync = function()
{
	currSync = null;
}
