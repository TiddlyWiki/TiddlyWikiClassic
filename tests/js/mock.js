// lovingly nicked and adapted from message macro
function resolveVar(varString) {
	if(!varString)
		return null;	
	var names = varString.split(".");
	var lookupMessage = function(root,nameIndex) {
		if(names[nameIndex] in root) {
			if(nameIndex < names.length-1)
				return (lookupMessage(root[names[nameIndex]],nameIndex+1));
			else
				return root[names[nameIndex]];
		} else
			return null;
	};
	return lookupMessage(window,0);
}

function mock_once(funcToMock,mocker) {
	var parent, child;
	
	var mockVars = {
		called:false // this could have as many default properties as we wanted to track behaviour
	};
	mocker.mockVars = mockVars; // attach mockVars to the mocker so we can get at it from the mocker using arguments.callee.mockVars
	
	// translate the funcToMock string to an object reference and store the current function
	if(funcToMock.indexOf(".") == -1) {
		parent = window;
		child = funcToMock;
	} else {
		parent = resolveVar(funcToMock.substring(0,funcToMock.lastIndexOf(".")));
		child = funcToMock.substring(funcToMock.lastIndexOf(".")+1);
	}
	var original = parent[child];
	
	// override the current function
	parent[child] = function() {
		mocker.apply(this,arguments);
		mockVars.called = true;
		parent[child] = original;
	};
	
	return mockVars;
}
