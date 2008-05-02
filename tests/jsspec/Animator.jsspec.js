// <![CDATA[

describe('Animator : constructor', {

	'the Animator() constructor should return an object' : function() {
		var a = new Animator();
		value_of(typeof a).should_be('object');
	},

	'the object returned by the Animator() constructor should contain a \'running\' integer with a value of 0 ' : function() {
		var a = new Animator();
		value_of(a.running).should_be(0);
	},
	
	'the object returned by the Animator() constructor should contain a \'timerID\' integer with a value of 0 ' : function() {
		var a = new Animator();
		value_of(a.timerID).should_be(0);
	},

	'the object returned by the Animator() constructor should contain an empty \'animations\' array' : function() {
		var a = new Animator();
		value_of(a.animations.length).should_be(0);
	}

});

describe('Animator : functions', {

	'given a float value, Animator.slowInSlowOut() returns the result of the correct mathematical transformation.' : function() {
		var expected = ".2061";
		var actual = Animator.slowInSlowOut(0.3);
		actual = actual.toString().substr(1,5);
		value_of(actual).should_be(expected);
	},
	
	'given a value above the max of valid input, Animator.slowInSlowOut() clamps its output appropriately. ' : function() {
		var expected = 0;
		var actual = Animator.slowInSlowOut(2);
		value_of(actual).should_be(expected);
	}

});

// ]]>