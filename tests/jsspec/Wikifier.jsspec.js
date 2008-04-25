// <![CDATA[
describe('Wikifier : getParser()', {

	before_each: function(){
		var formatter = new Formatter(config.formatters);
	},
	
	'it should return the default formatter if no tiddler argument is provided': function() {
		var actual = getParser(null,null);
		var expected = formatter;
		value_of(actual).should_be(expected);
	},
	
	'it should return the default formatter if no format argument is provided and the tiddler has no "wikiformat" field and is not tagged with the value of formatTag of a member of config.parsers': function() {
		var t = new Tiddler("t");
		var actual = getParser(t,null);
		var expected = formatter;
		value_of(actual).should_be(expected);
	},
	
	'it should return the default formatter if a format argument is provided, but does not appear as a value of formatTag of a member of config.parsers; the tiddler has no "wikiformat" field and is not tagged with the value of formatTag from a member of config.parsers': function() {
		var t = new Tiddler("t");
		var actual = getParser(t,"nomatch");
		var expected = formatter;
		value_of(actual).should_be(expected);
	},
	
	'it should return the default formatter if the tiddler has a "wikiformat" field that does not appear as a value of formatTag of a member of config.parsers; no format argument is provided and the tiddler is not tagged with the value of formatTag from a member of config.parsers': function() {
		var t = new Tiddler("t");
		t.fields.wikiformat = "nomatch";
		var actual = getParser(t,null);
		var expected = formatter;
		value_of(actual).should_be(expected);
	},
	
	'it should return the formatter specified by the "wikiformat" field even if a format tag is provided; no format parameter is provided': function() {
		var t = new Tiddler("t");
		t.fields.wikiformat = "format_field";
		t.tags.push("format_tag");
		config.parsers.field = {
			format: "format_field"
		};
		config.parsers.tag = {
			formatTag: "format_tag"
		};
		var actual = getParser(t,null);
		var expected = config.parsers.field;
		value_of(actual).should_be(expected);
	},
	
	'it should return the formatter specified by the format tag; the tiddler has no "wikiformat" field and no format parameter is provided': function() {
		var t = new Tiddler("t");
		t.tags.push("format_tag");
		config.parsers.tag = {
			formatTag: "format_tag"
		};
		var actual = getParser(t,null);
		var expected = config.parsers.tag;
		value_of(actual).should_be(expected);
	},
	
	'it should return the formatter specified by the format parameter even if a format tag and a "wikiformat" field are provided': function() {
		var t = new Tiddler("t");
		t.fields.wikiformat = "format_field";
		t.tags.push("format_tag");
		config.parsers.field = {
			format: "format_field"
		};
		config.parsers.tag = {
			formatTag: "format_tag"
		};
		config.parsers.parameter = {
			format: "format_parameter"
		};
		var actual = getParser(t,"format_parameter");
		var expected = config.parsers.parameter;
		value_of(actual).should_be(expected);
	}
});

describe('Wikifier : wikifyStatic()', {

	'Bold formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = (wikifyStatic("''bold''")).toLowerCase();
		var expected = "<strong>bold</strong>";
		value_of(actual).should_be(expected);
	},
	'Italic formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("//italic//").toLowerCase();
		var expected = "<em>italic</em>";
		value_of(actual).should_be(expected);
	},
	'Underline formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("__underline__").toLowerCase();
		var expected = "<u>underline</u>";
		value_of(actual).should_be(expected);
	},
	'Superscript formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("^^superscript^^").toLowerCase();
		var expected = "<sup>superscript</sup>";
		value_of(actual).should_be(expected);
	},
	'Subscript formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("~~subscript~~").toLowerCase();
		var expected = "<sub>subscript</sub>";
		value_of(actual).should_be(expected);
	}
});

describe('Wikifier: wikify()', {

	before_each: function() {
		place = document.createElement("div");
		d = document.body.appendChild(place);
		d.style.display = "none";
	},

	after_each: function() {
		removeNode(d);
	},

	'it should not call subWikify() if the "source" parameter is not provided': function() {
		var called = false;
		var original = Wikifier.prototype.subWikify;
		Wikifier.prototype.subWikify = function(source) {
			called = true;
			return;
		};
		var source = "";
		wikify();
		value_of(called).should_be_false();
		Wikifier.prototype.subWikify = original;
	},
	
	'it should not call subWikify() if the "source" parameter is an empty string': function() {
		var called = false;
		var original = Wikifier.prototype.subWikify;
		Wikifier.prototype.subWikify = function(source) {
			called = true;
			return;
		};
		var source = "";
		wikify(source);
		value_of(called).should_be_false();
		Wikifier.prototype.subWikify = original;
	},
	
	'it should call subWikify()': function() {
		var called = false;
		var original = Wikifier.prototype.subWikify;
		Wikifier.prototype.subWikify = function() {
			called = true;
			return;
		};
		var source = "hello";
		wikify(source);
		value_of(called).should_be(true);
		Wikifier.prototype.subWikify = original;
	}
});

describe('Wikifier: wikifyStatic()', {

	before_each: function() {
		place = document.createElement("div");
		d = document.body.appendChild(place);
		d.style.display = "none";
		source = "some text";
	},
	
	after_each: function() {
		removeNode(d);
	},
	
	'it should return an empty string if source does not exist or is an empty string': function() {
		var expected = "";
		var actual = wikifyStatic(null);
		value_of(actual).should_be(expected);
		var actual = wikifyStatic("");
		value_of(actual).should_be(expected);
	},
	
	'it should not require a tiddler to work': function() {
		var actual = wikifyStatic(source);
		value_of(actual).should_not_be_null();
	},
	
	'it should call subWikify() with the pre block as the only parameter': function() {
		tests_mock.before('Wikifier.prototype.subWikify',function() {
			/* console.log("in mocker");
			console.log(this);
			console.log(arguments.callee.name);
			console.log(arguments.callee.toString());
			console.log("----"); */
		});
		wikifyStatic(source);
		var called = tests_mock.after('Wikifier.prototype.subWikify');
		var expected = "PRE";
		var actual = "what do we set this to?";
		value_of(called).should_be(true);
		value_of(actual).should_be(expected);
	},
	
	'it should return a text string': function() {
		var expected = "string";
		var actual = typeof wikifyStatic(source);
	},
	
	'it should not leave any elements attached to the document body after returning': function() {
		var expected = document.body.childNodes.length;
		var html = wikifyStatic(source);
		var actual = document.body.childNodes.length;
		value_of(actual).should_be(expected);
	}
});

describe('Wikifier: wikifyPlain', {

	before_each: function() {
		store = new TiddlyWiki();
		loadShadowTiddlers();
		store.saveTiddler("t","t","text");
		formatter = new Formatter(config.formatters);
	},

	'it should use the store if only a title parameter is provided': function() {
		var actual = wikifyPlain("t");
		value_of(actual).should_not_be_null();
	},

	'it should call wikifyPlainText() if the tiddler exists in the store or is a shadow tiddler': function() {
		tests_mock.before('wikifyPlainText');
		wikifyPlain("t");
		var actual = tests_mock.after('wikifyPlainText');
		value_of(actual).should_be_true();
	},

	'it should call wikifyPlainText() if the tiddler is a shadow tiddler': function() {
		
		var t = store.isShadowTiddler("SiteTitle");
		value_of(t).should_be_true();
		mockVars = tests_mock.before('wikifyPlainText');
		wikifyPlain("SiteTitle");
		var actual = tests_mock.after('wikifyPlainText');
		value_of(actual).should_be_true();
	},

	'it should return an empty string if the tiddler isn\'t in the store or a shadow tiddler': function() {
		var tiddler = store.getTiddler("foo");
		value_of(tiddler).should_be(null);
		var actual = wikifyPlain("foo");
		var expected = "";
		value_of(actual).should_be(expected);
	}
});

describe('Wikifier: wikifyPlainText', {

	before_each: function() {
		store = new TiddlyWiki();
		loadShadowTiddlers();
		formatter = new Formatter(config.formatters);
	},

	'if a limit parameter is provided and the input text is greater in length than the limit, the number of characters generated should equal the limit': function() {
		var limit = 5;
		var	source = "aphraseof21characters";
		var actual = wikifyPlainText(source,limit).length;
		var expected = limit;
		value_of(actual).should_be(expected);
	},

	'it should call Wikifier.prototype.wikifyPlain()': function() {
		tests_mock.before('Wikifier.prototype.wikifyPlain');
		wikifyPlainText("hello",1,new Tiddler("temp"));
		var actual = tests_mock.after('Wikifier.prototype.wikifyPlain');
		value_of(actual).should_be_true();
	},
	
	'it should take an optional tiddler parameter that sets the context for the wikification': function() {
		var tiddler = new Tiddler("temp");
		var source = "<<view text>>";
		tiddler.text = "the text of a tiddler";
		var expected = tiddler.text;
		store.saveTiddler("temp","temp",tiddler.text);
		var actual = wikifyPlainText(source,null,tiddler);
		value_of(actual).should_be(expected);
	}
});

// ]]>

