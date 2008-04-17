// <![CDATA[
describe('Macros: text macros', {
	before_each : function() {
		store = new TiddlyWiki();
		loadShadowTiddlers();
		formatter = new Formatter(config.formatters);
	},

	'version macro should expand to the version string' : function() { 
		version.major = "123";
		version.minor = "456";
		version.revision = "789";
		version.beta = "123456789";
		value_of(wikifyStatic("<<version>>")).should_be("<span>123.456.789 (beta 123456789)</span>");
	},

	'today macro should return a date shaped string' : function() { 
		value_of(wikifyStatic("<<today>>")).should_match(/^<span>[A-Z][a-z]+\s[A-Z][a-z]+\s[0-9]{2}\s([0-9]){2}:[0-9]{2}:[0-9]{2} 2[0-9]{3}<\/span>$/);
	},

});
// ]]>
