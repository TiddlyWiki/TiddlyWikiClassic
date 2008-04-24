// <![CDATA[
describe('Version', {
	'there should be a version value': function() {
		value_of(version).should_not_be_null();
	},
	'the title should be "TiddlyWiki"': function() {
		value_of(version.title).should_be('TiddlyWiki');
	},
	'the major value should be a number': function() {
		value_of(parseInt(version.major)).should_not_be(NaN);
	},
	'the minor value should be a number': function() {
		value_of(parseInt(version.minor)).should_not_be(NaN);
	},
	'the revision value should be a number': function() {
		value_of(parseInt(version.revision)).should_not_be(NaN);
	},
	'the beta value should be a number': function() {
		value_of(parseInt(version.beta)).should_not_be(NaN);
	},
	'the date value should be a TiddlyWiki Date object': function() {
		value_of(typeof version.date).should_be('object');
		value_of(version.date.convertToYYYYMMDDHHMM()).should_match(/^\d{12,12}$/);
	},
	'the extensions value should be an object': function() {
		value_of(typeof version.extensions).should_be('object');
	},
	'format version 1.2.3 beta 5 should match an asserted string': function() {
		var v = {title: "TiddlyWiki", major: 1, minor: 2, revision: 3, beta: 5, date: new Date("Apr 17, 2008"), extensions: {}};
		var expected = "1.2.3 (beta 5)";
		var actual = formatVersion(v);
		value_of(actual).should_be(expected);
	},
	'format version should match a constructed value': function() {
		var expected = version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : "");
		var actual = formatVersion();
		value_of(actual).should_be(expected);
	},

	'version 2.4.0 beta 2 should equal version 2.4.0 beta 2': function() {
		var v1 = {title: "TiddlyWiki", major: 2, minor: 4, revision: 0, beta: 2, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 2, minor: 4, revision: 0, beta: 2, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(0);
	},
	'version 1.0 should be less than version 2.0': function() {
		var v1 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 2, minor: 0, revision: 0, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(1);
	},
	'version 1.0 should be less than version 1.1': function() {
		var v1 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 1, minor: 1, revision: 0, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(1);
	},
	'version 1.0.0 should be less than version 1.0.1': function() {
		var v1 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 1, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(1);
	},
	'version 1.0.0 (no beta) should be more than version 1.0.0 beta 1': function() {
		var v1 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, beta: 1, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(-1);
	},
	'version 1.0.0 beta 1 should be less than version 1.0.0 beta 2': function() {
		var v1 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, beta: 1, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 1, minor: 0, revision: 0, beta: 2, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(1);
	},
	'version 1.2.3 (no beta) should be more than version 1.2.3 beta 4': function() {
		var v1 = {title: "TiddlyWiki", major: 1, minor: 2, revision: 3, date: new Date("Apr 17, 2008"), extensions: {}};
		var v2 = {title: "TiddlyWiki", major: 1, minor: 2, revision: 3, beta: 4, date: new Date("Apr 17, 2008"), extensions: {}};
		value_of(compareVersions(v1,v2)).should_be(-1);
	}
});
// ]]>
