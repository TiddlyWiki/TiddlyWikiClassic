//--
//-- LoaderBase and SaverBase
//--

//# LoaderBase: An (abstract) storage loader that loads the tiddlers from a list of HTML elements.
//# The format of the elements is defined by subclasses of this loader through the internalizeTiddler implementation.
//# Subclasses must implement:
//#			function getTitle(store, node)
//#			function internalizeTiddler(store, tiddler, title, node)
//#
//# store must implement:
//#			function createTiddler(title)
function LoaderBase() {}

LoaderBase.prototype.loadTiddler = function(store, node, tiddlers) {
	var title = this.getTitle(store, node);
	if(!title) return;
	if(safeMode && store.isShadowTiddler(title)) return;

	var tiddler = store.createTiddler(title);
	this.internalizeTiddler(store, tiddler, title, node);
	tiddlers.push(tiddler);
};

LoaderBase.prototype.loadTiddlers = function(store, nodes) {
	var i, tiddlers = [];
	for(i = 0; i < nodes.length; i++) {
		try {
			this.loadTiddler(store, nodes[i], tiddlers);
		} catch(ex) {
			showException(ex, config.messages.tiddlerLoadError.format([this.getTitle(store, nodes[i])]));
		}
	}
	return tiddlers;
};

//# SaverBase: an (abstract) storage saver that externalizes all tiddlers into a string,
//# with every tiddler individually externalized (using this.externalizeTiddler) and joined with newlines
//# Subclasses must implement:
//#			function externalizeTiddler(store, tiddler)
//#
//# store must implement:
//#			function getTiddlers(sortByFieldName)
function SaverBase() {}

SaverBase.prototype.externalize = function(store) {
	var results = [];
	var i, tiddlers = store.getTiddlers("title");
	for(i = 0; i < tiddlers.length; i++) {
		if(!tiddlers[i].doNotSave())
			results.push(this.externalizeTiddler(store, tiddlers[i]));
	}
	return results.join("\n");
};

