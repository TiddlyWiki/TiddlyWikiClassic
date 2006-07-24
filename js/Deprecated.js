// ---------------------------------------------------------------------------------
// Deprecated code
// ---------------------------------------------------------------------------------

// @Deprecated: Use createElementAndWikify and this.termRegExp instead
config.formatterHelpers.charFormatHelper = function(w)
{
	w.subWikify(createTiddlyElement(w.output,this.element),this.terminator);
}

// @Deprecated: Use enclosedTextHelper and this.lookaheadRegExp instead
config.formatterHelpers.monospacedByLineHelper = function(w)
{
	var lookaheadRegExp = new RegExp(this.lookahead,"mg");
	lookaheadRegExp.lastIndex = w.matchStart;
	var lookaheadMatch = lookaheadRegExp.exec(w.source);
	if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
		{
		var text = lookaheadMatch[1];
		if(config.browser.isIE)
			text = text.replace(/\n/g,"\r");
		createTiddlyElement(w.output,"pre",null,null,text);
		w.nextMatch = lookaheadRegExp.lastIndex;
		}
}

// Load a tiddler from an HTML DIV. The caller should make sure to later call Tiddler.changed()
// @Deprecated: Use store.getLoader().internalizeTiddler instead
Tiddler.prototype.loadFromDiv = function(divRef,title)
{
	return store.getLoader().internalizeTiddler(store,this,title,divRef);
}

// Format the text for storage in an HTML DIV
// @Deprecated Use store.getSaver().externalizeTiddler instead.
Tiddler.prototype.saveToDiv = function()
{
	return store.getSaver().externalizeTiddler(store,this);
}

// @Deprecated: Use store.allTiddlersAsHtml() instead
function allTiddlersAsHtml()
{
	return store.allTiddlersAsHtml();
}

// @Deprecated: Use right hand side directly instead
var regexpBackSlashEn = new RegExp("\\\\n","mg");
var regexpBackSlash = new RegExp("\\\\","mg");
var regexpBackSlashEss = new RegExp("\\\\s","mg");
var regexpNewLine = new RegExp("\n","mg");
var regexpCarriageReturn = new RegExp("\r","mg");
