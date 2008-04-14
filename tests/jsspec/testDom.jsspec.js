// <![CDATA[
describe('TiddlyWiki DOM functions', {
	'Element creation': function() {
		var actual = createTiddlyElement(null,"div");
		value_of(actual).should_not_be_null();
	},
	'Element id': function() {
		var actual = createTiddlyElement(null,"div","testId").id;
		var expected = "testId";		
		value_of(actual).should_be(expected);
	},
	'Element class': function() {
		var actual = createTiddlyElement(null,"div",null,"testClass").className;
		var expected = "testClass";		
		value_of(actual).should_be(expected);
	}
});
// ]]>
