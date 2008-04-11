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
	'Date formatting hours, minutes & seconds': function() {
		var actual = new Date(2008,11,31,3,8,9).formatString("0hh hh 0mm mm 0ss ss");
		var expected = "03 3 08 8 09 9";
		value_of(actual).should_be(expected);
	},
	'Date formatting 12-hour': function() {
		var actual = new Date(2008,11,31,15,8,9).formatString("hh12 0hh12 AM am PM pm");
		var expected = "3 03 PM pm PM pm";
		value_of(actual).should_be(expected);
	},
	'Date convertFromYYYYMMDDHHMM': function() {
		var actual = Date.convertFromYYYYMMDDHHMM("200812312348");
		var expected = new Date(2008,11,31,23,48);
		value_of(actual).should_be(expected);
	}
});
// ]]>
