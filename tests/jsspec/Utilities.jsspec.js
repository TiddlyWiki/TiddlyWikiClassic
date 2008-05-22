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
		t_linked_from.fields = {
			"server.host":"host",
			"server.workspace":"workspace",
			"wikiformat":"wikiformat",
			"server.type":"type"
		};
		place = document.body;
		includeText = true;
		className = "testLink";
		isStatic = "true";
		linkedFromTiddler = t_linked_from;
		noToggle = "true";
		btn = createTiddlyLink(place,title,includeText,className,false,linkedFromTiddler,noToggle);
		btn_external = createTiddlyLink(place,title,includeText,className,isStatic,linkedFromTiddler,noToggle);
	},

	'it should add a link as child of the "place" DOM element (internal)': function() {
		var before = place.childNodes;
		var expected = before.length+1;
		createTiddlyLink(place,title);
		var actual = place.childNodes.length;
		value_of(actual).should_be(expected);
		actual = place.childNodes[place.childNodes.length-1].nodeName;
		expected = "A";
		value_of(actual).should_be(expected);
	},
	
	'it should set the "tiddlyLink" attribute on the link to the provided "title" parameter (internal)': function() {
		var actual = btn.getAttribute("tiddlyLink");
		var expected = title;
		value_of(actual).should_be(expected);
	},
	
	'it should set the "tiddlyLink" attribute on the link to the provided "title" parameter (external)': function() {
		var actual = btn_external.getAttribute("tiddlyLink");
		var expected = title;
		value_of(actual).should_be(expected);
	},

	'it should include the title as the text of this link if the "includeText" parameter is set to true (internal)': function() {
		var actual = btn.innerText || btn.textContent;
		var expected = title;
		value_of(actual).should_be(expected);
	},

	'it should include the title as the text of this link if the "includeText" parameter is set to true (external)': function() {
		var actual = btn_external.innerText || btn.textContent;
		var expected = title;
		value_of(actual).should_be(expected);
	},

	'it should not include any text in the link if the "includeText" parameter is not set or false': function() {
		btn = createTiddlyLink(place,title);
		var actual = btn.innerText || btn.textContent;
		var expected = "";
		value_of(actual).should_be(expected);
	},

	'it should add the provided "className" parameter to the class of the link (internal)': function() {
		var actual = btn.className.indexOf(className) != -1;
		value_of(actual).should_be_true();
	},
	/* BUG IN DOCS: THIS IS ONLY TRUE IF THE LINK IS INTERNAL */
	/* see http://groups.google.com/group/TiddlyWikiDev/browse_thread/thread/3e8c2de8d7b0fbfa */
	'it should add the provided "className" parameter to the class of the link (external)': function() {
		var actual = btn_external.className.indexOf(className) != -1;
		value_of(actual).should_be_true();
	},
	
	'it should set the "tiddlyFields" attribute on the link to be the fields from any tiddler referred to in the provided "linkedFromTiddler" parameter (internal)': function() {
		var actual = btn.getAttribute("tiddlyFields");
		var expected = linkedFromTiddler.getInheritedFields();
		value_of(actual).should_be(expected);
	},

	'it should set the "tiddlyFields" attribute on the link to be the fields from any tiddler referred to in the provided "linkedFromTiddler" parameter (external)': function() {
		var actual = btn_external.getAttribute("tiddlyFields");
		var expected = linkedFromTiddler.getInheritedFields();
		value_of(actual).should_be(expected);
	},

	'it should set the "noToggle" attribute on the link to "true" if the provided "noToggle" parameter is set (internal)': function() {
		var actual = btn.getAttribute("noToggle");
		var expected = "true";
		value_of(actual).should_be(expected);
	},
	
	'it should set the "noToggle" attribute on the link to "true" if the provided "noToggle" parameter is set (external)': function() {
		var actual = btn_external.getAttribute("noToggle");
		var expected = "true";
		value_of(actual).should_be(expected);
	},
	
	'it should set the "refresh" attribute on the link to "link" (internal)': function() {
		var actual = btn.getAttribute("refresh");
		var expected = "link";
		value_of(actual).should_be(expected);
	},
	
	'it should set the "refresh" attribute on the link to "link" (external)': function() {
		var actual = btn_external.getAttribute("refresh");
		var expected = "link";
		value_of(actual).should_be(expected);
	},
	
	'it should create a permalink if the "isStatic" parameter is set (internal)': function() {
		var actual = btn.href.indexOf("#") != -1;
		value_of(actual).should_be_true;
	},
	
	'it should create a permalink if the "isStatic" parameter is set (external)': function() {
		var actual = btn_external.href.indexOf("#") != -1;
		value_of(actual).should_be_true;
	},
	
	'it should return a reference to the link (internal)': function() {
		var actual = btn.nodeName;
		var expected = "A";
		value_of(actual).should_be(expected);
	},
	
	'it should return a reference to the link (external)': function() {
		var actual = btn_external.nodeName;
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
		removeNode(btn_external);
	}
});

describe('Utilities: refreshTiddlyLink(e,title)', {

	before_each: function() {
		store = new TiddlyWiki();
		loadShadowTiddlers();
		not_a_tiddler = null;
		store.saveTiddler("a_tiddler","a_tiddler");
		store.saveTiddler("another_tiddler","another_tiddler");
		place = document.body;
		btn = createTiddlyLink(place,"a_tiddler");
	},

	'it should update the className attribute of the "e" element if "title" is the name of a non-existant tiddler': function() {
		refreshTiddlyLink(btn,not_a_tiddler);
		var expected = ["tiddlyLink","tiddlyLinkNonExisting"];
		var actual = btn.className.readBracketedList();
		for(var i=0;i<expected.length;i++) {
			value_of(actual.contains(expected[i])).should_be_true();
		}
		value_of(actual.length).should_be(expected.length);
	},
	
	'it should update the className attribute of the "e" element if "title" is the name of a tiddler': function() {
		refreshTiddlyLink(btn,"another_tiddler");
		var expected = ["tiddlyLink","tiddlyLinkExisting"];
		var actual = btn.className.readBracketedList();
		for(var i=0;i<expected.length;i++) {
			value_of(actual.contains(expected[i])).should_be_true();
		}
		value_of(actual.length).should_be(expected.length);
	},
	
	'it should update the className attribute of the "e" element if "title" is the name of a shadow tiddler': function() {
		value_of(store.isShadowTiddler("SiteTitle")).should_be_true();
		refreshTiddlyLink(btn,"SiteTitle");
		var expected = ["tiddlyLink", "tiddlyLinkNonExisting", "shadow"];
		var actual = btn.className.readBracketedList();
		for(var i=0;i<expected.length;i++) {
			value_of(actual.contains(expected[i])).should_be_true();
		}
		value_of(actual.length).should_be(expected.length);
	},
	
	'it should update the title attribute of the "e" element if "title" is the name of a non-existant tiddler': function() {
		refreshTiddlyLink(btn,"not_a_tiddler");
		var expected = config.messages.undefinedTiddlerToolTip.format(["not_a_tiddler"]);
		var actual = btn.title;
		value_of(actual).should_be(expected);
	},
	
	'it should update the title attribute of the "e" element if "title" is the name of a tiddler': function() {
		refreshTiddlyLink(btn,"another_tiddler");
		var expected = store.getTiddler("another_tiddler").getSubtitle();
		var actual = btn.title;
		value_of(actual).should_be(expected);
	},
	
	'it should update the title attribute of the "e" element if "title" is the name of a shadow tiddler with an annotation': function() {
		var title = "SiteTitle";
		value_of(store.isShadowTiddler(title)).should_be_true();
		refreshTiddlyLink(btn,title);
		var expected = config.annotations[title];
		var actual = btn.title;
		value_of(actual).should_be(expected);
	},
	
	'it should update the title attribute of the "e" element if "title" is the name of a shadow tiddler without an annotation': function() {
		merge(config.shadowTiddlers,{
			testShadow: "some test text"
		});
		var title = "testShadow";
		value_of(store.isShadowTiddler(title)).should_be_true();
		refreshTiddlyLink(btn,title);
		var expected = config.messages.shadowedTiddlerToolTip.format([title]);
		var actual = btn.title;
		value_of(actual).should_be(expected);
		delete config.shadowTiddlers.testShadow;
	},

	after_each: function() {
		delete store;
		delete not_a_tiddler;
		delete place;
		removeNode(btn);
	}
});

describe('Utilities: getTiddlyLinkInfo(title,currClasses)', {

	before_each: function() {
		store = new TiddlyWiki();
		loadShadowTiddlers();
		title = "test";
		store.createTiddler(title);
		currClasses = "test test2";
		obj = getTiddlyLinkInfo(title,currClasses);
	},

	'it should return an object with two named properties - the first a string named "classes" and the second a string named "subTitle"': function() {
		var expected = "string";
		var actual = typeof obj["classes"];
		value_of(actual).should_be(expected);
	},
	
	'it should add "shadow" to the classes string if the tiddler is a shadow tiddler': function() {
		title = "SiteTitle";
		obj = getTiddlyLinkInfo(title,null);
		var actual = obj.classes.split(" ").contains("shadow");
		value_of(actual).should_be_true();
	},
	
	'it should add "tiddlyLinkExisting" to the classes string if the tiddler is in the store': function() {
		var actual = obj.classes.split(" ").contains("tiddlyLinkExisting");
		value_of(actual).should_be_true();
	},
	
	'it should add "tiddlyLinkNonExisting" to the classes string if the tiddler is not in the store': function() {
		title = "not_in_the_store";
		obj = getTiddlyLinkInfo(title,null);
		var actual = obj.classes.split(" ").contains("tiddlyLinkNonExisting");
		value_of(actual).should_be_true();
	},
	
	'it should add "tiddlyLink" to the classes string whether the tiddler is a shadow, in the store or not': function() {
		var actual = obj.classes.split(" ").contains("tiddlyLink");
		value_of(actual).should_be_true();
		title = "not_in_the_store";
		obj = getTiddlyLinkInfo(title,null);
		var actual = obj.classes.split(" ").contains("tiddlyLink");
		value_of(actual).should_be_true();
		title = "SiteTitle";
		obj = getTiddlyLinkInfo(title,null);
		var actual = obj.classes.split(" ").contains("tiddlyLink");
		value_of(actual).should_be_true();
	},
	
	'it should maintain any classes passed in, through the currClasses string, in the classes string': function() {
		var actual = currClasses.split(" ");
		var expected = obj.classes.split(" ");
		for(var i=0;i<actual.length;i++) {
			value_of(expected.contains(actual[i]) != -1).should_be_true();
		}
		title = "not_in_the_store";
		obj = getTiddlyLinkInfo(title,null);
		actual = obj.classes.split(" ");
		for(i=0;i<actual.length;i++) {
			value_of(expected.contains(actual[i]) != -1).should_be_true();
		}
		title = "SiteTitle";
		obj = getTiddlyLinkInfo(title,null);
		actual = obj.classes.split(" ");
		for(i=0;i<actual.length;i++) {
			value_of(expected.contains(actual[i]) != -1).should_be_true();
		}
	},
	
	'it should get subTitle from config.annotations if there is an entry there for the title parameter': function() {
		title = "SiteTitle";
		obj = getTiddlyLinkInfo(title,null);
		var expected = config.annotations["SiteTitle"];
		var actual = obj.subTitle;
		value_of(actual).should_be(expected);
	},
	
	'it should get subTitle by calling tiddler.getSubtitle() if there is no entry in config.annotations': function() {
		var funcToMock = 'Tiddler.prototype.getSubtitle';
		tests_mock.before(funcToMock);
		obj = getTiddlyLinkInfo(title,currClasses);
		var actual = tests_mock.after(funcToMock).called;
		value_of(actual).should_be_true();
	},
	
	after_each: function() {
		delete store;
		delete title;
		delete currClasses;
		delete obj;
	}
});

describe('Utilities: createExternalLink(place,url)', {
	'it should ': function() {
	
	},
});