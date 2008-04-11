// <![CDATA[
describe('Tiddlers', {
	'Tiddler changecount': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.isTouched()).should_be(false);
		tiddler.incChangeCount();
		value_of(tiddler.isTouched()).should_be(true);
		tiddler.clearChangeCount();
		value_of(tiddler.isTouched()).should_be(false);
	},
	'Tiddler tags': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.isTagged()).should_be(false);
		value_of(tiddler.getTags()).should_be("");
	}
});
// ]]>
