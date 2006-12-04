// ---------------------------------------------------------------------------------
// Sync macro
// ---------------------------------------------------------------------------------

// Synchronisation handlers
config.syncers = {};

// Translateable strings
config.macros.sync = {
	label: "sync",
	prompt: "Plug back in to the server and synchronize changes",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'selected', rowName: 'title', type: 'Selector'},
			{name: 'Title', field: 'title', tiddlerLink: 'title', title: "Title", type: 'TiddlerLink'},
			{name: 'Local Status', field: 'localStatus', title: "Changed on your computer?", type: 'String'},
			{name: 'Server Status', field: 'serverStatus', title: "Changed on server?", type: 'String'},
			{name: 'Server URL', field: 'serverUrl', title: "Server URL", text: "View", type: 'Link'}
			],
		rowClasses: [
			],
		buttons: [
			{caption: "Sync these tiddlers", name: 'sync'}
			]},
	wizardTitle: "Synchronize your content with external servers and feeds",
	step1: "Choose the tiddlers you want to synchronize"
};

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
	var wizard = createTiddlyElement(place,"div",null,"importTiddler wizard");
	createTiddlyElement(wizard,"h1",null,null,this.wizardTitle);
	createTiddlyElement(wizard,"h2",null,"step1",this.step1);
	var step = createTiddlyElement(wizard,"div",null,"wizardStep");
	currSync.listView = ListView.create(step,currSync.syncList,this.listViewTemplate,this.onSelectCommand);
}

config.macros.sync.cancelSync = function()
{
}

config.macros.sync.onSelectCommand = function(listView,command,rowNames)
{
	switch(command)
		{
		case "cancel":
			break;
		case "sync":
			config.macros.sync.doSync(rowNames);
			break;
		}
}

config.macros.sync.doSync = function(selNames)
{
	for(var t=0; t<selNames.length; t++)
		{
		var f = currSync.syncList.findByField("title",selNames[t])
		var s = currSync.syncList[f];
		var syncer = config.syncers[s.syncType];
		if(syncer.doSync)
			syncer.doSync(currSync,s);
		}
}
