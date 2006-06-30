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
