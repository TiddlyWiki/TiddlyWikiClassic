tests_mock = {
	saved:  {},
	before: function(funcName,mocker)
	{
		var frame = {};
		frame.was_called = 0;
		frame.savedFunc = eval(funcName); 
		if (typeof frame.savedFunc != "function") 
			throw(funcName +" is not a function: " + (typeof frame.savedFunc));

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
