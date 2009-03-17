jQuery(document).ready(function(){

	module("Tiddler");

	test('constructor', function() {
		var tiddler = new Tiddler("temp");
		var empty = "";
		same(tiddler.text,"",'Newly created tiddler should have empty string as content');
		tiddler = new Tiddler("temp");
		same(tiddler.created,tiddler.modified,'Created and modified dates should be equal for newly created tiddler');
		tiddler = new Tiddler("temp");
		same(tiddler.getTags(),"",'Newly created tiddler should not have any tags');
	});

	test('tiddler.isTouched()', function() {
		var tiddler = new Tiddler("temp");
		same(tiddler.isTouched(),false,'it should return true if the tiddler has been updated since the tiddler was created or downloaded');
		if(!tiddler.fields['changecount'])
			tiddler.fields['changecount'] = 0;
		tiddler.fields['changecount']++;
		same(tiddler.isTouched(),true,'it should return true if the tiddler has been updated since the tiddler was created or downloaded');
	});
});
/*
	test describe('Tiddler: tiddler.incChangeCount()',{
	'Tiddler changecount should increment by 1 when incChangeCount is called': function() {
		var tiddler = new Tiddler("temp");
		same(tiddler.isTouched()),false);
		tiddler.incChangeCount();
		same(tiddler.isTouched()),true);
	}

describe('Tiddler: tiddler.clearChangeCount()',{
	'Tiddler changecount should be set to 0 when clearChangeCount is called': function() {
		var tiddler = new Tiddler("temp");
		same(tiddler.isTouched(),false);
		tiddler.incChangeCount();
		same(tiddler.isTouched(),true);
		tiddler.clearChangeCount();
		same(tiddler.isTouched(),false);
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
		same(tiddler.title),"NewTitle");
		same(tiddler.text),"some text");
		same(tiddler.modifier),"a modifier");
		same(tiddler.created),new Date(2008,04,21,01,02,03));
		same(tiddler.modified),new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler text should override old text': function() {
		tiddler.assign(null,"new text");
		same(tiddler.title),"temp");
		same(tiddler.text),"new text");
		same(tiddler.modifier),"a modifier");
		same(tiddler.created),new Date(2008,04,21,01,02,03));
		same(tiddler.modified),new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler modifier should override old modifier': function() {
		tiddler.assign(null,null,"new modifier");
		same(tiddler.title),"temp");
		same(tiddler.text),"some text");
		same(tiddler.modifier),"new modifier");
		same(tiddler.created),new Date(2008,04,21,01,02,03));
		same(tiddler.modified),new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler created date should override old created date': function() {
		tiddler.assign(null,null,null,null,null,new Date(2007,03,20,00,01,02));
		same(tiddler.title),"temp");
		same(tiddler.text),"some text");
		same(tiddler.modifier),"a modifier");
		same(tiddler.created),new Date(2007,03,20,00,01,02));
		same(tiddler.modified),new Date(2009,05,22,12,13,14));
	},
	'Assigning value to tiddler modified date should override old modified date': function() {
		tiddler.assign(null,null,null,new Date(2010,06,23,13,14,15));
		same(tiddler.title),"temp");
		same(tiddler.text),"some text");
		same(tiddler.modifier),"a modifier");
		same(tiddler.created),new Date(2008,04,21,01,02,03));
		same(tiddler.modified),new Date(2010,06,23,13,14,15));
	}
});
*/
