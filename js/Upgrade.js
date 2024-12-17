//--
//-- Upgrade macro
//--

config.macros.upgrade.docsUrl = 'https://classic.tiddlywiki.com/#HowToUpgrade';

config.macros.upgrade.getSourceURL = function() {
	return config.options.txtUpgradeCoreURI || config.macros.upgrade.source;
};

//# onSuccess: function(coreAsText, textStatus, jqXHR)
//# onError:   function(jqXHR, textStatus, errorThrown)
config.macros.upgrade.loadLatestCore = function(onSuccess, onError) {
	ajaxReq({
		type: "GET",
		url: this.getSourceURL(),
		processData: false,
		success: onSuccess,
		error: onError
	});
};

config.macros.upgrade.handler = function(place) {
	var w = new Wizard();
	w.createWizard(place, this.wizardTitle);
	w.addStep(this.step1Title, this.step1Html.format([
		this.getSourceURL(),
		this.getSourceURL().replace(/^https:\/\//, ''),
		this.docsUrl
	]));
	w.setButtons([{
		caption: this.upgradeLabel,
		tooltip: this.upgradePrompt,
		onClick: this.onClickUpgrade
	}]);
};

config.macros.upgrade.onClickUpgrade = function(e) {
	var me = config.macros.upgrade;
	var w = new Wizard(this);
	if(!window.allowSave()) {
		alert(me.errorCantUpgrade);
		return false;
	}
	if(story.areAnyDirty() || store.isDirty()) {
		alert(me.errorNotSaved);
		return false;
	}

	w.setButtons([], me.statusPreparingBackup);
	var localPath = tw.io.getOriginalLocalPath();
	var backupPath = getBackupPath(localPath, me.backupExtension);
	var original = loadOriginal(localPath);

	w.setButtons([], me.statusSavingBackup);
	var backupSuccessOrPending = copyFile(backupPath, localPath) || saveFile(backupPath, original);
	if(!backupSuccessOrPending) {
		w.setButtons([], me.errorSavingBackup);
		alert(me.errorSavingBackup);
		return false;
	}

	// make sure both the backup is saved and tw.io.loadFile works before proceeding
	tw.io.loadFile(backupPath, function(backupContent) {
		if(!backupContent) {
			w.setButtons([], me.errorVerifyingBackup.format([me.docsUrl]));
			return;
		}

		w.setValue("backupPath", backupPath);

		w.setButtons([], me.statusLoadingCore);
		var sourceURL = me.getSourceURL();
		me.loadLatestCore(function(data, textStatus, jqXHR) {
			me.onLoadCore(true, w, jqXHR.responseText, sourceURL, jqXHR);
		}, function(jqXHR, textStatus, errorThrown) {
			me.onLoadCore(false, w, null, sourceURL, jqXHR);
		});
	});

	return false;
};

config.macros.upgrade.onLoadCore = function(status, w, responseText, url, xhr) {
	var me = config.macros.upgrade;
	var errMsg;
	if(!status) errMsg = me.errorLoadingCore;
	var newVer = me.extractVersion(responseText);
	if(!newVer) errMsg = me.errorCoreFormat;
	if(errMsg) {
		w.setButtons([], errMsg);
		alert(errMsg);
		return;
	}

	var step2 = [me.step2Html_downgrade, me.step2Html_restore, me.step2Html_upgrade][compareVersions(version, newVer) + 1];
	w.addStep(me.step2Title, step2.format([formatVersion(newVer), formatVersion(version)]));
	w.setButtons([
		{ caption: me.startLabel,  tooltip: me.startPrompt,  onClick: function() {
			config.macros.upgrade.onStartUpgrade(w, responseText);
		} },
		{ caption: me.cancelLabel, tooltip: me.cancelPrompt, onClick: me.onCancel }
	]);
};

config.macros.upgrade.onStartUpgrade = function(wizard, newCoreHtml) {
	wizard.setButtons([], config.macros.upgrade.statusSavingCore);
	var localPath = tw.io.getOriginalLocalPath();
	saveFile(localPath, newCoreHtml);

	wizard.setButtons([], config.macros.upgrade.statusReloadingCore);
	var backupPath = wizard.getValue("backupPath");
	var newLocation = addUpgradePartsToURI(document.location.toString(), backupPath);
	window.setTimeout(function () { window.location = newLocation }, 10);
};

config.macros.upgrade.onCancel = function(e) {
	var me = config.macros.upgrade;
	var w = new Wizard(this);
	w.addStep(me.step3Title, me.step3Html);
	w.setButtons([]);
	return false;
};

config.macros.upgrade.extractVersion = function(upgradeFile) {
	var re = /version = \{\s*title: "([^"]+)", major: (\d+), minor: (\d+), revision: (\d+)(, beta: (\d+)){0,1}, date: new Date\("([^"]+)"\)/mg;
	var m = re.exec(upgradeFile);
	return !m ? null : {
		title: m[1], major: m[2], minor: m[3], revision: m[4], beta: m[6], date: new Date(m[7])
	};
};

// a helper, splits uri into parts, passes the map of parts to modify and glues parts back
function changeUri(uri, modify) {
	var uriPartsRE = /^(?:([\w:]+)\/\/)?([^\/\?#]+)?([^\?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;
	var match = uriPartsRE.exec(uri) || [null, '', '', '', '', ''];
	var parts = {
		scheme:	match[1],
		host:	match[2],
		path:	match[3],
		query:	match[4],
		hash:	match[5]
	};
	modify(parts);
	var newScheme = parts.scheme === undefined ? '' : (parts.scheme + '//'),
	    newHost   = parts.host || '',
	    newPath   = parts.path || '',
	    newQuery  = parts.query ? ('?' + parts.query) : '',
	    newHash   = parts.hash   === undefined ? '' : ('#' + parts.hash);
	return newScheme + newHost + newPath + newQuery + newHash;
}

function addUpgradePartsToURI(uri, backupPath) {
	return changeUri(uri, function(uriParts) {
		var newParamifier = 'upgrade:[[' + encodeURI(backupPath) + ']]';
		uriParts.hash = (uriParts.hash ? uriParts.hash + '%20' : '') + newParamifier;

		var newQuery = "time=" + new Date().convertToYYYYMMDDHHMM();
		uriParts.query = (uriParts.query ? uriParts.query + '&' : '') + newQuery;
	});
}

function stripUpgradePartsFromURI(uri) {
	return changeUri(uri, function(uriParts) {
		var queryParts = uriParts.query.split('&'),
		    hashParts = uriParts.hash.split('%20'); // splits paramifiers with a space in argument

		for(var i = 0; i < queryParts.length; i++)
			if(queryParts[i].indexOf('time=') == 0)
				queryParts.splice(i--, 1);

		// relies on the upgrade paramifier being added to the end of hash
		for(i = 0; i < hashParts.length; i++)
			if(hashParts[i].indexOf('upgrade:') == 0)
				hashParts = hashParts.slice(0, i);

		uriParts.query = queryParts.join('&');
		uriParts.hash = hashParts.join('%20') || undefined;
	});
}

function upgradeFrom(path) {
	tw.io.loadFile(path, function(oldTw) {
		var importStore = new TiddlyWiki();
		importStore.importTiddlyWiki(oldTw);
		importStore.forEachTiddler(function(title, tiddler) {
			if(!store.getTiddler(title)) {
				store.addTiddler(tiddler);
			}
		});

		refreshDisplay();
		saveChanges();
		alert(config.messages.upgradeDone.format([formatVersion()]));
		window.location = stripUpgradePartsFromURI(window.location.toString());
	});
}

