// <![CDATA[

describe('Mock: testing framework mock functions', {
	before_each : function() {
	    mock_me = function() {
		return "ha-ha!";
	    }
	},
	'mocking a function restores orignial function afterwards' : function() { 
		tests_mock.before('mock_me');
		tests_mock.after('mock_me');
		value_of(mock_me()).should_be("ha-ha!");
	},
	'not calling a mocked function returns 0' : function() { 
		tests_mock.before('mock_me');
		value_of(tests_mock.after('mock_me')).should_be(0);
	},
	'calling a mocked function once returns 1' : function() { 
		tests_mock.before('mock_me');
		mock_me();
		value_of(tests_mock.after('mock_me')).should_be(1);
	},
	'calling a mocked function 1001 times returns 1001' : function() { 
		tests_mock.before('mock_me');
		for (var i=0; i<1001;i++)
		    mock_me();
		value_of(tests_mock.after('mock_me')).should_be(1001);
	},
	'mocked function should be able to return a hard-coded value' : function() { 
		tests_mock.before('mock_me', function() { return "hoho" });
		var returnValue = mock_me();
		value_of(tests_mock.after('mock_me')).should_be(1);
		value_of(returnValue).should_be('hoho');
	},
	'mocked function should be able to process passed arguments' : function() { 
		tests_mock.before('mock_me', function(p1,p2,p3,p4,p5) { return p1+p2+p3+p4+p5 });
		var returnValue = mock_me(5,3,2,99,101);
		value_of(tests_mock.after('mock_me')).should_be(1);
		value_of(returnValue).should_be(210);
	},
});

// ]]>
