// <![CDATA[

describe('testBasicTypes : Number.clamp()', {

	before_each: function(){
		max = 10;
		min = 5;
	},

	'given a number below the minium value, Number.clamp() brings the number into the range' : function() {
		var n = 2;
		n = n.clamp(min,max);
		value_of(n).should_be(min);
	},

	'given a number above the minium value, Number.clamp() brings the number into the range' : function() {
		var n = 20;
		n = n.clamp(min,max);
		value_of(n).should_be(max);
	},

	'given a number within the perscribed range, Number.clamp() returns the original value' : function() {
		var n = 7;
		n = n.clamp(min,max);
		value_of(n).should_be(7);
	}

});

describe('testBasicTypes : Array.indexOf()', {

	before_each: function(){
		test_arr = ['item1', 'item2','item3'];
	},

	'an array object should have an indexOf method.' : function() {
		var t = typeof test_arr.indexOf;
		value_of(t).should_be('function');
	},

	'given the value of the element at position 0, indexOf should return 0' : function() {
		value_of(test_arr.indexOf('item1')).should_be(0);
	},

	'given a value not present in an array, indexOf should return -1' : function() {
		value_of(test_arr.indexOf('noitem')).should_be(-1);
	},

	'indexOf should retuen the index of an element in a restricted range in an array' : function() {
		value_of(test_arr.indexOf('item3',1)).should_be(2);
	},

	'indexOf should return -1 when searching for an element outside a restricted range in an array' : function() {
		value_of(test_arr.indexOf('item1',1)).should_be(-1);
	}

});

// ]]>

