//--
//-- Menu and toolbar commands
//--

config.commands.closeTiddler.handler = function(event, src, title) {
	if(story.isDirty(title) && !readOnly) {
		if(!confirm(config.commands.cancelTiddler.warning.format([title])))
			return false;
	}
	story.setDirty(title, false);
	story.closeTiddler(title, true);
	return false;
};

config.commands.closeOthers.handler = function(event, src, title) {
	story.closeAllTiddlers(title);
	return false;
};

config.commands.editTiddler.handler = function(event, src, title) {
	clearMessage();
	var tiddlerElem = story.getTiddler(title);
	var fields = tiddlerElem.getAttribute("tiddlyFields");
	story.displayTiddler(null, title, DEFAULT_EDIT_TEMPLATE, false, null, fields);

	var editorElement = story.getTiddlerField(title, config.options.txtEditorFocus || "text");
	if(editorElement) setCaretPosition(editorElement, 0);
	return false;
};

config.commands.saveTiddler.handler = function(event, src, title) {
	var newTitle = story.saveTiddler(title, event.shiftKey);
	if(newTitle) story.displayTiddler(null, newTitle);
	return false;
};

config.commands.cancelTiddler.handler = function(event, src, title) {
	if(story.hasChanges(title) && !readOnly) {
		if(!confirm(this.warning.format([title])))
			return false;
	}
	story.setDirty(title, false);
	story.displayTiddler(null, title);
	return false;
};

config.commands.deleteTiddler.handler = function(event, src, title) {
	var deleteIt = true;
	if(config.options.chkConfirmDelete) deleteIt = confirm(this.warning.format([title]));
	if(!deleteIt) return false;

	store.removeTiddler(title);
	story.closeTiddler(title, true);
	autoSaveChanges();
	return false;
};

config.commands.permalink.getUrl = function(title) {
	var hash = story.getPermaViewHash([title]);
	return window.location.href.replace(/#.*/, '') + hash;
};
config.commands.permalink.handler = function(event, src, title) {
	var hash = story.getPermaViewHash([title]);
	if(window.location.hash != hash) window.location.hash = hash;
	return false;
};

config.commands.references.handlePopup = function(popup, title) {
	var references = store.getReferringTiddlers(title);
	var hasRefs = false;
	for(var i = 0; i < references.length; i++) {
		if(references[i].title != title && !references[i].isTagged("excludeLists")) {
			createTiddlyLink(createTiddlyElement(popup, "li"), references[i].title, true);
			hasRefs = true;
		}
	}
	if(!hasRefs) createTiddlyElement(popup, "li", null, "disabled", this.popupNone);
};

config.commands.jump.handlePopup = function(popup, title) {
	story.forEachTiddler(function(title, element) {
		createTiddlyLink(createTiddlyElement(popup, "li"), title, true, null, false, null, true);
	});
};

config.commands.fields.handlePopup = function(popup, title) {
	var tiddler = store.fetchTiddler(title);
	if(!tiddler) return;
	var items = [];
	store.forEachField(tiddler, function(tiddler, fieldName, value) {
		items.push({ field: fieldName, value: value });
	}, true);
	items.sort(function(a, b) { return a.field < b.field ? -1 : (a.field == b.field ? 0 : +1) });

	if(items.length > 0) {
		ListView.create(popup, items, this.listViewTemplate);
	} else {
		createTiddlyElement(popup, "li", null, "disabled", this.emptyText);
	}
};

