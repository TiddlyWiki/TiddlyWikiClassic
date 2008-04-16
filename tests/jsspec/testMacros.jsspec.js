// <![CDATA[
describe('Macros: text macros', {
	before_each : function() {
		store = new TiddlyWiki();
		loadShadowTiddlers();
		formatter = new Formatter(config.formatters);
	},

	'version macro should expand to the version string' : function() { 
		var actual = wikifyStatic("<<version>>");
		var expected = version.major + "." + version.minor + "." + version.revision
		 	+ (version.beta ? " (beta " + version.beta + ")" : "");
		value_of(actual).should_be("<span>" + expected + "</span>");
	}
});
// ]]>
