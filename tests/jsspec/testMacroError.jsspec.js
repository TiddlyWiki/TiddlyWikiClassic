// <![CDATA[

function __main() {
	store = new TiddlyWiki();
	loadShadowTiddlers();
	formatter = new Formatter(config.formatters);	
}

describe('Macros: list macro', {
	before_each : function() {
		__main();
	},

	'The specified macro should not exist and result in a string containing the text errortext' : function() { 	
		value_of(wikifyStatic('<<NOEXISTANTMACRO>>')).should_match(/errortext/);
	},

	'should pass becuase the macro exists and does not contain any errors' : function() { 			
		value_of(wikifyStatic('<<list all>>')).should_not_match(/errortext/);
	},

});

// ]]>
