// <![CDATA[

function __main() {
	store = new TiddlyWiki();
	loadShadowTiddlers();
	formatter = new Formatter(config.formatters);
}

__title = {
	en: {
	    all: "All tiddlers in alphabetical order",
	    missing: "Tiddlers that have links to them but are not defined",
	    orphans: "Tiddlers that are not linked to from any other tiddlers",
	    shadowed: "Tiddlers shadowed with default contents",
	    touched: "Tiddlers that have been modified locally",
	    closeAll: "Close all displayed tiddlers (except any that are being edited)",
	}
}

function __re_escape(s) {
	return s.replace('(','\\(').replace(')','\\)');
}

describe('Macros: version macro', {
	before_each : function() {
		__main();
	},

	'version macro should expand to the version string' : function() { 
		version.major = "123";
		version.minor = "456";
		version.revision = "789";
		version.beta = "123456789";
		value_of(wikifyStatic("<<version>>")).should_be("<span>123.456.789 (beta 123456789)</span>");
	},
});

describe('Macros: today macro', {
	before_each : function() {
		__main();
	},

	'today macro should return a date shaped string' : function() { 
		value_of(wikifyStatic("<<today>>")).should_match(/^<span>[A-Z][a-z]+\s[A-Z][a-z]+\s[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2} 2[0-9]{3}<\/span>$/);
	},

});

describe('Macros: list macro', {
	before_each : function() {
		__main();
	},

	'list all by default expands to the listTitle and an empty list' : function() { 
		value_of(wikifyStatic("<<list>>")).should_be('<ul><li class="listTitle">' + __title.en.all + '</li></ul>');
	},
	'list missing by default expands to the listTitle and an empty list' : function() { 
		value_of(wikifyStatic("<<list missing>>")).should_be('<ul><li class="listTitle">' + __title.en.missing + '</li></ul>');
	},
	'list orphans by default expands to the listTitle and an empty list' : function() { 
		value_of(wikifyStatic("<<list orphans>>")).should_be('<ul><li class="listTitle">' + __title.en.orphans + '</li></ul>');
	},
	'list shadowed by default expands to the listTitle and a list of tiddlers' : function() { 
		var pattern = new RegExp('^<ul><li class="listTitle">' + __title.en.shadowed + '</li><li>.*<\/li><\/ul>');
		value_of(wikifyStatic("<<list shadowed>>")).should_match(pattern);
	},
	'list touched by default expands to the listTitle and empty list' : function() { 
		value_of(wikifyStatic("<<list touched>>")).should_be('<ul><li class="listTitle">' + __title.en.touched + '</li></ul>');
	},
	'list filter by default expands to an empty list' : function() { 
		value_of(wikifyStatic("<<list filter>>")).should_be('<ul></ul>');
	},
});

describe('Macros: closeAll macro', {
	before_each : function() {
		__main();
	},
	'closeAll macro expands to button' : function() { 
		var t = wikifyStatic("<<closeAll>>");
		var title = __re_escape(__title.en.closeAll);
		var r = new RegExp('<a(( class="button")|( title="' + title + '")|( href="javascript:;")){3}>close all<\/a>');
		value_of(t).should_match(r);
	},

});

// ]]>
