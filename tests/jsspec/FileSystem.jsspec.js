// <![CDATA[
describe('FileSystem: manualConvertUTF8ToUnicode', {
	'ASCII characters should remain unchanged when converted from UTF8 to Unicode': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = manualConvertUTF8ToUnicode("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: mozConvertUTF8ToUnicode', {
	'ASCII characters should remain unchanged when converted from UTF8 to Unicode using mozConvert': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = manualConvertUTF8ToUnicode("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: manualConvertUnicodeToUTF8', {
	'ASCII characters should remain unchanged when converted from Unicode to UTF8': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = manualConvertUnicodeToUTF8("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: mozConvertUnicodeToUTF8', {
	'ASCII characters should remain unchanged when converted from Unicode to UTF8 using mozConvert': function() {
		var actual = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var expected = mozConvertUnicodeToUTF8("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		value_of(actual).should_be(expected);
	}
});

// ]]>
