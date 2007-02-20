// ---------------------------------------------------------------------------------
// Sync macro
// ---------------------------------------------------------------------------------

// Synchronisation handlers
config.syncers = {};

// Sync state. Members:
//	syncList - List of sync objects (title, tiddler, server, workspace, page, version)
//	listView - DOM element of the listView table
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
	currSync.syncList = [];
	store.forEachTiddler(function(title,tiddler) {
		var syncItem = {};
		syncItem.serverType = tiddler.getServerType();
		syncItem.serverHost = tiddler.fields['server.host'];
		syncItem.serverWorkspace = tiddler.fields['server.Workspace'];
		syncItem.tiddler = tiddler;
		syncItem.title = tiddler.title;
		syncItem.isTouched = tiddler.isTouched();
		syncItem.serverStatus = "...";
		syncItem.localStatus = syncItem.isTouched ? config.macros.sync.hasChanged : config.macros.sync.hasNotChanged;
		syncItem.selected = syncItem.isTouched;
		if(syncItem.serverType && syncItem.serverHost)
			currSync.syncList.push(syncItem);
		});
	var wizard = new Wizard();
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	var listView = ListView.create(listWrapper,currSync.syncList,this.listViewTemplate);
	wizard.setValue("listView",listView);
	wizard.setButtons([
			{caption: config.macros.sync.syncLabel, tooltip: config.macros.sync.syncPrompt, onClick: config.macros.sync.doSync}
		]);
}

config.macros.sync.cancelSync = function()
{
	currSync = null;
}

config.macros.sync.doSync = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	for(var t=0; t<rowNames.length; t++)
		{
		var f = currSync.syncList.findByField("title",rowNames[t])
		var s = currSync.syncList[f];
		var syncer = config.syncers[s.syncType];
		if(syncer.doSync)
			syncer.doSync(currSync,s);
		}
}
