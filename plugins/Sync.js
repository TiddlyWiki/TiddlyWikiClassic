/***
|Name|SyncPlugin|
|Source|https://github.com/TiddlyWiki/tiddlywiki/blob/master/plugins/Sync.js|
|Version|1.0.0|
|~CoreVersion|2.6.6|
|Type|plugin|
|Description|Synchronise changes with other TiddlyWiki files and servers|
!!!!!Code
***/
//{{{
version.extensions.SyncPlugin= {major: 1, minor: 0, revision: 0, date: new Date(2011,11,24)};

// Synchronisation handlers
config.syncers = {};
config.macros.sync = {};
config.commands.syncing = {type: "popup"};

var currSync = null;
config.backstageTasks.push("sync");

merge(config.tasks,{sync: {text: "sync", tooltip: "Synchronise changes with other TiddlyWiki files and servers", content: '<<sync>>'}});

merge(config.macros.sync,{
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Server Type', field: 'serverType', title: "Server type", type: 'String'},
			{name: 'Server Host', field: 'serverHost', title: "Server host", type: 'String'},
			{name: 'Server Workspace', field: 'serverWorkspace', title: "Server workspace", type: 'String'},
			{name: 'Status', field: 'status', title: "Synchronisation status", type: 'String'},
			{name: 'Server URL', field: 'serverUrl', title: "Server URL", text: "View", type: 'Link'}
			],
		rowClasses: [
			],
		buttons: [
			{caption: "Sync these tiddlers", name: 'sync'}
			]},
	wizardTitle: "Synchronize with external servers and files",
	step1Title: "Choose the tiddlers you want to synchronize",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	syncLabel: "sync",
	syncPrompt: "Sync these tiddlers",
	hasChanged: "Changed while unplugged",
	hasNotChanged: "Unchanged while unplugged",
	syncStatusList: {
		none: {text: "...", display:'none', className:'notChanged'},
		changedServer: {text: "Changed on server", display:null, className:'changedServer'},
		changedLocally: {text: "Changed while unplugged", display:null, className:'changedLocally'},
		changedBoth: {text: "Changed while unplugged and on server", display:null, className:'changedBoth'},
		notFound: {text: "Not found on server", display:null, className:'notFound'},
		putToServer: {text: "Saved update on server", display:null, className:'putToServer'},
		gotFromServer: {text: "Retrieved update from server", display:null, className:'gotFromServer'}
		}
	});

merge(config.commands.syncing,{
	text: "syncing",
	tooltip: "Control synchronisation of this tiddler with a server or external file",
	currentlySyncing: "<div>Currently syncing via <span class='popupHighlight'>'%0'</span> to:</"+"div><div>host: <span class='popupHighlight'>%1</span></"+"div><div>workspace: <span class='popupHighlight'>%2</span></"+"div>", // Note escaping of closing <div> tag
	notCurrentlySyncing: "Not currently syncing",
	captionUnSync: "Stop synchronising this tiddler",
	chooseServer: "Synchronise this tiddler with another server:",
	currServerMarker: "\u25cf ",
	notCurrServerMarker: "  "});

config.commands.syncing.handlePopup = function(popup,title)
{
	var me = config.commands.syncing;
	var tiddler = store.fetchTiddler(title);
	if(!tiddler)
		return;
	var serverType = tiddler.getServerType();
	var serverHost = tiddler.fields["server.host"];
	var serverWorkspace = tiddler.fields["server.workspace"];
	if(!serverWorkspace)
		serverWorkspace = "";
	if(serverType) {
		var e = createTiddlyElement(popup,"li",null,"popupMessage");
		e.innerHTML = me.currentlySyncing.format([serverType,serverHost,serverWorkspace]);
	} else {
		createTiddlyElement(popup,"li",null,"popupMessage",me.notCurrentlySyncing);
	}
	if(serverType) {
		createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		var btn = createTiddlyButton(createTiddlyElement(popup,"li"),this.captionUnSync,null,me.onChooseServer);
		btn.setAttribute("tiddler",title);
		btn.setAttribute("server.type","");
	}
	createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
	createTiddlyElement(popup,"li",null,"popupMessage",me.chooseServer);
	var feeds = store.getTaggedTiddlers("systemServer","title");
	var t;
	for(t=0; t<feeds.length; t++) {
		var f = feeds[t];
		var feedServerType = store.getTiddlerSlice(f.title,"Type");
		if(!feedServerType)
			feedServerType = "file";
		var feedServerHost = store.getTiddlerSlice(f.title,"URL");
		if(!feedServerHost)
			feedServerHost = "";
		var feedServerWorkspace = store.getTiddlerSlice(f.title,"Workspace");
		if(!feedServerWorkspace)
			feedServerWorkspace = "";
		var caption = f.title;
		if(serverType == feedServerType && serverHost == feedServerHost && serverWorkspace == feedServerWorkspace) {
			caption = me.currServerMarker + caption;
		} else {
			caption = me.notCurrServerMarker + caption;
		}
		btn = createTiddlyButton(createTiddlyElement(popup,"li"),caption,null,me.onChooseServer);
		btn.setAttribute("tiddler",title);
		btn.setAttribute("server.type",feedServerType);
		btn.setAttribute("server.host",feedServerHost);
		btn.setAttribute("server.workspace",feedServerWorkspace);
	}
};

config.commands.syncing.onChooseServer = function(e)
{
	var tiddler = this.getAttribute("tiddler");
	var serverType = this.getAttribute("server.type");
	if(serverType) {
		store.addTiddlerFields(tiddler,{
			"server.type": serverType,
			"server.host": this.getAttribute("server.host"),
			"server.workspace": this.getAttribute("server.workspace")
			});
	} else {
		store.setValue(tiddler,"server",null);
	}
	return false;
};

// sync macro
// Sync state.
//# Members:
//#	syncList - List of sync objects (title, tiddler, server, workspace, page, revision)
//#	wizard - reference to wizard object
//#	listView - DOM element of the listView table
config.macros.sync.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!wikifier.isStatic)
		this.startSync(place);
};

config.macros.sync.cancelSync = function()
{
	currSync = null;
};

config.macros.sync.startSync = function(place)
{
	if(currSync)
		config.macros.sync.cancelSync();
	currSync = {};
	currSync.syncList = this.getSyncableTiddlers();
	currSync.syncTasks = this.createSyncTasks(currSync.syncList);
	this.preProcessSyncableTiddlers(currSync.syncList);
	var wizard = new Wizard();
	currSync.wizard = wizard;
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	currSync.listView = ListView.create(listWrapper,currSync.syncList,this.listViewTemplate);
	this.processSyncableTiddlers(currSync.syncList);
	wizard.setButtons([{caption: this.syncLabel, tooltip: this.syncPrompt, onClick: this.doSync}]);
};

config.macros.sync.getSyncableTiddlers = function()
{
	var list = [];
	store.forEachTiddler(function(title,tiddler) {
		var syncItem = {};
		syncItem.serverType = tiddler.getServerType();
		syncItem.serverHost = tiddler.fields['server.host'];
		if(syncItem.serverType && syncItem.serverHost) {
			syncItem.adaptor = new config.adaptors[syncItem.serverType]();
			syncItem.serverHost = syncItem.adaptor.fullHostName(syncItem.serverHost);
			syncItem.serverWorkspace = tiddler.fields['server.workspace'];
			syncItem.tiddler = tiddler;
			syncItem.title = tiddler.title;
			syncItem.isTouched = tiddler.isTouched();
			syncItem.selected = syncItem.isTouched;
			syncItem.syncStatus = config.macros.sync.syncStatusList[syncItem.isTouched ? "changedLocally" : "none"];
			syncItem.status = syncItem.syncStatus.text;
			list.push(syncItem);
		}
		});
	list.sort(function(a,b) {return a.title < b.title ? -1 : (a.title == b.title ? 0 : +1);});
	return list;
};

config.macros.sync.preProcessSyncableTiddlers = function(syncList)
{
	var i;
	for(i=0; i<syncList.length; i++) {
		var si = syncList[i];
		si.serverUrl = si.adaptor.generateTiddlerInfo(si.tiddler).uri;
	}
};

config.macros.sync.processSyncableTiddlers = function(syncList)
{
	var i;
	for(i=0; i<syncList.length; i++) {
		var si = syncList[i];
		if(si.syncStatus.display)
			si.rowElement.style.display = si.syncStatus.display;
		if(si.syncStatus.className)
			si.rowElement.className = si.syncStatus.className;
	}
};

config.macros.sync.createSyncTasks = function(syncList)
{
	var i,syncTasks = [];
	for(i=0; i<syncList.length; i++) {
		var si = syncList[i];
		var j,r = null;
		for(j=0; j<syncTasks.length; j++) {
			var cst = syncTasks[j];
			if(si.serverType == cst.serverType && si.serverHost == cst.serverHost && si.serverWorkspace == cst.serverWorkspace)
				r = cst;
		}
		if(r) {
			si.syncTask = r;
			r.syncItems.push(si);
		} else {
			si.syncTask = this.createSyncTask(si);
			syncTasks.push(si.syncTask);
		}
	}
	return syncTasks;
};

config.macros.sync.createSyncTask = function(syncItem)
{
	var st = {};
	st.serverType = syncItem.serverType;
	st.serverHost = syncItem.serverHost;
	st.serverWorkspace = syncItem.serverWorkspace;
	st.syncItems = [syncItem];

	var getTiddlerListCallback = function(context,sycnItems) {
		var me = config.macros.sync;
		if(!context.status) {
			displayMessage(context.statusText);
			return false;
		}
		syncItems = context.userParams;
		var i,tiddlers = context.tiddlers;
		for(i=0; i<syncItems.length; i++) {
			var si = syncItems[i];
			var f = tiddlers.findByField("title",si.title);
			if(f !== null) {
				if(tiddlers[f].fields['server.page.revision'] > si.tiddler.fields['server.page.revision']) {
					si.syncStatus = me.syncStatusList[si.isTouched ? 'changedBoth' : 'changedServer'];
				}
			} else {
				si.syncStatus = me.syncStatusList.notFound;
			}
			me.updateSyncStatus(si);
		}
		return true;
	};

	var openWorkspaceCallback = function(context,syncItems) {
		if(context.status) {
			context.adaptor.getTiddlerList(context,syncItems,getTiddlerListCallback);
			return true;
		}
		displayMessage(context.statusText);
		return false;
	};

	var context = {host:st.serverHost,workspace:st.serverWorkspace};
	syncItem.adaptor.openHost(st.serverHost);
	syncItem.adaptor.openWorkspace(st.serverWorkspace,context,st.syncItems,openWorkspaceCallback);
	return st;
};

config.macros.sync.updateSyncStatus = function(syncItem)
{
	var e = syncItem.colElements["status"];
	jQuery(e).empty();
	createTiddlyText(e,syncItem.syncStatus.text);
	syncItem.rowElement.style.display = syncItem.syncStatus.display;
	if(syncItem.syncStatus.className)
		syncItem.rowElement.className = syncItem.syncStatus.className;
};

config.macros.sync.doSync = function(e)
{
	var me = config.macros.sync;
	var getTiddlerCallback = function(context,syncItem) {
		if(syncItem) {
			var tiddler = context.tiddler;
			store.saveTiddler(tiddler.title,tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags,tiddler.fields,true,tiddler.created);
			syncItem.syncStatus = me.syncStatusList.gotFromServer;
			me.updateSyncStatus(syncItem);
		}
	};
	var putTiddlerCallback = function(context,syncItem) {
		if(syncItem) {
			store.resetTiddler(context.title);
			syncItem.syncStatus = me.syncStatusList.putToServer;
			me.updateSyncStatus(syncItem);
		}
	};

	var rowNames = ListView.getSelectedRows(currSync.listView);
	var i,sl = me.syncStatusList;
	for(i=0; i<currSync.syncList.length; i++) {
		var si = currSync.syncList[i];
		if(rowNames.indexOf(si.title) != -1) {
			var errorMsg = "Error in doSync: ";
			try {
				var r = true;
				switch(si.syncStatus) {
				case sl.changedServer:
					var context = {"workspace": si.serverWorkspace};
					r = si.adaptor.getTiddler(si.title,context,si,getTiddlerCallback);
					break;
				case sl.notFound:
				case sl.changedLocally:
				case sl.changedBoth:
					r = si.adaptor.putTiddler(si.tiddler,null,si,putTiddlerCallback);
					break;
				default:
					break;
				}
				if(!r)
					displayMessage(errorMsg + r);
			} catch(ex) {
				if(ex.name == "TypeError")
					displayMessage("sync operation unsupported: " + ex.message);
				else
					displayMessage(errorMsg + ex.message);
			}
		}
	}
	return false;
};
//}}}
