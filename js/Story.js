// ---------------------------------------------------------------------------------
// Story functions
// ---------------------------------------------------------------------------------

// A story is a HTML div containing a sequence of tiddlers that can be manipulated
// container - id of containing element
// idPrefix - string prefix prepended to title to make ids for tiddlers in this story
function Story(container,idPrefix)
{
	this.container = container;
	this.idPrefix = idPrefix;
	this.highlightRegExp = null;
}

// Iterate through all the tiddlers in a story
// fn - callback function to be called for each tiddler. Arguments are:
//		tiddler - reference to Tiddler object
//		element - reference to tiddler display element
Story.prototype.forEachTiddler = function(fn)
{
	var place = document.getElementById(this.container);
	if(!place)
		return;
	var e = place.firstChild;
	while(e)
		{
		var n = e.nextSibling;
		var title = e.getAttribute("tiddler");
		fn.call(this,title,e);
		e = n;
		}
}

// Display several tiddlers given their titles in an array. Parameters same as displayTiddler(), except:
// titles - array of string titles
Story.prototype.displayTiddlers = function(srcElement,titles,template,animate,slowly)
{
	for(var t = titles.length-1;t>=0;t--)
		this.displayTiddler(srcElement,titles[t],template,animate,slowly);
}

// Display a given tiddler with a given template. If the tiddler is already displayed but with a different
// template, it is switched to the specified template
// srcElement - reference to element from which this one is being opened -or-
//              special positions "top", "bottom"
// title - title of tiddler to display
// template - the name of the tiddler containing the template -or-
//			  one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE -or-
//			  null or undefined to indicate the current template if there is one, DEFAULT_VIEW_TEMPLATE if not
// animate - whether to perform animations
// slowly - whether to perform animations in slomo
Story.prototype.displayTiddler = function(srcElement,title,template,animate,slowly)
{
	var place = document.getElementById(this.container);
	var theTiddler = document.getElementById(this.idPrefix + title);
	if(theTiddler)
		this.refreshTiddler(title,template);
	else
		{
		var before = this.positionTiddler(srcElement);
		theTiddler = this.createTiddler(place,before,title,template);
		}
	if(srcElement && typeof srcElement !== "string")
		{
		if(config.options.chkAnimate && (animate == undefined || animate == true))
			anim.startAnimating(new Cascade(title,srcElement,theTiddler,slowly),new Scroller(theTiddler,slowly));
		else
			window.scrollTo(0,ensureVisible(theTiddler));
		}
}

// Figure out the appropriate position for a newly opened tiddler
// srcElement - reference to the element containing the link to the tiddler -or-
//              special positions "top", "bottom"
// returns - reference to the tiddler that the new one should appear before (null for the bottom of the story)
Story.prototype.positionTiddler = function(srcElement)
{
	var place = document.getElementById(this.container);
	var before;
	if(typeof srcElement == "string")
		{
		switch(srcElement)
			{
			case "top":
				before = place.firstChild;
				break;
			case "bottom":
				before = null;
				break;
			}
		}
	else
		{
		var after = this.findContainingTiddler(srcElement);
		if(after == null)
			before = place.firstChild;
		else if(after.nextSibling)
			before = after.nextSibling;
		else
			before = null;
		}
	return before;
}

// Create a tiddler frame at the appropriate place in a story column
// place - reference to parent element
// before - null, or reference to element before which to insert new tiddler
// title - title of new tiddler
// template - the name of the tiddler containing the template or one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE
Story.prototype.createTiddler = function(place,before,title,template)
{
	var theTiddler = createTiddlyElement(null,"div",this.idPrefix + title,"tiddler");
	theTiddler.setAttribute("refresh","tiddler");
	place.insertBefore(theTiddler,before);
	this.refreshTiddler(title,template);
	return theTiddler;
}

// Overridable for choosing the name of the template to apply for a tiddler
Story.prototype.chooseTemplateForTiddler = function(title,template)
{
	if(!template)
		template = DEFAULT_VIEW_TEMPLATE;
	if(template == DEFAULT_VIEW_TEMPLATE || template == DEFAULT_EDIT_TEMPLATE)
		template = config.tiddlerTemplates[template];
	return template;
}

// Overridable for extracting the text of a template from a tiddler
Story.prototype.getTemplateForTiddler = function(title,template,tiddler)
{
	return store.getRecursiveTiddlerText(template,null,10);
}

// Apply a template to an existing tiddler if it is not already displayed using that template
// title - title of tiddler to update
// template - the name of the tiddler containing the template or one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE
// force - if true, forces the refresh even if the template hasn't changedd
Story.prototype.refreshTiddler = function(title,template,force)
{
	var theTiddler = document.getElementById(this.idPrefix + title);
	if(theTiddler)
		{
		if(theTiddler.getAttribute("dirty") == "true" && !force)
			return theTiddler;
		template = this.chooseTemplateForTiddler(title,template);
		var currTemplate = theTiddler.getAttribute("template");
		if((template != currTemplate) || force)
			{
			var tiddler = store.getTiddler(title);
			if(!tiddler)
				{
				tiddler = new Tiddler();
				if(store.isShadowTiddler(title))
					tiddler.set(title,store.getTiddlerText(title),config.views.wikified.shadowModifier,version.date,[],version.date);
				else
					{
					var text = template=="EditTemplate"
								? config.views.editor.defaultText.format([title])
								: config.views.wikified.defaultText.format([title]);
					tiddler.set(title,text,config.views.wikified.defaultModifier,version.date,[],version.date);
					}
				}
			theTiddler.setAttribute("tags",tiddler.tags.join(" "));
			theTiddler.setAttribute("tiddler",title);
			theTiddler.setAttribute("template",template);
			var me = this;
			theTiddler.onmouseover = this.onTiddlerMouseOver;
			theTiddler.onmouseout = this.onTiddlerMouseOut;
			theTiddler.ondblclick = this.onTiddlerDblClick;
			theTiddler.onkeypress = this.onTiddlerKeyPress;
			var html = this.getTemplateForTiddler(title,template,tiddler);
			theTiddler.innerHTML = html;
			applyHtmlMacros(theTiddler,tiddler);
			if(store.getTaggedTiddlers(title).length > 0)
				addClass(theTiddler,"isTag");
			else
				removeClass(theTiddler,"isTag");
			if(!store.tiddlerExists(title))
				{
				if(store.isShadowTiddler(title))
					addClass(theTiddler,"shadow");
				else
					addClass(theTiddler,"missing");
				}
			else
				{
				removeClass(theTiddler,"shadow");
				removeClass(theTiddler,"missing");
				}
			}
		}
	return theTiddler;
}

// Default tiddler onmouseover/out event handlers
Story.prototype.onTiddlerMouseOver = function(e)
{
	if(window.addClass instanceof Function)
		addClass(this,"selected");
}

Story.prototype.onTiddlerMouseOut = function(e)
{
	if(window.removeClass instanceof Function)
		removeClass(this,"selected");
}

// Default tiddler ondblclick event handler
Story.prototype.onTiddlerDblClick = function(e)
{
	if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
	if(theTarget && theTarget.nodeName.toLowerCase() != "input" && theTarget.nodeName.toLowerCase() != "textarea")
		{
		if(document.selection && document.selection.empty)
			document.selection.empty();
		config.macros.toolbar.invokeCommand(this,"defaultCommand",e);
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return true;
		}
	else
		return false;
}

// Default tiddler onkeypress event handler
Story.prototype.onTiddlerKeyPress = function(e)
{
	if (!e) var e = window.event;
	clearMessage();
	var consume = false;
	var title = this.getAttribute("tiddler");
	var target = resolveTarget(e);
	switch(e.keyCode)
		{
		case 9: // Tab
			if(config.options.chkInsertTabs && (target.tagName.toLowerCase() == "input" || target.tagName.toLowerCase() == "textarea"))
				{
				replaceSelection(resolveTarget(e),String.fromCharCode(9));
				consume = true;
				}
			break;
		case 13: // Ctrl-Enter
		case 10: // Ctrl-Enter on IE PC
		case 77: // Ctrl-Enter is "M" on some platforms
			if(e.ctrlKey)
				{
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
	if(consume)
		if (e.stopPropagation) e.stopPropagation();
	return(!consume);
};

// Returns the specified field (input or textarea element) in a tiddler, otherwise the first edit field it finds
// or null if it found no edit field at all
Story.prototype.getTiddlerField = function(title,field)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	var e = null;
	if(tiddler != null)
		{
		var children = tiddler.getElementsByTagName("*");
		for (var t=0; t<children.length; t++)
			{
			var c = children[t];
			if(c.tagName.toLowerCase() == "input" || c.tagName.toLowerCase() == "textarea")
				{
				if(!e)
					e = c;
				if(c.getAttribute("edit") == field)
					e = c;
				}
			}
		}
	return e;
}

// Focus a specified tiddler. Attempts to focus the specified field, otherwise the first edit field it finds
Story.prototype.focusTiddler = function(title,field)
{
	var e = this.getTiddlerField(title,field);
	if(e)
		{
		e.focus();
		e.select();
		}
}

// Ensures that a specified tiddler does not have the focus
Story.prototype.blurTiddler = function (title)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null && tiddler.focus && tiddler.blur)
		{
		tiddler.focus();
		tiddler.blur();
		}
}

// Adds a specified tag to the edit controls (if any) for a particular tiddler)
// title - name of tiddler
// tag - name of tag, without any [[brackets]]
// mode - +1 to add the tag, -1 to remove it, 0 to toggle it
Story.prototype.setTiddlerTag = function(title,tag,add)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null)
		{
		var children = tiddler.getElementsByTagName("input")
		for (var t=0; t<children.length; t++)
			{
			var c = children[t];
			if(c.tagName.toLowerCase() == "input" && c.getAttribute("edit") == "tags")
				{
				var tags = c.value.readBracketedList();
				var p = tags.find(tag);
				if(add == 0)
				    add = (p == null) ? +1 : -1;
				if(add == +1)
					{
					if(p == null)
						tags.push(tag);
					}
				else if(add == -1)
					{
					if(p != null)
						tags.splice(p,1);
					}
				c.value = String.encodeTiddlyLinkList(tags);
				}
			}
		}
}

// Close a specified tiddler
// title - name of tiddler to close
// animate - whether to perform animations
// slowly - whether to perform animations in slomo
Story.prototype.closeTiddler = function(title,animate,slowly)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null)
		{
		clearMessage();
		this.scrubTiddler(tiddler);
		if(config.options.chkAnimate && animate)
			anim.startAnimating(new Slider(tiddler,false,slowly,"all"));
		else
			tiddler.parentNode.removeChild(tiddler);
		}
}

// Scrub IDs from a tiddler. This is so that the 'ghost' of a tiddler while it is being closed
// does not interfere with things
// tiddler - reference to the tiddler element
Story.prototype.scrubTiddler = function(tiddler)
{
	tiddler.id = null;
}

// Set the 'dirty' flag of a tiddler
// tiddler - title of tiddler to change
// dirty - new boolean status of flag
Story.prototype.setDirty = function(title,dirty)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null)
		tiddler.setAttribute("dirty",dirty ? "true" : "false");
}

// Is a particular tiddler dirty (with unsaved changes)?
Story.prototype.isDirty = function(title)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null)
		return tiddler.getAttribute("dirty") == "true";
	return null;
}

// Close all tiddlers in the story
Story.prototype.closeAllTiddlers = function(exclude)
{
	clearMessage();
	this.forEachTiddler(function(title,element) {
		if((title != exclude) && element.getAttribute("dirty") != "true")
			this.closeTiddler(title);
		});
	window.scrollTo(0,0);
}

// Check if there are any tiddlers in the story
Story.prototype.isEmpty = function()
{
	var place = document.getElementById(this.container);
	return(place && place.firstChild == null);
}

// Perform a search and display the result
// text - text to search for
// useCaseSensitive - true for case sensitive matching
// useRegExp - true to interpret text as a RegExp
Story.prototype.search = function(text,useCaseSensitive,useRegExp)
{
	this.closeAllTiddlers();
	highlightHack = new RegExp(useRegExp ?	 text : text.escapeRegExp(),useCaseSensitive ? "mg" : "img");
	var matches = store.search(highlightHack,"title","excludeSearch");
	var titles = [];
	for(var t=matches.length-1; t>=0; t--)
		titles.push(matches[t].title);
	this.displayTiddlers(null,titles);
	highlightHack = null;
	var q = useRegExp ? "/" : "'";
	if(matches.length > 0)
		displayMessage(config.macros.search.successMsg.format([titles.length.toString(),q + text + q]));
	else
		displayMessage(config.macros.search.failureMsg.format([q + text + q]));
}

// Determine if the specified element is within a tiddler in this story
// e - reference to an element
// returns: reference to a tiddler element or null if none
Story.prototype.findContainingTiddler = function(e)
{
	while(e && !hasClass(e,"tiddler"))
		e = e.parentNode;
	return(e);
}

// Gather any saveable fields from a tiddler element
// e - reference to an element to scan recursively
// fields - object to contain gathered field values
Story.prototype.gatherSaveFields = function(e,fields)
{
	if(e && e.getAttribute)
		{
		var f = e.getAttribute("edit");
		if(f)
			fields[f] = e.value.replace(/\r/mg,"");;
		if(e.hasChildNodes())
			{
			var c = e.childNodes;
			for(var t=0; t<c.length; t++)
				this.gatherSaveFields(c[t],fields)
			}
		}
}

// Determine whether a tiddler has any edit fields, and if so if their values have been changed
// title - name of tiddler
Story.prototype.hasChanges = function(title)
{
	var e = document.getElementById(this.idPrefix + title);
	if(e != null)
		{
		var fields = {};
		this.gatherSaveFields(e,fields);
		var tiddler = store.fetchTiddler(title);
		if (!tiddler)
			return false;
		for(var n in fields)
			if (store.getValue(title,n) != fields[n])
				return true;
		}
	return false;
}

// Save any open edit fields of a tiddler and updates the display as necessary
// title - name of tiddler
// minorUpdate - true if the modified date shouldn't be updated
// returns: title of saved tiddler, or null if not saved
Story.prototype.saveTiddler = function(title,minorUpdate)
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null)
		{
		var fields = {};
		this.gatherSaveFields(tiddler,fields);
		var newTitle = fields.title ? fields.title : title;
		if(store.tiddlerExists(newTitle) && newTitle != title)
			{
			if(confirm(config.messages.overwriteWarning.format([newTitle.toString()])))
				this.closeTiddler(newTitle,false,false);
			else
				return null;
			}
		tiddler.id = this.idPrefix + newTitle;
		tiddler.setAttribute("tiddler",newTitle);
		tiddler.setAttribute("template",DEFAULT_VIEW_TEMPLATE);
		tiddler.setAttribute("dirty","false");
		if(config.options.chkForceMinorUpdate)
			minorUpdate = !minorUpdate;
		var newDate = new Date();
		store.saveTiddler(title,newTitle,fields.text,config.options.txtUserName,minorUpdate ? undefined : newDate,fields.tags);
		for (var n in fields) 
			if (!TiddlyWiki.isStandardField(n))
				store.setValue(newTitle,n,fields[n]);
		if(config.options.chkAutoSave)
			saveChanges();
		return newTitle;
		}
	return null;
}

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
}

