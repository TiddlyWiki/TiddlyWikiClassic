jQuery(document).ready(function(){

	module("Wizard.js");

	test("Wizard: construction", function() {
		expect(1);

		var w = new Wizard();
		var actual = w.formElem===null && w.bodyElem===null && w.footElem===null;
		ok(actual==true,'properties should be null when constructed with no parameters');

	});
	

});
