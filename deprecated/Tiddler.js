//--
//-- Deprecated Tiddler code
//--

// @Deprecated: Use tiddlerToRssItem(tiddler,uri) instead
Tiddler.prototype.toRssItem = function(uri)
{
	return tiddlerToRssItem(this,uri);
};

// @Deprecated: Use "<item>\n" + tiddlerToRssItem(tiddler,uri)  + "\n</item>" instead
Tiddler.prototype.saveToRss = function(uri)
{
	return "<item>\n" + tiddlerToRssItem(this,uri) + "\n</item>";
};

