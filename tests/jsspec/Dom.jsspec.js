// <![CDATA[

function __createDomElementsForQuery() {
	var place = document.body;
	var d = document.createElement("div");
	d.id = "test_div";
	place.appendChild(d);
	for (var i=0; i < 4; i++) {
		p = document.createElement("p");
		p.className = "test_p";
		d.appendChild(p);
	};
	p = document.createElement("p");
	p.className = "test_p";
	place.appendChild(p);
}

describe('Dom : TiddlyWiki DOM element creation', {
	'Element creation should create the DOM element': function() {
		var actual = createTiddlyElement(null,"div");
		value_of(actual).should_not_be_null();
	},
	'Setting the parent parameter should append the new DOM element to the parent': function() {
		var parent = document.body;
		var before = document.body.childNodes.length;
		var actual = createTiddlyElement(parent,"div");
		var after = document.body.childNodes.length;
		value_of(++before).should_be(after);
	},
	'Setting the element id parameter should set the id on the DOM element': function() {
		var actual = createTiddlyElement(null,"div","testId").id;
		var expected = "testId";		
		value_of(actual).should_be(expected);
	},
	'Setting the class parameter should set the class on the DOM element': function() {
		var actual = createTiddlyElement(null,"div",null,"testClass").className;
		var expected = "testClass";		
		value_of(actual).should_be(expected);
	}
});

describe('Dom : getElementsByClassName', {

	'document should have a getElementsByClassName function' : function() {
		var g = document.getElementsByClassName;
		value_of(typeof g).should_be('function');
	},
	
	'document.getElementsByClassName() returns an array of elements ' : function() {
		__createDomElementsForQuery();
		var results = document.getElementsByClassName('test_p');
		value_of(results).should_have_exactly(5, "items");
	},
	
	'node.getElementsByClassName() returns an array of elements with the specified class who are children of the node' : function() {
		__createDomElementsForQuery();
		var n = document.getElementById('test_div');
		var results = n.getElementsByClassName('test_p');
		value_of(results).should_have_exactly(4, "items");
	}

});

// ]]>
