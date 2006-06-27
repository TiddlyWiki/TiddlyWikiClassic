// ---------------------------------------------------------------------------------
// TW20Loader (inherits from LoaderByElems)
// ---------------------------------------------------------------------------------

function TW20Loader()
{	
}

TW20Loader.prototype = new LoaderByElems();

TW20Loader.prototype.getTitle = function(store,e)
{
	var title = null;
	if(e.getAttribute)
		title = e.getAttribute("tiddler");
	if(!title && e.id)
		{	
		var lenPrefix = store.idPrefix.length;
		if (e.id.substr(0,lenPrefix) == store.idPrefix)
			title = e.id.substr(lenPrefix);
		}
	return title;
}

TW20Loader.prototype.initTiddler = function(store,tiddler,title,data)
{
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
	tiddler.assign(title,text,modifier,modified,tags,created);
	return tiddler;
}

config.store.loader['tw20'] = TW20Loader;