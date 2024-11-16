//--
//-- Augmented methods for the JavaScript Date() object
//--

// Substitute date components into a string
Date.prototype.formatString = function(template) {
	var tz = this.getTimezoneOffset();
	var atz = Math.abs(tz);
	var t = template
		.replace(/0hh12/g, String.zeroPad(this.getHours12(), 2))
		.replace(/hh12/g, this.getHours12())
		.replace(/0hh/g, String.zeroPad(this.getHours(), 2))
		.replace(/hh/g, this.getHours())
		.replace(/mmm/g, config.messages.dates.shortMonths[this.getMonth()])
		.replace(/0mm/g, String.zeroPad(this.getMinutes(), 2))
		.replace(/mm/g, this.getMinutes())
		.replace(/0ss/g, String.zeroPad(this.getSeconds(), 2))
		.replace(/ss/g, this.getSeconds())
		.replace(/[ap]m/g, this.getAmPm().toLowerCase())
		.replace(/[AP]M/g, this.getAmPm().toUpperCase())
		.replace(/wYYYY/g, this.getYearForWeekNo())
		.replace(/wYY/g, String.zeroPad(this.getYearForWeekNo() - 2000, 2))
		.replace(/YYYY/g, this.getFullYear())
		.replace(/YY/g, String.zeroPad(this.getFullYear() - 2000, 2))
		.replace(/MMM/g, config.messages.dates.months[this.getMonth()])
		.replace(/0MM/g, String.zeroPad(this.getMonth() + 1, 2))
		.replace(/MM/g, this.getMonth() + 1)
		.replace(/0WW/g, String.zeroPad(this.getWeek(), 2))
		.replace(/WW/g, this.getWeek())
		.replace(/DDD/g, config.messages.dates.days[this.getDay()])
		.replace(/ddd/g, config.messages.dates.shortDays[this.getDay()])
		.replace(/0DD/g, String.zeroPad(this.getDate(), 2))
		.replace(/DDth/g, this.getDate() + this.daySuffix())
		.replace(/DD/g, this.getDate())
		.replace(/TZD/g, (tz < 0 ? '+' : '-') + String.zeroPad(Math.floor(atz / 60), 2) +
			':' + String.zeroPad(atz % 60, 2))
		.replace(/\\/g, "");
	return t;
};

Date.prototype.getWeek = function() {
	var dt = new Date(this.getTime());
	var d = dt.getDay();
	// JavaScript Sun=0, ISO Sun=7
	if(d == 0) d = 7;
	// shift day to Thurs of same week to calculate weekNo
	dt.setTime(dt.getTime() + (4 - d) * 86400000);
	var n = Math.floor((dt.getTime() - new Date(dt.getFullYear(), 0, 1) + 3600000) / 86400000);
	return Math.floor(n / 7) + 1;
};

Date.prototype.getYearForWeekNo = function() {
	var dt = new Date(this.getTime());
	var d = dt.getDay();
	// JavaScript Sun=0, ISO Sun=7
	if(d == 0) d = 7;
	// shift day to Thurs of same week
	dt.setTime(dt.getTime() + (4 - d) * 86400000);
	return dt.getFullYear();
};

Date.prototype.getHours12 = function() {
	var h = this.getHours();
	return h > 12 ? h - 12 : ( h > 0 ? h : 12 );
};

Date.prototype.getAmPm = function() {
	return this.getHours() >= 12 ? config.messages.dates.pm : config.messages.dates.am;
};

Date.prototype.daySuffix = function() {
	return config.messages.dates.daySuffixes[this.getDate() - 1];
};

// Convert to local YYYYMMDDHHMM format string
Date.prototype.convertToLocalYYYYMMDDHHMM = function() {
	return this.getFullYear() + String.zeroPad(this.getMonth() + 1, 2) + String.zeroPad(this.getDate(), 2) +
		String.zeroPad(this.getHours(), 2) + String.zeroPad(this.getMinutes(), 2);
};

// Convert to UTC YYYYMMDDHHMM format string
Date.prototype.convertToYYYYMMDDHHMM = function() {
	return this.getUTCFullYear() + String.zeroPad(this.getUTCMonth() + 1, 2) + String.zeroPad(this.getUTCDate(), 2) +
		String.zeroPad(this.getUTCHours(), 2) + String.zeroPad(this.getUTCMinutes(), 2);
};

// Convert to UTC YYYYMMDD.HHMMSSMMM format string
Date.prototype.convertToYYYYMMDDHHMMSSMMM = function() {
	return this.getUTCFullYear() + String.zeroPad(this.getUTCMonth() + 1, 2) +
		String.zeroPad(this.getUTCDate(), 2) + "." + String.zeroPad(this.getUTCHours(), 2) +
		String.zeroPad(this.getUTCMinutes(), 2) + String.zeroPad(this.getUTCSeconds(), 2) +
		String.zeroPad(this.getUTCMilliseconds(), 3) + "0";
};

// Static. Create a date from a UTC YYYYMMDDHHMM format string
Date.convertFromYYYYMMDDHHMM = function(d) {
	d = d ? d.replace(/[^0-9]/g, "") : "";
	return Date.convertFromYYYYMMDDHHMMSSMMM(d.substr(0, 12));
};

// Static. Create a date from a UTC YYYYMMDDHHMMSS format string
Date.convertFromYYYYMMDDHHMMSS = function(d) {
	d = d ? d.replace(/[^0-9]/g, "") : "";
	return Date.convertFromYYYYMMDDHHMMSSMMM(d.substr(0, 14));
};

// Static. Create a date from a UTC YYYYMMDDHHMMSSMMM format string
Date.convertFromYYYYMMDDHHMMSSMMM = function(d) {
	d = d ? d.replace(/[^0-9]/g, "") : "";
	return new Date(Date.UTC(parseInt(d.substr(0, 4), 10),
		parseInt(d.substr(4, 2), 10) - 1,
		parseInt(d.substr(6, 2), 10),
		parseInt(d.substr(8, 2) || "00", 10),
		parseInt(d.substr(10, 2) || "00", 10),
		parseInt(d.substr(12, 2) || "00", 10),
		parseInt(d.substr(14, 3) || "000", 10)));
};

