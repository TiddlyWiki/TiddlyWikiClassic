const joinPath = require('path').join;

const releaseVersion = '2.9.2'; //# grab from package.json instead?

module.exports = {
	releaseVersion,
	destinationRelativePath: 'cooked/' + releaseVersion,
}
