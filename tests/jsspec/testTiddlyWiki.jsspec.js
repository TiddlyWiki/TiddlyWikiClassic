// <![CDATA[
describe('Slices', {
	before_each: function() {
		store = new TiddlyWiki();
		//loadShadowTiddlers();
		//store.saveTiddler("t","t","text");
		//formatter = new Formatter(config.formatters);
	},

	'calcAllSlices() should return an object when not passed any arguments': function() {
		var actual = typeof store.calcAllSlices();
		var expected = "object";
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should return an object when passed an empty string': function() {
		var actual = typeof store.calcAllSlices("");
		var expected = "object";
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should return an object when pointed to a non-existing tiddler': function() {
		var actual = typeof store.calcAllSlices("MissingTiddler");
		var expected = "object";
		value_of(actual).should_be(expected);
	},

	'calcAllSlices() should return an existing slice (colon notation) as a label/value pair': function() {
		var title = "tiddler";
		var text = "foo: bar";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should return existing slices (colon notation) as label/value pairs': function() {
		var title = "tiddler";
		var text = "foo: bar\n"
			+ "lorem: ipsum";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar", lorem: "ipsum" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should return an existing slice (table notation) as a label/value pair': function() {
		var title = "tiddler";
		var text = "|foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should return existing slices (table notation) as label/value pairs': function() {
		var title = "tiddler";
		var text = "|foo|bar|\n"
			+ "|lorem|ipsum|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar", lorem: "ipsum" };
		value_of(actual).should_be(expected);
	},

	'calcAllSlices() should strip bold markup from slice labels': function() {
		var title = "tiddler";
		var text = "|''foo''|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should strip italic markup from slice labels': function() {
		var title = "tiddler";
		var text = "|//foo//|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should not strip markup from slice values': function() {
		var title = "tiddler";
		var text = "|foo|''bar''|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "''bar''" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should strip heading markup from slice labels (table notation)': function() {
		var title = "tiddler";
		var text = "|!foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},

	'calcAllSlices() should ignore the escaping character for WikiWords': function() {
		var title = "tiddler";
		var text = "|~FooBar|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { FooBar: "baz" };
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should ignore the escaping character for non-WikiWords': function() {
		var title = "tiddler";
		var text = "|~foo|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	},

	'calcAllSlices() should ignore slices whose label contains spaces': function() {
		var title = "tiddler";
		var text = "|foo bar|baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = {};
		value_of(actual).should_be(expected);
	},
	'calcAllSlices() should not ignore slices whose value contains spaces': function() {
		var title = "tiddler";
		var text = "|foo|bar baz|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar baz" };
		value_of(actual).should_be(expected);
	},

	'calcAllSlices() should strip trailing colons from slice labels (table notation)': function() {
		var title = "tiddler";
		var text = "|foo:|bar|";
		store.saveTiddler(title, title, text);
		var actual = store.calcAllSlices(title);
		var expected = { foo: "bar" };
		value_of(actual).should_be(expected);
	}
});
// ]]>
