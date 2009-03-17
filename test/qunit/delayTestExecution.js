jQuery(document).ready(function() {
	test("dummy test (delay test execution until after TiddlyWiki startup)", function() {
		stop();
	});
});

jQuery().bind("startup", function() {
	start();
});
