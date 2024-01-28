jQuery(document).ready(function() {

	var numSaves, _autoSaveChanges, _readOnly;
	module("TiddlyWiki options", {
		setup: function() {
			config.options.chkAutoSave = true;
			systemSettingSave = 0;
			numSaves = 0;
			_autoSaveChanges = autoSaveChanges;
			autoSaveChanges = function() {
				numSaves += 1;
				return _autoSaveChanges.apply(this, arguments);
			};
			_readOnly = readOnly;
			readOnly = false;
		},
		teardown: function() {
			numSaves = null;
			config.options.chkAutoSave = false;
			autoSaveChanges = _autoSaveChanges;
			readOnly = _readOnly;
		}
	});

	test("save multiple system settings", function() {
		saveSystemSetting("foo", true);
		saveSystemSetting("foo", false);
		saveSystemSetting("foo", true);
		strictEqual(numSaves, 0, "The save is asynchronous so no saves have yet been made");
		strictEqual(systemSettingSave > 0, true, "However there should be a timeout in progress");
	});
});

