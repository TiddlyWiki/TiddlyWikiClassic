jQuery(document).ready(function(){

	module("Wikifier.js");

	test("getParser()", function() {
		expect(7);

		formatter = new Formatter(config.formatters);
		
		var actual = getParser(null,null);
		var expected = formatter;
		equals(actual, expected, 'it should return the default formatter if no tiddler argument is provided');
		
		var t = new Tiddler("t");
		actual = getParser(t,null);
		expected = formatter;
		equals(actual, expected, 'it should return the default formatter if no format argument is provided and the tiddler has no "wikiformat" field and is not tagged with the value of formatTag of a member of config.parsers');

		actual = getParser(t,"nomatch");
		expected = formatter;
		equals(actual, expected, 'it should return the default formatter if a format argument is provided, but does not appear as a value of formatTag of a member of config.parsers; the tiddler has no "wikiformat" field and is not tagged with the value of formatTag from a member of config.parsers');
		
		t.fields.wikiformat = "nomatch";
		actual = getParser(t,null);
		expected = formatter;
		equals(actual, expected, 'it should return the default formatter if the tiddler has a "wikiformat" field that does not appear as a value of formatTag of a member of config.parsers; no format argument is provided and the tiddler is not tagged with the value of formatTag from a member of config.parsers');
	
		t.fields.wikiformat = "format_field";
		t.tags.push("format_tag");
		config.parsers.field = {
			format: "format_field"
		};
		config.parsers.tag = {
			formatTag: "format_tag"
		};
		actual = getParser(t,null);
		expected = config.parsers.field;
		equals(actual, expected, 'it should return the formatter specified by the "wikiformat" field even if a format tag is provided; no format parameter is provided');
		config.parsers.field = {};
		config.parsers.tag = {};
	
		t = new Tiddler("t");
		t.tags.push("format_tag");
		config.parsers.tag = {
			formatTag: "format_tag"
		};
		actual = getParser(t,null);
		expected = config.parsers.tag;
		equals(actual, expected, 'it should return the formatter specified by the format tag; the tiddler has no "wikiformat" field and no format parameter is provided');

		t = new Tiddler("t");
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
		actual = getParser(t,"format_parameter");
		expected = config.parsers.parameter;
		equals(actual, expected, 'it should return the formatter specified by the format parameter even if a format tag and a "wikiformat" field are provided');
		config.parsers.field = {};
		config.parsers.tag = {};
		config.parsers.parameter = {};
	});
	
	test('wikify(): it should not call subWikify() if the "source" parameter is not provided', function() {
		expect(1);
	
		var place = document.createElement("div");
		var d = document.body.appendChild(place);
		d.style.display = "none";
		
		var subWikifyMock = new jqMock.Mock(Wikifier.prototype, "subWikify");
		subWikifyMock.modify().args().multiplicity(0);
		wikify();
		subWikifyMock.verifyAll();
		subWikifyMock.restore();
	});
});
