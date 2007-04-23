//--
//-- Menu and toolbar commands
//--

config.commands.closeTiddler.handler = function(event,src,title)
{
	story.closeTiddler(title,true);
	return false;
};

config.commands.closeOthers.handler = function(event,src,title)
{
	story.closeAllTiddlers(title);
	return false;
};

config.commands.editTiddler.handler = function(event,src,title)
{
	clearMessage();
	var tiddlerElem = document.getElementById(story.idPrefix + title);
	var fields = tiddlerElem.getAttribute("tiddlyFields");
	story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE,false,null,fields);
	story.focusTiddler(title,"text");
	return false;
};

config.commands.saveTiddler.handler = function(event,src,title)
{
	var newTitle = story.saveTiddler(title,event.shiftKey);
	if(newTitle)
		story.displayTiddler(null,newTitle);
	return false;
};

config.commands.cancelTiddler.handler = function(event,src,title)
{
	if(story.hasChanges(title) && !readOnly) {
		if(!confirm(this.warning.format([title])))
			return false;
	}
	story.setDirty(title,false);
	story.displayTiddler(null,title);
	return false;
};

config.commands.deleteTiddler.handler = function(event,src,title)
{
	var deleteIt = true;
	if (config.options.chkConfirmDelete)
		deleteIt = confirm(this.warning.format([title]));
	if (deleteIt) {
		store.removeTiddler(title);
		story.closeTiddler(title,true);
		autoSaveChanges();
	}
	return false;
};

config.commands.permalink.handler = function(event,src,title)
{
	var t = encodeURIComponent(String.encodeTiddlyLink(title));
	if(window.location.hash != t)
		window.location.hash = t;
	return false;
};

config.commands.references.handlePopup = function(popup,title)
{
	var references = store.getReferringTiddlers(title);
	var c = false;
	for(var r=0; r<references.length; r++) {
		if(references[r].title != title && !references[r].isTagged("excludeLists")) {
			createTiddlyLink(createTiddlyElement(popup,"li"),references[r].title,true);
			c = true;
		}
	}
	if(!c)
		createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),this.popupNone);
};

config.commands.jump.handlePopup = function(popup,title)
{
	story.forEachTiddler(function(title,element) {
		createTiddlyLink(createTiddlyElement(popup,"li"),title,true,null,false,null,true);
		});
};

config.commands.syncing.handlePopup = function(popup,title)
{
	var tiddler = store.fetchTiddler(title);
	if(!tiddler)
		return;
	var serverType = tiddler.getServerType();
	var serverHost = tiddler.fields['server.host'];
	var serverWorkspace = tiddler.fields['server.workspace'];
	if(!serverWorkspace)
		serverWorkspace = "";
	if(serverType) {
		var e = createTiddlyElement(popup,"li",null,"popupMessage");
		e.innerHTML = config.commands.syncing.currentlySyncing.format([serverType,serverHost,serverWorkspace]);
	} else {
		createTiddlyElement(popup,"li",null,"popupMessage",config.commands.syncing.notCurrentlySyncing);
	}
	if(serverType) {
		createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		var btn = createTiddlyButton(createTiddlyElement(popup,"li"),this.captionUnSync,null,config.commands.syncing.onChooseServer);
		btn.setAttribute("tiddler",title);
		btn.setAttribute("server.type","");
	}
	createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
	createTiddlyElement(popup,"li",null,"popupMessage",config.commands.syncing.chooseServer);
	var feeds = store.getTaggedTiddlers("systemServer","title");
	for(var t=0; t<feeds.length; t++) {
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
			caption = config.commands.syncing.currServerMarker + caption;
		} else {
			caption = config.commands.syncing.notCurrServerMarker + caption;
		}
		btn = createTiddlyButton(createTiddlyElement(popup,"li"),caption,null,config.commands.syncing.onChooseServer);
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
			'server.type': serverType,
			'server.host': this.getAttribute("server.host"),
			'server.workspace': this.getAttribute("server.workspace")
			});
	} else {
		store.setValue(tiddler,'server',null);
	}
	return false;
};

config.commands.fields.handlePopup = function(popup,title)
{
	var tiddler = store.fetchTiddler(title);
	if(!tiddler)
		return;
	var fields = {};
	store.forEachField(tiddler,function(tiddler,fieldName,value) {fields[fieldName] = value;},true);
	var items = [];
	for(var t in fields) {
		items.push({field: t,value: fields[t]});
	}
	items.sort(function(a,b) {return a.field < b.field ? -1 : (a.field == b.field ? 0 : +1);});
	if(items.length > 0)
		ListView.create(popup,items,this.listViewTemplate);
	else
		createTiddlyElement(popup,"div",null,null,this.emptyText);
};
