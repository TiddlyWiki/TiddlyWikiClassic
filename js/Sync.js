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
	if(currSync)
		config.macros.sync.cancelSync();
	currSync = {};
	var syncer;
	for(syncer in config.syncers)
		if(config.syncers[syncer].init)
			config.syncers[syncer].init(currSync);
	currSync.syncList = [];
	store.forEachTiddler(function(title,tiddler) {
		var syncType = store.getValue(tiddler,"sync");
		if(store.getValue(tiddler,"socialtext.server"))
			syncType = "socialtext";
		var syncItem = {title: title,
			tiddler: tiddler,
			syncType: syncType,
			changeCount: store.getValue(tiddler,"changeCount"),
			serverStatus: "..."
			};
		syncItem.localStatus = syncItem.changeCount > 0 ? "Changed while unplugged" : "Unchanged while unplugged";
		syncItem.selected = syncItem.changeCount > 0;
		syncer = config.syncers[syncType];
		if(syncType && syncer)
			{
			if(syncer.addSyncable)
				syncer.addSyncable(currSync,tiddler,syncItem);
			currSync.syncList.push(syncItem);
			}
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
			{caption: config.macros.sync.syncLabel, tooltip: config.macros.sync.syncPrompt, onClick:  config.macros.sync.doSync}
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
