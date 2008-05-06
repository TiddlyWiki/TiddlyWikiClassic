describe('Utilities: formatVersion', {
	before_each: function() {
		v = {
			major:1,
			minor:2,
			revision:3
		};
		v_beta = {
			major:1,
			minor:2,
			revision:3,
			beta:true
		};
	},
	'it should use a version object if one is passed as a parameter, which has properties: major, minor, revision, beta (optional) and format the output as "major.minor.revision"': function() {
		var actual = formatVersion(v);
		var expected = v.major+"."+v.minor+"."+v.revision;
		value_of(actual).should_be(expected);
	},
	'it doesn\'t need to take an argument, in which case it will use the global "version" variable': function() {
		var actual = formatVersion();
		var expected = version.major+"."+version.minor+"."+version.revision+" ("+(version.beta?"beta "+version.beta+")" : "");
		value_of(actual).should_be(expected);
	},
	'it should return a string': function() {
		var actual = typeof formatVersion();
		var expected = "string";
		value_of(actual).should_be(expected);
	},
	'it should append the string " (beta #)", where # is the beta number if the beta number is set': function() {
		var actual = formatVersion(v_beta).indexOf("beta "+v_beta.beta) != -1;
		value_of(actual).should_be_true();
	},
	after_each: function() {
		delete v;
		delete v_beta;
	}
});

describe('Utilities: compareVersions', {
	before_each: function() {
		v1 = {
			major:1,
			minor:2,
			revision:3
		};
		v1_beta = {
			major:1,
			minor:2,
			revision:3,
			beta:true
		};
		v2 = {
			major:v1.major,
			minor:v1.minor,
			revision:v1.revision
		};
	},

	'it should return +1 if the second version is later than the first': function() {
		v2.major = v1.major+1;
		var actual = compareVersions(v1,v2);
		var expected = 1;
		value_of(actual).should_be(expected);
		v2.major--;
		v2.minor = v1.minor+1;
		actual = compareVersions(v1,v2);
		expected = 1;
		value_of(actual).should_be(expected);
		v2.minor--;
		v2.revision = v1.revision+1;
		actual = compareVersions(v1,v2);
		expected = 1;
		value_of(actual).should_be(expected);
	},
	
	'it should return 0 if the second version is the same as the first': function() {
		var actual = compareVersions(v1,v2);
		var expected = 0;
		value_of(actual).should_be(expected);
	},
	
	'it should return -1 if the second version is earlier than the first': function() {
		v2.major = v1.major-1;
		var actual = compareVersions(v1,v2);
		var expected = -1;
		value_of(actual).should_be(expected);
		v2.major++;
		v2.minor = v1.minor-1;
		actual = compareVersions(v1,v2);
		expected = -1;
		value_of(actual).should_be(expected);
		v2.minor++;
		v2.revision = v1.revision-1;
		actual = compareVersions(v1,v2);
		expected = -1;
		value_of(actual).should_be(expected);
	},
	
	'it should treat versions without a beta number as later than a version without a beta number': function() {
		var actual = compareVersions(v1,v1_beta);
		var expected = -1;
		value_of(actual).should_be(expected);
	}

});

//# Compares two TiddlyWiki version objects
//# Returns +1 if v2 is later than v1
//#          0 if v2 is the same as v1
//#         -1 if v2 is earlier than v1
//# version without a beta number is later than a version with a beta number
compareVersions = function(v1,v2)
{
	var a = ["major","minor","revision"];
	for(var i = 0; i<a.length; i++) {
		var x1 = v1[a[i]] || 0;
		var x2 = v2[a[i]] || 0;
		if(x1<x2)
			return 1;
		if(x1>x2)
			return -1;
	}
	x1 = v1.beta || 9999;
	x2 = v2.beta || 9999;
	if(x1<x2)
		return 1;
	return x1 > x2 ? -1 : 0;
};