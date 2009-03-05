jQuery(document).ready(function(){
	module("Basic Types");

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
});
