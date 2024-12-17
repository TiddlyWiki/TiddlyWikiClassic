//--
//-- TiddlyWiki-specific utility functions
//--

// Return TiddlyWiki version string
function formatVersion(v) {
	v = v || version;
	return v.major + "." + v.minor + "." + v.revision +
		(v.alpha ? " (alpha " + v.alpha + ")" : "") +
		(v.beta ? " (beta " + v.beta + ")" : "") +
		(v.nightly ? " (nightly " + v.nightly + ")" : "");
}

//# Compare two TiddlyWiki version objects
//# Returns +1 if v2 is later than v1
//#          0 if v2 is the same as v1
//#         -1 if v2 is earlier than v1
//# version without a beta number is later than a version with a beta number
function compareVersions(v1, v2) {
	var x1, x2, i, a = ["major", "minor", "revision"];
	for(i = 0; i < a.length; i++) {
		x1 = v1[a[i]] || 0;
		x2 = v2[a[i]] || 0;
		if(x1 < x2) return +1;
		if(x1 > x2) return -1;
	}
	x1 = v1.beta || Infinity;
	x2 = v2.beta || Infinity;
	return x1 < x2 ? +1 :
	       x1 > x2 ? -1 : 0;
}

function merge(dst, src, preserveExisting) {
	for(var key in src)
		if(!preserveExisting || dst[key] === undefined)
			dst[key] = src[key];

	return dst;
}

// Get the target of an event
function resolveTarget(event) {
	var obj = event.target || event.srcElement;
	// defeat Safari bug
	if(obj.nodeType == 3)
		obj = obj.parentNode;
	return obj;
}

// Return the description of an exception (string)
function exceptionText(ex, prependedMessage) {
	var s = ex.description || ex.toString();
	return prependedMessage ? (prependedMessage + ":\n" + s) : s;
}

// Display an alert of an exception description with optional message
function showException(e, prependedMessage) {
	alert(exceptionText(e, prependedMessage));
}

//# deprecated
function alertAndThrow(m) {
	alert(m);
	throw(m);
}

function glyph(name) {
	var g = config.glyphs;
	if(!g.codes[name]) return "";
	if(g.currBrowser == null) {
		var i = 0;
		while(i < g.browsers.length - 1 && !g.browsers[i]())
			i++;
		g.currBrowser = i;
	}
	return g.codes[name][g.currBrowser];
}

function createTiddlyText(parent, text) {
	return parent.appendChild(document.createTextNode(text));
}

function createTiddlyCheckbox(parent, caption, checked, onChange) {
	var cb = document.createElement("input");
	cb.setAttribute("type", "checkbox");
	cb.onclick = onChange;
	parent.appendChild(cb);
	cb.checked = checked;
	cb.className = "chkOptionInput";
	if(caption)
		wikify(caption, parent);
	return cb;
}

function createTiddlyElement(parent, element, id, className, text, attribs) {
	var n, e = document.createElement(element);
	if(className != null) e.className = className;
	if(       id != null) e.setAttribute('id', id);
	if(     text != null) createTiddlyText(e, text);
	if(attribs) {
		for(n in attribs) e.setAttribute(n, attribs[n]);
	}
	if(parent != null) parent.appendChild(e);
	return e;
}

function createTiddlyButton(parent, text, tooltip, action, className, id, accessKey, customAttributes) {
	var attributes = { href: 'javascript:;' };
	if(tooltip)   attributes.title = tooltip;
	if(accessKey) attributes.accessKey = accessKey;
	merge(attributes, customAttributes || {});

	var btn = createTiddlyElement(parent, 'a', id || null, className || 'button', text, attributes);
	if(action) btn.onclick = action;
	return btn;
}

//# Create a link to an external resource
//#   place - element where the link should be created
//#   url - link target
//#   label - link text (optional)
function createExternalLink(place, url, label) {
	var tooltip = config.messages.externalLinkTooltip;
	var link = createTiddlyElement(place, 'a', null, 'externalLink', label, {
		href: url,
		title: tooltip ? tooltip.format([url]) : url
	});
	if(config.options.chkOpenInNewWindow)
		link.target = "_blank";
	return link;
}

function getTiddlyLinkInfo(title, currClasses) {
	var classes = currClasses ? currClasses.split(" ") : [];
	classes.pushUnique("tiddlyLink");
	var tiddler = store.fetchTiddler(title);
	var subTitle;
	if(tiddler) {
		subTitle = tiddler.getSubtitle();
		classes.pushUnique("tiddlyLinkExisting");
		classes.remove("tiddlyLinkNonExisting");
		classes.remove("shadow");
	} else {
	    var f;
		classes.remove("tiddlyLinkExisting");
		classes.pushUnique("tiddlyLinkNonExisting");
		if(store.isShadowTiddler(title)) {
			f = config.messages.shadowedTiddlerToolTip;
			classes.pushUnique("shadow");
		} else {
			f = config.messages.undefinedTiddlerToolTip;
			classes.remove("shadow");
		}
		subTitle = f ? f.format([title]) : "";
	}
	if(typeof config.annotations[title] == "string")
		subTitle = config.annotations[title];
	return { classes: classes.join(" "), subTitle: subTitle };
}

// Event handler for clicking on a tiddly link
function onClickTiddlerLink(ev) {
	var e = ev || window.event;
	var target = resolveTarget(e);
	var link = target;
	var title = null;
	var fields = null;
	var noToggle = null;
	do {
		title = link.getAttribute("tiddlyLink");
		fields = link.getAttribute("tiddlyFields");
		noToggle = link.getAttribute("noToggle");
		link = link.parentNode;
	} while(title == null && link != null);
	if(!store.isShadowTiddler(title)) {
		var f = fields ? fields.decodeHashMap() : {};
		fields = String.encodeHashMap(merge(f, config.defaultCustomFields, true));
	}
	if(title) {
		var toggling = e.metaKey || e.ctrlKey;
		if(config.options.chkToggleLinks)
			toggling = !toggling;
		if(noToggle)
			toggling = false;
		if(store.getTiddler(title))
			fields = null;
		story.displayTiddler(target, title, null, true, null, fields, toggling);
	}
	clearMessage();
	return false;
}

function getTiddlerLinkHref(title) {
	return window.location.toString().replace(/#.*$/, '') + story.getPermaViewHash([title]);
}

//# Create a link to a particular tiddler
//#   place - element where the link should be created
//#   title - title of target tiddler
//#   includeText - flag for whether to include the title as the text of the link
//#   className - custom CSS class for the link
//#   linkedFromTiddler - tiddler from which to inherit extended fields
//#   noToggle - flag to force the link to open the target, even if chkToggleLinks is on
function createTiddlyLink(place, title, includeText, className, isStatic, linkedFromTiddler, noToggle) {
	var title = jQuery.trim(title);
	var text = includeText ? title : null;
	var info = getTiddlyLinkInfo(title, className);
	var btn = isStatic ?
		createExternalLink(place, store.getTiddlerText("SiteUrl", null) + story.getPermaViewHash([title])) :
		createTiddlyButton(place, text, info.subTitle, onClickTiddlerLink, info.classes, '', '', {
			href: getTiddlerLinkHref(title)
		});
	if(isStatic)
		btn.className += ' ' + className;
	btn.setAttribute("refresh", "link");
	btn.setAttribute("tiddlyLink", title);
	if(noToggle)
		btn.setAttribute("noToggle", "true");
	if(linkedFromTiddler) {
		var fields = linkedFromTiddler.getInheritedFields();
		if(fields)
			btn.setAttribute("tiddlyFields", fields);
	}
	return btn;
}

function refreshTiddlyLink(e, title) {
	var info = getTiddlyLinkInfo(title, e.className);
	e.className = info.classes;
	e.title = info.subTitle;
}

function createTiddlyDropDown(place, onchange, options, defaultValue) {
	var sel = createTiddlyElement(place, "select");
	sel.onchange = onchange;

	for(var i = 0; i < options.length; i++) {
		var e = createTiddlyElement(sel, "option", null, null, options[i].caption);
		e.value = options[i].name;
		if(e.value == defaultValue)
			e.selected = true;
	}
	return sel;
}

