// ---------------------------------------------------------------------------------
// ImportTiddlers macro
// ---------------------------------------------------------------------------------

config.macros.importTiddlers.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(readOnly)
		{
		createTiddlyElement(place,"div",null,"marked",this.readOnlyWarning);
		return;
		}
	var w = new Wizard();
	w.createWizard(place,this.wizardTitle);
	this.restart(w);
}

config.macros.importTiddlers.onCancel = function(e)
{
	var wizard = new Wizard(this);
	var place = wizard.clear();
	config.macros.importTiddlers.restart(wizard);
	return false;
}

config.macros.importTiddlers.restart = function(wizard)
{
	wizard.addStep(this.step1Title,this.step1Html);
	var s = wizard.getElement("selTypes");
	for(var t in config.adaptors)
		{
		var e = createTiddlyElement(s,"option",null,null,t);
		e.value = t;
		}
	s = wizard.getElement("selFeeds");
	var feeds = this.getFeeds();
	for(t in feeds)
		{
		e = createTiddlyElement(s,"option",null,null,t);
		e.value = t;
		}
	wizard.setValue("feeds",feeds);
	s.onchange = config.macros.importTiddlers.onFeedChange;
	var fileInput = wizard.getElement("txtBrowse");
	fileInput.onchange = config.macros.importTiddlers.onBrowseChange;
	fileInput.onkeyup = config.macros.importTiddlers.onBrowseChange;
	wizard.setButtons([{caption: this.openLabel, tooltip: this.openPrompt, onClick: config.macros.importTiddlers.onOpen}]);
}

config.macros.importTiddlers.getFeeds = function()
{
	var feeds = {};
	var tagged = store.getTaggedTiddlers("systemServer","title");
	for(var t=0; t<tagged.length; t++)
		{
		var title = tagged[t].title;
		var serverType = store.getTiddlerSlice(title,"Type");
		if(!serverType)
			serverType = "file";
		feeds[title] = {title: title,
						url: store.getTiddlerSlice(title,"URL"),
						serverType: serverType,
						description: store.getTiddlerSlice(title,"Description")};
		}
	return feeds;
}

config.macros.importTiddlers.onFeedChange = function(e)
{
	var wizard = new Wizard(this);
	var selTypes = wizard.getElement("selTypes");
	var fileInput = wizard.getElement("txtPath");
	var feeds = wizard.getValue("feeds");
	var f = feeds[this.value];
	if(f)
		{
		selTypes.value = f.serverType;
		fileInput.value = f.url;
		this.selectedIndex = 0;
		}
	return false;
}

config.macros.importTiddlers.onBrowseChange = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	fileInput.value = "file://" + this.value;
	return false;
}

config.macros.importTiddlers.onOpen = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	var url = fileInput.value;
	var s = wizard.getElement("selTypes");
	var adaptor = new config.adaptors[s.value];
	wizard.setValue("adaptor",adaptor);
	var context = {};
	var ret = adaptor.openHost(url,context,wizard,config.macros.importTiddlers.onOpenHost);
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusOpenHost);
	return false;
}

config.macros.importTiddlers.onOpenHost = function(context,wizard)
{
	var adaptor = wizard.getValue("adaptor");
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onOpenHost: " + context.statusText);
	var ret = adaptor.getWorkspaceList(context,wizard,config.macros.importTiddlers.onGetWorkspaceList)
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusGetWorkspaceList);
}

config.macros.importTiddlers.onGetWorkspaceList = function(context,wizard)
{
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onGetWorkspaceList: " + context.statusText);
	wizard.addStep(config.macros.importTiddlers.step2Title,config.macros.importTiddlers.step2Html);
	var s = wizard.getElement("selWorkspace");
	s.onchange = config.macros.importTiddlers.onWorkspaceChange;
	for(var t=0; t<context.workspaces.length; t++)
		{
		var e = createTiddlyElement(s,"option",null,null,context.workspaces[t].title);
		e.value = context.workspaces[t].title;
		}
	wizard.setButtons([{caption: config.macros.importTiddlers.openLabel, tooltip: config.macros.importTiddlers.openPrompt, onClick: config.macros.importTiddlers.onChooseWorkspace}]);
}

config.macros.importTiddlers.onWorkspaceChange = function(e)
{
	var wizard = new Wizard(this);
	var t = wizard.getElement("txtWorkspace");
	t.value  = this.value;
	this.selectedIndex = 0;
	return false;
}

config.macros.importTiddlers.onChooseWorkspace = function(e)
{
	var wizard = new Wizard(this);
	var adaptor = wizard.getValue("adaptor");
	var t = wizard.getElement("txtWorkspace");
	var context = {};
	var ret = adaptor.openWorkspace(t.value,context,wizard,config.macros.importTiddlers.onOpenWorkspace);
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusOpenWorkspace);
	return false;
}

config.macros.importTiddlers.onOpenWorkspace = function(context,wizard)
{
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onOpenWorkspace: " + context.statusText);
	var adaptor = wizard.getValue("adaptor");
	var ret = adaptor.getTiddlerList(context,wizard,config.macros.importTiddlers.onGetTiddlerList);
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusGetTiddlerList);
}

config.macros.importTiddlers.onGetTiddlerList = function(context,wizard)
{
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onGetTiddlerList: " + context.statusText);
	// Extract data for the listview
	var listedTiddlers = [];
	if(context.tiddlers)
		for(var n=0; n<context.tiddlers.length-1; n++) {
			var tiddler = context.tiddlers[n];
			listedTiddlers.push({
				title: tiddler.title,
				modified: tiddler.modified,
				modifier: tiddler.modifier,
				text: tiddler.text ? wikifyPlainText(tiddler.text,100) : "",
				tags: tiddler.tags,
				size: tiddler.text ? tiddler.text.length : 0
			});
		}
	// Display the listview
	wizard.addStep(config.macros.importTiddlers.step3Title,config.macros.importTiddlers.step3Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	var listView = ListView.create(listWrapper,listedTiddlers,config.macros.importTiddlers.listViewTemplate);
	wizard.setValue("listView",listView);
	wizard.setButtons([
			{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel},
			{caption: config.macros.importTiddlers.importLabel, tooltip: config.macros.importTiddlers.importPrompt, onClick:  config.macros.importTiddlers.doImport}
		]);
}

config.macros.importTiddlers.doImport = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	var adaptor = wizard.getValue("adaptor");
	var overwrite = new Array();
	var t;
	for(t=0; t<rowNames.length; t++) {
		if(store.tiddlerExists(rowNames[t]))
			overwrite.push(rowNames[t]);
	}
	if(overwrite.length > 0)
		if(!confirm(config.macros.importTiddlers.confirmOverwriteText.format([overwrite.join(", ")])))
			return;
	wizard.addStep(config.macros.importTiddlers.step4Title.format([rowNames.length]),config.macros.importTiddlers.step4Html);
	for(t=0; t<rowNames.length; t++) {
		var link = document.createElement("div");
		createTiddlyLink(link,rowNames[t],true);
		var place = wizard.getElement("markReport");
		place.parentNode.insertBefore(link,place);
		}
	wizard.setValue("remainingImports",rowNames.length);
	wizard.setButtons([
			{caption: config.macros.importTiddlers.doneLabel, tooltip: config.macros.importTiddlers.donePrompt, onClick: config.macros.importTiddlers.onCancel}
		]);
	for(t=0; t<rowNames.length; t++)
		{
		var context = {};
		var inbound = adaptor.getTiddler(rowNames[t],context,wizard,config.macros.importTiddlers.onGetTiddler);
		}
	return false;
}

config.macros.importTiddlers.onGetTiddler = function(context,wizard)
{
	if(!context.status)
		displayMessage("Error in importTiddlers.onGetTiddler: " + context.statusText);
	var tiddler = context.tiddler;
	store.saveTiddler(tiddler.title, tiddler.title, tiddler.text, tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields);
	store.fetchTiddler(tiddler.title).created = tiddler.created;
	var remainingImports = wizard.getValue("remainingImports")-1;
	wizard.setValue("remainingImports",remainingImports);
	if(remainingImports == 0) {
		wizard.addStep(config.macros.importTiddlers.step5Title,config.macros.importTiddlers.step5Html);
		autoSaveChanges();
	}
}

