// ---------------------------------------------------------------------------------
// Sync macro
// ---------------------------------------------------------------------------------

// Synchronisation handlers
config.syncers = {};

// Sync state. Members:
//	syncList - List of sync objects (title, tiddler, server, workspace, page, version)
//	listView - DOM element of the listView table
//	adaptors - nested store of adaptor objects by type, host and workspace
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
	config.macros.sync.sortSyncList();
	config.macros.sync.openSyncAdaptors();
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
		syncItem.serverStatus = "...";
		syncItem.localStatus = syncItem.isTouched ? config.macros.sync.hasChanged : config.macros.sync.hasNotChanged;
		syncItem.selected = syncItem.isTouched;
		if(syncItem.serverType && syncItem.serverHost)
			list.push(syncItem);
		});
	return list;
}

config.macros.sync.sortSyncList = function ()
{
	// Sort by type/host/workspace
	currSync.syncList.sort(function(a,b) {
		var r;
		if(a.serverType < b.serverType) {
			r = -1;
		} else if(a.serverType == b.serverType) {
			if(a.serverHost < b.serverHost) {
				r = -1;
			} else if(a.serverHost == b.serverHost) {
				if(a.serverWorkspace < b.serverWorkspace) {
					r = -1;
				} else if(a.serverWorkspace == b.serverWorkspace) {
					r = 0;
				} else {
					r = +1;
				}
			} else {
				r = +1;
			}
			
		} else {
			r = +1;
		}
		return r;
	});
}

config.macros.sync.openSyncAdaptors = function()
{
	currSync.adaptors = {};
	for(var t=0; t<currSync.syncList.length; t++) {
		var syncItem = currSync.syncList[t];
		var adaptor = null;
		if(currSync.adaptors[syncItem.serverType] !== undefined && currSync.adaptors[syncItem.serverType][syncItem.serverHost] !== undefined) {
			if(syncItem.serverWorkspace)
				adaptor = currSync.adaptors[syncItem.serverType][syncItem.serverHost][syncItem.serverWorkspace];
			else
				adaptor = currSync.adaptors[syncItem.serverType][syncItem.serverHost];
		}
		if(adaptor === undefined) {
			if(currSync.adaptors[syncItem.serverType] === undefined)
				currSync.adaptors[syncItem.serverType] = {};
			if(currSync.adaptors[syncItem.serverType][syncItem.serverHost] === undefined)
				currSync.adaptors[syncItem.serverType][syncItem.serverHost] = {};
			if(syncItem.serverWorkspace)
				currSync.adaptors[syncItem.serverType][syncItem.serverHost][syncItem.serverWorkspace] = null;
			else
				currSync.adaptors[syncItem.serverType][syncItem.serverHost] = null;
		}
	}
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
		var syncItemIndex = currSync.syncList.findByField("title",rowNames[t])
		var syncItem = currSync.syncList[syncItemIndex];
		
		
		
		}
}
