describe('Utilities: formatVersion', {
	before_each: function() {
		v = {
			major:1,
			minor:2,
			revision:3
		};
		v_beta = {
			major:1,
			minor:2,
			revision:3,
			beta:true
		};
	},
	'it should use a version object if one is passed as a parameter, which has properties: major, minor, revision, beta (optional) and format the output as "major.minor.revision"': function() {
		var actual = formatVersion(v);
		var expected = v.major+"."+v.minor+"."+v.revision;
		value_of(actual).should_be(expected);
	},
	'it doesn\'t need to take an argument, in which case it will use the global "version" variable': function() {
		var actual = formatVersion();
		var expected = version.major+"."+version.minor+"."+version.revision+(version.beta?" (beta "+version.beta+")" : "");
		value_of(actual).should_be(expected);
	},
	'it should return a string': function() {
		var actual = typeof formatVersion();
		var expected = "string";
		value_of(actual).should_be(expected);
	},
	'it should append the string " (beta #)", where # is the beta number if the beta number is set': function() {
		var actual = formatVersion(v_beta).indexOf("beta "+v_beta.beta) != -1;
		value_of(actual).should_be_true();
	},
	after_each: function() {
		delete v;
		delete v_beta;
	}
});

describe('Utilities: compareVersions', {
	before_each: function() {
		v1 = {
			major:1,
			minor:2,
			revision:3
		};
		v1_beta = {
			major:1,
			minor:2,
			revision:3,
			beta:true
		};
		v2 = {
			major:v1.major,
			minor:v1.minor,
			revision:v1.revision
		};
	},

	'it should return +1 if the second version is later than the first': function() {
		v2.major = v1.major+1;
		var actual = compareVersions(v1,v2);
		var expected = 1;
		value_of(actual).should_be(expected);
		v2.major--;
		v2.minor = v1.minor+1;
		actual = compareVersions(v1,v2);
		expected = 1;
		value_of(actual).should_be(expected);
		v2.minor--;
		v2.revision = v1.revision+1;
		actual = compareVersions(v1,v2);
		expected = 1;
		value_of(actual).should_be(expected);
	},
	
	'it should return 0 if the second version is the same as the first': function() {
		var actual = compareVersions(v1,v2);
		var expected = 0;
		value_of(actual).should_be(expected);
	},
	
	'it should return -1 if the second version is earlier than the first': function() {
		v2.major = v1.major-1;
		var actual = compareVersions(v1,v2);
		var expected = -1;
		value_of(actual).should_be(expected);
		v2.major++;
		v2.minor = v1.minor-1;
		actual = compareVersions(v1,v2);
		expected = -1;
		value_of(actual).should_be(expected);
		v2.minor++;
		v2.revision = v1.revision-1;
		actual = compareVersions(v1,v2);
		expected = -1;
		value_of(actual).should_be(expected);
	},
	
	'it should treat versions without a beta number as later than a version without a beta number': function() {
		var actual = compareVersions(v1,v1_beta);
		var expected = -1;
		value_of(actual).should_be(expected);
	}

});

describe('Utilities: createTiddlyButton(parent,text,tooltip,action,className,id,accessKey,attribs)', {

	before_each: function() {
		parent = document.body;
		text = "hi!";
		tooltip = "a tooltip";
		action = function() { alert('clicked!'); };
		className = "testButton";
		id = "testButtonId";
		accessKey = "b";
		attribs = {
			style:"display:none;"
		};
		btn = createTiddlyButton(parent,text,tooltip,action,className,id,accessKey,attribs);
	},

	'it should create an anchor element as a child of the parent element provided': function() {
		var before = document.body.childNodes.length;
		btn = createTiddlyButton(parent,text,tooltip,action,className,id,accessKey,attribs);
		var after = document.body.childNodes.length;
		var actual = after-before;
		var expected = 1;
		value_of(actual).should_be(expected);
		actual = document.body.childNodes[after-1].nodeName;
		expected = "A";
		value_of(actual).should_be(expected);
	},
	
	'it should set the onclick function to the provided action parameter': function() {
		var actual = btn.onclick;
		var expected = action;
		value_of(actual).should_be(expected);
	},
	
	'it should set the anchor href to null if no action parameter is provided': function() {
		var actual = btn.href;
		var expected = "javascript:;";
		value_of(actual).should_be(expected);
	},
	
	'it should set the anchor title to the provided tooltip paramater': function() {
		var actual = btn.title;
		var expected = tooltip;
		value_of(actual).should_be(expected);
	},
	
	'it should set the contained text to the provided text parameter': function() {
		var actual = btn.innerText || btn.textContent;
		var expected = text;
		value_of(actual).should_be(expected);
	},
	
	'it should set the anchor class to the provdided className parameter': function() {
		var actual = btn.className;
		var expected = className;
	},
	
	'it should set the anchor class to "button" if no className parameter is provided': function() {
		var btn2 = createTiddlyButton(parent,text,tooltip,action,null,id,accessKey,attribs);
		var actual = btn2.className;
		var expected = "button";
		value_of(actual).should_be(expected);
	},
	
	'it should set the anchor id to the provided id parameter': function() {
		var actual = btn.id;
		var expected = id;
		value_of(actual).should_be(expected);
	},
	
	'it should set any attributes on the anchor that are provided in the attribs object': function() {
		for(var i in attribs) {
			value_of(btn.i).should_be(attribs.i);
		}
	},
	
	'it should set the anchor accessKey attribute to the provided accessKey parameter': function() {

	},
	
	'it should return the anchor element': function() {
		var actual = btn.nodeName;
		var expected = "A";
		value_of(actual).should_be(expected);
	},
	
	'it should not require any parameters and still return an anchor element': function() {
		var actual = createTiddlyButton().nodeName;
		var expected = "A";
		value_of(actual).should_be(expected);
	},
	
	after_each: function() {
		delete btn;
		delete parent;
		delete text;
		delete tooltip;
		delete action;
		delete className;
		delete id;
		delete accessKey;
		delete attribs;
	}
});

describe('Utilities: createTiddlyLink(place,title,includeText,className,isStatic,linkedFromTiddler,noToggle)', {

	before_each: function() {
		store = new TiddlyWiki();
		title = "test";
		t = new Tiddler(title);
		t_linked_from = new Tiddler("linkedFrom");
		place = document.body;
		includeText = true;
		className = "testLink";
		isStatic = "true";
		linkedFromTiddler = t_linked_from;
		noToggle = "true";
		btn = createTiddlyLink(place,title,includeText,className,isStatic,linkedFromTiddler,noToggle);
	},

	'it should add a link as child of the "place" DOM element ': function() {
		var before = place.childNodes;
		var expected = before.length+1;
		createTiddlyLink(place,title);
		var actual = place.childNodes.length;
		value_of(actual).should_be(expected);
		actual = place.childNodes[place.childNodes.length-1].nodeName;
		expected = "A";
		value_of(actual).should_be(expected);
	},
	
	'it should set the "tiddlyLink" attribute on the link to the provided "title" parameter': function() {
		var actual = btn.getAttribute("tiddlyLink");
		var expected = title;
		value_of(actual).should_be(expected);
	},
	/* BUG IN DOCS: THIS IS ONLY TRUE IF THE LINK IS INTERNAL
	'it should include the title as the text of this link if the "includeText" parameter is set to true': function() {
		var actual = btn.innerText || btn.textContent;
		var expected = title;
		value_of(actual).should_be(expected);
	},
	*/
	'it should not include any text in the link if the "includeText" parameter is not set or false': function() {
		btn = createTiddlyLink(place,title);
		var actual = btn.innerText || btn.textContent;
		var expected = "";
		value_of(actual).should_be(expected);
	},
	/* BUG IN DOCS: THIS IS ONLY TRUE IF THE LINK IS INTERNAL
	'it should add the provided "className" parameter as the class of the link': function() {
		var actual = btn.className;
		console.log(btn);
		var expected = className;
		value_of(actual).should_be(expected);
	},
	*/
	/* BUG IN DOCS: THIS IS ONLY TRUE IF THE LINK IS INTERNAL
	'it should set the "tiddlyFields" attribute on the link to be the fields from any tiddler referred to in the provided "linkedFromTiddler" parameter': function() {
		var actual = btn.getAttribute("tiddlyFields");
		var expected = linkedFromTiddler.getInheritedFields();
		value_of(actual).should_be(expected);
	},
	*/
	'it should set the "noToggle" attribute on the link to "true" if the provided "noToggle" parameter is set': function() {
		var actual = btn.getAttribute("noToggle");
		var expected = "true";
		value_of(actual).should_be(expected);
	},
	
	'it should set the "refresh" attribute on the link to "link"': function() {
		var actual = btn.getAttribute("refresh");
		var expected = "link";
		value_of(actual).should_be(expected);
	},
	
	'it should create a permalink if the "isStatic" parameter is set': function() {
		var actual = btn.href.indexOf("#") != -1;
		value_of(actual).should_be_true;
	},
	
	'it should return a reference to the link': function() {
		var actual = btn.nodeName;
		var expected = "A";
		value_of(actual).should_be(expected);
	},
	
	after_each: function() {
		delete store;
		delete t_linked_from;
		delete place;
		delete title;
		delete includeText;
		delete className;
		delete isStatic;
		delete linkedFromTiddler;
		delete noToggle;
		removeNode(btn);
	}
});
