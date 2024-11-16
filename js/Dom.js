//--
//-- DOM utilities - many derived from www.quirksmode.org
//--

tw.assets.icons.closeSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" class="tw-icon">' +
	'	<line x1="1" y1="1" x2="9" y2="9" rx="1" ry="1"/>' +
	'	<line x1="9" y1="1" x2="1" y2="9" rx="1" ry="1"/>' +
	'</svg>';

function drawGradient(place, horiz, loColors, hiColors) {
	if(!hiColors) hiColors = loColors;

	for(var i = 0; i <= 100; i += 2) {
		var bar = document.createElement("div");
		place.appendChild(bar);
		bar.style.position = "absolute";
		bar.style.left = horiz ? i + "%" : 0;
		bar.style.top = horiz ? 0 : i + "%";
		bar.style.width = horiz ? (101 - i) + "%" : "100%";
		bar.style.height = horiz ? "100%" : (101 - i) + "%";
		bar.style.zIndex = -1;
		var p = i / 100 * (loColors.length - 1);
		var hc = hiColors[Math.floor(p)];
		if(typeof hc == "string")
			hc = new RGB(hc);
		var lc = loColors[Math.ceil(p)];
		if(typeof lc == "string")
			lc = new RGB(lc);
		bar.style.backgroundColor = hc.mix(lc, p - Math.floor(p)).toString();
	}
}

//# Add an event handler
//# Thanks to John Resig, via QuirksMode
function addEvent(obj, type, fn) {
	if(obj.attachEvent) {
		obj["e" + type + fn] = fn;
		obj[type + fn] = function() { obj["e" + type + fn](window.event) };
		obj.attachEvent("on" + type, obj[type + fn]);
	} else {
		obj.addEventListener(type, fn, false);
	}
}

//# Remove an event handler
//# Thanks to John Resig, via QuirksMode
function removeEvent(obj, type, fn) {
	if(obj.detachEvent) {
		obj.detachEvent("on" + type, obj[type + fn]);
		obj[type + fn] = null;
	} else {
		obj.removeEventListener(type, fn, false);
	}
}

// Find the closest relative with a given property value (property defaults to tagName, relative defaults to parentNode)
function findRelated(e, value, name, relative) {
	name = name || "tagName";
	relative = relative || "parentNode";
	if(name == "className") {
		while(e && !jQuery(e).hasClass(value)) {
			e = e[relative];
		}
	} else {
		while(e && e[name] != value) {
			e = e[relative];
		}
	}
	return e;
}

// Get the scroll position for window.scrollTo necessary to scroll a given element into view
function ensureVisible(e) {
	var posTop = findPosY(e);
	var posBot = posTop + e.offsetHeight;
	var winTop = findScrollY();
	var winHeight = findWindowHeight();
	var winBot = winTop + winHeight;
	if(posTop < winTop) {
		return posTop;
	} else if(posBot > winBot) {
		if(e.offsetHeight < winHeight)
			return posTop - (winHeight - e.offsetHeight);
		else
			return posTop;
	} else {
		return winTop;
	}
}

// Get the current width of the display window
function findWindowWidth() {
	return window.innerWidth || document.documentElement.clientWidth;
}

// Get the current height of the display window
function findWindowHeight() {
	return window.innerHeight || document.documentElement.clientHeight;
}

// Get the current height of the document
function findDocHeight() {
	var d = document;
	return Math.max(
		Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
		Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
		Math.max(d.body.clientHeight, d.documentElement.clientHeight)
	);
}

// Get the current horizontal page scroll position
function findScrollX() {
	return window.scrollX || document.documentElement.scrollLeft;
}

// Get the current vertical page scroll position
function findScrollY() {
	return window.scrollY || document.documentElement.scrollTop;
}

function findPosX(obj) {
	var curleft = 0;
	while(obj.offsetParent) {
		curleft += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return curleft;
}

function findPosY(obj) {
	var curtop = 0;
	while(obj.offsetParent) {
		curtop += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return curtop;
}

function blurElement(e) {
	if(e && e.focus && e.blur) {
		e.focus();
		e.blur();
	}
}

// Create a non-breaking space
function insertSpacer(place) {
	var e = document.createTextNode(String.fromCharCode(160));
	if(place) place.appendChild(e);
	return e;
}

// Replace the current selection of a textarea or text input and scroll it into view
function replaceSelection(e, text) {
	if(e.setSelectionRange) {
		var oldpos = e.selectionStart;
		var isRange = e.selectionEnd > e.selectionStart;
		e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd);
		e.setSelectionRange(isRange ? oldpos : oldpos + text.length, oldpos + text.length);
		// scroll into view
		var linecount = e.value.split("\n").length;
		var thisline = e.value.substr(0, e.selectionStart).split("\n").length - 1;
		e.scrollTop = Math.floor((thisline - e.rows / 2) * e.scrollHeight / linecount);
	} else if(document.selection) { // support IE
		var range = document.selection.createRange();
		if(range.parentElement() == e) {
			var isCollapsed = range.text == "";
			range.text = text;
			if(!isCollapsed) {
				range.moveStart("character", -text.length);
				range.select();
			}
		}
	}
}

// Set the caret position in a text area
function setCaretPosition(e, pos) {
	if(e.selectionStart || e.selectionStart == '0') {
		e.selectionStart = pos;
		e.selectionEnd = pos;
		e.focus();
	} else if(document.selection) { // support IE
		e.focus();
		var sel = document.selection.createRange();
		sel.moveStart('character', -e.value.length);
		sel.moveStart('character', pos);
		sel.moveEnd('character', 0);
		sel.select();
	}
}

// Returns the text of the given (text) node, possibly merging subsequent text nodes
function getNodeText(e) {
	var text = "";
	while(e && e.nodeName == "#text") {
		text += e.nodeValue;
		e = e.nextSibling;
	}
	return text;
}

// Returns true if the element e has a given ancestor element
function isDescendant(e, ancestor) {
	while(e) {
		if(e === ancestor)
			return true;
		e = e.parentNode;
	}
	return false;
}


// deprecate the following...

// Prevent an event from bubbling
function stopEvent(e) {
	var ev = e || window.event;
	ev.cancelBubble = true;
	if(ev.stopPropagation) ev.stopPropagation();
	return false;
}

// Remove any event handlers or non-primitve custom attributes
function scrubNode(e) {
	if(!config.browser.isIE) return;
	var att = e.attributes;
	if(att) {
		for(var i = 0; i < att.length; i++) {
			var n = att[i].name;
			if(n !== "style" && (typeof e[n] === "function" || (typeof e[n] === "object" && e[n] != null))) {
				try {
					e[n] = null;
				} catch(ex) {
				}
			}
		}
	}
	var c = e.firstChild;
	while(c) {
		scrubNode(c);
		c = c.nextSibling;
	}
}

function setStylesheet(s, id, doc) {
	jQuery.twStylesheet(s, { id: id, doc: doc });
}

function removeStyleSheet(id) {
	jQuery.twStylesheet.remove({ id: id });
}

