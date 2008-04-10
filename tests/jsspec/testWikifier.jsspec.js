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
		var actual = wikifyStatic("//italic//");
		var expected = "<em>italic</em>";		
		value_of(actual).should_be(expected);
	},
	'Underline formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("__underline__");
		var expected = "<u>underline</u>";		
		value_of(actual).should_be(expected);
	},
	'Superscript formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("^^superscript^^");
		var expected = "<sup>superscript</sup>";		
		value_of(actual).should_be(expected);
	},
	'Subscript formatting': function() {
		formatter = new Formatter(config.formatters);
		var actual = wikifyStatic("~~subscript~~");
		var expected = "<sub>subscript</sub>";		
		value_of(actual).should_be(expected);
	},
})
// ]]>

