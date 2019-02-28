impress.js
============

[![CircleCI](https://circleci.com/gh/impress/impress.js.svg?style=svg)](https://circleci.com/gh/impress/impress.js)

It's a presentation framework based on the power of CSS3 transforms and
transitions in modern browsers and inspired by the idea behind prezi.com.

**WARNING**

impress.js may not help you if you have nothing interesting to say ;)


HOW TO USE IT
---------------

### Checking out and initializing the git repository

    git clone --recursive https://github.com/impress/impress.js.git
    cd impress.js

Note: For a minimal checkout, omit the `--recursive` option. This will leave out extra plugins.

**Stable releases**

New features and fixes are continuously merged into the master branch, which is what the above command will check out. For the latest stable release, see the [Github Releases page](https://github.com/impress/impress.js/releases).


### Documentation


Reference documentation of core impress.js features and API you can find it in [DOCUMENTATION.md](DOCUMENTATION.md).

The [HTML source code](index.html) of the official [impress.js demo](http://impress.github.io/impress.js/) serves as a good example usage and contains comments explaning various features of impress.js. For more information about styling you can look into [CSS code](css/impress-demo.css) which shows how classes provided by impress.js can be used. Last but not least [JavaScript code of impress.js](js/impress.js) has some useful comments if you are interested in how everything works. Feel free to explore!

### Official demo

[impress.js demo](http://impress.github.io/impress.js/) by [@bartaz](http://twitter.com/bartaz)

### Examples and demos

The [Classic Slides](http://impress.github.io/impress.js/examples/classic-slides/) demo is targeted towards beginners, or can be used as a template for presentations that look like the traditional PowerPoint slide deck. Over time, it also grew into the example presentation that uses most of the features and addons available.

More examples and demos can be found on [Examples and demos wiki page](http://github.com/impress/impress.js/wiki/Examples-and-demos).

Feel free to add your own example presentations (or websites) there.

### Other tutorials and learning resources

If you want to learn even more there is a [list of tutorials and other learning resources](https://github.com/impress/impress.js/wiki/impress.js-tutorials-and-other-learning-resources)
on the wiki, too.

There is also a book available about [Building impressive presentations with impress.js](http://www.packtpub.com/building-impressive-presentations-with-impressjs/book) by Rakhitha Nimesh Ratnayake.

You may want to check out the sibling project [Impressionist](https://github.com/henrikingo/impressionist): a 3D GUI editor that can help you in creating impress.js presentations.

### Mailing list

You're welcome to ask impress.js related questions on the [impressionist-presentations](https://groups.google.com/forum/#!forum/impressionist-presentations) mailing list.


REPOSITORY STRUCTURE
--------------------

* [index.html](index.html): This is the official impress.js demo, showcasing all of the features of the original impress.js, as well as some new plugins as we add them.
  * As already mentioned, this file is well commented and acts as the official tutorial.
* [examples/](examples/): Contains several demos showcasing additional features available.
  * [Classic Slides](examples/classic-slides/index.html) is a simple demo that that you can use as template if you want to create very simple, rectangular, PowerPoint-like presentations.
* [src/](src/): The main file is [src/impress.js](src/impress.js). Additional functionality is implemented as plugins in [src/plugins/](src/plugins/).
  * See [src/plugins/README.md](src/plugins/README.md) for information about the plugin API and how to write plugins.
* [test/](test/): Contains QUnit and Syn libraries that we use for writing tests, as well as some test coverage for core functionality. (Yes, more tests are much welcome.) Tests for plugins are in the directory of each plugin.
* [js/](js/): Contains [js/impress.js](js/impress.js), which contains a concatenation of the core `src/impress.js` and all the plugins. Traditionally this is the file that you'll link to in a browser. In fact both the demo and test files do exactly that.
* [css/](css/): Contains a CSS file used by the demo. This file is **not required for using impress.js** in your own presentations. Impress.js creates the CSS it needs dynamically.
* [extras/](extras/) contains plugins that for various reasons aren't enabled by default. You have to explicitly add them with their own `script` element to use them.
* [build.js](build.js): Simple build file that creates `js/impress.js`. It also creates a minified version `impress.min.js`, but that one is not included in the github repository.
* [package.json](build.js): An NPM package specification. This was mainly added so you can easily install [buildify](https://www.npmjs.com/package/buildify) and run `node build.js`. Other than the build process, which is really just doing roughly `cat src/impress.js src/plugins/*/*.js > js/impress.js`, and testing, `impress.js` itself doesn't depend on Node or any NPM modules.
* [bower.json](bower.json): A Bower package file. We also don't depend on Bower, but provide this file if you want to use it.

WANT TO CONTRIBUTE?
---------------------

For developers, once you've made changes to the code, you should run these commands for testing:

    npm run build
    npm run test
    npm run lint

Note that running `firefox qunit_test_runner.html` is usually more informative than running `karma` with `npm run test`. They both run the same tests.

More info about the [src/](src/) directory can be found in [src/plugins/README.md](src/plugins/README.md).


ABOUT THE NAME
----------------

impress.js name is [courtesy of @skuzniak](http://twitter.com/skuzniak/status/143627215165333504).

It's an (un)fortunate coincidence that a Open/LibreOffice presentation tool is called Impress ;)

Reference API
--------------

See the [Reference API](DOCUMENTATION.md)

BROWSER SUPPORT
-----------------

The design goal for impress.js has been to showcase awesome CSS3 features as found in modern browser versions. We also use some new DOM functionality, and specifically do not use jQuery or any other JavaScript libraries, nor our own functions, to support older browsers. In general, recent versions of Firefox and Chrome are known to work well. Reportedly IE now works too.

The typical use case for impress.js is to create presentations that you present from your own laptop, with a browser version you know works well. Some people also use impress.js successfully to embed animations or presentations in a web page, however, be aware that in this some of your visitors may not see the presentation correctly, or at all.

In particular, impress.js makes use of the following JS and CSS features:

* [DataSet API](http://caniuse.com/#search=dataset)
* [ClassList API](http://caniuse.com/#search=classlist)
* [CSS 3D Transforms](http://caniuse.com/#search=css%203d)
* [CSS Transitions](http://caniuse.com/#search=css%20transition)

COPYRIGHT AND LICENSE
---------------------

Copyright 2011-2016 Bartek Szopka

Copyright 2015-2017 Henrik Ingo

Released under the MIT [License](LICENSE)
