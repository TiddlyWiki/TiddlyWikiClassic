jQuery(document).ready(function(){

	module("TiddlyWiki core");

	test("String functions", function() {
		expect(3);

		var actual = "abcdef".right(3);
		var expected = "def";
		ok(actual==expected,'String right');

		actual = " abcdef ".trim();
		expected = "abcdef";
		ok(actual==expected,'String trim');

		actual = "background-color".unDash();
		expected = "backgroundColor";
		ok(actual==expected,'String undash');

	});
});
