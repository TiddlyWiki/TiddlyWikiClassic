// <![CDATA[
describe('Strings', {
	'String right': function() {
		var actual = "abcdef".right(3);
		var expected = "def";		
		value_of(actual).should_be(expected);
	},
	'String trim': function() {
		var actual = " abcdef ".trim();
		var expected = "abcdef";		
		value_of(actual).should_be(expected);
	},
	'String undash': function() {
		var actual = "background-color".unDash();
		var expected = "backgroundColor";		
		value_of(actual).should_be(expected);
	},
	'String format with an empty substring array should return input string': function() {
		var actual = "hello %0, is your favourite colour red?".format([]);
		var expected = "hello , is your favourite colour red?";
		value_of(actual).should_be(expected);
	},
	'String format with a substrings array of correct size (1) should add substrings in the right places': function() {
		var actual = "hello %0, is your favourite colour red?".format(["Jon"]);
		var expected = "hello Jon, is your favourite colour red?";
		value_of(actual).should_be(expected);
	},
	'String format with a substrings array of more than enough substrings (1 needed) should add substrings in the right places': function() {
		var actual = "hello %0, is your favourite colour red?".format(["Jon","rhubarb","rhubarb"]);
		var expected = "hello Jon, is your favourite colour red?";
		value_of(actual).should_be(expected);
	},
	'String format with an empty substring array and no %1-type specifiers should return input string': function() {
		var actual = "hello Jon, is your favourite colour red?".format([]);
		var expected = "hello Jon, is your favourite colour red?";
		value_of(actual).should_be(expected);
	},
	'String format with a substrings array of non-zero size (1) and no %1-type specifiers should return input string': function() {
		var actual = "hello Jon, is your favourite colour red?".format(["rhubarb"]);
		var expected = "hello Jon, is your favourite colour red?";
		value_of(actual).should_be(expected);
	},
	'String.encodeTiddlyLinkList with null parameter should return null string': function() {
		var actual = String.encodeTiddlyLinkList();
		var expected = "";
		value_of(actual).should_be(expected);
	},
	'String.encodeTiddlyLinkList with empty array as parameter should return null string': function() {
		var actual = String.encodeTiddlyLinkList([]);
		var expected = "";
		value_of(actual).should_be(expected);
	}
});
// ]]>
