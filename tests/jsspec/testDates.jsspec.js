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

	'minutes format (with zero-padding) should return "00" for minute 0': function() {
		var actual = new Date(2008,11,15,11,0).formatString("0mm");
		var expected = "00";
		value_of(actual).should_be(expected);
	},
	'minutes format (with zero-padding) should return "05" for minute 5': function() {
		var actual = new Date(2008,11,15,11,5).formatString("0mm");
		var expected = "05";
		value_of(actual).should_be(expected);
	},
	'minutes format (with zero-padding) should return "30" for minute 30': function() {
		var actual = new Date(2008,11,15,11,30).formatString("0mm");
		var expected = "30";
		value_of(actual).should_be(expected);
	},
	'minutes format (with zero-padding) should return "00" for minute 60': function() {
		var actual = new Date(2008,11,15,11,60).formatString("0mm");
		var expected = "00";
		value_of(actual).should_be(expected);
	},
	'minutes format (without zero-padding) should return "0" for minute 0': function() {
		var actual = new Date(2008,11,15,11,0).formatString("mm");
		var expected = "0";
		value_of(actual).should_be(expected);
	},
	'minutes format (without zero-padding) should return "5" for minute 5': function() {
		var actual = new Date(2008,11,15,11,5).formatString("mm");
		var expected = "5";
		value_of(actual).should_be(expected);
	},
	'minutes format (without zero-padding) should return "30" for minute 30': function() {
		var actual = new Date(2008,11,15,11,30).formatString("mm");
		var expected = "30";
		value_of(actual).should_be(expected);
	},
	'minutes format (without zero-padding) should return "0" for minute 60': function() {
		var actual = new Date(2008,11,15,11,60).formatString("mm");
		var expected = "0";
		value_of(actual).should_be(expected);
	},

	'seconds format (with zero-padding) should return "00" for second 0': function() {
		var actual = new Date(2008,11,15,11,1,0).formatString("0ss");
		var expected = "00";
		value_of(actual).should_be(expected);
	},
	'seconds format (with zero-padding) should return "05" for second 5': function() {
		var actual = new Date(2008,11,15,11,1,5).formatString("0ss");
		var expected = "05";
		value_of(actual).should_be(expected);
	},
	'seconds format (with zero-padding) should return "30" for second 30': function() {
		var actual = new Date(2008,11,15,11,1,30).formatString("0ss");
		var expected = "30";
		value_of(actual).should_be(expected);
	},
	'seconds format (with zero-padding) should return "00" for second 60': function() {
		var actual = new Date(2008,11,15,11,1,60).formatString("0ss");
		var expected = "00";
		value_of(actual).should_be(expected);
	},
	'seconds format (without zero-padding) should return "0" for second 0': function() {
		var actual = new Date(2008,11,15,11,1,0).formatString("ss");
		var expected = "0";
		value_of(actual).should_be(expected);
	},
	'seconds format (without zero-padding) should return "5" for second 5': function() {
		var actual = new Date(2008,11,15,11,1,5).formatString("ss");
		var expected = "5";
		value_of(actual).should_be(expected);
	},
	'seconds format (without zero-padding) should return "30" for second 30': function() {
		var actual = new Date(2008,11,15,11,1,30).formatString("ss");
		var expected = "30";
		value_of(actual).should_be(expected);
	},
	'seconds format (without zero-padding) should return "0" for second 60': function() {
		var actual = new Date(2008,11,15,11,1,60).formatString("ss");
		var expected = "0";
		value_of(actual).should_be(expected);
	},

	'am format should return "am" for pre-noon times (00:00:00)': function() {
		var actual = new Date(2008,11,15,0).formatString("am");
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'am format should return "am" for pre-noon times (08:00:00)': function() {
		var actual = new Date(2008,11,15,8).formatString("am");
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'am format should return "am" for pre-noon times (11:59:59)': function() {
		var actual = new Date(2008,11,15,11,59,59).formatString("am");
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'pm format should return "am" for pre-noon times (00:00:00)': function() {
		var actual = new Date(2008,11,15,0).formatString("pm");
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'pm format should return "am" for pre-noon times (08:00:00)': function() {
		var actual = new Date(2008,11,15,8).formatString("pm");
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'pm format should return "am" for pre-noon times (11:59:59)': function() {
		var actual = new Date(2008,11,15,11,59,59).formatString("pm");
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'am format should return "pm" for pre-midnight times (12:00:00)': function() {
		var actual = new Date(2008,11,15,12).formatString("am");
		var expected = "pm";
		value_of(actual).should_be(expected);
	},
	'am format should return "pm" for pre-midnight times (20:00:00)': function() {
		var actual = new Date(2008,11,15,20).formatString("am");
		var expected = "pm";
		value_of(actual).should_be(expected);
	},
	'am format should return "pm" for pre-midnight times (23:59:59)': function() {
		var actual = new Date(2008,11,15,23,59,59).formatString("am");
		var expected = "pm";
		value_of(actual).should_be(expected);
	},
	'pm format should return "pm" for pre-midnight times (12:00:00)': function() {
		var actual = new Date(2008,11,15,12).formatString("pm");
		var expected = "pm";
		value_of(actual).should_be(expected);
	},
	'pm format should return "pm" for pre-midnight times (20:00:00)': function() {
		var actual = new Date(2008,11,15,20).formatString("pm");
		var expected = "pm";
		value_of(actual).should_be(expected);
	},
	'pm format should return "pm" for pre-midnight times (23:59:59)': function() {
		var actual = new Date(2008,11,15,23,59,59).formatString("pm");
		var expected = "pm";
		value_of(actual).should_be(expected);
	},

	'AM format should return "AM" for pre-noon times (00:00:00)': function() {
		var actual = new Date(2008,11,15,0).formatString("AM");
		var expected = "AM";
		value_of(actual).should_be(expected);
	},
	'AM format should return "AM" for pre-noon times (08:00:00)': function() {
		var actual = new Date(2008,11,15,8).formatString("AM");
		var expected = "AM";
		value_of(actual).should_be(expected);
	},
	'AM format should return "AM" for pre-noon times (11:59:59)': function() {
		var actual = new Date(2008,11,15,11,59,59).formatString("AM");
		var expected = "AM";
		value_of(actual).should_be(expected);
	},
	'PM format should return "AM" for pre-noon times (00:00:00)': function() {
		var actual = new Date(2008,11,15,0).formatString("PM");
		var expected = "AM";
		value_of(actual).should_be(expected);
	},
	'PM format should return "AM" for pre-noon times (08:00:00)': function() {
		var actual = new Date(2008,11,15,8).formatString("PM");
		var expected = "AM";
		value_of(actual).should_be(expected);
	},
	'PM format should return "AM" for pre-noon times (11:59:59)': function() {
		var actual = new Date(2008,11,15,11,59,59).formatString("PM");
		var expected = "AM";
		value_of(actual).should_be(expected);
	},
	'AM format should return "PM" for pre-midnight times (12:00:00)': function() {
		var actual = new Date(2008,11,15,12).formatString("AM");
		var expected = "PM";
		value_of(actual).should_be(expected);
	},
	'AM format should return "PM" for pre-midnight times (20:00:00)': function() {
		var actual = new Date(2008,11,15,20).formatString("AM");
		var expected = "PM";
		value_of(actual).should_be(expected);
	},
	'AM format should return "PM" for pre-midnight times (23:59:59)': function() {
		var actual = new Date(2008,11,15,23,59,59).formatString("AM");
		var expected = "PM";
		value_of(actual).should_be(expected);
	},
	'PM format should return "PM" for pre-midnight times (12:00:00)': function() {
		var actual = new Date(2008,11,15,12).formatString("PM");
		var expected = "PM";
		value_of(actual).should_be(expected);
	},
	'PM format should return "PM" for pre-midnight times (20:00:00)': function() {
		var actual = new Date(2008,11,15,20).formatString("PM");
		var expected = "PM";
		value_of(actual).should_be(expected);
	},
	'PM format should return "PM" for pre-midnight times (23:59:59)': function() {
		var actual = new Date(2008,11,15,23,59,59).formatString("PM");
		var expected = "PM";
		value_of(actual).should_be(expected);
	},

	'week-based four-digit year number should return the year based on the week number': function() {
		var actual = new Date(2007,11,31).formatString("wYYYY");
		var expected = "2008";
		value_of(actual).should_be(expected);
	},
	'week-based two-digit year number should return the year based on the week number': function() {
		var actual = new Date(2007,11,31).formatString("wYY");
		var expected = "08";
		value_of(actual).should_be(expected);
	},
	'four-digit year number should return the correct year': function() {
		var actual = new Date(2007,11,31).formatString("YYYY");
		var expected = "2007";
		value_of(actual).should_be(expected);
	},
	'four-digit year number should return the correct year based on 20th century': function() {
		var actual = new Date(7,11,31).formatString("YYYY");
		var expected = "1907";
		value_of(actual).should_be(expected);
	},
	'two-digit year number should return the correct year': function() {
		var actual = new Date(2007,11,31).formatString("YY");
		var expected = "07";
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
	},

	'months format (with zero-padding) should return "01" for January': function() {
		var actual = new Date(2008,0).formatString("0MM");
		var expected = "01";
		value_of(actual).should_be(expected);
	},
	'months format (with zero-padding) should return "12" for December': function() {
		var actual = new Date(2008,11).formatString("0MM");
		var expected = "12";
		value_of(actual).should_be(expected);
	},
	'months format (with zero-padding) should return "01" for month 13': function() {
		var actual = new Date(2008,12).formatString("0MM");
		var expected = "01";
		value_of(actual).should_be(expected);
	},
	'months format (without zero-padding) should return "1" for January': function() {
		var actual = new Date(2008,0).formatString("MM");
		var expected = "1";
		value_of(actual).should_be(expected);
	},
	'months format (without zero-padding) should return "12" for December': function() {
		var actual = new Date(2008,11).formatString("MM");
		var expected = "12";
		value_of(actual).should_be(expected);
	},
	'months format (without zero-padding) should return "1" for month 13': function() {
		var actual = new Date(2008,12).formatString("MM");
		var expected = "1";
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
		var actual = new Date(2007,2,1,10,0).getAmPm();
		var expected = "am";
		value_of(actual).should_be(expected);
	},
	'Given an PM time, getAmPm returns pm': function() {
		var actual = new Date(2007,2,1,13,0).getAmPm();
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
