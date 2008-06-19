// <![CDATA[
describe('FileSystem: convertUTF8ToUnicode', {
	'ASCII characters should remain unchanged when converted from UTF8 to Unicode using convert': function() {
		var expected = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
		var actual = convertUTF8ToUnicode(expected);
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: manualConvertUTF8ToUnicode', {
	'ASCII characters should remain unchanged when converted from UTF8 to Unicode manually': function() {
		var expected = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
		var actual = manualConvertUTF8ToUnicode(expected);
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: convertUnicodeToUTF8', {
	'ASCII characters should remain unchanged when converted from Unicode to UTF8 using convert': function() {
		var expected = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
		var actual = convertUnicodeToUTF8(expected);
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: manualConvertUnicodeToUTF8', {
	'ASCII characters should remain unchanged when converted from Unicode to UTF8 manually': function() {
		var expected = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
		var actual = manualConvertUnicodeToUTF8(expected);
		value_of(actual).should_be(expected);
	}
});

describe('FileSystem: round trip conversion from UTF to Unicode and back', {
	'Characters should remain unchanged when converted from Unicode to UTF8 and back to Unicode': function() {
		//var expected = "\u007f\u0080\u0081\u00ff\u0100\u0101";
		var expected = "\u007f\u0080";
		console.log("ee");
		console.log(expected);
		var actual = convertUTF8ToUnicode(convertUnicodeToUTF8(expected));
		console.log("aa");
		console.log(actual);
		value_of(actual).should_be(expected);
	}
});
// ]]>
