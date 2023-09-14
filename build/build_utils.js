const fs = require('fs')
const joinPath = require('path').join
const exec = require('child_process').execSync
const {
	releaseVersion, //# overwrite Version.js ?
} = require('./build_settings.js')

module.exports = {
	makeSureFolderExists: function (path) {
		if(!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
	},
	clearFolder: function (path) {
		const files = fs.readdirSync(path)
		for(const file of files) {
			fs.unlink(joinPath(path, file), err => {
				if (err) throw err
			})
		}
	},
	//# saving into folder should be separated from cooking instead (limitation of TW5)
	cookTwIntoFolder: function (recipePath, destinationPath, resultFileName, customTw5Template) {
		const tw5Command = 'tiddlywiki'
		const tw5OptionsPath = joinPath(__dirname, './tw5CookOptions')
		const resultPath = joinPath(destinationPath, resultFileName)
		const tw5Template = customTw5Template || 'tiddlywiki2.template.html'
		let output = exec(`${tw5Command} "${tw5OptionsPath}" --verbose --load "${recipePath}"` +
			` --rendertiddler $:/core/templates/${tw5Template} "${resultPath}" text/plain`)
		return output.toString()
	},
	fixupEmptyLinesInStoreArea: function (htmlAsString) {
		return htmlAsString.replace(/(<(div|DIV) (?:id|ID)=["']?storeArea['"]?>)(\n+)<\/\2>/,
			(wholeThing, openTag, tagName) => `${openTag}</${tagName}>`)
	},
}
