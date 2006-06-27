// ---------------------------------------------------------------------------------
// TW20Saver (inherits from AbstractSaver)
// ---------------------------------------------------------------------------------

function TW20Saver()
{
};

TW20Saver.prototype = new AbstractSaver();

TW20Saver.prototype.getFormat = function(store)
{
	return 'tw20';
}

TW20Saver.prototype.serializeTiddler = function(store, tiddler)
{
	try
		{
		return '<div tiddler="%0" modifier="%1" modified="%2" created="%3" tags="%4">%5</div>'.format([
				tiddler.title.htmlEncode(),
				tiddler.modifier.htmlEncode(),
				tiddler.modified.convertToYYYYMMDDHHMM(),
				tiddler.created.convertToYYYYMMDDHHMM(),
				tiddler.getTags().htmlEncode(),
				tiddler.escapeLineBreaks().htmlEncode()
			]);
		}
	catch (e)
		{
		throw exceptionText(e, config.messages.tiddlerSaveError.format([tiddler.title]));
		}
};

config.store.saver['tw20'] = TW20Saver;
