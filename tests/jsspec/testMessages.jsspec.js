// <![CDATA[
describe(' test the DisplayMessages', {
	' should fail if the messageArea is not on the page.': function() {
		var actual = displayMessage('test value');
		var expected = undefined;
		value_of(actual).should_be(expected);
	}
});
// ]]>
