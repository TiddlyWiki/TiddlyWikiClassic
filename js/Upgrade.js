//--
//-- Upgrade macro
//--

config.macros.upgrade.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var w = new Wizard();
	w.createWizard(place,this.wizardTitle);
	w.addStep(this.step1Title,this.step1Html.format([this.source,this.source]));
	w.setButtons([{caption: this.upgradeLabel, tooltip: this.upgradePrompt, onClick: this.onClickUpgrade}]);
};

config.macros.upgrade.onClickUpgrade = function(e)
{
	var me = config.macros.upgrade;
	var w = new Wizard(this);
	//# Check that the store isn't dirty and there are no tiddlers in edit mode
	var localPath = getLocalPath(document.location.toString());
	var backupPath = getBackupPath(localPath,me.backupExtension);
	w.setValue("backupPath",backupPath);
	w.setButtons([],me.statusPreparingBackup);
	var original = loadOriginal(localPath);
	w.setButtons([],me.statusSavingBackup);
	var backup = config.browser.isIE ? ieCopyFile(backupPath,localPath) : saveFile(backupPath,original);
	if(backup != true) {
		w.setButtons([],me.errorSavingBackup);
		alert(me.errorSavingBackup);
		return;
	}
	w.setButtons([],me.statusLoadingCore);
	var load = loadRemoteFile(me.source,me.onLoadCore,w);
	if(typeof load == "string") {
		w.setButtons([],me.errorLoadingCore);
		alert(me.errorLoadingCore);
		return;
	}
};

config.macros.upgrade.onLoadCore = function(status,params,responseText,url,xhr)
{
	var me = config.macros.upgrade;
	var w = params;
	var errMsg;
	if(!status)
		errMsg = me.errorLoadingCore;
	if(!locateStoreArea(responseText))
		errMsg = me.errorCoreFormat;
	if(errMsg) {
		w.setButtons([],errMsg);
		alert(errMsg);
		return;
	}
	w.setButtons([],me.statusSavingCore);
	var localPath = getLocalPath(document.location.toString());
	saveFile(localPath,responseText);
	w.setButtons([],me.statusReloadingCore);
	var backupPath = w.getValue("backupPath");
	window.location = document.location.toString() + '?time=' + new Date().convertToYYYYMMDDHHMM()  + '#upgrade:[[' + encodeURI(backupPath) + ']]';
};

function upgradeFrom(path)
{
	var importStore = new TiddlyWiki();
	importStore.importTiddlyWiki(loadFile(path));
	importStore.forEachTiddler(function(title,tiddler) {
		if(!store.getTiddler(title)) {
			store.addTiddler(tiddler);
		}
	});
	refreshDisplay();
	saveChanges(); //# To create appropriate Markup* sections
	alert(config.messages.upgradeDone);
	window.location = window.location.toString().substr(0,window.location.toString().lastIndexOf('?'));
}

