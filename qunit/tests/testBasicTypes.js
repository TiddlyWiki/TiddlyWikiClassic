jQuery(document).ready(function() {
	module("Basic Types");

	test("Number clamp", function() {
		expect(5);
		var actual, expected;

		actual = (99).clamp();
		expected = 99;
		equals(actual, expected, "return original number if no range is specified");

		actual = (11).clamp(20);
		expected = 20;
		equals(actual, expected, "if only one argument is specified, use it as minimum");

		actual = (55).clamp(20, 80);
		expected = 55;
		equals(actual, expected, "return original number if it is between minimum and maximum");

		actual = (11).clamp(20, 80);
		expected = 20;
		equals(actual, expected, "return minimum if number is smaller than minimum");

		actual = (99).clamp(20, 80);
		expected = 80;
		equals(actual, expected, "return maximum if number is greater than maximum");
	});

	test("Array indexOf", function() {
		expect(3);
		var actual, expected;

		actual = typeof [].indexOf;
		expected = "function";
		equals(actual, expected, "method exists");

		actual = ["foo", "bar", "baz"].indexOf("bar");
		expected = 1;
		equals(actual, expected, "returns element postion");

		actual = ["foo", "bar"].indexOf("baz");
		expected = -1;
		equals(actual, expected, "returns -1 if element not found");
	});

	test("Array findByField", function() {
		expect(3);
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
		expect(3);
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
});
