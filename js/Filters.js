//--
//-- Filter a list of tiddlers
//--

// Filter a list of tiddlers
//#   filter - filter expression (eg "tidlertitle [[multi word tiddler title]] [tag[systemConfig]]")
//# Returns an array of Tiddler() objects that match the filter expression
TiddlyWiki.prototype.filterTiddlers = function(filter)
{
	var results = [];
	if(filter) {
		var tiddler;
		var re = /([^\s\[\]]+)|(?:\[([ \w]+)\[([^\]]+)\]\])|(?:\[\[([^\]]+)\]\])/mg;
		var match = re.exec(filter);
		while(match) {
			if(match[1] || match[4]) {
				//# matches (eg) text or [[tiddler title]]
				var title = match[1] || match[4];
				tiddler = this.fetchTiddler(title);
				if(tiddler) {
					results.pushUnique(tiddler);
				} else if(this.isShadowTiddler(title)) {
					tiddler = new Tiddler();
					tiddler.set(title,this.getTiddlerText(title));
					results.pushUnique(tiddler);
				} else {
					results.pushUnique(new Tiddler(title));
				}
			} else if(match[2]) {
				//# matches (eg) [text[more text]]
				switch(match[2]) {
					case "tag":
						var matched = this.getTaggedTiddlers(match[3]);
						for(var m = 0; m < matched.length; m++)
							results.pushUnique(matched[m]);
						break;
					case "sort":
						results = this.sortTiddlers(results,match[3]);
						break;
					case "limit":
						results = results.slice(0, parseInt(match[3],10));
						break;
					default:
						var matched = this.getValueTiddlers(match[2],match[3]);
						for(var m = 0; m < matched.length; m++)
							results.pushUnique(matched[m]);
						break;
				}
			}
			match = re.exec(filter);
		}
	}
	return results;
};
