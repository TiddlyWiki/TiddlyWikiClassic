// <![CDATA[
describe('Dates', {
	'Date formatting YYYY MMM DD': function() {
		var actual = new Date(2007,2,1).formatString("YYYY MMM DD");
		var expected = "2007 March 1";
		
		value_of(actual).should_be(expected);
	}
})
// ]]>
