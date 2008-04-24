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

	'should fail due to the macro not existing' : function() { 
		
	var input = wikifyStatic('<<NOEXISTANTMACRO>>');
	var should_be = '<a errortext="Error while executing macro &lt;&lt;NOEXISTANTMACRO&gt;&gt;:\nNo such macro" class="errorButton" href="javascript:;">Error in macro &lt;&lt;NOEXISTANTMACRO&gt;&gt;</a>';

value_of(input).should_be(should_be);
	},

});

// ]]>
