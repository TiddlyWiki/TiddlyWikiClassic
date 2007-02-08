//--
//-- Story functions
//--

//# A story is a HTML div containing a sequence of tiddlers that can be manipulated
//# container - id of containing element
//# idPrefix - string prefix prepended to title to make ids for tiddlers in this story
function Story(container,idPrefix)
{
	this.container = container;
	this.idPrefix = idPrefix;
	this.highlightRegExp = null;
}

//# Iterate through all the tiddlers in a story
//# fn - callback function to be called for each tiddler. Arguments are:
//#      tiddler - reference to Tiddler object
//#      element - reference to tiddler display element
Story.prototype.forEachTiddler = function(fn)
{
	var place = document.getElementById(this.container);
	if(!place)
		return;
	var e = place.firstChild;
	while(e) {
		var n = e.nextSibling;
		var title = e.getAttribute("tiddler");
		fn.call(this,title,e);
		e = n;
	}
};

//# Display several tiddlers given their titles in an array. Parameters same as displayTiddler(), except:
//# titles - array of string titles
Story.prototype.displayTiddlers = function(srcElement,titles,template,animate,slowly,customFields)
{
	for(var t = titles.length-1;t>=0;t--)
		this.displayTiddler(srcElement,titles[t],template,animate,slowly,customFields);
};

//# Display a given tiddler with a given template. If the tiddler is already displayed but with a different
//# template, it is switched to the specified template
//# srcElement - reference to element from which this one is being opened -or-
//#              special positions "top", "bottom"
//# title - title of tiddler to display
//# template - the name of the tiddler containing the template -or-
//#            one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE -or-
//#            null or undefined to indicate the current template if there is one, DEFAULT_VIEW_TEMPLATE if not
//# animate - whether to perform animations
//# slowly - whether to perform animations in slomo
//# customFields - an optional list of name/value pairs to be assigned as tiddler fields (for edit templates)
Story.prototype.displayTiddler = function(srcElement,title,template,animate,slowly,customFields)
{
	var place = document.getElementById(this.container);
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem) {
		this.refreshTiddler(title,template,false,customFields);
	} else {
		var before = this.positionTiddler(srcElement);
		tiddlerElem = this.createTiddler(place,before,title,template,customFields);
	}
	if(srcElement && typeof srcElement !== "string") {
		if(config.options.chkAnimate && (animate == undefined || animate == true) && anim && typeof Cascade == "function" && typeof Scroller == "function")
			anim.startAnimating(new Cascade(title,srcElement,tiddlerElem,slowly),new Scroller(tiddlerElem,slowly));
		else
			window.scrollTo(0,ensureVisible(tiddlerElem));
	}
};

//# Figure out the appropriate position for a newly opened tiddler
//# srcElement - reference to the element containing the link to the tiddler -or-
//#              special positions "top", "bottom"
//# returns - reference to the tiddler that the new one should appear before (null for the bottom of the story)
Story.prototype.positionTiddler = function(srcElement)
{
	var place = document.getElementById(this.container);
	var before;
	if(typeof srcElement == "string") {
		switch(srcElement) {
			case "top":
				before = place.firstChild;
				break;
			case "bottom":
				before = null;
				break;
		}
	} else {
		var after = this.findContainingTiddler(srcElement);
		if(after == null)
			before = place.firstChild;
		else if(after.nextSibling)
			before = after.nextSibling;
		else
			before = null;
	}
	return before;
};

//# Create a tiddler frame at the appropriate place in a story column
//# place - reference to parent element
//# before - null, or reference to element before which to insert new tiddler
//# title - title of new tiddler
//# template - the name of the tiddler containing the template or one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE
//# customFields - an optional list of name/value pairs to be assigned as tiddler fields (for edit templates)
Story.prototype.createTiddler = function(place,before,title,template,customFields)
{
	var tiddlerElem = createTiddlyElement(null,"div",this.idPrefix + title,"tiddler");
	tiddlerElem.setAttribute("refresh","tiddler");
	place.insertBefore(tiddlerElem,before);
	this.refreshTiddler(title,template,false,customFields);
	return tiddlerElem;
};

//# Overridable for choosing the name of the template to apply for a tiddler
Story.prototype.chooseTemplateForTiddler = function(title,template)
{
	if(!template)
		template = DEFAULT_VIEW_TEMPLATE;
	if(template == DEFAULT_VIEW_TEMPLATE || template == DEFAULT_EDIT_TEMPLATE)
		template = config.tiddlerTemplates[template];
	return template;
};

//# Overridable for extracting the text of a template from a tiddler
Story.prototype.getTemplateForTiddler = function(title,template,tiddler)
{
	return store.getRecursiveTiddlerText(template,null,10);
};

//# Apply a template to an existing tiddler if it is not already displayed using that template
//# title - title of tiddler to update
//# template - the name of the tiddler containing the template or one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE
//# force - if true, forces the refresh even if the template hasn't changedd
//# customFields - an optional list of name/value pairs to be assigned as tiddler fields (for edit templates)
Story.prototype.refreshTiddler = function(title,template,force,customFields)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem) {
		if(tiddlerElem.getAttribute("dirty") == "true" && !force)
			return tiddlerElem;
		template = this.chooseTemplateForTiddler(title,template);
		var currTemplate = tiddlerElem.getAttribute("template");
		if((template != currTemplate) || force) {
			var tiddler = store.getTiddler(title);
			if(!tiddler) {
				tiddler = new Tiddler();
				if(store.isShadowTiddler(title)) {
					tiddler.set(title,store.getTiddlerText(title),config.views.wikified.shadowModifier,version.date,[],version.date);
				} else {
					var text = template=="EditTemplate" ?
								config.views.editor.defaultText.format([title]) :
								config.views.wikified.defaultText.format([title]);
					var fields = customFields ? convertCustomFieldsToHash(customFields) : null;
					tiddler.set(title,text,config.views.wikified.defaultModifier,version.date,[],version.date,fields);
				}
			}
			tiddlerElem.setAttribute("tags",tiddler.tags.join(" "));
			tiddlerElem.setAttribute("tiddler",title);
			tiddlerElem.setAttribute("template",template);
			var me = this;
			tiddlerElem.onmouseover = this.onTiddlerMouseOver;
			tiddlerElem.onmouseout = this.onTiddlerMouseOut;
			tiddlerElem.ondblclick = this.onTiddlerDblClick;
			tiddlerElem[window.event?"onkeydown":"onkeypress"] = this.onTiddlerKeyPress;
			var html = this.getTemplateForTiddler(title,template,tiddler);
			tiddlerElem.innerHTML = html;
			applyHtmlMacros(tiddlerElem,tiddler);
			if(store.getTaggedTiddlers(title).length > 0)
				addClass(tiddlerElem,"isTag");
			else
				removeClass(tiddlerElem,"isTag");
			if(!store.tiddlerExists(title)) {
				if(store.isShadowTiddler(title))
					addClass(tiddlerElem,"shadow");
				else
					addClass(tiddlerElem,"missing");
			} else {
				removeClass(tiddlerElem,"shadow");
				removeClass(tiddlerElem,"missing");
			}
			if(customFields)
				this.addCustomFields(tiddlerElem,customFields);
		}
	}
	return tiddlerElem;
};

//# Add hidden input elements for the custom fields of a tiddler
Story.prototype.addCustomFields = function(place,customFields)
{
	var fieldsPattern = "([^:]*):([^;]*);";
	var fieldsRegExp = new RegExp(fieldsPattern,"mg");
	var fields = [];
	var lastMatch = 0;
	var match = fieldsRegExp.exec(customFields);
	while(match && match.index == lastMatch) {
		fields.push({field: match[1], value: match[2]});
		lastMatch = match.index + match[0].length;
		fieldsRegExp.lastIndex = lastMatch;
		match = fieldsRegExp.exec(customFields);
	}
	var w = document.createElement("div");
	w.style.display = "none";
	place.appendChild(w);
	for(var t=0; t<fields.length; t++) {
		var e = document.createElement("input");
		e.setAttribute("type","text");
		e.setAttribute("value",fields[t].value);
		w.appendChild(e);
		e.setAttribute("edit",fields[t].field);
	}
};

//# Refresh all tiddlers in the Story
Story.prototype.refreshAllTiddlers = function() 
{
	var place = document.getElementById(this.container);
	var e = place.firstChild;
	if(!e)
		return;
	this.refreshTiddler(e.getAttribute("tiddler"),e.getAttribute("template"),true);
	while((e = e.nextSibling) != null) 
		this.refreshTiddler(e.getAttribute("tiddler"),e.getAttribute("template"),true);
};

//# Default tiddler onmouseover/out event handlers
Story.prototype.onTiddlerMouseOver = function(e)
{
	if(window.addClass instanceof Function)
		addClass(this,"selected");
};

Story.prototype.onTiddlerMouseOut = function(e)
{
	if(window.removeClass instanceof Function)
		removeClass(this,"selected");
};

//# Default tiddler ondblclick event handler
Story.prototype.onTiddlerDblClick = function(e)
{
	if(!e) var e = window.event;
	var theTarget = resolveTarget(e);
	if(theTarget && theTarget.nodeName.toLowerCase() != "input" && theTarget.nodeName.toLowerCase() != "textarea") {
		if(document.selection && document.selection.empty)
			document.selection.empty();
		config.macros.toolbar.invokeCommand(this,"defaultCommand",e);
		e.cancelBubble = true;
		if(e.stopPropagation) e.stopPropagation();
		return true;
	} else {
		return false;
	}
};

Story.prototype.onTiddlerKeyPress = function(e)
{
	if(!e) var e = window.event;
	clearMessage();
	var consume = false; 
	var title = this.getAttribute("tiddler");
	var target = resolveTarget(e);
	switch(e.keyCode) {
		case 9: // Tab
			if(config.options.chkInsertTabs && target.tagName.toLowerCase() == "textarea") {
				replaceSelection(target,String.fromCharCode(9));
				consume = true; 
			}
			if(config.isOpera) {
				target.onblur = function() {
					this.focus();
					this.onblur = null;
				};
			}
			break;
		case 13: // Ctrl-Enter
		case 10: // Ctrl-Enter on IE PC
		case 77: // Ctrl-Enter is "M" on some platforms
			if(e.ctrlKey) {
				blurElement(this);
				config.macros.toolbar.invokeCommand(this,"defaultCommand",e);
				consume = true;
			}
			break; 
		case 27: // Escape
			blurElement(this);
			config.macros.toolbar.invokeCommand(this,"cancelCommand",e);
			consume = true;
			break;
	}
	e.cancelBubble = consume;
	if(consume) {
		if(e.stopPropagation) e.stopPropagation(); // Stop Propagation
		e.returnValue = true; // Cancel The Event in IE
		if(e.preventDefault ) e.preventDefault(); // Cancel The Event in Moz
	}
	return !consume;
};

//# Returns the specified field (input or textarea element) in a tiddler, otherwise the first edit field it finds
//# or null if it found no edit field at all
Story.prototype.getTiddlerField = function(title,field)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	var e = null;
	if(tiddlerElem != null) {
		var children = tiddlerElem.getElementsByTagName("*");
		for(var t=0; t<children.length; t++) {
			var c = children[t];
			if(c.tagName.toLowerCase() == "input" || c.tagName.toLowerCase() == "textarea") {
				if(!e)
					e = c;
				if(c.getAttribute("edit") == field)
					e = c;
			}
		}
	}
	return e;
};

//# Focus a specified tiddler. Attempts to focus the specified field, otherwise the first edit field it finds
Story.prototype.focusTiddler = function(title,field)
{
	var e = this.getTiddlerField(title,field);
	if(e) {
		e.focus();
		e.select();
	}
};

//# Ensures that a specified tiddler does not have the focus
Story.prototype.blurTiddler = function(title)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null && tiddlerElem.focus && tiddlerElem.blur) {
		tiddlerElem.focus();
		tiddlerElem.blur();
	}
};

//# Adds a specified value to the edit controls (if any) of a particular
//# array-formatted field of a particular tiddler (eg "tags")
//#  title - name of tiddler
//#  tag - value of field, without any [[brackets]]
//#  mode - +1 to add the tag, -1 to remove it, 0 to toggle it
//#  field - name of field (eg "tags")
Story.prototype.setTiddlerField = function(title,tag,mode,field)
{
	var c = story.getTiddlerField(title,field);

	var tags = c.value.readBracketedList();
	tags.setItem(tag,mode);
	c.value = String.encodeTiddlyLinkList(tags);
};

//# The same as setTiddlerField but preset to the "tags" field
Story.prototype.setTiddlerTag = function(title,tag,mode)
{
	Story.prototype.setTiddlerField(title,tag,mode,"tags");
};

//# Close a specified tiddler
//# title - name of tiddler to close
//# animate - whether to perform animations
//# slowly - whether to perform animations in slomo
Story.prototype.closeTiddler = function(title,animate,slowly)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null) {
		clearMessage();
		this.scrubTiddler(tiddlerElem);
		if(config.options.chkAnimate && animate && anim && typeof Slider == "function")
			anim.startAnimating(new Slider(tiddlerElem,false,slowly,"all"));
		else
			tiddlerElem.parentNode.removeChild(tiddlerElem);
	}
};

//# Scrub IDs from a tiddler. This is so that the 'ghost' of a tiddler while it is being closed
//# does not interfere with things
//# tiddler - reference to the tiddler element
Story.prototype.scrubTiddler = function(tiddlerElem)
{
	tiddlerElem.id = null;
};

//# Set the 'dirty' flag of a tiddler
//# title - title of tiddler to change
//# dirty - new boolean status of flag
Story.prototype.setDirty = function(title,dirty)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null)
		tiddlerElem.setAttribute("dirty",dirty ? "true" : "false");
};

//# Is a particular tiddler dirty (with unsaved changes)?
Story.prototype.isDirty = function(title)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null)
		return tiddlerElem.getAttribute("dirty") == "true";
	return null;
};

//# Determine whether any open tiddler are dirty
Story.prototype.areAnyDirty = function()
{
	var r = false;
	this.forEachTiddler(function(title,element) {
		if(this.isDirty(title))
			r = true;
	});
	return r;
};

//# Close all tiddlers in the story
Story.prototype.closeAllTiddlers = function(exclude)
{
	clearMessage();
	this.forEachTiddler(function(title,element) {
		if((title != exclude) && element.getAttribute("dirty") != "true")
			this.closeTiddler(title);
	});
	window.scrollTo(0,ensureVisible(this.container));
};

//# Check if there are any tiddlers in the story
Story.prototype.isEmpty = function()
{
	var place = document.getElementById(this.container);
	return place && place.firstChild == null;
};

//# Perform a search and display the result
//# text - text to search for
//# useCaseSensitive - true for case sensitive matching
//# useRegExp - true to interpret text as a RegExp
Story.prototype.search = function(text,useCaseSensitive,useRegExp)
{
	this.closeAllTiddlers();
	highlightHack = new RegExp(useRegExp ?	 text : text.escapeRegExp(),useCaseSensitive ? "mg" : "img");
	var matches = store.search(highlightHack,"title","excludeSearch");
	var titles = [];
	for(var t=0;t<matches.length;t++)
		titles.push(matches[t].title);
	this.displayTiddlers(null,titles);
	highlightHack = null;
	var q = useRegExp ? "/" : "'";
	if(matches.length > 0)
		displayMessage(config.macros.search.successMsg.format([titles.length.toString(),q + text + q]));
	else
		displayMessage(config.macros.search.failureMsg.format([q + text + q]));
};

//# Determine if the specified element is within a tiddler in this story
//# e - reference to an element
//# returns: reference to a tiddler element or null if none
Story.prototype.findContainingTiddler = function(e)
{
	while(e && !hasClass(e,"tiddler"))
		e = e.parentNode;
	return e;
};

//# Gather any saveable fields from a tiddler element
//# e - reference to an element to scan recursively
//# fields - object to contain gathered field values
Story.prototype.gatherSaveFields = function(e,fields)
{
	if(e && e.getAttribute) {
		var f = e.getAttribute("edit");
		if(f)
			fields[f] = e.value.replace(/\r/mg,"");
		if(e.hasChildNodes()) {
			var c = e.childNodes;
			for(var t=0; t<c.length; t++)
				this.gatherSaveFields(c[t],fields);
		}
	}
};

//# Determine whether a tiddler has any edit fields, and if so if their values have been changed
//# title - name of tiddler
Story.prototype.hasChanges = function(title)
{
	var e = document.getElementById(this.idPrefix + title);
	if(e != null) {
		var fields = {};
		this.gatherSaveFields(e,fields);
		var tiddler = store.fetchTiddler(title);
		if(!tiddler)
			return false;
		for(var n in fields) {
			if(store.getValue(title,n) != fields[n])
				return true;
		}
	}
	return false;
};

//# Save any open edit fields of a tiddler and updates the display as necessary
//# title - name of tiddler
//# minorUpdate - true if the modified date shouldn't be updated
//# returns: title of saved tiddler, or null if not saved
Story.prototype.saveTiddler = function(title,minorUpdate)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null) {
		var fields = {};
		this.gatherSaveFields(tiddlerElem,fields);
		var newTitle = fields.title ? fields.title : title;
		if(store.tiddlerExists(newTitle) && newTitle != title) {
			if(!confirm(config.messages.overwriteWarning.format([newTitle.toString()])))
				return null;
		}
		if(newTitle != title)
			this.closeTiddler(newTitle,false,false);
		tiddlerElem.id = this.idPrefix + newTitle;
		tiddlerElem.setAttribute("tiddler",newTitle);
		tiddlerElem.setAttribute("template",DEFAULT_VIEW_TEMPLATE);
		tiddlerElem.setAttribute("dirty","false");
		if(config.options.chkForceMinorUpdate)
			minorUpdate = !minorUpdate;
		var newDate = new Date();
		var tiddler = store.saveTiddler(title,newTitle,fields.text,config.options.txtUserName,minorUpdate ? undefined : newDate,fields.tags);
		store.suspendNotifications();
		for(var n in fields) {
			if(!TiddlyWiki.isStandardField(n))
				store.setValue(newTitle,n,fields[n]);
		store.resumeNotifications();
		}
		if(config.options.chkAutoSave)
			saveChanges(null,[tiddler]);
		return newTitle;
	}
	return null;
};

Story.prototype.permaView = function()
{
	var links = [];
	this.forEachTiddler(function(title,element) {
		links.push(String.encodeTiddlyLink(title));
	});
	var t = encodeURIComponent(links.join(" "));
	if(t == "")
		t = "#";
	if(window.location.hash != t)
		window.location.hash = t;
};

