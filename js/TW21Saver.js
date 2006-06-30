//--------------------------------
// TW21Saver (inherits from AbstractSaver)

function TW21Saver() {};

// Returns a string containing XML attributes for every (non-legacy) MetaData 
// of the given tiddler, or "" if tiddler has no such.
// MetaData from the "temp" namespace is not returned.
TW21Saver.serializeMetadata = function(store, tiddler) {
	var result = "";
	store.forEachField(tiddler, 
		function(tiddler, fieldName, value) {
			// don't store stuff from the temp namespace
			if (fieldName.match(/^temp\./))
				return false;
			result += ' %0="%1"'.format([fieldName, value.escapeLineBreaks().htmlEncode()]);
		}, true);
	return result;
}

TW21Saver.prototype = new AbstractSaver();

TW21Saver.prototype.getFormat = function(store) {
	return 'tw21';
}

TW21Saver.prototype.serializeTiddler = function(store, tiddler) {
	try {
		return '<div tiddler="%0" modifier="%1" modified="%2" created="%3" tags="%4"%6>%5</div>'.format([
				tiddler.title.htmlEncode(),
				tiddler.modifier.htmlEncode(),
				tiddler.modified.convertToYYYYMMDDHHMM(),
				tiddler.created.convertToYYYYMMDDHHMM(),
				tiddler.getTags().htmlEncode(),
				tiddler.escapeLineBreaks().htmlEncode(),
				TW21Saver.serializeMetadata(store, tiddler)
			]);
	} catch (e) {
		throw exceptionText(e, config.messages.tiddlerSaveError.format([tiddler.title]));
	}
};

