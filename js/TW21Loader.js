//--------------------------------
// TW21Loader (inherits from LoaderBase)

function TW21Loader() {};

TW21Loader.prototype = new LoaderBase();

TW21Loader.prototype.getTitle = function(store, e) {
	var title = null;
	if(e.getAttribute)
		title = e.getAttribute("tiddler");
	if(!title && e.id) {	
		var lenPrefix = store.idPrefix.length;
		if (e.id.substr(0,lenPrefix) == store.idPrefix)
			title = e.id.substr(lenPrefix);
	}
	return title;
}

TW21Loader.prototype.internalizeTiddler = function(store, tiddler, title, data) {
	var text = getNodeText(data.firstChild).unescapeLineBreaks();
	var modifier = data.getAttribute("modifier");
	var modified = Date.convertFromYYYYMMDDHHMM(data.getAttribute("modified"));
	var c = data.getAttribute("created");
	var created = c ? Date.convertFromYYYYMMDDHHMM(c) : modified;
	var tags = data.getAttribute("tags");
	var fields = {};
	var attrs = data.attributes;
	for(var i = attrs.length-1; i >= 0; i--) {
		var name = attrs[i].name;
		if (!TiddlyWiki.isStandardField(name)) {
			fields[name] = attrs[i].value.unescapeLineBreaks();
		}
	}
	tiddler.assign(title,text,modifier,modified,tags,created, fields);
	return tiddler;
};

