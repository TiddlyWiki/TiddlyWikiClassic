tests_mock = {
	saved:  {},
	before: function(funcName)
	{
		var frame = {};
		frame.savedFunc = eval(funcName); 
		frame.was_called = 0;

		var mocker = arguments[1];

		var mockFunction = function() { 
			tests_mock.saved[funcName].was_called++; 
			if (mocker)
			    return mocker.apply(this, arguments);
		}
		eval(funcName + "=mockFunction");

		this.saved[funcName] = frame;
	},
	after: function(funcName) 
	{
		frame = this.saved[funcName];
		eval(funcName + '=frame.savedFunc');
		return frame.was_called;
	}
};
