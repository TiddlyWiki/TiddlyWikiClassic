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

// Load a tiddler from an HTML DIV. The caller should make sure to later call Tiddler.changed()
// @Deprecated: Use store.getLoader().internalizeTiddler instead
Tiddler.prototype.loadFromDiv = function(divRef, title)
{
	return store.getLoader().internalizeTiddler(store, this, title, divRef);
};

// Format the text for storage in an HTML DIV
// @Deprecated Use store.getSaver().externalizeTiddler instead.
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

