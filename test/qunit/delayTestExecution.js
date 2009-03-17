jQuery(document).ready(function() {
	test('dummy', function() {
		console.log('calling dummy');
		stop();
	});
});

jQuery().bind("startup", function() {
	//start();
});
