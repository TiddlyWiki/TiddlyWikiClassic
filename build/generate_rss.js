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

const page = require('webpage').create();
page.open(twUrl, function(status) {

	const rss = page.evaluate(function() {
		return generateRss();
	});
	fs.write(rssPath, rss);

	phantom.exit();
});
