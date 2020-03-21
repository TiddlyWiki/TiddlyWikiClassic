// this builds index.html (TW site contents) using index.html.recipe and build_settings.js

const joinPath = require('path').join;
const fs = require('fs');
const exec = require('child_process').execSync;
const {
	releaseVersion,
	destinationRelativePath
} = require('./build_settings.js');
const {
	makeSureFolderExists,
	clearFolder,
	cookTwIntoFolder,
	fixupEmptyLinesInStoreArea
} = require('./build_utils.js');

const destinationPath = joinPath(__dirname, destinationRelativePath);
makeSureFolderExists(destinationPath);

console.log(`BUILD: clearing target folder: "${destinationRelativePath}"`);
clearFolder(destinationPath);
console.log();

console.log(`BUILD: assembling INDEX.HTML (v${releaseVersion})`);
const recipePath = joinPath(__dirname, 'index.html.recipe');
let output = cookTwIntoFolder(recipePath, destinationPath, 'index.html');
console.log(output);

console.log('BUILD: done');
