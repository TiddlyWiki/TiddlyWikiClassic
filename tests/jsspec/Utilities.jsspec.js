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
		}
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
