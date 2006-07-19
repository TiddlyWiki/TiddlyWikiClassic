//# -------------------------
//# LoaderBase: A (abstract) storage loader that loads the tiddlers from a list of HTML elements.
//# The format of the elements is defined by subclasses of this loader through the internalizeTiddler implementation.
//# Subclasses must implement:
//# 			function getTitle(store, e)
//#
//# store must implement:
//# 			function createTiddler(title).
//#

function LoaderBase()
{
}

LoaderBase.prototype.loadTiddler = function(store,e,tiddlers)
{
	var title = this.getTitle(store, e);
	if (title)
		{
		var tiddler = store.createTiddler(title);
		this.internalizeTiddler(store, tiddler, title, e);
		tiddlers.push(tiddler);
		}
}

LoaderBase.prototype.loadTiddlers = function(store,nodes)
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
			showException(e, config.messages.tiddlerLoadError.format([this.getTitle(store, nodes[t])]));
			}
		}
	return tiddlers;
}
	
//# -------------------------
//# SaverBase: a (abstract) storage saver that externalizes all tiddlers into a string, 
//# with every tiddler individually externalized (using this.externalizeTiddler) and joined with newlines 
//# Subclasses must implement:
//# 			function externalizeTiddler(store, tiddler)
//#
//# store must implement:
//# 			function getTiddlers(sortByFieldName)
//#

function SaverBase()
{
}

SaverBase.prototype.externalize = function(store) 
{
	var results = [];
	var tiddlers = store.getTiddlers("title");
	for (var t = 0; t < tiddlers.length; t++)
		results.push(this.externalizeTiddler(store, tiddlers[t]));
	return results.join("\n");
}
