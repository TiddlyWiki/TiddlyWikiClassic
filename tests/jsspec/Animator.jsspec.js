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

// ]]>