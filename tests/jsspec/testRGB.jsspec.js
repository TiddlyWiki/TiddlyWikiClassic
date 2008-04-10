// <![CDATA[
describe('RGB', {
	'RGB test R value': function() {
		var actual = new RGB(255,0,0).toString();
		var expected = "#ff0000";		
		value_of(actual).should_be(expected);
	},
	'RGB test #f00': function() {
		var actual = new RGB("#f00").toString();
		var expected = "#ff0000";		
		value_of(actual).should_be(expected);
	}
})
// ]]>
