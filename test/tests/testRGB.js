jQuery(document).ready(function(){

	module("TiddlyWiki core");

	test("RGB tests", function() {
		expect(3);

		var actual = new RGB(255,0,255).toString();
		var expected = "#ff00ff";		
		ok(actual==expected,'rgb(255,0,255) is the same as #ff00ff');

		actual = new RGB("#f00").toString();
		expected = "#ff0000";		
		ok(actual==expected,'#ff0000 is the same as #f00');
		
		actual = new RGB("rgb(0,255,0)").toString();
		expected = "#00ff00";
		ok(actual==expected,'RGB object created from rgb value > toString method gives hex');	


	});
	

});
