(function($) {

var makeTestNode = function() {
	var element = $('<div id="testElement" class="testClass"></div>');
	element.appendTo('body');
	return element.get(0);
};

var removeTestNode = function() {
	$('#testElement').remove();
};

$(document).ready(function(){

	module("DOM.js");

	test("resolveTarget", function() {

		expect(1);
		var element = makeTestNode();
		var target;
		$(element).click(function(ev){
			target = $(resolveTarget(ev))[0];
		});

		$(element).click();

		equals(target, element, "resolveTarget correctly identifies the target of a click event");

		removeTestNode();
	});


	test('getPlainText', function(){

		expect(1);
		var initialText = "foo bar baz";
		$('body').append("<div id='text_test'>"+initialText+"</div>");
		var element = $('#text_test').get(0);

		var text = getPlainText(element);

		equals(text, initialText, "getPlainText() returns the plain text of an element.");

		$("#text_test").remove();
	});


	test("findWindowHeight", function() {

		expect(2);
		equals(typeof findWindowHeight(), "number", "returns a number value");
		equals($(window).height(), findWindowHeight(), "return the current height of the display window");
	});
	
	test("findDocHeight", function() {

		expect(2);
		equals(typeof findDocHeight(), "number", "returns a number value");
		var maxHeight = Math.max(
			$(document).height(),
			$(window).height(),
			/* For opera: */
			document.documentElement.clientHeight
		);
		equals(maxHeight, findDocHeight(), "return the current height of the document");
	});

	test("findWindowWidth", function() {

		expect(1);
		equals(typeof findWindowWidth(), "number", "returns a number value");
		// XXX: following test does not work
		// equals($(window).width(), findWindowWidth(), "return the current width of the display window");
	});


	test("findScrollX", function() {

		expect(1);
		var scroll = 10;
		$('<div id="wiiide">wide</div>').css({width: '9999px'}).appendTo('body');
		$().scrollLeft(scroll);

		equals(typeof findScrollX(), "number", "returns a number value");
		//equals(findScrollX(), scroll, "returns the correct horizontal scroll position of the window");

		$('#wiiide').remove();
	});

	test("findScrollY", function() {

		expect(1);
		var scroll = 200;
		$().scrollTop(scroll);

		equals(typeof findScrollY(), "number", "returns a number value");
		// XXX: following test does not work
		// equals(findScrollY(), scroll, "returns the correct vertical scroll position of the window");
	});
}); // document ready.

})(jQuery);

