function makeTestNode() {
	var ele = document.createElement('div');
	document.body.appendChild(ele);
	ele.id = 'testElement';
	return ele;
}

function removeTestNode() {
	jQuery('#testElement').remove();
}


jQuery(document).ready(function(){

	module("DOM.js");

	test("createTiddlyElement", function() {
		expect(4);
		
		ok(createTiddlyElement(null,"div"), "Element creation should create the DOM element");
		
		createTiddlyElement( makeTestNode(),"div");
		ok(jQuery('#testElement div'), 'Setting the parent parameter should append the new DOM element to the parent');
		removeTestNode();
		
		createTiddlyElement(null,"div",'testID');		
		ok(jQuery('#testID'), 'Setting the element id parameter should set the id on the DOM element');
		
		createTiddlyElement(null,"div", null, 'testClass');		
		ok(jQuery('div.testClass'), 'Setting the element class parameter should set the class on the DOM element');
		
	});

	
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
