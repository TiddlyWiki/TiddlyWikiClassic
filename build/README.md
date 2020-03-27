This folder contains tools to build TiddlyWiki Classic and TWC's main site http://classic.tiddlywiki.com/;
it is meant to also hold tools to run autotests etc but this is not implemented yet.
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

Building index.html and generating RSS for classic.tiddlywiki.com
-----------------------------------------------------------------
With the same notes, building is done via `npm run build-site`. This also generates the RSS file
(index.xml).

Testing core via test.html
--------------------------
Currently, autotests are implemented in an old fashioned way: a new page (test.html) that is TW
core with incorporated autotests is built via `npm run build-test`, than it should be opened
in a browser and inspected visually. Note that load/save tests currently fail which is to be fixed
in the future.
