// <![CDATA[
describe('Slices: calcAllSlices()', {
	before_each: function() {
		store = new TiddlyWiki();
		//loadShadowTiddlers();
		//store.saveTiddler("t","t","text");
		//formatter = new Formatter(config.formatters);
	},

	'should return an object when not passed any arguments': function() {
		var actual = typeof store.calcAllSlices();
		var expected = "object";
		value_of(actual).should_be(expected);
	},
	'should return an object when passed an empty string': function() {
		var actual = typeof store.calcAllSlices("");
		var expected = "object";
		value_of(actual).should_be(expected);
	},
	'should return an object when pointed to a non-existing tiddler': function() {
		var actual = typeof store.calcAllSlices("MissingTiddler");
		var expected = "object";
		value_of(actual).should_be(expected);
	},

	'should return an existing slice (colon notation) as a label/value pair': function() {
		var title = "tiddler";
		var text = "foo: bar";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'should return existing slices (colon notation) as label/value pairs': function() {
		var title = "tiddler";
		var text = "foo: bar\nlorem: ipsum";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar", lorem: "ipsum" };
		value_of(actual).should_be(expected);
	},
	'should return an existing slice (table notation) as a label/value pair': function() {
		var title = "tiddler";
		var text = "|foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'should return existing slices (table notation) as label/value pairs': function() {
		var title = "tiddler";
		var text = "|foo|bar|\n"
			+ "|lorem|ipsum|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar", lorem: "ipsum" };
		value_of(actual).should_be(expected);
	},
	'should strip bold markup from slice labels': function() {
		var title = "tiddler";
		var text = "|''foo''|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'should strip italic markup from slice labels': function() {
		var title = "tiddler";
		var text = "|//foo//|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'should not strip markup from slice values': function() {
		var title = "tiddler";
		var text = "|foo|''bar''|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "''bar''" };
		value_of(actual).should_be(expected);
	},
	'should ignore the escaping character for WikiWords in slice labels': function() {
		var title = "tiddler";
		var text = "|~FooBar|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { FooBar: "baz" };
		value_of(actual).should_be(expected);
	},
	'should ignore the escaping character for non-WikiWords in slice labels': function() {
		var title = "tiddler";
		var text = "|~foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'should not ignore the escaping character for WikiWords in slice values': function() {
		var title = "tiddler";
		var text = "|foo|~BarBaz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "~BarBaz" };
		value_of(actual).should_be(expected);
	},
	'should not ignore the escaping character for non-WikiWords in slice values': function() {
		var title = "tiddler";
		var text = "|foo|~bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "~bar" };
		value_of(actual).should_be(expected);
	},

	'should ignore slices whose label contains spaces': function() {
		var title = "tiddler";
		var text = "|foo bar|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = {};
		value_of(actual).should_be(expected);
	},
	'should not ignore slices whose value contains spaces': function() {
		var title = "tiddler";
		var text = "|foo|bar baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar baz" };
		value_of(actual).should_be(expected);
	},

	'should strip trailing colons from slice labels (table notation)': function() {
		var title = "tiddler";
		var text = "|foo:|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},

	'should strip bold markup from slice labels (colon notation)': function() {
		var title = "tiddler";
		var text = "''~FooBar:'' baz";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { FooBar: "baz" };
		value_of(actual).should_be(expected);
	},
	'should strip italic markup from slice labels (colon notation)': function() {
		var title = "tiddler";
		var text = "//~FooBar:// baz";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { FooBar: "baz" };
		value_of(actual).should_be(expected);
	},
	'should strip bold markup from slice labels (table notation)': function() {
		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		var title = "tiddler";
		var text = "|''~FooBar:''|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { FooBar: "baz" };
		value_of(actual).should_be(expected);
	},
	'should strip italic markup from slice labels (table notation)': function() {
		var title = "tiddler";
		var text = "|//~FooBar://|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { FooBar: "baz" };
		value_of(actual).should_be(expected);
	},


	'should ignore colons in slice values (colon notation)': function() {
		var title = "tiddler";
		var text = "foo: bar: baz";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar: baz" };
		value_of(actual).should_be(expected);
	},
	'should allow dots in slice labels': function() {
		var title = "tiddler";
		var text = "foo.bar: baz";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { "foo.bar": "baz" };
		value_of(actual).should_be(expected);
	},
	/*'should ignore additional columns (table notation)': function() {
		var title = "tiddler";
		var text = "|foo|bar|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},*/

	'should disregard apparent slices within code sections': function() {
		// FAILURE
		// ticket #522 (http://trac.tiddlywiki.org/ticket/522)
		var title = "tiddler";
		var text = "//{{{\nfoo: bar;\n//}}}";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = {};
		value_of(actual).should_be(expected);
	},
	'should disregard slices within JSON structures': function() {
		// FAILURE
		// ticket #522 (http://trac.tiddlywiki.org/ticket/522)
		var title = "tiddler";
		var text = "{\n\tfoo: 'bar'\n}\n";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = {};
		value_of(actual).should_be(expected);
	}
});

describe('Slices: getTiddlerSlice()', {
	before_each: function() {
		store = new TiddlyWiki();
		//loadShadowTiddlers();
		//store.saveTiddler("t","t","text");
		//formatter = new Formatter(config.formatters);
	},

	'should return undefined when not passed any arguments': function() {
		var actual = store.getTiddlerSlice();
		var expected = undefined;
		value_of(actual).should_be(expected);
	},
	'should return undefined when pointed to non-existing tiddler': function() {
		var actual = store.getTiddlerSlice("tiddler", "foo");
		var expected = undefined;
		value_of(actual).should_be(expected);
	},
	'should return undefined when pointed to non-existing slice': function() {
		var title = "tiddler";
		var text = "foo bar\nbaz";
		store.saveTiddler(title, title, text);
		var actual = store.getTiddlerSlice(title, "foo");
		var expected = undefined;
		value_of(actual).should_be(expected);
	},

	'should return slice value when given slice label (colon notation)': function() {
		var title = "tiddler";
		var text = "foo: bar";
		store.saveTiddler(title, title, text);
		var actual = store.getTiddlerSlice(title, "foo");
		var expected = "bar";
		value_of(actual).should_be(expected);
	},
	'should return slice value when given slice label (table notation)': function() {
		var title = "tiddler";
		var text = "|foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.getTiddlerSlice(title, "foo");
		var expected = "bar";
		value_of(actual).should_be(expected);
	}
});
	/*'should strip heading markup from slice labels (table notation)': function() {
		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		var title = "tiddler";
		var text = "|!foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'should strip double brackets (PrettyLinks) from slice labels': function() {
		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		var title = "tiddler";
		var text = "[[foo]]: bar";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { "foo": "bar" };
		value_of(actual).should_be(expected);
	},*/
	/*'should allow brackets in slice labels': function() {
		// FAILURE
		// ticket #370 (http://trac.tiddlywiki.org/ticket/370)
		var title = "tiddler";
		var text = "[foo]: bar";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { "[foo]": "bar" };
		value_of(actual).should_be(expected);
	},*/


// ]]>