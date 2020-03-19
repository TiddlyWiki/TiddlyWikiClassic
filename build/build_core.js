// this builds empty TW using node.js, TW5, tiddlywikinosaver.html.recipe and build_settings.js

const joinPath = require('path').join;
const fs = require('fs');
const exec = require('child_process').execSync;
const {
	releaseVersion,
	destinationRelativePath
} = require('./build_settings.js');

const destinationPath = joinPath(__dirname, destinationRelativePath);
if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath);

console.log(`BUILD: clearing target folder: "${destinationRelativePath}"`);
const files = fs.readdirSync(destinationPath);
for(const file of files) {
	fs.unlink(joinPath(destinationPath, file), err => {
		if (err) throw err;
	});
}
console.log();

console.log(`BUILD: assembling EMPTY.HTML (v${releaseVersion})`);
const tw5Command = 'tiddlywiki';
const tw5OptionsPath = joinPath(__dirname, './wiki');
const recipePath = joinPath(__dirname, '../tiddlywikinosaver.html.recipe');
const resultPath = joinPath(destinationPath, 'empty.html');
let output = exec(`${tw5Command} ${tw5OptionsPath} --verbose --load ${recipePath}` +
	` --rendertiddler $:/core/templates/tiddlywiki2.template.html ${resultPath} text/plain`);
console.log(output.toString());

console.log('BUILD: removing empty lines from storeArea of EMPTY.HTML');
const result = fs.readFileSync(resultPath).toString();
const fixedResult = result.replace(/(<(div|DIV) (?:id|ID)=["']?storeArea['"]?>)(\n+)<\/\2>/,
	(wholeThing, openTag, tagName) => `${openTag}</${tagName}>`)
fs.writeFileSync(resultPath, fixedResult);
console.log();

console.log('BUILD: done');
