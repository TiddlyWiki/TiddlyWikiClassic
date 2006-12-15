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
	var importer = createTiddlyElement(null,"div",null,"importTiddler wizard");
	createTiddlyElement(importer,"h1",null,null,this.wizardTitle);
	createTiddlyElement(importer,"h2",null,"step1",this.step1);
	var step = createTiddlyElement(importer,"div",null,"wizardStep");
	createTiddlyText(step,this.step1prompt);
	var input = createTiddlyElement(null,"input",null,"txtOptionInput");
	input.type = "text";
	input.size = 50;
	step.appendChild(input);
	importer.inputBox = input;
	createTiddlyElement(step,"br");
	createTiddlyText(step,this.step1promptFile);
	var fileInput = createTiddlyElement(null,"input",null,"txtOptionInput");
	fileInput.type = "file";
	fileInput.size = 50;
	fileInput.onchange = this.onBrowseChange;
	fileInput.onkeyup = this.onBrowseChange;
	step.appendChild(fileInput);
	createTiddlyElement(step,"br");
	createTiddlyText(step,this.step1promptFeeds);
	var feeds = this.getFeeds([{caption: this.step1feedPrompt, name: ""}]);
	createTiddlyDropDown(step,this.onFeedChange,feeds);
	createTiddlyElement(step,"br");
	createTiddlyButton(step,this.fetchLabel,this.fetchPrompt,this.onFetch,null,null,null);
        place.appendChild(importer);
}

config.macros.importTiddlers.getFeeds = function(feeds)
{
	var tagged = store.getTaggedTiddlers("contentPublisher","title");
	for(var t=0; t<tagged.length; t++)
		feeds.push({caption: tagged[t].title, name: store.getTiddlerSlice(tagged[t].title,"URL")});
	return feeds;
}

config.macros.importTiddlers.onFeedChange = function(e)
{
	var importer = findRelated(this,"importTiddler","className","parentNode");
	importer.inputBox.value = this.value;
	this.selectedIndex = 0;
}

config.macros.importTiddlers.onBrowseChange = function(e)
{
	var importer = findRelated(this,"importTiddler","className","parentNode");
	importer.inputBox.value = "file://" + this.value;
}

config.macros.importTiddlers.onFetch = function(e)
{
	var importer = findRelated(this,"importTiddler","className","parentNode");
	var url = importer.inputBox.value;
	var cutoff = findRelated(importer.firstChild,"step2","className","nextSibling");
	while(cutoff)
		{
		var temp = cutoff.nextSibling;
		cutoff.parentNode.removeChild(cutoff);
		cutoff = temp;
		}
	createTiddlyElement(importer,"h2",null,"step2",config.macros.importTiddlers.step2);
	var step = createTiddlyElement(importer,"div",null,"wizardStep",config.macros.importTiddlers.step2Text.format([url]));
	loadRemoteFile(url,config.macros.importTiddlers.onLoad,importer);
}

config.macros.importTiddlers.onLoad = function(status,params,responseText,url,xhr)
{
	if(!status)
		{
		displayMessage(this.fetchError);
		return;
		}
	var importer = params;
	// Check that the tiddler we're in hasn't been closed - doesn't work on IE
//	var p = importer;
//	while(p.parentNode)
//		p = p.parentNode;
//	if(!(p instanceof HTMLDocument))
//		return;
	// Crack out the content - (should be refactored)
	var posOpeningDiv = responseText.indexOf(startSaveArea);
	var limitClosingDiv = responseText.indexOf("<!--POST-BODY-END--"+">");
	var posClosingDiv = responseText.lastIndexOf(endSaveArea,limitClosingDiv == -1 ? responseText.length : limitClosingDiv);
	if((posOpeningDiv == -1) || (posClosingDiv == -1))
		{
		alert(config.messages.invalidFileError.format([url]));
		return;
		}
	var content = "<html><body>" + responseText.substring(posOpeningDiv,posClosingDiv + endSaveArea.length) + "</body></html>";
	// Create the iframe
	var iframe = document.createElement("iframe");
	iframe.style.display = "none";
	importer.insertBefore(iframe,importer.firstChild);
	var doc = iframe.document;
	if(iframe.contentDocument)
		doc = iframe.contentDocument; // For NS6
	else if(iframe.contentWindow)
		doc = iframe.contentWindow.document; // For IE5.5 and IE6
	// Put the content in the iframe
	doc.open();
	doc.writeln(content);
	doc.close();
	// Load the content into a TiddlyWiki() object
	var storeArea = doc.getElementById("storeArea");
	var importStore = new TiddlyWiki();
	importStore.loadFromDiv(storeArea,"store");
	// Get rid of the iframe
	iframe.parentNode.removeChild(iframe);
	// Extract data for the listview
	var tiddlers = [];
	importStore.forEachTiddler(function(title,tiddler)
		{
		var t = {};
		t.title = title;
		t.modified = tiddler.modified;
		t.modifier = tiddler.modifier;
		t.text = tiddler.text.substr(0,50);
		t.tags = tiddler.tags;
		tiddlers.push(t);
		});
	// Display the listview
	createTiddlyElement(importer,"h2",null,"step3",config.macros.importTiddlers.step3);
	var step = createTiddlyElement(importer,"div",null,"wizardStep");
	ListView.create(step,tiddlers,config.macros.importTiddlers.listViewTemplate,config.macros.importTiddlers.onSelectCommand);
	// Save the importer
	importer.store = importStore;
}

config.macros.importTiddlers.onSelectCommand = function(listView,command,rowNames)
{
	var importer = findRelated(listView,"importTiddler","className","parentNode");
	switch(command)
		{
		case "import":
			config.macros.importTiddlers.doImport(importer,rowNames);
			break;
		}
	if(config.options.chkAutoSave)
		saveChanges(true);
}

config.macros.importTiddlers.doImport = function(importer,rowNames)
{
	var theStore = importer.store;
	var overwrite = new Array();
	var t;
	for(t=0; t<rowNames.length; t++)
		{
		if(store.tiddlerExists(rowNames[t]))
			overwrite.push(rowNames[t]);
	}
	if(overwrite.length > 0)
		if(!confirm(this.confirmOverwriteText.format([overwrite.join(", ")])))
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
	createTiddlyElement(importer,"h2",null,"step4",this.step4.format([rowNames.length]));
	var step = createTiddlyElement(importer,"div",null,"wizardStep");
	for(t=0; t<rowNames.length; t++)
		{
		createTiddlyLink(step,rowNames[t],true);
		createTiddlyElement(step,"br");
		}
	createTiddlyElement(importer,"h2",null,"step5",this.step5);
}
