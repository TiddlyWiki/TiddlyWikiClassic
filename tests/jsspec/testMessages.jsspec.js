// <![CDATA[
describe('displayMessage', {
	before_each: function() {
		createTiddlyElement(document.body,"div","messageArea");
	},

	'should fail if the messageArea element does not exist': function() {
		var actual = displayMessage('test value');
		var expected = undefined;
		value_of(actual).should_be(expected);
	},
	
	'should provide the letter "s" contained in a message area.': function() {
		createTiddlyElement(document.body,"div","messageArea");
	 	displayMessage('s');
		var a = document.getElementById('messageArea');
		actual = a.getElementsByTagName('div')[1].innerHTML;
		var expected = 's';
		value_of(actual).should_be(expected);
	}

});
// ]]>


