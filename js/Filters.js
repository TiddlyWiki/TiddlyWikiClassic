//--
//-- Filter a list of tiddlers
//--

//# Extensible filter functions
config.filters = {
	tiddler: function(results, match) {
		var title = match[1] || match[4];
		var tiddler = this.fetchTiddler(title);
		if(tiddler) {
			results.pushUnique(tiddler);
		} else if(this.isShadowTiddler(title)) {
			tiddler = new Tiddler();
			tiddler.set(title, this.getTiddlerText(title));
			results.pushUnique(tiddler);
		} else {
			results.pushUnique(new Tiddler(title));
		}
		return results;
	},
	tag: function(results, match) {
		var i, matched = this.getTaggedTiddlers(match[3]);
		for(i = 0; i < matched.length; i++) {
			results.pushUnique(matched[i]);
		}
		return results;
	},
	sort: function(results, match) {
		return this.sortTiddlers(results, match[3]);
	},
	limit: function(results, match) {
		return results.slice(0, parseInt(match[3], 10));
	},
	field: function(results, match) {
		var i, matched = this.getValueTiddlers(match[2], match[3]);
		for (i = 0; i < matched.length; i++) {
			results.pushUnique(matched[i]);
		}
		return results;
	}
};

// Filter a list of tiddlers
//#   filter - filter expression (eg "tidlertitle [[multi word tiddler title]] [tag[systemConfig]]")
//# Returns an array of Tiddler() objects that match the filter expression
TiddlyWiki.prototype.filterTiddlers = function(filter, results) {
	//# text or [foo[bar]] or [[tiddler title]]
	var re = /([^\s\[\]]+)|(?:\[([ \w\.\-]+)\[([^\]]+)\]\])|(?:\[\[([^\]]+)\]\])/mg;

	results = results || [];
	if(filter) {
		var match;
		while(match = re.exec(filter)) {
			var handler = (match[1] || match[4]) ? 'tiddler' :
				config.filters[match[2]] ? match[2] : 'field';
			results = config.filters[handler].call(this, results, match);
		}
	}
	return results;
};

