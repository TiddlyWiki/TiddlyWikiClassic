/*global story, jQuery, document, module, test, same strictEqual store */
(function ($) {
	$(document).ready(function () {
		module("Macros.js", {});
	/*
	 * list
	 */
	test("list all", function () {
		var place = $("<div />")[0];
		var params = ["all"];
		var paramString = "all";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 4,
			"there are 3 tiddlers defined in testdata at time of writing these should all be listed. also a prompt");
		strictEqual($($("li", place)[0]).text(), config.macros.list.all.prompt, "make sure prompt in place.")
		strictEqual($("li .tiddlyLink", place).length, 3, "3 tiddly links should have been created");
	});

	test("list missing - nothing missing", function () {
		var place = $("<div />")[0];
		var params = ["missing"];
		var paramString = "missing";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 1,"no missing tiddlers only header");
		strictEqual($($("li", place)[0]).text(), config.macros.list.missing.prompt, "make sure prompt in place.")
		strictEqual($("li .tiddlyLink", place).length, 0, "no tiddly links should have been created");
	});

	test("NEW: list missing - test emptyMessage", function () {
		var place = $("<div />")[0];
		var params = ["missing"];
		var paramString = "missing emptyMessage:nothing";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 2,"no missing tiddlers only header and empty message");
		strictEqual($($("li", place)[1]).text(), "nothing", "check the empty message was printed");
	});

	test("list shadows", function () {
		var place = $("<div />")[0];
		var params = ["shadowed"];
		var paramString = "shadowed";
		var numShadows = 0;
		for(var i in config.shadowTiddlers) {
			numShadows += 1;
		}
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, numShadows + 1,"all shadows and the header");
		var items = $("li", place);
		strictEqual($("li .tiddlyLink", place).length, items.length - 1,
			"everything but header should be tiddlylink")
		strictEqual($(items[1]).text(), "AdvancedOptions",
			"the first in the list should be the shadow AdvancedOptions");
		strictEqual($(items[items.length - 1]).text(), "WindowTitle",
			"the first in the list should be the shadow WindowTitle");
	});
	
	test("list orphans", function () {
		var place = $("<div />")[0];
		var params = ["orphans"];
		var paramString = "orphans";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 4,"header plus 3 dummy tiddlers");
		var items = $("li", place);
		strictEqual($(items[1]).text(), "testTiddler1",
			"check alphabetical order");
		strictEqual($(items[2]).text(), "testTiddler2",
			"check alphabetical order");
	});

	test("list touched", function () {
		var place = $("<div />")[0];
		var params = ["touched"];
		var paramString = "touched";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 1,"just header");
	});

	test("list filter", function () {
		var place = $("<div />")[0];
		var params = ["filter", "[tag[twoTag]]"];
		var paramString = "filter [tag[twoTag]]";
		config.macros.list.handler(place,"list",params,null,paramString);
		var item = $("li .tiddlyLink", place);
		strictEqual(item.length, 1,"just the tiddler matched");
		strictEqual(item.text(), "testTiddler2")
	});
	
	test("NEW: list filter emptyMessage", function () {
		var place = $("<div />")[0];
		var params = ["filter", "[tag[badtag]]"];
		var paramString = "filter [tag[badtag]] emptyMessage:what";
		config.macros.list.handler(place,"list",params,null,paramString);
		var item = $("li", place);
		strictEqual(item.length, 1,"just the empty message");
		strictEqual(item.text(), "what")
	});

	module("Macros.js - additional scenarios", {
		setup: function() {
			var text = "[[Foo is a missing tiddler]] test";
			store.saveTiddler("MissingExample", "MissingExample", text);
			var templateText = "<<view title link>> hello world";
			store.saveTiddler("MyTemplate", "MyTemplate", templateText);
		},
		teardown: function() {
			store.removeTiddler("MissingExample");
			store.removeTiddler("MyTemplate");
		}
	});

	test("list missing - where something missing", function () {
		var place = $("<div />")[0];
		var params = ["missing"];
		var paramString = "missing";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 2, "prompt and one match");
		strictEqual($("li .tiddlyLink", place).text(), "Foo is a missing tiddler","check missing tiddler link created.");
	});

	test("NEW: missing with template parameter", function () {
		var place = $("<div />")[0];
		var params = ["missing"];
		var paramString = "missing template:MyTemplate";
		config.macros.list.handler(place,"list",params,null,paramString);
		var items = $("li", place);
		strictEqual(items.length, 2, "prompt and one match");
		strictEqual($(items[0]).text(), config.macros.list.missing.prompt, "prompt in place and immune from templating");
		strictEqual($(items[1]).text(), 
			"Foo is a missing tiddler hello world","check missing tiddler link created.");
	});

	test("list touched", function () {
		var place = $("<div />")[0];
		var params = ["touched"];
		var paramString = "touched";
		config.macros.list.handler(place,"list",params,null,paramString);
		strictEqual($("li", place).length, 3, "just header and MissingExample and MyTemplate");
		var links = $("li .tiddlyLink", place);
		strictEqual($(links[0]).text(), "MissingExample", "should have noticed it was touched");
	});

	test("NEW: list filter with new template", function () {
		var place = $("<div />")[0];
		var params = ["filter", "[tag[testTag]][sort[-title]]"];
		var paramString = "filter tag[testTag][sort[-title]] template:MyTemplate";
		config.macros.list.handler(place,"list",params,null,paramString);
		var items = $("li", place);
		strictEqual(items.length, 3, "should match 3 tiddlers");
		strictEqual($(items[0]).text(), "testTiddler3 hello world", "the template has hello world in it.");
		strictEqual($(".tiddlyLink", items[0]).text(), "testTiddler3", "filter sorts by descending title");
	});
});
}(jQuery));
