// <![CDATA[
describe('FileSystem: convertUTF8ToUnicode', {
	'ASCII characters should remain unchanged when converted from UTF8 to Unicode using convert': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = convertUTF8ToUnicode("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: manualConvertUTF8ToUnicode', {
	'ASCII characters should remain unchanged when converted from UTF8 to Unicode manually': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = manualConvertUTF8ToUnicode("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: convertUnicodeToUTF8', {
	'ASCII characters should remain unchanged when converted from Unicode to UTF8 using convert': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = convertUnicodeToUTF8("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: manualConvertUnicodeToUTF8', {
	'ASCII characters should remain unchanged when converted from Unicode to UTF8 manually': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = manualConvertUnicodeToUTF8("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

// ]]>
