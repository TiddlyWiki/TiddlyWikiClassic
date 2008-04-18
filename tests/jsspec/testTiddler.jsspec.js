// <![CDATA[
describe('Tiddler: constructor', {
	'Newly created tiddler should have empty string as content': function() {
		var tiddler = new Tiddler("temp");
		var empty = "";
		value_of(tiddler.text).should_be("");
	},
	'Created and modified dates should be equal for newly created tiddler': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.created).should_be(tiddler.modified);
	},
	'Newly created tiddler should not have any tags': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.getTags()).should_be("");
	}
});

describe('Tiddler: tiddler.isTouched()',{
	'it should return true if the tiddler has been updated since the tiddler was created or downloaded': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.isTouched()).should_be(false);
		if(!tiddler.fields['changecount'])
			tiddler.fields['changecount'] = 0;
		tiddler.fields['changecount']++;
		value_of(tiddler.isTouched()).should_be(true);
	}
});

describe('Tiddler: tiddler.incChangeCount()',{
	'Tiddler changecount should increment by 1 when incChangeCount is called': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.isTouched()).should_be(false);
		tiddler.incChangeCount();
		value_of(tiddler.isTouched()).should_be(true);
	}
});

describe('Tiddler: tiddler.clearChangeCount()',{
	'Tiddler changecount should be set to 0 when clearChangeCount is called': function() {
		var tiddler = new Tiddler("temp");
		value_of(tiddler.isTouched()).should_be(false);
		tiddler.incChangeCount();
		value_of(tiddler.isTouched()).should_be(true);
		tiddler.clearChangeCount();
		value_of(tiddler.isTouched()).should_be(false);
	}
});
// ]]>
