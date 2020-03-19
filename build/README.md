This folder contains tools to build TiddlyWiki Classic; it is meant to also hold tools to build
TWC's main site http://classic.tiddlywiki.com/ , to run autotests etc but this is not implemented yet.
An older fully functional toolchain may be found at https://github.com/TiddlyWiki/tiddlywiki.com .

Prerequisites
-------------
Before building TW, one should install `nodejs` from http://www.nodejs.org (latest LTS version
is expected to be enough).

Also, after first cloning of the repository (and may be after some updates),
one should run `npm install` (or `npm i` as a shortcut) to install dependencies.

Building TiddlyWIki
-------------------

Before building, one may want to adjust `build/build_settings.js` (destination folder etc)
and package.json (version number).

Building is done in command line by simply running `npm run build-core`.

Note that currently this doesn't include any auto-tests so be careful with the resulting core.
