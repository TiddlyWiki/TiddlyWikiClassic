const joinPath = require('path').join

// get releaseVersion from package.json
const packagePath = joinPath(__dirname, '../package.json')
const packageText = require('fs').readFileSync(packagePath)
const releaseVersion = JSON.parse(packageText).version

module.exports = {
	releaseVersion,
	destinationRelativePath: 'cooked/' + releaseVersion,
}
