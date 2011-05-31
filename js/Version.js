var version = {title: "TiddlyWiki", major: 2, minor: 6, revision: 3, alpha: 7, date: new Date("May 23, 2011"), extensions: {}};

config.macros.version.handler = function(place)
{
	jQuery("<span/>").text(formatVersion()).appendTo(place);
};

// Returns TiddlyWiki version string
function formatVersion(v)
{
	v = v || version;
	return v.major + "." + v.minor + "." + v.revision +
		(v.alpha ? " (alpha " + v.alpha + ")" : "") +
		(v.beta ? " (beta " + v.beta + ")" : "");
}

//# Compares two TiddlyWiki version objects
//# Returns +1 if v2 is later than v1
//#          0 if v2 is the same as v1
//#         -1 if v2 is earlier than v1
//# version without a beta number is later than a version with a beta number
function compareVersions(v1,v2)
{
	var a = ["major","minor","revision"];
	for(var i = 0; i<a.length; i++) {
		var x1 = v1[a[i]] || 0;
		var x2 = v2[a[i]] || 0;
		if(x1<x2)
			return 1;
		if(x1>x2)
			return -1;
	}
	x1 = v1.beta || 9999;
	x2 = v2.beta || 9999;
	if(x1<x2)
		return 1;
	return x1 > x2 ? -1 : 0;
}
