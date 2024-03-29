jQuery(document).ready(function(){

	module("TiddlyWiki core");

	test("String functions", function() {
		expect(4);

		let actual = " abcdef ".trim();
		let expected = "abcdef";
		ok(actual == expected, 'String trim');

		actual = " abc def ".trim();
		expected = "abc def";
		ok(actual == expected, 'String trim');

		actual = "hello %0, is your favourite colour red?".format([]);
		expected = "hello , is your favourite colour red?";
		ok(actual == expected, 'String format with an empty substring array should return input string');

		actual = "hello %0, is your favourite colour red?".format(["Jon"]);
		expected = "hello Jon, is your favourite colour red?";
		ok(actual == expected, 'String format with a substrings array of correct size (1) should add substrings in the right places');

		actual = "hello Jon, is your favourite colour red?".format(["Jon", "rhubarb", "rhubarb"]);
		expected = "hello Jon, is your favourite colour red?";
		ok(actual == expected, 'String format with a substrings array of more than enough substrings (1 needed) should add substrings in the right places');

		actual = "hello Jon, is your favourite colour red?".format([]);
		expected = "hello Jon, is your favourite colour red?";
		ok(actual == expected, 'String format with an empty substring array and no %1-type specifiers should return input string');

		actual = "hello Jon, is your favourite colour red?".format(["rhubarb"]);
		expected = "hello Jon, is your favourite colour red?";
		ok(actual == expected, 'String format with a substrings array of non-zero size (1) and no %1-type specifiers should return input string');

		actual = String.encodeTiddlyLinkList();
		expected = "";
		ok(actual == expected, 'String.encodeTiddlyLinkList with null parameter should return null string');

		actual = String.encodeTiddlyLinkList([]);
		expected = "";
		ok(actual == expected, 'String.encodeTiddlyLinkList with empty array as parameter should return null string');

		const linksArray = ["tag", "TagName", "tag with spaces"];
		actual = String.encodeTiddlyLinkList(linksArray);
		expected = "tag TagName [[tag with spaces]]";
		ok(actual == expected, `String.encodeTiddlyLinkList should turn [${linksArray}] array into "${expected}" string`);

		actual = "abcdefghijklmnopqrstuvwxyz".startsWith("abc");
		expected = true;
		ok(actual == expected, 'String "abcdefghijklmnopqrstuvwxyz" startsWith "abc"');

		actual = "abcdefghijklmnopqrstuvwxyz".startsWith("def");
		expected = false;
		ok(actual == expected, 'String "abcdefghijklmnopqrstuvwxyz" does not startsWith "def"');

		actual = "abcdefghijklmnopqrstuvwxyz".startsWith("");
		expected = true;
		ok(actual == expected, 'String "abcdefghijklmnopqrstuvwxyz" startsWith ""');
	});

	test("Strings: html encoding/decoding", function() {
		let actual = '&<>"'.htmlEncode();
		let expected = '&amp;&lt;&gt;&quot;';
		ok(actual == expected, 'String should correctly htmlEncode &<>"');

		actual = '&amp;&lt;&gt;&quot;'.htmlDecode();
		expected = '&<>"';
		ok(actual == expected, 'String should correctly htmlDecode &amp;&lt;&gt;&quot;');

		const s = '&&&""<">>&>&"';
		actual = s.htmlEncode().htmlDecode();
		expected = s;
		ok(actual == expected, 'htmlEncode followed by htmlDecode of complex string should leave string unchanged');
	});

	test("readMacroParams", function() {
		const params = "foo bar dum".readMacroParams(false);
		const params2 = "foo bar 'tweedle de' dum".readMacroParams(false);
		const params3 = "foo bar 'tweedle dum' dum test:foo test: 'bar' [[check brackets]]".readMacroParams(false);

		strictEqual(params.length, 3, "There are 3 parameters");
		strictEqual(params2.length, 4, "There are 4 parameters");
		strictEqual(params2[2], "tweedle de", "Check parameter in brackets");
		strictEqual(params3[4], "test:foo");
		strictEqual(params3[5], "test:");
		strictEqual(params3[6], "bar");
		strictEqual(params3[7], "check brackets");
	});

	test("parseParams", function() {
		const args = "foo [[bar dum]] test:foo test: bar hello:[[goodbye]] x: [[bar dum]] what:[['fun']] why:'[[test]]'"
			.parseParams();
		const args2 = "foo [[bar dum]] test:foo test: bar hello:[[goodbye]] x: [[bar dum]] what:[['fun']] why:'[[test]]'"
			.parseParams("anon");
		const summary = args[0];
		const summary2 = args2[0];

		strictEqual(summary.anon, undefined, "no unnamed parameters matched");
		strictEqual(summary.what.length, 1, "what only matched once");
		strictEqual(summary.test.length, 2, "test is a named parameter twice");
		strictEqual(args[2].name, "bar dum", "unnamed parameters are collected in resulting array");
		strictEqual(args[2].value, undefined, "no value for unnamed parameters");
		strictEqual(args[3].value, "foo", "test matches foo");
		strictEqual(args[4].value, "bar", "test matches bar the leading whitespace ignored");
		strictEqual(args[5].value, "goodbye", "checking [[ ]]");
		strictEqual(args[6].value, "bar dum", "checking [[ ]] and ignored leading space");
		strictEqual(args[7].value, "'fun'", "checking the quotes are kept");
		strictEqual(args[8].value, "[[test]]", "checking the brackets are kept in this special case");

		strictEqual(summary2.anon.length, 2, "foo and bar dum matched");
		strictEqual(args2[1].name, "anon",
			"unnamed parameters collect as anonymous");
		strictEqual(args2[1].value, "foo",
			"unnamed parameters collect as anonymous");
		strictEqual(args2[2].name, "anon",
			"unnamed parameters collect as anonymous");
		strictEqual(args2[2].value, "bar dum", "unnamed parameters collect as anonymous");
		strictEqual(args2[3].name, "test", "named parameters collected as normal");
	});

	test("Strings: encodeTiddlyLink", function() {
		let actual = String.encodeTiddlyLink("title");
		let expected = "title";
		ok(actual == expected, 'String should correctly encodeTiddlyLink with no spaces');

		actual = String.encodeTiddlyLink("the title");
		expected = "[[the title]]";
		ok(actual == expected, 'String should correctly encodeTiddlyLink with spaces');
	});

	test("tw.textUtils", () => {
		let textBefore = "text before "
		let textAfter = " text after"
		let textInside = "text inside"
		let startMarker = "["
		let endMarker = "]"
		let wholeString = textBefore + startMarker + textInside + endMarker + textAfter
		let actual = tw.textUtils.getChunkRange(wholeString, startMarker, endMarker)
		let expected = [(textBefore + startMarker).length, (textBefore + startMarker + textInside).length]
		ok(actual[0] === expected[0],
			`tw.textUtils.getChunkRange("${wholeString}", "${startMarker}", "${endMarker}"): start index is ${expected[0]}`)
		ok(actual[1] === expected[1],
			`tw.textUtils.getChunkRange("${wholeString}", "${startMarker}", "${endMarker}"): end index is ${expected[1]}`)
	})
});

