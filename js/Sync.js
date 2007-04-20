//--
//-- Sync macro
//--

// Synchronisation handlers
config.syncers = {};

// Sync state.
//# Members:
//#	syncList - List of sync objects (title, tiddler, server, workspace, page, revision)
//#	wizard - reference to wizard object
//#	listView - DOM element of the listView table
//#	syncMachines - array of syncMachines
var currSync = null;

// sync macro
config.macros.sync.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!wikifier.isStatic)
		this.startSync(place);
};

config.macros.sync.startSync = function(place)
{
	if(currSync)
		config.macros.sync.cancelSync();
	currSync = {};
	currSync.syncList = this.getSyncableTiddlers();
	this.createSyncTasks();
	this.preProcessSyncableTiddlers();
	var wizard = new Wizard();
	currSync.wizard = wizard;
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	currSync.listView = ListView.create(listWrapper,currSync.syncList,this.listViewTemplate);
	this.processSyncableTiddlers();
	wizard.setButtons([
			{caption: this.syncLabel, tooltip: this.syncPrompt, onClick: this.doSync}
		]);
};

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
		syncItem.syncStatus = config.macros.sync.syncStatusList[syncItem.isTouched ? "changedLocally" : "none"];
		syncItem.status = syncItem.syncStatus.text;
		if(syncItem.serverType && syncItem.serverHost)
			list.push(syncItem);
		});
	list.sort(function(a,b) {return a.title < b.title ? -1 : (a.title == b.title ? 0 : +1);});
	return list;
};

config.macros.sync.preProcessSyncableTiddlers = function()
{
	for(var t=0; t<currSync.syncList.length; t++) {
		si = currSync.syncList[t];
		var ti = si.syncTask.syncMachine.generateTiddlerInfo(si.tiddler);
		si.serverUrl = ti.uri;
	}
};

config.macros.sync.processSyncableTiddlers = function()
{
	for(var t=0; t<currSync.syncList.length; t++) {
		si = currSync.syncList[t];
		si.rowElement.style.backgroundColor = si.syncStatus.color;
	}
};

config.macros.sync.createSyncTasks = function()
{
	currSync.syncTasks = [];
	for(var t=0; t<currSync.syncList.length; t++) {
		var si = currSync.syncList[t];
		var r = null;
		for(var st=0; st<currSync.syncTasks.length; st++) {
			var cst = currSync.syncTasks[st];
			if(si.serverType == cst.serverType && si.serverHost == cst.serverHost && si.serverWorkspace == cst.serverWorkspace)
				r = cst;
		}
		if(r == null) {
			si.syncTask = this.createSyncTask(si);
			currSync.syncTasks.push(si.syncTask);
		} else {
			si.syncTask = r;
			r.syncItems.push(si);
		}
	}
};

config.macros.sync.createSyncTask = function(syncItem)
{
	var st = {};
	st.serverType = syncItem.serverType;
	st.serverHost = syncItem.serverHost;
	st.serverWorkspace = syncItem.serverWorkspace;
	st.syncItems = [syncItem];
	st.syncMachine = new SyncMachine(st.serverType,{
		start: function() {
			return this.openHost(st.serverHost,"openWorkspace");
		},
		openWorkspace: function() {
			return this.openWorkspace(st.serverWorkspace,"getTiddlerList");
		},
		getTiddlerList: function() {
			return this.getTiddlerList("gotTiddlerList");
		},
		gotTiddlerList: function(tiddlers) {
			for(var t=0; t<st.syncItems.length; t++) {
				var si = st.syncItems[t];
				var f = tiddlers.findByField("title",si.title);
				if(f !== null) {
					if(tiddlers[f].fields['server.page.revision'] > si.tiddler.fields['server.page.revision']) {
						si.syncStatus = config.macros.sync.syncStatusList[si.isTouched ? 'changedBoth' : 'changedServer'];
					}
				} else {
					si.syncStatus = config.macros.sync.syncStatusList.notFound;
				}
				config.macros.sync.updateSyncStatus(si);
			}
		},
		getTiddler: function(title) {
			return this.getTiddler(title,"onGetTiddler");
		},
		onGetTiddler: function(tiddler) {
			var syncItem = st.syncItems.findByField("title",tiddler.title);
			if(syncItem !== null) {
				syncItem = st.syncItems[syncItem];
				store.saveTiddler(tiddler.title, tiddler.title, tiddler.text, tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields, true, tiddler.created);
				syncItem.syncStatus = config.macros.sync.syncStatusList.gotFromServer;
				config.macros.sync.updateSyncStatus(syncItem);
			}
		},
		putTiddler: function(tiddler) {
			return this.putTiddler(tiddler,"onPutTiddler");
		},
		onPutTiddler: function(tiddler) {
			var syncItem = st.syncItems.findByField("title",tiddler.title);
			if(syncItem !== null) {
				syncItem = st.syncItems[syncItem];
				store.resetTiddler(tiddler.title);
				syncItem.syncStatus = config.macros.sync.syncStatusList.putToServer;
				config.macros.sync.updateSyncStatus(syncItem);
			}
		}
	});
	st.syncMachine.go();
	return st;
};

config.macros.sync.updateSyncStatus = function(syncItem)
{
	var e = syncItem.colElements["status"];
	removeChildren(e);
	createTiddlyText(e,syncItem.syncStatus.text);
	syncItem.rowElement.style.backgroundColor = syncItem.syncStatus.color;
};

config.macros.sync.doSync = function(e)
{
	var rowNames = ListView.getSelectedRows(currSync.listView);
	for(var t=0; t<currSync.syncList.length; t++) {
		var si = currSync.syncList[t];
		if(rowNames.indexOf(si.title) != -1) {
			config.macros.sync.doSyncItem(si);
		}
	}
	return false;
};

config.macros.sync.doSyncItem = function(syncItem)
{
	var r = true;
	var sl = config.macros.sync.syncStatusList;
	switch(syncItem.syncStatus) {
		case sl.changedServer:
			r = syncItem.syncTask.syncMachine.go("getTiddler",syncItem.title);
			break;
		case sl.notFound:
		case sl.changedLocally:
		case sl.changedBoth:
			r = syncItem.syncTask.syncMachine.go("putTiddler",syncItem.tiddler);
			break;
		default:
			break;
	}
	if(r !== true)
		displayMessage("Error in doSyncItem: " + r);
};

config.macros.sync.cancelSync = function()
{
	currSync = null;
};

function SyncMachine(serverType,steps)
{
	this.serverType = serverType;
	this.adaptor = new config.adaptors[serverType];
	this.steps = steps;
}

SyncMachine.prototype.go = function(step,varargs)
{
	if(!step)
		step = "start";
	var h = this.steps[step];
	if(!h)
		return null;
	var a = [];
	for(var t=1; t<arguments.length; t++)
		a.push(arguments[t]);
	var r = h.apply(this,a);
	if(typeof r == "string")
		this.invokeError(r);
	return r;
};

SyncMachine.prototype.invokeError = function(message)
{
	if(this.steps.error)
		this.steps.error(message);
};

SyncMachine.prototype.openHost = function(host,nextStep)
{
	var me = this;
	return me.adaptor.openHost(host,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep);
	});
};

SyncMachine.prototype.getWorkspaceList = function(nextStep)
{
	var me = this;
	return me.adaptor.getWorkspaceList(null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,context.workspaces);
	});
};

SyncMachine.prototype.openWorkspace = function(workspace,nextStep)
{
	var me = this;
	return me.adaptor.openWorkspace(workspace,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep);
	});
};

SyncMachine.prototype.getTiddlerList = function(nextStep)
{
	var me = this;
	return me.adaptor.getTiddlerList(null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,context.tiddlers);
	});
};

SyncMachine.prototype.generateTiddlerInfo = function(tiddler)
{
	return this.adaptor.generateTiddlerInfo(tiddler);
};

SyncMachine.prototype.getTiddler = function(title,nextStep)
{
	var me = this;
	return me.adaptor.getTiddler(title,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,context.tiddler);
	});
};

SyncMachine.prototype.putTiddler = function(tiddler,nextStep)
{
	var me = this;
	return me.adaptor.putTiddler(tiddler,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,tiddler);
	});
};


