// Returns true if path is a valid (meta data) field name (path),
// i.e. a sequence of identifiers, separated by '.'
TiddlyWiki.isValidFieldName = function (name) {
	var match = /[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)*/.exec(name);
	return match && (match[0] == name);
}

// Throws an exception when name is not a valid (meta data) field name.
TiddlyWiki.checkFieldName = function(name) {
	if (!TiddlyWiki.isValidFieldName(name))
		throw config.messages.invalidFieldName.format([name]);
}

function StringFieldAccess(n, readOnly) {
	this.set = readOnly 
		? function(t,v) {if (v != t[n]) throw config.messages.fieldCannotBeChanged.format([n]);}
		: function(t,v) {if (v != t[n]) {t[n] = v; return true;}};
	this.get = function(t) {return t[n];};
}

function DateFieldAccess(n) {
	this.set = function(t,v) {
			var d = v instanceof Date ? v : Date.convertFromYYYYMMDDHHMM(v); 
			if (d != t[n]) {
				t[n] = d; return true;
			}
		};
	this.get = function(t)   {return t[n].convertToYYYYMMDDHHMM();}
}

function LinksFieldAccess(n) {
	this.set = function(t,v) {
			var s = (typeof v == "string") ? v.readBracketedList() : v; 
			if (s.toString() != t[n].toString()) {
				t[n] = s; return true;
			}
		};
	this.get = function(t)   {return String.encodeTiddlyLinkList(t[n]);}
}

TiddlyWiki.legacyFieldAccess = {
	// The set functions return true when setting the data has changed the value.
	
	"title":    new StringFieldAccess("title", true),
	// Handle the "tiddler" field name as the title
	"tiddler":  new StringFieldAccess("title", true),
	
	"text":     new StringFieldAccess("text"),
	"modifier": new StringFieldAccess("modifier"),
	"modified": new DateFieldAccess("modified"),
	"created":  new DateFieldAccess("created"),
	"tags":     new LinksFieldAccess("tags")
};

TiddlyWiki.isLegacyField = function(name) {
	return TiddlyWiki.legacyFieldAccess[name] != undefined;
}

// Sets the value of the given (meta) data field of the tiddler to the value. 
// Setting a (non-legacy) field's value to null or undefined removes the field. 
// Setting a namespace to undefined removes all fields of that namespace.
// The fieldName is case-insensitive.
// All values will be converted to a string value.
TiddlyWiki.prototype.setValue = function(tiddler, fieldName, value) {
	TiddlyWiki.checkFieldName(fieldName);
	var t = this.resolveTiddler(tiddler);
	if (!t)
		return;
		
	fieldName = fieldName.toLowerCase();

	var isRemove = (value === undefined) || (value === null);

	if (!t.metadata) 
		t.metadata = {};
		
	// handle the legacy metadata
	var accessor = TiddlyWiki.legacyFieldAccess[fieldName];
	if (accessor) {
		if (isRemove)
			// don't remove legacy fields
			return;
		var h = TiddlyWiki.legacyFieldAccess[fieldName];
		if (!h.set(t, value))
			return;

	} else {
		// handle the normal metadata
		var oldValue = t.metadata[fieldName];
		
		if (isRemove) {
			if (oldValue !== undefined) {
				// deletes a single field
				delete t.metadata[fieldName];
			} else {
				// no concrete value is defined for the fieldName
				// so we guess this is a namespace path.
				
				// delete all fields in a namespace
				var re = new RegExp('^'+fieldName+'\\.');
				var dirty = false;
				for (var n in t.metadata) {
					if (n.match(re)) {
						delete t.metadata[n];
						dirty = true;
					}
				}
				if (!dirty)
					return
			}
				
		} else {
			// the "normal" set case. value is defined (not null/undefined)
			// For convenience provide a nicer conversion Date->String
 			value = value instanceof Date 
				? value.convertToYYYYMMDDHHMMSSMMM() 
				: String(value);
			if (oldValue == value) 
				return;
			t.metadata[fieldName] = value;
		}
	}
	
	// When we are here the tiddler/store really was changed.
	this.notify(t.title,true);
	if (!fieldName.match(/^temp\./))
		this.setDirty(true);
}

// Returns the value of the given meta data field of the tiddler. 
// The fieldName is case-insensitive.
// Will only return String values (or undefined).
TiddlyWiki.prototype.getValue = function(tiddler, fieldName) {
	var t = this.resolveTiddler(tiddler);
	if (!t)
		return undefined;

	fieldName = fieldName.toLowerCase();

	// handle the legacy metadata
	var accessor = TiddlyWiki.legacyFieldAccess[fieldName];
	if (accessor) {
		return accessor.get(t);
	}
	
	// handle the 'normal' metadata
	return t.metadata ? t.metadata[fieldName] : undefined;
}

// Calls the callback function for every metadata field in the tiddler.
//
// When callback function returns a non-false value the iteration stops 
// and that value is returned. 
//
// The order of the fields is not defined.
// 
// @param callback a function(tiddler, fieldName, value). 
// 
TiddlyWiki.prototype.forEachField = function(tiddler, callback, ignoreLegacyFields) {
	var t = this.resolveTiddler(tiddler);
	if (!t)
		return undefined;
	
	// handle the 'normal' metadata
	if (t.metadata) {
		for (var n in t.metadata) {
			var result = callback(t, n, t.metadata[n]);
			if (result)
				return result;
		}
	}
	
	if (ignoreLegacyFields)
		return undefined;

	// handle the legacy metadata
	for (var n in TiddlyWiki.legacyFieldAccess) {
		if (n == "tiddler")
			// even though the "title" field can also be referenced through the name "tiddler"
			// we only visit this field once.
			continue;
			
		var result = callback(t, n, TiddlyWiki.legacyFieldAccess[n].get(t));
		if (result)
			return result;
	}

	return undefined;
}
