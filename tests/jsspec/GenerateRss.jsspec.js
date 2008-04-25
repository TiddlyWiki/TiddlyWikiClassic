// <![CDATA[

function __main() {
	store = new TiddlyWiki();
	loadShadowTiddlers();
	formatter = new Formatter(config.formatters);
}

describe('GenerateRss: generateRss text', {

        before_each : function() {
		__main();
		rss = generateRss();
        },
        'produces a string value' : function() { 
                value_of(typeof rss).should_be('string');
        },
        'should start with an XML 1.0 declaration' : function() { 
		// <?xml version='1.0'?>
		// <?xml version="1.0" ?>
		// <?xml version="1.0" encoding='utf-8' ?>
                value_of(rss).should_match(/^<\?xml\s+version=(["'])1.0\1\s*(encoding=(["'])utf-8\2)?\s*\?>/);
        },
        'should be well-formed XML' : function() { 
                xml = tests_xml.parse(rss);
                value_of(typeof xml).should_match('object');
	},
});

/*
<rss version="2.0">
<channel>
<title>My TiddlyWiki</title>
<link>http://www.tiddlywiki.com/</link>
<description>a reusable non-linear personal web notebook</description>
<language>en-us</language>
<copyright>Copyright 2008 YourName</copyright>
<pubDate>Tue, 15 Apr 2008 11:11:50 GMT</pubDate>
<lastBuildDate>Tue, 15 Apr 2008 11:11:50 GMT</lastBuildDate>
<docs>http://blogs.law.harvard.edu/tech/rss</docs>
<generator>TiddlyWiki 2.4.0</generator>
</channel>
</rss>"
*/

describe('GenerateRss: generateRss default XML', {

        before_each : function() {
		__main();
		rss = generateRss();
                xml = tests_xml.parse(rss);
        },
        'document node should be "rss"' : function() { 
                value_of(xml.documentElement.nodeName).should_be("rss");
        },
        'rss version should be "2.0"' : function() { 
                value_of(xml.documentElement.getAttribute("version")).should_be("2.0");
        },
        'document should have a single channel element' : function() { 
		value_of(xml.xpath("count(/rss/channel)", "number")).should_be(1);
        },
        'channel title should be the default TiddlyWiki title' : function() { 
		value_of(xml.xpath("/rss/channel/title", "string")).should_be('My TiddlyWiki');
        },
        'channel description should be the default TiddlyWiki subtitle' : function() { 
		value_of(xml.xpath("/rss/channel/description", "string")).should_be('a reusable non-linear personal web notebook');
        },
        'channel language should be "en-us"' : function() { 
		value_of(xml.xpath("/rss/channel/language", "string")).should_be('en-us');
        },
        'channel copyright should be "TiddlyWiki YYYY YourName"' : function() { 
		// Y2K+99 issue :)
		value_of(xml.xpath("/rss/channel/copyright", "string")).should_match(/Copyright 20[0-9]{2,2} YourName/);
        },

});

// ]]>
