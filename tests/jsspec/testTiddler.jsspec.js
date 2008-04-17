// <![CDATA[
describe('Tiddlers', {
	'Newly created tiddler should have empty string as content': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.text).should_be("");
	},
	'Created and modified dates should be equal for newly created tiddler': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.created).should_be(tiddler.modified);
	},
	'Tiddler changecount': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.isTouched()).should_be(false);
		tiddler.incChangeCount();
		value_of(tiddler.isTouched()).should_be(true);
		tiddler.clearChangeCount();
		value_of(tiddler.isTouched()).should_be(false);
	},
	'Newly created tiddler should not have any tags': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.getTags()).should_be("");
	}
});
// ]]>
