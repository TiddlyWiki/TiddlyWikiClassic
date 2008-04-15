// <![CDATA[
describe('Date components', {
	'12-hour format (with zero-padding) should return correct result for AM times': function() {
		var actual = new Date(2008,11,31,9,48).formatString("0hh12");
		var expected = "09";
		value_of(actual).should_be(expected);
	},
	'12-hour format (with zero-padding) should return correct result for PM times': function() {
		var actual = new Date(2008,11,31,21,48).formatString("0hh12");
		var expected = "09";
		value_of(actual).should_be(expected);
	},
	'12-hour format (without zero-padding) should return correct result for AM times': function() {
		var actual = new Date(2008,11,31,9,48).formatString("hh12");
		var expected = "9";
		value_of(actual).should_be(expected);
	},
	'12-hour format (without zero-padding) should return correct result for PM times': function() {
		var actual = new Date(2008,11,31,21,48).formatString("hh12");
		var expected = "9";
		value_of(actual).should_be(expected);
	},
	'24-hour format (with zero-padding) should return correct result for AM times': function() {
		var actual = new Date(2008,11,31,9,48).formatString("0hh");
		var expected = "09";
		value_of(actual).should_be(expected);
	},
	'24-hour format (with zero-padding) should return correct result for PM times': function() {
		var actual = new Date(2008,11,31,21,48).formatString("0hh");
		var expected = "21";
		value_of(actual).should_be(expected);
	},
	'24-hour format (without zero-padding) should return correct result for AM times': function() {
		var actual = new Date(2008,11,31,9,48).formatString("hh");
		var expected = "9";
		value_of(actual).should_be(expected);
	},
	'24-hour format (without zero-padding) should return correct result for PM times': function() {
		var actual = new Date(2008,11,31,21,48).formatString("hh");
		var expected = "21";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Jan" for month 0': function() {
		var actual = new Date(2008,0).formatString("mmm");
		var expected = "Jan";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Feb" for month 1': function() {
		var actual = new Date(2008,1).formatString("mmm");
		var expected = "Feb";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Mar" for month 2': function() {
		var actual = new Date(2008,2).formatString("mmm");
		var expected = "Mar";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Apr" for month 3': function() {
		var actual = new Date(2008,3).formatString("mmm");
		var expected = "Apr";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "May" for month 4': function() {
		var actual = new Date(2008,4).formatString("mmm");
		var expected = "May";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Jun" for month 5': function() {
		var actual = new Date(2008,5).formatString("mmm");
		var expected = "Jun";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Jul" for month 6': function() {
		var actual = new Date(2008,6).formatString("mmm");
		var expected = "Jul";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Aug" for month 7': function() {
		var actual = new Date(2008,7).formatString("mmm");
		var expected = "Aug";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Sep" for month 8': function() {
		var actual = new Date(2008,8).formatString("mmm");
		var expected = "Sep";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Oct" for month 9': function() {
		var actual = new Date(2008,9).formatString("mmm");
		var expected = "Oct";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Nov" for month 10': function() {
		var actual = new Date(2008,10).formatString("mmm");
		var expected = "Nov";
		value_of(actual).should_be(expected);
	},
	'short-month format should return "Dec" for month 12': function() {
		var actual = new Date(2008,11).formatString("mmm");
		var expected = "Dec";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "January" for month 0': function() {
		var actual = new Date(2008,0).formatString("MMM");
		var expected = "January";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "February" for month 1': function() {
		var actual = new Date(2008,1).formatString("MMM");
		var expected = "February";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "March" for month 2': function() {
		var actual = new Date(2008,2).formatString("MMM");
		var expected = "March";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "April" for month 3': function() {
		var actual = new Date(2008,3).formatString("MMM");
		var expected = "April";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "May" for month 4': function() {
		var actual = new Date(2008,4).formatString("MMM");
		var expected = "May";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "June" for month 5': function() {
		var actual = new Date(2008,5).formatString("MMM");
		var expected = "June";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "July" for month 6': function() {
		var actual = new Date(2008,6).formatString("MMM");
		var expected = "July";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "August" for month 7': function() {
		var actual = new Date(2008,7).formatString("MMM");
		var expected = "August";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "September" for month 8': function() {
		var actual = new Date(2008,8).formatString("MMM");
		var expected = "September";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "October" for month 9': function() {
		var actual = new Date(2008,9).formatString("MMM");
		var expected = "October";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "November" for month 10': function() {
		var actual = new Date(2008,10).formatString("MMM");
		var expected = "November";
		value_of(actual).should_be(expected);
	},
	'full-month format should return "December" for month 12': function() {
		var actual = new Date(2008,11).formatString("MMM");
		var expected = "December";
		value_of(actual).should_be(expected);
	}
});

describe('Date formatting', {
	'Date formatting YYYY MMM DD': function() {
		var actual = new Date(2007,2,1).formatString("YYYY MMM DD");
		var expected = "2007 March 1";
		value_of(actual).should_be(expected);
	},
	'Given a format string including text (such as DD of MMM, YYYY) the date format outputs accordingly.': function() {
		var actual = new Date(2007,2,1).formatString("DD of MMM, YYYY");
		var expected = "1 of March, 2007";
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
	'Date formatting 12-hour (AM)': function() {
		var actual = new Date(2008,11,31,3,8,9).formatString("hh12 0hh12 AM am PM pm");
		var expected = "3 03 AM am AM am";
		value_of(actual).should_be(expected);
	},
	'Date formatting 12-hour (PM)': function() {
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

describe('Information about dates', {
	'Given an AM time, getAmPm returns am': function() {
		var actual = new Date(2007,2,1,10,00).getAmPm();
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'Given an PM time, getAmPm returns pm': function() {
		var actual = new Date(2007,2,1,13,00).getAmPm();
		var expected = "pm";
		value_of(actual).should_be(expected);
	},
	'Give a valid date (1st), daySuffix returns the correct day Suffix ': function() {
		var actual = new Date(2007,2,1).daySuffix();
		var expected = "st";
		value_of(actual).should_be(expected);
	}
});

// ]]>
