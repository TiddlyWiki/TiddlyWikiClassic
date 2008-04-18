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
		wikify();
	},
	
	'it should not call subWikify() if the "source" parameter is an empty string': function() {
		var source = "";
		wikify(source);
	},
	
	'it should call subWikify()': function() {
		var called = false;
		Wikifier.prototype.subWikify = function() {
			called = true;
			return;
		};
	}
});

// ]]>

