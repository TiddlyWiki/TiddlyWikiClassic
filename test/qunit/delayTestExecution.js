jQuery(document).ready(function() {
	test('dummy', function() {
		stop();
	});
});

jQuery().bind("startup", function() {
	start();
});
