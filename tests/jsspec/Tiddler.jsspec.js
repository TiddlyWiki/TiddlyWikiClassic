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

describe('Tiddler: tiddler.assign()',{
	before_each: function(){
		tiddler = new Tiddler("temp");
		tiddler.text = "some text";
		tiddler.modifier = "a modifier";
		tiddler.created = new Date(2008,04,21,01,02,03);
		tiddler.modified = new Date(2009,05,22,12,13,14);
	},
	'Assigning value to tiddler title should override old title': function() {
		tiddler.assign("NewTitle");
		value_of(tiddler.title).should_be("NewTitle");
		value_of(tiddler.text).should_be("some text");
		value_of(tiddler.modifier).should_be("a modifier");
		value_of(tiddler.created).should_be(new Date(2008,04,21,01,02,03));
		value_of(tiddler.modified).should_be(new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler text should override old text': function() {
		tiddler.assign(null,"new text");
		value_of(tiddler.title).should_be("temp");
		value_of(tiddler.text).should_be("new text");
		value_of(tiddler.modifier).should_be("a modifier");
		value_of(tiddler.created).should_be(new Date(2008,04,21,01,02,03));
		value_of(tiddler.modified).should_be(new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler modifier should override old modifier': function() {
		tiddler.assign(null,null,"new modifier");
		value_of(tiddler.title).should_be("temp");
		value_of(tiddler.text).should_be("some text");
		value_of(tiddler.modifier).should_be("new modifier");
		value_of(tiddler.created).should_be(new Date(2008,04,21,01,02,03));
		value_of(tiddler.modified).should_be(new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler created date should override old created date': function() {
		tiddler.assign(null,null,null,null,null,new Date(2007,03,20,00,01,02));
		value_of(tiddler.title).should_be("temp");
		value_of(tiddler.text).should_be("some text");
		value_of(tiddler.modifier).should_be("a modifier");
		value_of(tiddler.created).should_be(new Date(2007,03,20,00,01,02));
		value_of(tiddler.modified).should_be(new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler modified date should override old modified date': function() {
		tiddler.assign(null,null,null,new Date(2010,06,23,13,14,15));
		value_of(tiddler.title).should_be("temp");
		value_of(tiddler.text).should_be("some text");
		value_of(tiddler.modifier).should_be("a modifier");
		value_of(tiddler.created).should_be(new Date(2008,04,21,01,02,03));
		value_of(tiddler.modified).should_be(new Date(2010,06,23,13,14,15));
	}
});
// ]]>
