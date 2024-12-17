//--
//-- Augmented methods for the JavaScript Array() object
//--

//# todo: get rid of usages in core, deprecate
// Find an entry in a given field of the members of an array
Array.prototype.findByField = function(field, value) {
	for(var i = 0; i < this.length; i++) {
		if(this[i][field] === value) return i;
	}
	return null;
};

//# todo: get rid of usages in core, deprecate (is likely to be used in some plugins though)
// Return whether an entry exists in an array
Array.prototype.contains = function(item) {
	return this.indexOf(item) != -1;
};

//# todo: deprecate (is not used in the core already)
// Return whether one of a list of values exists in an array
Array.prototype.containsAny = function(items) {
	for(var i = 0; i < items.length; i++) {
		if(this.indexOf(items[i]) != -1)
			return true;
	}
	return false;
};

//# todo: deprecate (is not used in the core already)
// Return whether all of a list of values exists in an array
Array.prototype.containsAll = function(items) {
	for(var i = 0; i < items.length; i++) {
		if(this.indexOf(items[i]) == -1)
			return false;
	}
	return true;
};

// Push a new value into an array only if it is not already present in the array.
// If the optional unique parameter is false, it reverts to a normal push
Array.prototype.pushUnique = function(item, unique) {
	if(unique === false || this.indexOf(item) == -1) {
		this.push(item);
	}
};

//# todo: get rid of usages in core, deprecate
Array.prototype.remove = function(item) {
	var p = this.indexOf(item);
	if(p != -1) this.splice(p, 1);
};

