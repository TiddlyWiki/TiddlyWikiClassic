//--
//-- Story functions
//--

// A story is a HTML div containing a sequence of tiddlers that can be manipulated
//  container - id of containing element
//  idPrefix - string prefix prepended to title to make ids for tiddlers in this story
function Story(containerId, idPrefix) {
	this.container = containerId;
	this.idPrefix = idPrefix;
	this.highlightRegExp = null;
	//# should be getTiddlerId and getContainerId, respectively
	this.tiddlerId = function(title) {
		var validId = title.replace(/_/g, "__").replace(/ /g, "_");
		var id = this.idPrefix + validId;
		return id == this.container ? this.idPrefix + "_" + validId : id;
	};
	this.containerId = function() {
		return this.container;
	};
}

//# get tiddler element
Story.prototype.getTiddler = function(title) {
	return document.getElementById(this.tiddlerId(title));
};

Story.prototype.getContainer = function() {
	return document.getElementById(this.containerId());
};

//# For each tiddler currently opened in a story, call
//#  handleTiddler - function with arguments:
//#       tiddlerTitle - title of the tiddler
//#       element - reference to tiddler display element
Story.prototype.forEachTiddler = function(handleTiddler) {
	var place = this.getContainer();
	if(!place) return;
	var el = place.firstChild;
	while(el) {
		var next = el.nextSibling;
		var title = el.getAttribute("tiddler");
		if(title) {
			handleTiddler.call(this, title, el);
		}
		el = next;
	}
};

//# Display a given tiddler with a given template. If the tiddler is already displayed but with a different
//# template, it is switched to the specified template. If the tiddler does not exist, and if server hosting
//# custom fields were provided, then an attempt is made to retrieve the tiddler from the server
//#  srcElement - reference to element from which this one is being opened -or-
//#               special positions "top", "bottom"
//#  tiddler - tiddler or title of tiddler to display
//#  template - the name of the tiddler containing the template -or-
//#             one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE -or-
//#             null or undefined to indicate the current template if there is one, DEFAULT_VIEW_TEMPLATE if not
//#  animate - whether to perform animations
//#  customFields - an optional list of name:"value" pairs to be assigned as tiddler fields (for edit templates)
//#  toggle - if true, causes the tiddler to be closed if it is already opened
//#  animationSrc - optional. If provided, this will specify the element which is to act as the start of the animation -or-
//#                 the source of the animation will be the srcElement.
Story.prototype.displayTiddler = function(srcElement, tiddler,
	template, animate, unused, customFields, toggle, animationSrc) {
	var title = (tiddler instanceof Tiddler) ? tiddler.title : tiddler;
	var tiddlerElem = this.getTiddler(title);
	if(tiddlerElem) {
		if(toggle) {
			if(tiddlerElem.getAttribute("dirty") != "true")
				this.closeTiddler(title, true);
		} else {
			this.refreshTiddler(title, template, false, customFields);
		}
	} else {
		var place = this.getContainer();
		var before = this.positionTiddler(srcElement);
		tiddlerElem = this.createTiddler(place, before, title, template, customFields);
	}

	if(animationSrc && typeof animationSrc !== "string") {
		srcElement = animationSrc;
	}
	if(srcElement && typeof srcElement !== "string") {
		if(config.options.chkAnimate && (animate == undefined || animate == true) && anim &&
		   typeof Zoomer == "function" && typeof Scroller == "function")
			anim.startAnimating(new Zoomer(title, srcElement, tiddlerElem), new Scroller(tiddlerElem));
		else
			window.scrollTo(0, ensureVisible(tiddlerElem));
	}
	return tiddlerElem;
};

Story.prototype.displayTiddlers = function(srcElement, titles, template, animate, unused, customFields, toggle) {
	for(var i = titles.length - 1; i >= 0; i--)
		this.displayTiddler(srcElement, titles[i], template, animate, unused, customFields);
};

Story.prototype.displayDefaultTiddlers = function() {
	this.displayTiddlers(null, store.filterTiddlers(store.getTiddlerText("DefaultTiddlers")));
};

//# Figure out the appropriate position for a newly opened tiddler
//#  srcElement - reference to the element containing the link to the tiddler -or-
//#               special positions "top", "bottom"
//#  returns - reference to the tiddler that the new one should appear before (null for the bottom of the story)
Story.prototype.positionTiddler = function(srcElement) {
	var place = this.getContainer();
	var before = null;
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
		if(after == null) {
			before = place.firstChild;
		} else if(after.nextSibling) {
			before = after.nextSibling;
			if(before.nodeType != 1)
				before = null;
		}
	}
	return before;
};

//# Create a tiddler frame at the appropriate place in a story column.
//# If the tiddler doesn't exist, trigger an attempt to load it as a missing tiddler.
//#  place - reference to parent element
//#  before - null, or reference to element before which to insert new tiddler
//#  title - title of new tiddler
//#  template - the name of the tiddler containing the template or one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE
//#  customFields - an optional list of name:"value" pairs to be assigned as tiddler fields
Story.prototype.createTiddler = function(place, before, title, template, customFields) {
	var tiddlerElem = createTiddlyElement(null, "div", this.tiddlerId(title), "tiddler");
	tiddlerElem.setAttribute("refresh", "tiddler");
	if(customFields)
		tiddlerElem.setAttribute("tiddlyFields", customFields);
	place.insertBefore(tiddlerElem, before);
	var defaultText = null;
	if(!store.tiddlerExists(title) && !store.isShadowTiddler(title))
		defaultText = this.loadMissingTiddler(title, customFields);
	this.refreshTiddler(title, template, false, customFields, defaultText);
	return tiddlerElem;
};

//# Attempts to load a missing tiddler from the server specified in the custom fields
//#  title - title of the missing tiddler
//#  fields - string of name:"value" pairs or hashmap
//#  callback - optional function invoked with context argument upon completion; context provides context.tiddler if successful
Story.prototype.loadMissingTiddler = function(title, fields, callback) {
	var tiddler = new Tiddler(title);
	tiddler.fields = typeof fields == "string" ? fields.decodeHashMap() : fields || {};
	var context = { serverType: tiddler.getServerType() };
	if(!context.serverType) return "";
	context.host = tiddler.fields['server.host'];
	context.workspace = tiddler.fields['server.workspace'];
	var adaptor = new config.adaptors[context.serverType]();

	var onLoadTiddlerResponse = function(context) {
		if(context.status) {
			var t = context.tiddler;
			t.created  = t.created  || new Date();
			t.modified = t.modified || t.created;
			var dirty = store.isDirty();
			context.tiddler = store.saveTiddler(t.title, t.title, t.text, t.modifier, t.modified,
				t.tags, t.fields, true, t.created, t.creator);
			if(!window.allowSave())
				store.setDirty(dirty);
			autoSaveChanges();
		} else {
			story.refreshTiddler(context.title, null, true);
		}
		context.adaptor.close();
		if(callback) callback(context);
	};
	adaptor.getTiddler(title, context, null, onLoadTiddlerResponse);
	return config.messages.loadingMissingTiddler.format([title, context.serverType, context.host, context.workspace]);
};

//# Overridable for choosing the name of the template to apply for a tiddler
Story.prototype.chooseTemplateForTiddler = function(title, template) {
	if(!template)
		template = DEFAULT_VIEW_TEMPLATE;
	if(template == DEFAULT_VIEW_TEMPLATE || template == DEFAULT_EDIT_TEMPLATE)
		template = config.tiddlerTemplates[template];
	return template;
};

//# Overridable for extracting the text of a template from a tiddler
Story.prototype.getTemplateForTiddler = function(title, template, tiddler) {
	return store.getRecursiveTiddlerText(template, null, 10);
};

//# Apply a template to an existing tiddler if it is not already displayed using that template
//#  title - title of tiddler to update
//#  template - the name of the tiddler containing the template or one of the constants DEFAULT_VIEW_TEMPLATE and DEFAULT_EDIT_TEMPLATE
//#  force - if true, forces the refresh even if the template hasn't changed
//#  customFields - an optional list of name/value pairs to be assigned as tiddler fields (for edit templates)
//#  defaultText - an optional string to replace the default text for non-existent tiddlers
Story.prototype.refreshTiddler = function(title, template, force, customFields, defaultText) {
	var tiddlerElem = this.getTiddler(title);
	if(!tiddlerElem) return null;

	if(tiddlerElem.getAttribute("dirty") == "true" && !force)
		return tiddlerElem;
	template = this.chooseTemplateForTiddler(title, template);
	var currTemplate = tiddlerElem.getAttribute("template");
	if((template == currTemplate) && !force)
		return tiddlerElem;

	var tiddler = store.getTiddler(title);
	if(!tiddler) {
		tiddler = new Tiddler();
		if(store.isShadowTiddler(title)) {
			var tags = [];
			tiddler.set(title, store.getTiddlerText(title),
				config.views.wikified.shadowModifier, version.date, tags, version.date);
		} else {
			var text = template == config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE] // #166
				? config.views.editor.defaultText.format([title])
				: config.views.wikified.defaultText.format([title]);
			text = defaultText || text;
			var fields = customFields ? customFields.decodeHashMap() : null;
			tiddler.set(title, text, config.views.wikified.defaultModifier, version.date, [], version.date, fields);
		}
	}

	tiddlerElem.setAttribute("tags", tiddler.tags.join(" "));
	tiddlerElem.setAttribute("tiddler", title);
	tiddlerElem.setAttribute("template", template);
	tiddlerElem.onmouseover = this.onTiddlerMouseOver;
	tiddlerElem.onmouseout = this.onTiddlerMouseOut;
	tiddlerElem.ondblclick = this.onTiddlerDblClick;
	tiddlerElem[window.event ? "onkeydown" : "onkeypress"] = this.onTiddlerKeyPress;
	tiddlerElem.innerHTML = this.getTemplateForTiddler(title, template, tiddler);
	applyHtmlMacros(tiddlerElem, tiddler);
	if(store.getTaggedTiddlers(title).length > 0)
		jQuery(tiddlerElem).addClass("isTag");
	else
		jQuery(tiddlerElem).removeClass("isTag");
	if(store.tiddlerExists(title)) {
		jQuery(tiddlerElem).removeClass("shadow");
		jQuery(tiddlerElem).removeClass("missing");
	} else {
		jQuery(tiddlerElem).addClass(store.isShadowTiddler(title) ? "shadow" : "missing");
	}
	if(customFields)
		this.addCustomFields(tiddlerElem, customFields);

	return tiddlerElem;
};

//# Add hidden input elements for the custom fields of a tiddler
Story.prototype.addCustomFields = function(place, customFields) {
	var fields = customFields.decodeHashMap();
	var container = createTiddlyElement(place, "div", null, "customFields");
	container.style.display = "none";
	for(var fieldName in fields) {
		var input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("value", fields[fieldName]);
		container.appendChild(input);
		input.setAttribute("edit", fieldName);
	}
};

Story.prototype.refreshAllTiddlers = function(force) {
	this.forEachTiddler(function(title, element) {
		var template = element.getAttribute("template");
		if(template && element.getAttribute("dirty") != "true") {
			this.refreshTiddler(title, force ? null : template, true);
		}
	});
};

Story.prototype.onTiddlerMouseOver = function() {
	jQuery(this).addClass("selected");
};

Story.prototype.onTiddlerMouseOut = function() {
	jQuery(this).removeClass("selected");
};

Story.prototype.onTiddlerDblClick = function(ev) {
	var e = ev || window.event;
	var target = resolveTarget(e);
	if(!target || target.nodeName.toLowerCase() == "input" || target.nodeName.toLowerCase() == "textarea")
		return false;
	if(document.selection && document.selection.empty)
		document.selection.empty();
	config.macros.toolbar.invokeCommand(this, "defaultCommand", e);
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return true;
};

Story.prototype.onTiddlerKeyPress = function(ev) {
	var e = ev || window.event;
	clearMessage();
	var consume = false;
	var title = this.getAttribute("tiddler");
	var target = resolveTarget(e);
	switch(e.keyCode) {
		case 9: // Tab
			var editor = story.getTiddlerField(title, "text");
			if(target.tagName.toLowerCase() == "input"
			   && editor.value == config.views.editor.defaultText.format([title])) {
				// moving from input field and editor still contains default text, so select it
				editor.focus();
				editor.select();
				consume = true;
			}
			if(config.options.chkInsertTabs && !e.ctrlKey && target.tagName.toLowerCase() == "textarea") {
				replaceSelection(target, String.fromCharCode(9));
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
				config.macros.toolbar.invokeCommand(this, "defaultCommand", e);
				consume = true;
			}
			break;
		case 27: // Escape
			blurElement(this);
			config.macros.toolbar.invokeCommand(this, "cancelCommand", e);
			consume = true;
			break;
	}
	e.cancelBubble = consume;
	if(consume) {
		if(e.stopPropagation) e.stopPropagation(); // Stop Propagation
		e.returnValue = true; // Cancel The Event in IE
		if(e.preventDefault) e.preventDefault(); // Cancel The Event in Moz
	}
	return !consume;
};

//# Returns the specified field (input or textarea element) in a tiddler, otherwise the first edit field it finds
//# or null if it found no edit field at all
Story.prototype.getTiddlerField = function(title, field) {
	var tiddlerElem = this.getTiddler(title);
	if(!tiddlerElem) return null;

	var $editors = jQuery(tiddlerElem).find('input, textarea');
	return $editors.filter('[edit="' + field + '"]')[0] || $editors[0] || null;
};

//# Focus a specified tiddler. Attempts to focus the specified field, otherwise the first edit field it finds
Story.prototype.focusTiddler = function(title, field) {
	var e = this.getTiddlerField(title, field);
	if(e) {
		e.focus();
		e.select();
	}
};

//# Ensures that a specified tiddler does not have the focus
Story.prototype.blurTiddler = function(title) {
	var tiddlerElem = this.getTiddler(title);
	if(tiddlerElem && tiddlerElem.focus && tiddlerElem.blur) {
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
Story.prototype.setTiddlerField = function(title, tag, mode, field) {
	var editor = this.getTiddlerField(title, field);
	var tags = editor.value.readBracketedList();

	var i = tags.indexOf(tag);
	if(mode == 0) mode = (i == -1) ? +1 : -1;
	if(mode == +1) {
		if(i == -1) tags.push(tag);
	} else if(mode == -1) {
		if(i != -1) tags.splice(i, 1);
	}

	editor.value = String.encodeTiddlyLinkList(tags);
};

Story.prototype.setTiddlerTag = function(title, tag, mode) {
	this.setTiddlerField(title, tag, mode, "tags");
};

Story.prototype.closeTiddler = function(title, shouldAnimate, unused) {
	var tiddlerElem = this.getTiddler(title);
	if(!tiddlerElem) return;

	clearMessage();
	this.scrubTiddler(tiddlerElem);
	if(config.options.chkAnimate && shouldAnimate && anim && typeof Slider == "function") {
		anim.startAnimating(new Slider(tiddlerElem, false, null, "all"));
	} else {
		jQuery(tiddlerElem).remove();
	}
};

//# Scrub IDs from a tiddler. This is so that the 'ghost' of a tiddler while it is being closed
//# does not interfere with things
Story.prototype.scrubTiddler = function(tiddlerElement) {
	tiddlerElement.id = null;
};

// 'dirty' flag attribute is used on tiddlers to mark those having unsaved changes

//# Set the 'dirty' flag of a tiddler
//#  title - title of tiddler to change
//#  dirty - new boolean status of flag
Story.prototype.setDirty = function(title, dirty) {
	var tiddlerElem = this.getTiddler(title);
	if(tiddlerElem)
		tiddlerElem.setAttribute("dirty", dirty ? "true" : "false");
};

Story.prototype.isDirty = function(title) {
	var tiddlerElem = this.getTiddler(title);
	if(!tiddlerElem) return null;
	return tiddlerElem.getAttribute("dirty") == "true";
};

Story.prototype.areAnyDirty = function() {
	var r = false;
	this.forEachTiddler(function(title, element) {
		if(this.isDirty(title))
			r = true;
	});
	return r;
};

Story.prototype.closeAllTiddlers = function(exclude) {
	clearMessage();
	this.forEachTiddler(function(title, element) {
		if((title != exclude) && element.getAttribute("dirty") != "true")
			this.closeTiddler(title);
	});
	window.scrollTo(0, ensureVisible(this.container));
};

//# Check if there are any tiddlers in the story
Story.prototype.isEmpty = function() {
	var place = this.getContainer();
	return place && place.firstChild == null;
};

//# Perform a search and display the result
//#  text - text to search for
//#  useCaseSensitive - true for case sensitive matching
//#  useRegExp - true to interpret text as a RegExp
Story.prototype.search = function(text, useCaseSensitive, useRegExp) {
	this.closeAllTiddlers();
	highlightHack = new RegExp(useRegExp ? text : text.escapeRegExp(), useCaseSensitive ? "mg" : "img");
	var matches = store.search(highlightHack, "title", "excludeSearch");
	this.displayTiddlers(null, matches);
	highlightHack = null;
	var q = useRegExp ? "/" : "'";
	if(matches.length > 0)
		displayMessage(config.macros.search.successMsg.format([matches.length.toString(), q + text + q]));
	else
		displayMessage(config.macros.search.failureMsg.format([q + text + q]));
};

//# Determine if the specified element (el) is within a tiddler element
//# returns: reference to a tiddler element or null if none
Story.prototype.findContainingTiddler = function(el) {
	while(el && !jQuery(el).hasClass("tiddler")) {
		el = jQuery(el).hasClass("popup") && Popup.stack[0] ? Popup.stack[0].root
			: el.parentNode;
	}
	return el;
};

//# Gather any saveable fields from a tiddler element
//#  el - reference to an element to scan recursively
//#  fields - object to contain gathered field values
Story.prototype.gatherSaveFields = function(el, fields) {
	if(!el || !el.getAttribute) return;
	var fieldName = el.getAttribute("edit");
	if(fieldName)
		fields[fieldName] = el.value.replace(/\r/mg, "");
	if(el.hasChildNodes()) {
		for(var i = 0; i < el.childNodes.length; i++)
			this.gatherSaveFields(el.childNodes[i], fields);
	}
};

//# Determine whether a tiddler has any edit fields with changed values
//#  title - name of tiddler
Story.prototype.hasChanges = function(title) {
	var tiddlerElement = this.getTiddler(title);
	if(!tiddlerElement) return false;

	var fields = {};
	this.gatherSaveFields(tiddlerElement, fields);
	if(store.fetchTiddler(title)) {
		for(var fieldName in fields) {
			if(store.getValue(title, fieldName) != fields[fieldName])
				return true;
		}
		return false;
	}
	if(store.isShadowTiddler(title)) {
		// not checking for title or tags
		return store.getShadowTiddlerText(title) != fields.text;
	}
	// new tiddler
	return true;
};

//# Save any open edit fields of a tiddler and updates the display as necessary
//#  title - name of tiddler
//#  minorUpdate - true if the modified date shouldn't be updated
//# returns: title of saved tiddler, or null if not saved
Story.prototype.saveTiddler = function(title, minorUpdate) {
	var tiddlerElem = this.getTiddler(title);
	if(!tiddlerElem) return null;

	var fields = {};
	this.gatherSaveFields(tiddlerElem, fields);
	var newTitle = fields.title || title;
	if(!store.tiddlerExists(newTitle)) {
		newTitle = newTitle.trim();
		var creator = config.options.txtUserName;
	}
	if(store.tiddlerExists(newTitle) && newTitle != title) {
		if(!confirm(config.messages.overwriteWarning.format([newTitle.toString()])))
			return null;
	}
	if(newTitle != title)
		this.closeTiddler(newTitle, false);
	tiddlerElem.id = this.tiddlerId(newTitle);
	tiddlerElem.setAttribute("tiddler", newTitle);
	tiddlerElem.setAttribute("template", DEFAULT_VIEW_TEMPLATE);
	tiddlerElem.setAttribute("dirty", "false");
	if(config.options.chkForceMinorUpdate)
		minorUpdate = !minorUpdate;
	if(!store.tiddlerExists(newTitle))
		minorUpdate = false;
	if(store.tiddlerExists(title)) {
		var t = store.fetchTiddler(title);
		var extendedFields = t.fields;
		creator = t.creator;
	} else {
		extendedFields = merge({}, config.defaultCustomFields);
	}
	for(var n in fields) {
		if(!TiddlyWiki.isStandardField(n))
			extendedFields[n] = fields[n];
	}
	var tiddler = store.saveTiddler(title, newTitle, fields.text, minorUpdate ? undefined : config.options.txtUserName,
		minorUpdate ? undefined : new Date(), fields.tags, extendedFields, null, null, creator);
	autoSaveChanges(null, [tiddler]);
	return newTitle;
};

Story.prototype.getPermaViewHash = function(titles) {
	return '#' + encodeURIComponent(String.encodeTiddlyLinkList(titles));
};

Story.prototype.permaView = function() {
	var titles = [];
	this.forEachTiddler(function(title, element) {
		titles.push(title);
	});
	var hash = this.getPermaViewHash(titles);
	if(window.location.hash != hash)
		window.location.hash = hash;
};

Story.prototype.switchTheme = function(theme) {
	if(safeMode) return;

	var getSlice = function(theme, slice) {
		var r;
		if(readOnly)
			r = store.getTiddlerSlice(theme, slice + "ReadOnly") || store.getTiddlerSlice(theme, "Web" + slice);
		r = r || store.getTiddlerSlice(theme, slice);
		if(r && r.indexOf(config.textPrimitives.sectionSeparator) == 0)
			r = theme + r;
		return store.isAvailable(r) ? r : slice;
	};

	var replaceNotification = function(i, name, theme, slice) {
		var newName = getSlice(theme, slice);
		if(name != newName && store.namedNotifications[i].name == name) {
			store.namedNotifications[i].name = newName;
			return newName;
		}
		return name;
	};

	var pt = config.refresherData.pageTemplate;
	var vi = DEFAULT_VIEW_TEMPLATE;
	var vt = config.tiddlerTemplates[vi];
	var ei = DEFAULT_EDIT_TEMPLATE;
	var et = config.tiddlerTemplates[ei];

	for(var i = 0; i < config.notifyTiddlers.length; i++) {
		var name = config.notifyTiddlers[i].name;
		switch(name) {
			case "PageTemplate":
				config.refresherData.pageTemplate = replaceNotification(i, config.refresherData.pageTemplate, theme, name);
				break;
			case "StyleSheet":
				removeStyleSheet(config.refresherData.styleSheet);
				config.refresherData.styleSheet = replaceNotification(i, config.refresherData.styleSheet, theme, name);
				break;
			case "ColorPalette":
				config.refresherData.colorPalette = replaceNotification(i, config.refresherData.colorPalette, theme, name);
				break;
			default:
				break;
		}
	}
	config.tiddlerTemplates[vi] = getSlice(theme, "ViewTemplate");
	config.tiddlerTemplates[ei] = getSlice(theme, "EditTemplate");
	if(!startingUp) {
		if(config.refresherData.pageTemplate != pt || config.tiddlerTemplates[vi] != vt
		   || config.tiddlerTemplates[ei] != et) {
			refreshAll();
			this.refreshAllTiddlers(true);
		} else {
			setStylesheet(store.getRecursiveTiddlerText(config.refresherData.styleSheet, "", 10),
				config.refreshers.styleSheet);
		}
		config.options.txtTheme = theme;
		saveOption("txtTheme");
	}
};

