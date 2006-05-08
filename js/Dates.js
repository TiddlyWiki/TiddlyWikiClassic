// ---------------------------------------------------------------------------------
// Augmented methods for the JavaScript Date() object
// ---------------------------------------------------------------------------------

// Substitute date components into a string
Date.prototype.formatString = function(template)
{
	template = template.replace(/YYYY/g,this.getFullYear());
	template = template.replace(/YY/g,String.zeroPad(this.getFullYear()-2000,2));
	template = template.replace(/MMM/g,config.messages.dates.months[this.getMonth()]);
	template = template.replace(/0MM/g,String.zeroPad(this.getMonth()+1,2));
	template = template.replace(/MM/g,this.getMonth()+1);
	template = template.replace(/DDD/g,config.messages.dates.days[this.getDay()]);
	template = template.replace(/0DD/g,String.zeroPad(this.getDate(),2));
	template = template.replace(/DDth/g,this.getDate()+this.daySuffix());
	template = template.replace(/DD/g,this.getDate());
	template = template.replace(/0hh/g,String.zeroPad(this.getHours(),2));
	template = template.replace(/hh/g,this.getHours());
	template = template.replace(/0mm/g,String.zeroPad(this.getMinutes(),2));
	template = template.replace(/mm/g,this.getMinutes());
	template = template.replace(/0ss/g,String.zeroPad(this.getSeconds(),2));
	template = template.replace(/ss/g,this.getSeconds());
	return template;
}

Date.prototype.daySuffix = function()
{
	var num = this.getDate();
	if (num >= 11 && num <= 13) return "th";
	else if (num.toString().substr(-1)=="1") return "st";
	else if (num.toString().substr(-1)=="2") return "nd";
	else if (num.toString().substr(-1)=="3") return "rd";
	return "th";
}

// Convert a date to local YYYYMMDDHHMM string format
Date.prototype.convertToLocalYYYYMMDDHHMM = function()
{
	return(String.zeroPad(this.getFullYear(),4) + String.zeroPad(this.getMonth()+1,2) + String.zeroPad(this.getDate(),2) + String.zeroPad(this.getHours(),2) + String.zeroPad(this.getMinutes(),2));
}

// Convert a date to UTC YYYYMMDDHHMM string format
Date.prototype.convertToYYYYMMDDHHMM = function()
{
	return(String.zeroPad(this.getUTCFullYear(),4) + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2));
}

// Convert a date to UTC YYYYMMDD.HHMMSSMMM string format
Date.prototype.convertToYYYYMMDDHHMMSSMMM = function()
{
	return(String.zeroPad(this.getUTCFullYear(),4) + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + "." + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2) + String.zeroPad(this.getUTCSeconds(),2) + String.zeroPad(this.getUTCMilliseconds(),4));
}

// Static method to create a date from a UTC YYYYMMDDHHMM format string
Date.convertFromYYYYMMDDHHMM = function(d)
{
	var theDate = new Date(Date.UTC(parseInt(d.substr(0,4),10),
							parseInt(d.substr(4,2),10)-1,
							parseInt(d.substr(6,2),10),
							parseInt(d.substr(8,2),10),
							parseInt(d.substr(10,2),10),0,0));
	return(theDate);
}

