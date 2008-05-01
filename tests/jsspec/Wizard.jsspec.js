// <![CDATA[
describe('Wizard: construction', {

	'properties should be null when constructed with no parameters': function() {
		var w = new Wizard();
		var actual = w.formElem===null && w.bodyElem===null && w.footElem===null;
		value_of(actual).should_be(true);
	}
});

// ]]>

