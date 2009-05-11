jQuery(document).ready(function() {
	module("jquery.stylesheet");

	test("apply", function() {
		var actual, expected, el;

		el = jQuery('<div />').appendTo(document.body);
		jQuery.stylesheet("div { overflow: hidden; }");
		actual = jQuery(el).css("overflow");
		expected = "hidden";
		same(actual, expected, "applies style definitions to document");
		// teardown
		jQuery(el).remove();
		jQuery.stylesheet.remove();

		el = jQuery('<div />').appendTo(document.body);
		jQuery.stylesheet("div { font-style: italic; }");
		actual = jQuery(el).css("font-style");
		expected = "italic";
		same(actual, expected, "applies style definitions to newly-created elements");
		// teardown
		jQuery(el).remove();
		jQuery.stylesheet.remove();

		jQuery.stylesheet("", { id: "dummyStyleSheet" });
		actual = jQuery("#dummyStyleSheet").length;
		expected = 1;
		same(actual, expected, "generates style element using given ID");
		// teardown
		jQuery.stylesheet.remove({ id: "dummyStyleSheet" });

		// TODO: test for options.doc argument

	});

	test("remove", function() {
		var actual, expected;

		// setup
		el = jQuery('<div />').appendTo(document.body);
		jQuery.stylesheet("div { overflow: hidden; }");
		// test
		jQuery.stylesheet.remove();
		actual = jQuery(el).css("overflow");
		expected = "visible";
		same(actual, expected, "neutralizes style definitions");
		// teardown
		jQuery(el).remove();

		// setup
		jQuery.stylesheet("");
		// test
		jQuery.stylesheet.remove();
		actual = jQuery("#customStyleSheet").length;
		expected = 0;
		same(actual, expected, "removes default style sheet if no ID is given");

		// setup
		jQuery.stylesheet("", { id: "dummyStyleSheet" });
		// test
		jQuery.stylesheet.remove({ id: "dummyStyleSheet" });
		actual = jQuery("#dummyStyleSheet").length;
		expected = 0;
		same(actual, expected, "removes style element using given ID");

		// TODO: test for options.doc argument

	});
});
