// this builds test.html (old-fashion autotests to be run in browser) using tests.html.recipe and build_settings.js

const joinPath = require('path').join
const {
	releaseVersion,
	destinationRelativePath
} = require('./build_settings.js')
const {
	makeSureFolderExists,
	clearFolder,
	cookTwIntoFolder,
	fixupEmptyLinesInStoreArea
} = require('./build_utils.js')

const destinationPath = joinPath(__dirname, destinationRelativePath)
makeSureFolderExists(destinationPath)

console.log(`BUILD: clearing target folder: "${destinationRelativePath}"`)
clearFolder(destinationPath)
console.log()

console.log(`BUILD: assembling TEST.HTML (v${releaseVersion})`)
const recipePath = joinPath(__dirname, '../test/recipes/tests.html.recipe')
let output = cookTwIntoFolder(recipePath, destinationPath, 'test.html')
console.log(output)

// color settings from https://stackoverflow.com/a/41407246/3995261
const fontYellow = '\x1b[33m'
const colorReset = '\x1b[0m'
console.log(`BUILD: done, ${fontYellow}now check results by opening ${joinPath(destinationPath, 'test.html')}`,
	colorReset)
