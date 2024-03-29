jQuery(document).ready(function(){

	module("TW21Saver");

	test("externalizeTiddler", function() {
		const store = new TiddlyWiki();
		const saver = store.getSaver();

		let tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = version.date;
		tiddler.modified = tiddler.created;

		let actual = saver.externalizeTiddler(store, tiddler);
		let expected = "<div title=\"test\">\n<pre></pre>\n</div>";
		same(actual, expected, 'Saving empty tiddler with no dates');

		delete tiddler;

		tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = new Date(Date.UTC(2008, 3, 16, 12, 34));
		tiddler.modified = tiddler.created;

		actual = saver.externalizeTiddler(store, tiddler);
		expected = "<div title=\"test\" created=\"200804161234\">\n<pre></pre>\n</div>";
		same(actual, expected, 'Saving empty tiddler with created date');

		delete tiddler;

		tiddler = new Tiddler("test");
		tiddler.text = "";
		tiddler.created = new Date(Date.UTC(2008, 3, 16, 12, 34));
		tiddler.modified = new Date(Date.UTC(2008, 3, 17, 12, 34));

		actual = saver.externalizeTiddler(store, tiddler);
		expected = "<div title=\"test\" created=\"200804161234\" modified=\"200804171234\">\n<pre></pre>\n</div>";
		same(actual, expected, 'Saving empty tiddler with created and modified dates');

		delete tiddler;
		tiddler = new Tiddler("test");
		tiddler.text = "text";
		tiddler.created = version.date;
		tiddler.modified = tiddler.created;

		actual = saver.externalizeTiddler(store, tiddler);
		expected = "<div title=\"test\">\n<pre>text</pre>\n</div>";
		same(actual, expected, 'Saving tiddler with text');
	});
});

