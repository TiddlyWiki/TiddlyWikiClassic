// <![CDATA[
describe('TiddlyWiki DOM element creation', {
	'Element creation should create the DOM element': function() {
		var actual = createTiddlyElement(null,"div");
		value_of(actual).should_not_be_null();
	},
	'Setting the parent parameter should append the new DOM element to the parent': function() {
		var parent = document.body;
		var before = document.body.childNodes.length;
		var actual = createTiddlyElement(parent,"div");
		var after = document.body.childNodes.length;
		value_of(++before).should_be(after);
	},
	'Setting the element id parameter should set the id on the DOM element': function() {
		var actual = createTiddlyElement(null,"div","testId").id;
		var expected = "testId";		
		value_of(actual).should_be(expected);
	},
	'Setting the class parameter should set the class on the DOM element': function() {
		var actual = createTiddlyElement(null,"div",null,"testClass").className;
		var expected = "testClass";		
		value_of(actual).should_be(expected);
	}
});
// ]]>
