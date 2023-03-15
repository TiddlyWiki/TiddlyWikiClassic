This folder contains tools to build TiddlyWiki Classic, run autotests,
and build TWC's [main site](http://classic.tiddlywiki.com).
It is meant to also hold docs about publishing updates to the site
and [means](https://github.com/TiddlyWiki/tiddlywiki.github.com/tree/master/.github/workflows)
to automate this process, but these have not been written yet.
An older (deprecated) fully functional toolchain may be found [here](https://github.com/TiddlyWiki/tiddlywiki.com).

Prerequisites
-------------
Before building TW, one should install [Node.js](http://www.nodejs.org)
(the latest LTS version is expected to be enough).

Also, after the first cloning of the repository (and possibly after some updates),
one should run `npm install` (or `npm i` as a shortcut) to install dependencies.

Finally, before building, one may want to adjust `build/build_settings.js`
(destination folder, etc) and package.json (version number).

Building TiddlyWIki
-------------------
Building is done in a terminal by simply running `npm run build-core`.

Before using the resulting core, one may want to test it (see below).

Building TiddlyWIki with externalized JavaScript
------------------------------------------------
Similarly, one can use `npm run build-external-core` to get a TiddlyWiki "storage" html
with JavaScript in separate files (twcore.js, jquery.js and jQuery.twStylesheet.js).
Those may be cached by the browser and result in smaller load times.

Testing core via test.html
--------------------------
Currently, autotests are implemented in an old-fashioned way:
a new page (test.html) that is TW core with incorporated autotests
is built via `npm run build-test`, then it should be opened in a browser
and inspected visually. Note that load/save tests currently fail,
which is to be fixed in the future.

Building index.html and generating RSS for classic.tiddlywiki.com
-----------------------------------------------------------------
`npm run build-site` builds index.html and also generates the RSS file
(index.xml) with content for the main site.
