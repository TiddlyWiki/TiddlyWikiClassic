// this script is meant to be run via phantom.js (from build_site.js)

const twName = 'index.html';
const rssName = 'index.xml';
const destinationPath = require('system').env['TIDDLYWIKI_DESTINATION_PATH'];
const twPath = destinationPath + '/' + twName;
//# to be checked: whether twUrl below is corrent on Unix too
const twUrl = 'file:///' + twPath;
const rssPath = destinationPath + '/' + rssName;

// fs is phantom.js' custom implementation (not the same as node.js's filesystem module)
const fs = require('fs');

const original = fs.read(twPath);

const page = require('webpage').create();
page.open(twUrl, function(status) {

	const generatedContent = page.evaluate(function(injectedOriginal, injectedTwName) {
		// this code is evaluated in the context of index.html open in phantomjs in background,
		// so we can use all the code from TiddlyWiki like updateOriginal and generateRss functions

		const buildProblemMessage = 'looks like ' + injectedTwName + ' was not built properly: ';

		// updateOriginal generates static markup blocks, page title (and potentially more)
		if(!window.updateOriginal) buildProblemMessage + 'updateOriginal is not defined';
		const htmlWithUpdatedMarkupBlocksAndTitle = updateOriginal(injectedOriginal);

		if(!window.generateRss) buildProblemMessage + 'generateRss is not defined';
		const rss = generateRss();

		return {
			index: htmlWithUpdatedMarkupBlocksAndTitle,
			rss: rss
		};
	}, original, twName);

	if(!generatedContent) {
		console.log('Something went wrong, output of the evaluated script is falsy..');
	} else if(typeof generatedContent == 'string') {
		console.log('Something went wrong: ' + generatedContent);
	} else if(typeof generatedContent != 'object') {
		console.log('Something went wrong, output of the evaluated script is not an object..');
	} else {
		fs.write(twPath, generatedContent.index);
		fs.write(rssPath, generatedContent.rss);
	}

	phantom.exit();
});
