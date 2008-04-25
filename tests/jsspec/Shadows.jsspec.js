// <![CDATA[
describe('Shadow tiddler existence', {
	'DefaultTiddlers shadow tiddler should exist': function() {
		value_of(config.shadowTiddlers["DefaultTiddlers"]).should_not_be_empty();
	},
	'StyleSheetColors shadow tiddler should exist': function() {
		loadShadowTiddlers();
		value_of(config.shadowTiddlers["StyleSheetColors"]).should_not_be_empty();
	}
});
// ]]>
