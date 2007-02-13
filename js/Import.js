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
}

config.macros.importTiddlers.restart = function(wizard)
{
	wizard.addStep(this.step1Title,this.step1Html);
	var s = wizard.getElement("selFeeds");
	var feeds = this.getFeeds();
	for(var t=0; t<feeds.length; t++)
		{
		var e = createTiddlyElement(s,"option",null,null,feeds[t].title);
		e.value = feeds[t].url;
		}
	s.onchange = config.macros.importTiddlers.onFeedChange;
	var fileInput = wizard.getElement("txtBrowse");
	fileInput.onchange = config.macros.importTiddlers.onBrowseChange;
	fileInput.onkeyup = config.macros.importTiddlers.onBrowseChange;
	wizard.setButtons([{caption: this.fetchLabel, tooltip: this.fetchPrompt, onClick: config.macros.importTiddlers.onFetch}]);
}

config.macros.importTiddlers.getFeeds = function()
{
	var feeds = [];
	var tagged = store.getTaggedTiddlers("contentPublisher","title");
	for(var t=0; t<tagged.length; t++)
		feeds.push({title: tagged[t].title, url: store.getTiddlerSlice(tagged[t].title,"URL")});
	return feeds;
}

config.macros.importTiddlers.onFeedChange = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	fileInput.value = this.value;
	this.selectedIndex = 0;
}

config.macros.importTiddlers.onBrowseChange = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	fileInput.value = "file://" + this.value;
}

config.macros.importTiddlers.onFetch = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	var url = fileInput.value;
	wizard.addStep(config.macros.importTiddlers.step2Title,config.macros.importTiddlers.step2Html);
	var markPath = wizard.getElement("markPath");
	markPath.parentNode.insertBefore(document.createTextNode(url),markPath);
	loadRemoteFile(url,config.macros.importTiddlers.onLoad,wizard);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}]);
}

config.macros.importTiddlers.onLoad = function(status,params,responseText,url,xhr)
{
	if(!status)
		{
		displayMessage(this.fetchError);
		return;
		}
	var wizard = params;
	// Check that the tiddler we're in hasn't been closed - doesn't work on IE
//	var p = importer;
//	while(p.parentNode)
//		p = p.parentNode;
//	if(!(p instanceof HTMLDocument))
//		return;
	// Load the content into a TiddlyWiki() object
	var importStore = new TiddlyWiki();
	var r = importStore.importTiddlyWiki(responseText);
	if(r != null)
		{
		displayMessage(r);
		return;
		}
	// Extract data for the listview
	var tiddlers = [];
	importStore.forEachTiddler(function(title,tiddler)
		{
		var t = {};
		t.title = title;
		t.modified = tiddler.modified;
		t.modifier = tiddler.modifier;
		t.text = wikifyPlain(title,importStore,100).substr(0,100);
		t.tags = tiddler.tags;
		t.size = tiddler.text ? tiddler.text.length : 0;
		tiddlers.push(t);
		});
	wizard.setValue("store",importStore);
	// Display the listview
	wizard.addStep(config.macros.importTiddlers.step3Title,config.macros.importTiddlers.step3Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	var listView = ListView.create(listWrapper,tiddlers,config.macros.importTiddlers.listViewTemplate);
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
	var theStore = wizard.getValue("store");
	var overwrite = new Array();
	var t;
	for(t=0; t<rowNames.length; t++)
		{
		if(store.tiddlerExists(rowNames[t]))
			overwrite.push(rowNames[t]);
	}
	if(overwrite.length > 0)
		if(!confirm(config.macros.importTiddlers.confirmOverwriteText.format([overwrite.join(", ")])))
			return;
	for(t=0; t<rowNames.length; t++)
		{
		var inbound = theStore.fetchTiddler(rowNames[t]);
		store.saveTiddler(inbound.title, inbound.title, inbound.text, inbound.modifier, inbound.modified, inbound.tags);
		store.fetchTiddler(inbound.title).created = inbound.created;
		store.notify(rowNames[t],false);
		}
	store.notifyAll();
	store.setDirty(true);
	wizard.addStep(config.macros.importTiddlers.step4Title.format([rowNames.length]),config.macros.importTiddlers.step4Html);
	var reportList = wizard.getElement("markReport");
	var reportWrapper = document.createElement("div");
	reportList.parentNode.insertBefore(reportWrapper,reportList);
	for(t=0; t<rowNames.length; t++)
		{
		createTiddlyLink(reportWrapper,rowNames[t],true);
		createTiddlyElement(reportWrapper,"br");
		}
	autoSaveChanges();
	wizard.setButtons([
			{caption: config.macros.importTiddlers.doneLabel, tooltip: config.macros.importTiddlers.donePrompt, onClick: config.macros.importTiddlers.onCancel}
		]);
}
