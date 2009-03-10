jQuery(document).ready(function() {
	module("Basic Types");

	test("Number clamp", function() {
		var actual, expected;

		actual = (99).clamp();
		expected = 99;
		equals(actual, expected, "returns original number if no arguments are specified");

		actual = (11).clamp(20);
		expected = 20;
		equals(actual, expected, "if only one argument is specified, uses it as minimum");

		actual = (55).clamp(20, 80);
		expected = 55;
		equals(actual, expected, "returns original number if it is between minimum and maximum");

		actual = (11).clamp(20, 80);
		expected = 20;
		equals(actual, expected, "returns minimum if number is smaller than minimum");

		actual = (99).clamp(20, 80);
		expected = 80;
		equals(actual, expected, "return maximum if number is greater than maximum");
	});

	test("Array indexOf", function() {
		var actual, expected;

		actual = typeof [].indexOf;
		expected = "function";
		equals(actual, expected, "method exists");

		actual = ["foo", "bar", "baz"].indexOf("bar");
		expected = 1;
		equals(actual, expected, "returns element postion");

		actual = ["foo", "bar"].indexOf("baz");
		expected = -1;
		equals(actual, expected, "returns -1 if element not present");

		actual = ["foo", "bar", "baz"].indexOf("baz", 1);
		expected = 2;
		equals(actual, expected, "returns element position if element is present within given range");

		actual = ["foo", "bar", "baz"].indexOf("foo", 1);
		expected = -1;
		equals(actual, expected, "returns -1 if element is not present within given range");
	});

	test("Array findByField", function() {
		var actual, expected;

		var L = [{ foo: "lorem", bar: "ipsum" }, { bar: "dolor", baz: "sit" }, { bar: "dolor" }];

		actual = L.findByField();
		expected = 0;
		equals(actual, expected, "returns 0 if no arguments are specified"); // XXX: not actually desired; cf. ticket #964

		actual = L.findByField("bar", "dolor");
		expected = 1;
		equals(actual, expected, "returns the position of the first matching element");

		actual = L.findByField("bar", "xxx");
		expected = null;
		equals(actual, expected, "returns null if no match was found"); // XXX: not actually desired; cf. ticket #966

	});

	test("Array contains", function() {
		var actual, expected;

		var L = ["foo", "bar", "baz", "bar"];

		actual = L.contains();
		expected = false;
		equals(actual, expected, "returns false if no arguments are specified"); // XXX: not actually desired; cf. ticket #966

		actual = L.contains("bar");
		expected = 1;
		equals(actual, expected, "returns the position of the first matching element");

		actual = L.contains("xxx");
		expected = false;
		equals(actual, expected, "returns false if no match was found"); // XXX: not actually desired; cf. ticket #966
	});

	test("Array containsAny", function() {
		var actual, expected;

		var L = ["foo", "bar", "baz"];

		try { // XXX: exception detection not supported by QUnit?
			actual = L.containsAny();
		} catch(ex) {
			actual = null;
		}
		expected = null;
		equals(actual, expected, "throws exception if no arguments are specified");

		actual = L.containsAny("foo");
		expected = false;
		equals(actual, expected, "returns false if argument is not an array"); // XXX: not actually desired!?

		actual = L.containsAny(["lorem", "bar"]);
		expected = true;
		equals(actual, expected, "returns true if a matching item has been found");

		actual = L.containsAny(["lorem", "ipsum"]);
		expected = false;
		equals(actual, expected, "returns false if no matching item has been found");
	});

	test("Array containsAll", function() { // TODO
		var actual, expected;

		var L = ["foo", "bar", "baz"];

		try {
			actual = L.containsAll();
		} catch(ex) {
			actual = null;
		}
		expected = null;
		equals(actual, expected, "throws exception if no arguments are specified");

		actual = L.containsAll("foo");
		expected = false;
		equals(actual, expected, "returns false if argument is not an array"); // XXX: not actually desired!?

		actual = L.containsAll(["foo", "bar"]);
		expected = true;
		equals(actual, expected, "returns true if all given items have been found");

		actual = L.containsAll(["lorem", "bar"]);
		expected = false;
		equals(actual, expected, "returns false if not all given items have been found");
	});

	test("Array pushUnique", function() { // TODO
		var actual, expected;

		//actual = ;
		//expected = ;
		//equals(actual, expected, "");
	});

	test("Array remove", function() { // TODO
		var actual, expected;

		//actual = ;
		//expected = ;
		//equals(actual, expected, "");
	});

	test("Array setItem", function() { // TODO
		var actual, expected;

		//actual = ;
		//expected = ;
		//equals(actual, expected, "");
	});
});
