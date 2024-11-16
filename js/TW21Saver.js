//--
//-- TW21Saver (inherits from SaverBase)
//--

function TW21Saver() {}

TW21Saver.prototype = new SaverBase();

TW21Saver.prototype.externalizeTiddler = function(store, tiddler) {
	try {
		var usePre = config.options.chkUsePreForStorage;
		var created = tiddler.created;
		var modified = tiddler.modified;
		var tags = tiddler.getTags();
		var attributes =
			(tiddler.creator ? ' creator="' + tiddler.creator.htmlEncode() + '"' : "") +
			(tiddler.modifier ? ' modifier="' + tiddler.modifier.htmlEncode() + '"' : "") +
			((usePre && created == version.date) ? "" : ' created="' + created.convertToYYYYMMDDHHMM() + '"') +
			((usePre && modified == created) ? "" : ' modified="' + modified.convertToYYYYMMDDHHMM() + '"') +
			((!usePre || tags) ? ' tags="' + tags.htmlEncode() + '"' : "");
		var extendedAttributes = "";
		store.forEachField(tiddler, function(tiddler, fieldName, value) {
			if(typeof value != "string")
				value = "";
			// don't store fields from the temp namespace
			if(!fieldName.match(/^temp\./))
				extendedAttributes += ' %0="%1"'.format([fieldName, value.escapeLineBreaks().htmlEncode()]);
		}, true);
		return ('<div %0="%1"%2%3>%4</' + 'div>').format([
			usePre ? "title" : "tiddler",
			tiddler.title.htmlEncode(),
			attributes,
			extendedAttributes,
			usePre ? "\n<pre>" + tiddler.text.htmlEncode() + "</pre>\n" : tiddler.text.escapeLineBreaks().htmlEncode()
		]);
	} catch (ex) {
		throw exceptionText(ex, config.messages.tiddlerSaveError.format([tiddler.title]));
	}
};

