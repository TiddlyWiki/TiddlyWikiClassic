// <![CDATA[
describe('Version', {
	'there should be a version value': function() {	
		value_of(version).should_not_be_null();
	},
	'the title should be "TiddlyWiki"': function() {	
		value_of(version.title).should_be('TiddlyWiki');
	},
	'the major value should be a number': function() {	
		value_of(typeof version.major).should_be('number');
	},
	'the minor value should be a number': function() {	
		value_of(typeof version.minor).should_be('number');
	},
	'the revision value should be a number': function() {	
		value_of(typeof version.revision).should_be('number');
	},
	'the beta value should be a revision number': function() {	
		value_of(typeof version.beta).should_be('number');
	},
	'the date value should be a TiddlyWiki Date object': function() {	
		value_of(typeof version.date).should_be('object');
		value_of(version.date.convertToYYYYMMDDHHMM()).should_match(/^\d{12,12}$/);
	},
	'the extensions value should be an object': function() {	
		value_of(typeof version.extensions).should_be('object');
	},
});
// ]]>

