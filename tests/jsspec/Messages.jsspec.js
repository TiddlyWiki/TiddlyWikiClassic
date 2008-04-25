// <![CDATA[
function getMessage() {
	return msgArea.getElementsByTagName("div")[1].innerHTML;
}

describe('displayMessage', {	before_each: function() {		msgArea = createTiddlyElement(document.body,"div","messageArea");
		msgArea.style.visibility = "hidden";	},	after_each: function() {		removeNode(msgArea);	},

	/* NOTE: disabled to suppress alert()	'should fail if the messageArea element does not exist': function() {
		msgArea.id = "messageArea_disabled";
		displayMessage("test value");
		var actual = getMessage();		var expected = undefined;		value_of(actual).should_be(expected);	},
	*/
	'should provide the letter "s" contained in a message area': function() {		displayMessage("s");		var actual = getMessage();		var expected = "s";		value_of(actual).should_be(expected);	}});// ]]>
