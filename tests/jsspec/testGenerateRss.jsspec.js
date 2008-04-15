// <![CDATA[
describe('GenerateRss: generateRss', {

        before_each : function() {
                store = new TiddlyWiki();
                loadShadowTiddlers();
		formatter = new Formatter(config.formatters);
		feed = generateRss();
        },

        'produces a string value' : function() { 
                value_of(typeof feed).should_be('string');
        },

        'should have an XML 1.0 declaration' : function() { 
		// <?xml version='1.0'?>
		// <?xml version="1.0" ?>
		// <?xml version="1.0" encoding='utf-8' ?>
                value_of(feed).should_match(/^<\?xml\s+version=(["'])1.0\1\s*(encoding=(["'])utf-8\2)?\s*\?>/);
        },

});

// ]]>

