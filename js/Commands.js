// ---------------------------------------------------------------------------------
// Menu and toolbar commands
// ---------------------------------------------------------------------------------

config.commands.closeTiddler.handler = function(event,src,title)
{
	story.closeTiddler(title,true,event.shiftKey || event.altKey);
	return false;
}

config.commands.closeOthers.handler = function(event,src,title)
{
	story.closeAllTiddlers(title);
	return false;
}

config.commands.editTiddler.handler = function(event,src,title)
{
	clearMessage();
	story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE);
	story.focusTiddler(title,"text");
	return false;
}

config.commands.saveTiddler.handler = function(event,src,title)
{
	var newTitle = story.saveTiddler(title,event.shiftKey);
	if(newTitle)
	   story.displayTiddler(null,newTitle);
	return false;
}

config.commands.cancelTiddler.handler = function(event,src,title)
{
	if(story.hasChanges(title) && !readOnly)
		if(!confirm(this.warning.format([title])))
			return false;
	story.setDirty(title,false);
	story.displayTiddler(null,title);
	return false;
}

config.commands.deleteTiddler.handler = function(event,src,title)
{
	var deleteIt = true;
	if (config.options.chkConfirmDelete)
		deleteIt = confirm(this.warning.format([title]));
	if (deleteIt)
		{
		store.removeTiddler(title);
		story.closeTiddler(title,true,event.shiftKey || event.altKey);
		if(config.options.chkAutoSave)
			saveChanges();
		}
	return false;
}

config.commands.permalink.handler = function(event,src,title)
{
	var t = encodeURIComponent(String.encodeTiddlyLink(title));
	if(window.location.hash != t)
		window.location.hash = t;
	return false;
}

config.commands.references.handler = function(event,src,title)
{
	var popup = Popup.create(src);
	if(popup)
		{
		var references = store.getReferringTiddlers(title);
		var c = false;
		for(var r=0; r<references.length; r++)
			if(references[r].title != title && !references[r].isTagged("excludeLists"))
				{
				createTiddlyLink(createTiddlyElement(popup,"li"),references[r].title,true);
				c = true;
				}
		if(!c)
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),this.popupNone);
		}
	Popup.show(popup,false);
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
	return false;
}

config.commands.jump.handler = function(event,src,title)
{
	var popup = Popup.create(src);
	if(popup)
		{
		story.forEachTiddler(function(title,element) {
			createTiddlyLink(createTiddlyElement(popup,"li"),title,true);
			});
		}
	Popup.show(popup,false);
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
	return false;
}

