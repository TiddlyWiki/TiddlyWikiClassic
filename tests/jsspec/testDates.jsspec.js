// <![CDATA[
describe('Dates', {
	'Date formatting YYYY MMM DD': function() {
		var actual = new Date(2007,2,1).formatString("YYYY MMM DD");
		var expected = "2007 March 1";
		
		value_of(actual).should_be(expected);
	},
	'Date formatting YYYY MMM DD hh:mm ss': function() {
		var actual = new Date(2008,11,31,23,48,59).formatString("YYYY MMM DD hh:mm ss");
		var expected = "2008 December 31 23:48 59";
		
		value_of(actual).should_be(expected);
	},
	'Date convertFromYYYYMMDDHHMM': function() {
		var actual = Date.convertFromYYYYMMDDHHMM("200812312348");
		var expected = new Date(2008,11,31,23,48);
		
		value_of(actual).should_be(expected);
	},
})
// ]]>
