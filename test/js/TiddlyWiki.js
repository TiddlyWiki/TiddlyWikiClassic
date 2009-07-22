jQuery(document).ready(function(){

	module("TiddlyWiki.js");

	test("Slices: calcAllSlices()", function() {

		var store = new TiddlyWiki();

		var actual = typeof store.calcAllSlices();
		var expected = "object";
		same(actual,expected,'should return an object when not passed any arguments');

		actual = typeof store.calcAllSlices("");
		expected = "object";
		same(actual,expected,'should return an object when passed an empty string');

		actual = typeof store.calcAllSlices("MissingTiddler");
		expected = "object";
		same(actual,expected,'should return an object when pointed to a non-existing tiddler');

		var title = "tiddler";
		var text = "foo: bar";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { "foo": "bar" };
		console.log('actual',actual,expected);
		same(actual,expected,'should return an existing slice (colon notation) as a label/value pair');

		title = "tiddler";
		text = "foo: bar\nlorem: ipsum";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar", lorem: "ipsum" };
		same(actual,expected,'should return existing slices (colon notation) as label/value pairs');

		title = "tiddler";
		text = "|foo|bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar" };
		same(actual,expected,'should return an existing slice (table notation) as a label/value pair');

		title = "tiddler";
		text = "|foo|bar|\n|lorem|ipsum|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar", lorem: "ipsum" };
		same(actual,expected,'should return existing slices (table notation) as label/value pairs');

		title = "tiddler";
		text = "|''foo''|bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar" };
		same(actual,expected,'should strip bold markup from slice labels');

		title = "tiddler";
		text = "|//foo//|bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar" };
		same(actual,expected,'should strip italic markup from slice labels');

		title = "tiddler";
		text = "|foo|''bar''|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "''bar''" };
		same(actual,expected,'should not strip markup from slice values');

		title = "tiddler";
		text = "|~FooBar|baz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { FooBar: "baz" };
		same(actual,expected,'should ignore the escaping character for WikiWords in slice labels');

		title = "tiddler";
		text = "|~foo|bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar" };
		same(actual,expected,'should ignore the escaping character for non-WikiWords in slice labels');

		title = "tiddler";
		text = "|foo|~BarBaz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "~BarBaz" };
		same(actual,expected,'should not ignore the escaping character for WikiWords in slice values');

		title = "tiddler";
		text = "|foo|~bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "~bar" };
		same(actual,expected,'should not ignore the escaping character for non-WikiWords in slice values');

		title = "tiddler";
		text = "|foo bar|baz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = {};
		same(actual,expected,'should ignore slices whose label contains spaces');

		title = "tiddler";
		text = "|foo|bar baz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar baz" };
		same(actual,expected,'should not ignore slices whose value contains spaces');

		title = "tiddler";
		text = "|foo:|bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar" };
		same(actual,expected,'should strip trailing colons from slice labels (table notation)');

		title = "tiddler";
		text = "''~FooBar:'' baz";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { FooBar: "baz" };
		same(actual,expected,'should strip bold markup from slice labels (colon notation)');

		title = "tiddler";
		text = "//~FooBar:// baz";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { FooBar: "baz" };
		same(actual,expected,'should strip italic markup from slice labels (colon notation)');

		title = "tiddler";
		text = "|''~FooBar:''|baz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { FooBar: "baz" };
		same(actual,expected,'should strip bold markup from slice labels (table notation)');

		title = "tiddler";
		text = "|//~FooBar://|baz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { FooBar: "baz" };
		same(actual,expected,'should strip italic markup from slice labels (table notation)');

		title = "tiddler";
		text = "foo: bar: baz";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar: baz" };
		same(actual,expected,'should ignore colons in slice values (colon notation)');

		title = "tiddler";
		text = "foo.bar: baz";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { "foo.bar": "baz" };
		same(actual,expected,'should allow dots in slice labels');

		title = "tiddler";
		text = "foo: bar|baz";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { "foo": "bar|baz" };
		same(actual,expected,'should allow pipes in slice values (colon notation)');

		title = "tiddler";
		text = "|foo|bar|baz|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { "foo": "bar|baz" };
		same(actual,expected,'should allow pipes in slice values (table notation)');

		title = "tiddler";
		text = "foo: lorem [[bar|baz]] ipsum";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "lorem [[bar|baz]] ipsum" };
		same(actual,expected,'should retrieve slices containing PrettyLinks (colon notation)');

		title = "tiddler";
		text = "foo: lorem [img[qux|bar.baz]] ipsum";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "lorem [img[qux|bar.baz]] ipsum" };
		same(actual,expected,'should retrieve slices containing image markup (colon notation)');

	/*
		// FAILURE
		// ticket #522 (http://trac.tiddlywiki.org/ticket/522)
		title = "tiddler";
		text = "//{{{\nfoo: bar;\n//}}}";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = {};
		same(actual,expected,'should disregard apparent slices within code sections');
	*/
		title = "tiddler";
		text = "{\n\tfoo: 'bar'\n}\n";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = {};
		same(actual,expected,'should disregard slices within JSON structures');
	});

	test("Slices: getTiddlerSlice()", function() {
		var store = new TiddlyWiki();

		var actual = store.getTiddlerSlice();
		var expected = undefined;
		same(actual,expected,'should return undefined when not passed any arguments');

		actual = store.getTiddlerSlice("tiddler", "foo");
		expected = undefined;
		same(actual,expected,'should return undefined when pointed to non-existing tiddler');

		title = "tiddler";
		text = "foo bar\nbaz";
		store.saveTiddler(title, title, text);
		actual = store.getTiddlerSlice(title, "foo");
		expected = undefined;
		same(actual,expected,'should return undefined when pointed to non-existing slice');

		title = "tiddler";
		text = "foo: bar";
		store.saveTiddler(title, title, text);
		actual = store.getTiddlerSlice(title, "foo");
		expected = "bar";
		same(actual,expected,'should return slice value when given slice label (colon notation)');

		title = "tiddler";
		text = "|foo|bar|";
		store.saveTiddler(title, title, text);
		actual = store.getTiddlerSlice(title, "foo");
		expected = "bar";
		same(actual,expected,'should return slice value when given slice label (table notation)');

	/*
		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		title = "tiddler";
		text = "|!foo|bar|";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { foo: "bar" };
		same(actual,expected,'should strip heading markup from slice labels (table notation)');

		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		title = "tiddler";
		text = "[[foo]]: bar";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { "foo": "bar" };
		same(actual,expected,'should strip double brackets (PrettyLinks) from slice labels');

		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		title = "tiddler";
		text = "[foo]: bar";
		store.saveTiddler(title, title, text);
		actual = store.calcAllSlices(title);
		expected = { "[foo]": "bar" };
		same(actual,expected,'should allow brackets in slice labels');
	*/

	});

});
