
// The format a TiddlyWiki's storeArea is saved can be given through the 
// 'saveFormat' startup parameter, passing in the format id (e.g. 'tw21'). E.g.: 
//
//       http://www.tiddlywiki.com/index.html#saveFormat:tw21
//
// If no save format is explicitly specified the file is saved in its original format it was
// loaded from, if that format is supported and not the config.store.LEGACY_FORMAT. 
// Otherwise the config.store.defaultFormat is used.

config.store =  {
	LEGACY_FORMAT: 'tw20', // The format identifying the pre 2.1 file format
	
	//TODO: make this 'tw21' as soon ginsu/cook can understand that format
	defaultFormat: 'tw20',  
	
	// Map a storage format name to a loader/saver.
	loader: {},
	saver: {}
};

function getLoaderForFormat(format) 
{
	var loader = config.store.loader[format];
	if (!loader)
		throw config.messages.unsupportedTWFormat.format([format]);
	return new loader();
}

function getSaverForFormat(format) 
{
	var saver = config.store.saver[format];
	if (!saver)
		throw config.messages.unsupportedTWFormat.format([format]);
	return new saver();
}

function getFormatOfStore(storeElem) 
{
	var format = storeElem.className;
	return format ? format : config.store.LEGACY_FORMAT;
}

// Returns a saver for the preferredFormat or the default saver if the format is not supported.
// When noAlert is false a dialog is displayed when the preferredFormat is not supported.
function getSaver(preferredFormat,noAlert)
{
	try
		{
		return getSaverForFormat(preferredFormat);
		}
	catch(e)
		{
		if (!noAlert)
			alert(config.messages.wrongSaveFormat.format([preferredFormat]));
		return getSaverForFormat(config.store.defaultFormat);
		}
}

config.paramifiers.saveFormat = {
	oninit: function(v) {
		TiddlyWiki.prototype.requestedSaver = getSaver(v);
	}
};

//-------------------------
// LoaderByElems: A (abstract) storage loader that loads the tiddlers from a list of HTML elements.
//# The format of the elements is defined by subclasses of this loader through the initTiddler implementation.
//# Subclasses must implement:
//# 			function getTitle(store, e)
//#
//# store must implement:
//# 			function createTiddler(title).
//#

function LoaderByElems()
{
};

LoaderByElems.prototype.loadTiddler = function(store,e,tiddlers)
{
	var title = this.getTitle(store, e);
	if (title)
		{
		var tiddler = store.createTiddler(title);
		this.initTiddler(store, tiddler, title, e);
		tiddlers.push(tiddler);
		}
}

LoaderByElems.prototype.loadTiddlers = function(store,nodes)
{
	var tiddlers = [];
	for (var t = 0; t < nodes.length; t++)
		{
		try
			{
			this.loadTiddler(store, nodes[t], tiddlers);
			}
		catch(e)
			{
			showException(e, config.messages.tiddlerLoadError.format([this.getTitle(store, e)]));
			}
		}
	return tiddlers;
};
	
//-------------------------
// AbstractSaver: a storage saver that serializes all tiddlers into a string, 
// with every tiddler individually serialized and joined with newlines 

function AbstractSaver()
{
};

AbstractSaver.prototype.serialize = function(store) {
	var results = [];
	var tiddlers = store.getTiddlers("title");
	for (var t = 0; t < tiddlers.length; t++)
		results.push(this.serializeTiddler(store, tiddlers[t]));
	return results.join("\n");
};
