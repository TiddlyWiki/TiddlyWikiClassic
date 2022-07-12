// this builds index.html (TW site contents) using index.html.recipe and build_settings.js,
// generates RSS (index.xml) via TW's internal generateRss()
// and updates markup blocks etc of index.html using TW's internal updateOriginal()

const joinPath = require('path').join
const exec = require('child_process').execSync
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

console.log(`BUILD: assembling INDEX.HTML (v${releaseVersion})`)
const recipePath = joinPath(__dirname, 'index.html.recipe')
let output = cookTwIntoFolder(recipePath, destinationPath, 'index.html')
console.log(output)

console.log(`BUILD: generating INDEX.XML (RSS feed) and static bits of INDEX.HTML`)
process.env['TIDDLYWIKI_DESTINATION_PATH'] = destinationPath
// filenames (index.html and index.xml) are hardcoded inside generate_rss.js
try {
	output = exec('phantomjs ' + joinPath(__dirname, 'generate_rss_and_static.js'))
} catch (error) {
	console.error('BUILD: generating RSS failed:', error)
}
console.log(output.toString())

console.log('BUILD: done')
