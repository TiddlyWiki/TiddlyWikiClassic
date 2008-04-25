tests_mock = {
	frame:  {},
	before: function(funcName,mocker)
	{
		var frame = {};
		frame.called = 0;
		frame.savedFunc = eval(funcName); 
		if (typeof frame.savedFunc != "function") 
			throw(funcName +" is not a function: " + (typeof frame.savedFunc));

		var mockFunction = function() { 
			tests_mock.frame[funcName].called++; 
			if (mocker)
			    return mocker.apply(this, arguments);
		}
		eval(funcName + "=mockFunction");

		this.frame[funcName] = frame;
	},
	after: function(funcName) 
	{
		frame = this.frame[funcName];
		eval(funcName + '=frame.savedFunc');
		return frame;
	}
};
