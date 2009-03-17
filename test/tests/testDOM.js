function makeTestNode() {
	var ele = document.createElement('div');
	document.body.appendChild(ele);
	ele.id = 'testElement';
	return ele;
}


jQuery(document).ready(function(){

	module("DOM.js");

	test("CSS classes", function() {
		expect(4);
		var ele = makeTestNode();

		// addClass()
		addClass(ele,'testClass');
		ok(jQuery('#testElement').hasClass('testClass'), "addClass() adds a css class to a given DOM element");

		// removeClass()
		removeClass(ele,'testClass');
		ok(!jQuery('#testElement').hasClass('testClass'), "removeClass() removes a css class from a given DOM element");

		// hasClass()
		ok(!hasClass(ele, 'testClass'), "hasClass() returns false when looking for a class which is not present on an element");
		jQuery(ele).addClass('testClass');
		ok(hasClass(ele, 'testClass'), "hasClass() returns true when looking for a class which is present on an element");

	});


	test("Events", function() {
		expect(1);
		var ele = makeTestNode();

		// resolveTarget()
		var target;
		jQuery(ele).click(function(ev){
			target = resolveTarget(ev);
		});
		jQuery(ele).click();
		equals(target, ele, "resolveTarget correctly identifies the target of a click event");
	});


	test('Text', function(){
		jQuery('body').append("<div id='text_test'>foo bar baz</div>");
		var d = document.getElementById('text_test');
		equals(getPlainText(d), "foo bar baz", "getPlainText() returns the plain text of an element.");
		jQuery("#text_test").remove();
	});

});
