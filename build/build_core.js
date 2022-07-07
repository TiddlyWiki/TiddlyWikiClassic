// this builds empty TW using tiddlywikinosaver.html.recipe and build_settings.js

const joinPath = require('path').join
const fs = require('fs')
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

console.log(`BUILD: assembling EMPTY.HTML (v${releaseVersion})`)
const recipePath = joinPath(__dirname, '../recipes/tiddlywikinosaver.html.recipe')
let output = cookTwIntoFolder(recipePath, destinationPath, 'empty.html')
console.log(output)

console.log('BUILD: removing empty lines from storeArea of EMPTY.HTML')
const resultPath = joinPath(destinationPath, 'empty.html')
const result = fs.readFileSync(resultPath).toString()
const fixedResult = fixupEmptyLinesInStoreArea(result)
fs.writeFileSync(resultPath, fixedResult)
console.log()

console.log('BUILD: done')
