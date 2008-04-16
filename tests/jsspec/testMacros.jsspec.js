// <![CDATA[
function __main() {
	store = new TiddlyWiki();
	loadShadowTiddlers();
	formatter = new Formatter(config.formatters);
}

describe('Macros: text macros', {

        before_each : function() {
		__main();
        },
        'version macro should expand to the version string' : function() { 
		var v = version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : "")
                value_of(wikifyStatic('<<version>>')).should_be("<span>"+v+"</span>");
        },
});

// ]]>
