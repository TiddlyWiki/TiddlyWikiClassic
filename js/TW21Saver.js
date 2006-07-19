//--------------------------------
// TW21Saver (inherits from SaverBase)

function TW21Saver() {};

TW21Saver.prototype = new SaverBase();

TW21Saver.prototype.externalizeTiddler = function(store, tiddler) 
{
	try {
		var extendedFieldAttributes = "";
		store.forEachField(tiddler, 
			function(tiddler, fieldName, value) {
				// don't store stuff from the temp namespace
				if (!fieldName.match(/^temp\./))
					extendedFieldAttributes += ' %0="%1"'.format([fieldName, value.escapeLineBreaks().htmlEncode()]);
			}, true);
		return '<div tiddler="%0" modifier="%1" modified="%2" created="%3" tags="%4"%6>%5</div>'.format([
				tiddler.title.htmlEncode(),
				tiddler.modifier.htmlEncode(),
				tiddler.modified.convertToYYYYMMDDHHMM(),
				tiddler.created.convertToYYYYMMDDHHMM(),
				tiddler.getTags().htmlEncode(),
				tiddler.escapeLineBreaks().htmlEncode(),
				extendedFieldAttributes
			]);
	} catch (e) {
		throw exceptionText(e, config.messages.tiddlerSaveError.format([tiddler.title]));
	}
}

