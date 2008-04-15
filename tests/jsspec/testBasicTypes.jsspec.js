// <![CDATA[

describe('testBasicTypes : Number.clamp(min,max)', {

	'given a number below the minium value, Number.clamp() brings the number into the range' : function() {
		var max = 10;
		var min = 5;
		var n = 2;
		n = n.clamp(min,max);
		value_of(n).should_be(min);
	},
	
	'given a number above the minium value, Number.clamp() brings the number into the range' : function() {
		var max = 10;
		var min = 5;
		var n = 20;
		n = n.clamp(min,max);
		value_of(n).should_be(max);
	}
});

// ]]>

