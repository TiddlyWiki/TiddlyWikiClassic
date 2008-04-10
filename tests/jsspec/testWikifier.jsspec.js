// <![CDATA[
describe('Wikifier', {
	'Bold formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("''bold''");
		var expected = "<strong>bold</strong>";		
		value_of(actual).should_be(expected);
	},
	'Italic formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("//italic");
		var expected = "<em>italic</em>";		
		value_of(actual).should_be(expected);
	}
})
// ]]>
