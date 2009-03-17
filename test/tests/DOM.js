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

	
	test("addClass", function() {
		expect(1);
		var ele = makeTestNode();

		addClass(ele,'testClass');
		ok(jQuery('#testElement').hasClass('testClass'), "addClass() adds a css class to a given DOM element");
		
		removeTestNode();
	});	
	
	
	
	test("removeClass", function() {
		expect(1);
		var ele = makeTestNode();

		removeClass(ele,'testClass');
		ok(!jQuery('#testElement').hasClass('testClass'), "removeClass() removes a css class from a given DOM element");
		
		removeTestNode();
	});	


	test("hasClass", function() {
		expect(2);
		var ele = makeTestNode();

		ok(!hasClass(ele, 'testClass'), "hasClass() returns false when looking for a class which is not present on an element");

		jQuery(ele).addClass('testClass');
		ok(hasClass(ele, 'testClass'), "hasClass() returns true when looking for a class which is present on an element");

		removeTestNode();
	});


	test("resolveTarget", function() {
		expect(1);
		var ele = makeTestNode();

		var target;
		jQuery(ele).click(function(ev){
			target = resolveTarget(ev);
		});
		jQuery(ele).click();
		equals(target, ele, "resolveTarget correctly identifies the target of a click event");
		
		removeTestNode();
	});


	test('getPlainText', function(){
		jQuery('body').append("<div id='text_test'>foo bar baz</div>");
		var d = jQuery('#text_test').get(0);
		equals(getPlainText(d), "foo bar baz", "getPlainText() returns the plain text of an element.");
		jQuery("#text_test").remove();
	});

});
