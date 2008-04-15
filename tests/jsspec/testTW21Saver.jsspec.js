// <![CDATA[
describe('TW21Saver', {
	before_each : function() {
		store = new TiddlyWiki();
		saver = store.getSaver();
	},

	'Saving empty tiddler': function() {
		store = new TiddlyWiki();
		tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = new Date(Date.UTC(2008,3,16));
		tiddler.modified = tiddler.created;

		var actual = saver.externalizeTiddler(store,tiddler);
		var expected = "<div title=\"test\" created=\"200804160000\">\n<pre></pre>\n</div>";
		value_of(actual).should_be(expected);
	},
	'Saving tiddler with text': function() {
		tiddler = new Tiddler("test");
		tiddler.text = "text";
		tiddler.created = new Date(Date.UTC(2008,3,16));
		tiddler.modified = tiddler.created;

		var actual = saver.externalizeTiddler(store,tiddler);
		var expected = "<div title=\"test\" created=\"200804160000\">\n<pre>text</pre>\n</div>";
		value_of(actual).should_be(expected);
	}
});
// ]]>

