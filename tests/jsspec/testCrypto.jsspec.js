// <![CDATA[
describe('Crypto: hexSha1Str()', {

	'SHA-1 hash of empty string should be correct': function() {
		var actual = Crypto.hexSha1Str("").toLowerCase();
		var expected = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
		value_of(actual).should_be(expected);
	},
	'SHA-1 hash of test vector 1 should be correct': function() {
		var actual = Crypto.hexSha1Str("The quick brown fox jumps over the lazy dog").toLowerCase();
		var expected = "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12";
		value_of(actual).should_be(expected);
	}
});
// ]]>

