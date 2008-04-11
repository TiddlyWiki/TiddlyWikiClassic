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
	}
});
// ]]>
