const readline = require('readline')
const joinPath = require('path').join
const fs = require('fs')

const packagePath = joinPath(__dirname, '../package.json')
const versionPath = joinPath(__dirname, '../js/Version.js')
const initialPackageText = fs.readFileSync(packagePath)
const packageData = JSON.parse(initialPackageText)

const updateVersion = (version) => {
	// update Version.js
	const versionJs = `var version = {title: "TiddlyWiki", major: ${version.major}, minor: ${
		version.minor}, revision: ${version.revision}, date: new Date("${
		new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
		}"), extensions: {}};\n`
	fs.writeFileSync(versionPath, versionJs)
	console.log(`\n✅ updated Version.js:\n\n` + versionJs)

	const versionString = `${version.major}.${version.minor}.${version.revision}`

	// update version in package.json
	packageData.version = versionString
	fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2))
	console.log(`✅ updated package.json`)

	console.log(`\nNow please:`)
	console.log(`🔲 Update package-lock.json accordingly`)
	console.log(`🔲 Stage these changes; commit:  git commit -m "infra: bump version to ${versionString}"`)
	console.log(`🔲 Tag the new commit:           git tag v${versionString}`)
	console.log(`🔲 Push both the commit and the tag`)
}

const askForVersionNumber = async () => {
	const cliReader = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	const versionRE = /(\d+)\.(\d+)\.(\d+)/
	let versionMatch
	let isFirstTime = true

	while(!versionMatch) {
		const CANCEL = 1
		const result = await new Promise(resolve => {
			cliReader.question(
				isFirstTime
					? `Enter the version (like 2.3.4, current one is ${packageData.version}):\n`
					: `You have entered an invalid version. You can try again; or, to cancel, press y or c and Enter:\n`,
				(reply) => resolve(versionRE.exec(reply) || (reply == 'y' || reply == 'c' ? CANCEL : null))
			)
		})
		isFirstTime = false

		if(!result) continue
		if(result === CANCEL) return null

		versionMatch = result
	}

	cliReader.close()
	return {
		major: versionMatch[1],
		minor: versionMatch[2],
		revision: versionMatch[3],
	}
}

askForVersionNumber().then(version => {
	if(version) updateVersion(version)
	else {
		console.log(`Canceled`)
		process.exit(0)
	}
})
