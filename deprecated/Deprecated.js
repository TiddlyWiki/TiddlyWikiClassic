//--
//-- Deprecated code
//--

// @Deprecated: Use createElementAndWikify and this.termRegExp instead
config.formatterHelpers.charFormatHelper = function(w)
{
	w.subWikify(createTiddlyElement(w.output, this.element), this.terminator);
};

// @Deprecated: Use enclosedTextHelper and this.lookaheadRegExp instead
config.formatterHelpers.monospacedByLineHelper = function(w)
{
	var lookaheadRegExp = new RegExp(this.lookahead, "mg");
	lookaheadRegExp.lastIndex = w.matchStart;
	var lookaheadMatch = lookaheadRegExp.exec(w.source);
	if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
		var text = lookaheadMatch[1];
		if(config.browser.isIE) text = text.replace(/\n/g, "\r");
		createTiddlyElement(w.output, "pre", null, null, text);
		w.nextMatch = lookaheadRegExp.lastIndex;
	}
};

// @Deprecated: Use <br> or <br /> instead of <<br>>
config.macros.br = {};
config.macros.br.handler = function(place)
{
	createTiddlyElement(place, "br");
};

// Find an item in an array. If a predicate is provided, use the native Array.find (return the item);
// otherwise (for backwards compatibility) treat the argument as an item to find (return the index or null)
// @Deprecated: Use indexOf instead
Array.prototype.orig_find = Array.prototype.find;
Array.prototype.find = function(itemOrPredicate)
{
	if(itemOrPredicate instanceof Function) return Array.prototype.orig_find.apply(this, arguments);
	var i = this.indexOf(itemOrPredicate);
	return i == -1 ? null : i;
};

// Adds, removes or toggles a particular value within an array
//  value - value to add
//  mode - +1 to add value, -1 to remove value, 0 to toggle it
// @Deprecated: No direct substitution
Array.prototype.setItem = function(value, mode)
{
	var i = this.indexOf(value);
	if(mode == 0) mode = (i == -1) ? +1 : -1;
	if(mode == +1) {
		if(i == -1) this.push(value);
	} else if(mode == -1) {
		if(i != -1) this.splice(i, 1);
	}
};

// For IE up to 8 (https://caniuse.com/?search=indexOf)
if(!Array.prototype.map) {
	Array.prototype.map = function(fn, thisObj)
	{
		var scope = thisObj || window;
		var i, j, a = [];
		for(i = 0, j = this.length; i < j; ++i) {
			a.push(fn.call(scope, this[i], i, this));
		}
		return a;
	};
}

// For IE up to 8 (https://caniuse.com/?search=indexOf)
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item, from)
	{
		if(!from) from = 0;
		for(var i = from; i < this.length; i++) {
			if(this[i] === item) return i;
		}
		return -1;
	};
}

// Load a tiddler from an HTML DIV. The caller should make sure to later call Tiddler.changed()
// @Deprecated: Use store.getLoader().internalizeTiddler instead
Tiddler.prototype.loadFromDiv = function(divRef, title)
{
	return store.getLoader().internalizeTiddler(store, this, title, divRef);
};

// Format the text for storage in an HTML DIV
// @Deprecated: Use store.getSaver().externalizeTiddler instead.
Tiddler.prototype.saveToDiv = function()
{
	return store.getSaver().externalizeTiddler(store, this);
};

// @Deprecated: Use store.allTiddlersAsHtml() instead
function allTiddlersAsHtml()
{
	return store.allTiddlersAsHtml();
}

// @Deprecated: Use refreshPageTemplate instead
function applyPageTemplate(title)
{
	refreshPageTemplate(title);
}

// @Deprecated: Use story.displayTiddlers instead
function displayTiddlers(srcElement, titles, template, unused1, unused2, animate, unused3)
{
	story.displayTiddlers(srcElement, titles, template, animate);
}

// @Deprecated: Use story.displayTiddler instead
function displayTiddler(srcElement, title, template, unused1, unused2, animate, unused3)
{
	story.displayTiddler(srcElement, title, template, animate);
}

// @Deprecated: Java IO is no longer supported;
// these "empty" versions are only left for the tiny chance of backwards
// compatibility issues and will be removed completely in the future
function javaSaveFile(filePath, content)
{
	return null;
}

function javaLoadFile(filePath)
{
	return null;
}

// @Deprecated: Use functions on right hand side directly instead
var createTiddlerPopup = Popup.create;
var scrollToTiddlerPopup = Popup.show;
var hideTiddlerPopup = Popup.remove;

// @Deprecated: Use right hand side directly instead
var regexpBackSlashEn = new RegExp("\\\\n", "mg");
var regexpBackSlash = new RegExp("\\\\", "mg");
var regexpBackSlashEss = new RegExp("\\\\s", "mg");
var regexpNewLine = new RegExp("\n", "mg");
var regexpCarriageReturn = new RegExp("\r", "mg");

