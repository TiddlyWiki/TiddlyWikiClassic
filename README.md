TiddlyWiki
==========

https://github.com/TiddlyWiki/tiddlywiki


Description
-----------

This is the master repository for the core of TiddlyWiki. It is for the development and maintenance of TiddlyWiki.

If you simply wish to use TiddlyWiki, it is easiest to download it from:

    http://tiddlywiki.com/

This site also gives details about TiddlyWiki.

TiddlyWiki code and issues used to be stored at http://svn.tiddlywiki.org and http://trac.tiddlywiki.org .


Installation
------------

Install the [git](http://git-scm.com/download) version control system.

TiddlyWiki has 4 important parallel repositories:

1. [tiddlywiki](https://github.com/TiddlyWiki/tiddlywiki), this includes the source and test code for TiddlyWiki itself.

2. [cooker](https://github.com/TiddlyWiki/cooker), this includes the tool for building a TiddlyWiki from a set of tiddlers (`cook`) and the tool for splitting a TiddlyWiki into separate tiddlers (`ginsu`). You need to download this repository for any TiddlyWiki development.

3. [translations](https://github.com/TiddlyWiki/translations), this includes the translations of TiddlyWiki into a number of different languages.

4. [tiddlywiki.com](https://github.com/TiddlyWiki/tiddlywiki.com), this includes what is required to build and upload the http://tiddlywiki.com website.


To do any serious work on TiddlyWiki you will probably want to download all four of these repositories. They should be downloaded into parallel directories, since some of the build scripts used relative links to the other repositories:

    git clone git@github.com:TiddlyWiki/tiddlywiki.git
    git clone git@github.com:TiddlyWiki/cooker.git
    git clone git@github.com:TiddlyWiki/tiddlywiki.com.git
    git clone git@github.com:TiddlyWiki/translations.git


Next you need to set up `cook`. Copy the `cook` script file to somewhere that is on your path. Edit this file according to the instructions in the file.


Building and testing
--------------------

There is a `Makefile` for managing testing. To build and execute the TiddlyWiki tests, type:

    make test

To build an alpha version of TiddlyWiki incorporating any changes you have made, run the `bldalpha` script by typing:

    ./bldalpha


Contributing
------------

Pull requests for feature requests/bug fixes are being accepted for this project. Pull requests should be accompanied by tests. If no tests existed for the given functionality previously, please include these in your contribution to ensure that the TiddlyWiki code base is as reliable as possible going forward. Any pull requests without tests will not generally be folded into the core codebase. See https://github.com/TiddlyWiki/tiddlywiki/wiki for more information.


License
-------

TiddlyWiki is Copyright 2011 UneMesa Assocation

It is licensed under a BSD License.
