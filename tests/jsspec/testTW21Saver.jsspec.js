// <![CDATA[
describe('TW21Saver', {
	before_each : function() {
		store = new TiddlyWiki();
		saver = store.getSaver();
	},

	'Saving empty tiddler with no dates': function() {
		store = new TiddlyWiki();
		tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = version.date;
		tiddler.modified = tiddler.created;

		var actual = saver.externalizeTiddler(store,tiddler);
		var expected = "<div title=\"test\">\n<pre></pre>\n</div>";
		value_of(actual).should_be(expected);
	},
	'Saving empty tiddler with created date': function() {
		store = new TiddlyWiki();
		tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = new Date(Date.UTC(2008,3,16,12,34));
		tiddler.modified = tiddler.created;

		var actual = saver.externalizeTiddler(store,tiddler);
		var expected = "<div title=\"test\" created=\"200804161234\">\n<pre></pre>\n</div>";
		value_of(actual).should_be(expected);
	},
	'Saving empty tiddler with created and modified dates': function() {
		store = new TiddlyWiki();
		tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = new Date(Date.UTC(2008,3,16,12,34));
		tiddler.modified = new Date(Date.UTC(2008,3,17,12,34));

		var actual = saver.externalizeTiddler(store,tiddler);
		var expected = "<div title=\"test\" created=\"200804161234\" modified=\"200804171234\">\n<pre></pre>\n</div>";
		value_of(actual).should_be(expected);
	},
	'Saving tiddler with text': function() {
		tiddler = new Tiddler("test");
		tiddler.text = "text";
		tiddler.created = version.date;
		tiddler.modified = tiddler.created;

		var actual = saver.externalizeTiddler(store,tiddler);
		var expected = "<div title=\"test\">\n<pre>text</pre>\n</div>";
		value_of(actual).should_be(expected);
	}
});
// ]]>

