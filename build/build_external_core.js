// this builds TiddlyWiki (tiddlywiki_externaljs.html) with core externalized into 3 js files
// (twcore.js, jquery.js, jQuery.twStylesheet.js)

/* this reproduces the result of the old build toolchain; to be fixed:
   - duplicated  if(useJavaSaver)  block (and the  useJavaSaver is not defined  error in console)

   may be improved:
   - allow to merge the 3 JS files into one
   - support minifing JS (measure load times), externalize license, de-duplicate copyright
   - remove various empty parts in html: jsArea, jsdeprecatedArea, jslibArea, jqueryArea; extra linebreaks in storeArea
     (use fixupEmptyLinesInStoreArea), in title, in noscript, in the end of #shadowArea, after twcore.js, in markup blocks
   - assembling twcore.js: create a different recipe instead of using different tw5Template
   - adapt core upgrade engine to external core
*/

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
} = require('./build_utils.js')

const destinationPath = joinPath(__dirname, destinationRelativePath)
makeSureFolderExists(destinationPath)

console.log(`BUILD: clearing target folder: "${destinationRelativePath}"`)
clearFolder(destinationPath)
console.log()

console.log(`BUILD: assembling TIDDLYWIKI_EXTERNALJS.HTML`)
let recipePath = joinPath(__dirname, '../recipes/tiddlywiki_externaljs.html.recipe')
let output = cookTwIntoFolder(recipePath, destinationPath, 'tiddlywiki_externaljs.html')
console.log(output)

console.log(`BUILD: assembling TWCORE.JS (v${releaseVersion})`)
recipePath = joinPath(__dirname, '../recipes/tiddlywikinosaver.html.recipe')
output = cookTwIntoFolder(recipePath, destinationPath, 'twcore.js', 'tiddlywiki2.externaljs.template.html')
console.log(output)

console.log(`BUILD: copying JQUERY.JS`)
fs.copyFileSync(joinPath(__dirname, '../node_modules/jquery/jquery.min.js'), joinPath(destinationPath, 'jquery.js'))
console.log(`BUILD: copying JQUERY.TWSTYLESHEET.JS`)
fs.copyFileSync(joinPath(__dirname, '../jquery/plugins/jQuery.twStylesheet.js'),
	joinPath(destinationPath, 'jQuery.twStylesheet.js'))
console.log('')

console.log('BUILD: done')
