//--------------------------------
// TW21Loader (inherits from LoaderByElems)

function TW21Loader() {};

TW21Loader.getMetaDataFromAttributes = function(tiddlerDiv) {
	var result = {};
	var attrs = tiddlerDiv.attributes;
	for(var i = attrs.length-1; i >= 0; i--) {
		var name = attrs[i].name;
		if (!TiddlyWiki.isLegacyField(name)) {
			result[name] = Tiddler.unescapeLineBreaks(attrs[i].value);
		}
	}
	return result;
}


TW21Loader.prototype = new LoaderByElems();

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

TW21Loader.prototype.initTiddler = function(store, tiddler, title, data) {
	var text= ""; 
	var e = data.firstChild;
	while (e && e.nodeName == "#text")
		{
		text += Tiddler.unescapeLineBreaks(e.nodeValue);
		e = e.nextSibling;
		}
	var modifier = data.getAttribute("modifier");
	var modified = Date.convertFromYYYYMMDDHHMM(data.getAttribute("modified"));
	var c = data.getAttribute("created");
	var created = c ? Date.convertFromYYYYMMDDHHMM(c) : modified;
	var tags = data.getAttribute("tags");
	var metadata = TW21Loader.getMetaDataFromAttributes(data);
	tiddler.assign(title,text,modifier,modified,tags,created, metadata);
	return tiddler;
};

