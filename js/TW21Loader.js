//--------------------------------
// TW21Loader (inherits from LoaderBase)

function TW21Loader() {}

TW21Loader.prototype = new LoaderBase();

TW21Loader.prototype.getTitle = function(store,e)
{
	var title = null;
	if(e.getAttribute) {
		title = e.getAttribute("title");
		if(!title)
			title = e.getAttribute("tiddler");
	}
	if(!title && e.id) {
		var lenPrefix = store.idPrefix.length;
		if (e.id.substr(0,lenPrefix) == store.idPrefix)
			title = e.id.substr(lenPrefix);
	}
	return title;
};

TW21Loader.prototype.internalizeTiddler = function(store,tiddler,title,data)
{
	var e = data.firstChild;
	var text = null;
	if(data.getAttribute("tiddler")) {
		text = getNodeText(e).unescapeLineBreaks();
	} else {
		while(e.nodeName!="PRE" && e.nodeName!="pre") {
			e = e.nextSibling;
		}
		text = e.innerHTML.replace(/\r/mg,"").htmlDecode();
	}
	var modifier = data.getAttribute("modifier");
	var created = Date.convertFromYYYYMMDDHHMM(data.getAttribute("created"));
	var m = data.getAttribute("modified");
	var modified = m ? Date.convertFromYYYYMMDDHHMM(m) : created;
	var tags = data.getAttribute("tags");
	var fields = {};
	var attrs = data.attributes;
	for(var i = attrs.length-1; i >= 0; i--) {
		var name = attrs[i].name;
		if (attrs[i].specified && !TiddlyWiki.isStandardField(name)) {
			fields[name] = attrs[i].value.unescapeLineBreaks();
		}
	}
	tiddler.assign(title,text,modifier,modified,tags,created,fields);
	return tiddler;
};

