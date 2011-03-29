#!/usr/bin/env bash
# Usage:
#  alpha.sh [release]

if [ -z "$TW_TRUNKDIR" ]
then
	echo 'TW_TRUNKDIR environment variable should be set to "/the/path/to/your/git-base-directory"'
	exit 2
fi

DEFAULT_RELEASE=2.6.3.A2
RELEASE=${1:-$DEFAULT_RELEASE}
DEST=$PWD
RECIPE=$PWD/tiddlywiki.html.recipe
RECIPE_EXT_JS=$PWD/tiddlywiki_externaljs.html.recipe
RECIPE_EXT_JS_TS=$PWD/tiddlywiki_externaljs_tiddlyspace_alpha.html.recipe

ruby -Ku -C $TW_TRUNKDIR/tools/cooker cook.rb $RECIPE -d$DEST -q -o tiddlywiki.$RELEASE.html$2 $3 $4 $5
ruby -Ku -C $TW_TRUNKDIR/tools/cooker cook.rb $RECIPE -d$DEST -q -o tiddlywiki_compressed.$RELEASE.html -cr -Cr -Dr $2 $3 $4 $5
ruby -Ku -C $TW_TRUNKDIR/tools/cooker cook.rb $RECIPE -d$DEST -q -j -o twcore.$RELEASE.js $2 $3 $4 $5
ruby -Ku -C $TW_TRUNKDIR/tools/cooker cook.rb $RECIPE_EXT_JS -d$DEST -q -o tiddlywiki_externaljs.$RELEASE.html$2 $3 $4 $5
ruby -Ku -C $TW_TRUNKDIR/tools/cooker cook.rb $RECIPE_EXT_JS_TS -d$DEST -q -o tiddlywiki_externaljs_tiddlyspace.$RELEASE.html$2 $3 $4 $5
