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
	
	var mockVars = {}; // this could have as many properties as we wanted to track behaviour
	mockVars.called = false;
	
	// translate the funcToMock string to an object reference and store the current function
	if(funcToMock.indexOf(".") == -1) {
		parent = window;
		child = funcToMock;
	} else {
		parent = resolveVar(funcToMock.substring(0,funcToMock.lastIndexOf(".")));
		child = funcToMock.substring(funcToMock.lastIndexOf(".")+1);
	}
	var original = parent[child];
	
	// override the current function and set behaviour flags in mockVars
	parent[child] = function() {
		mocker.apply(this,arguments);
		mockVars.called = true;
		parent[child] = original;
	};
	
	return mockVars;
}
