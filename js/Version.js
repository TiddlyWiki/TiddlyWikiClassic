var version = {title: "TiddlyWiki", major: 2, minor: 6, revision: 3, alpha: 7, date: new Date("May 23, 2011"), extensions: {}};

config.macros.version.handler = function(place)
{
	jQuery("<span/>").text(formatVersion()).appendTo(place);
};
