[![Build Status](https://travis-ci.org/bitovi/syn.png?branch=master)](https://travis-ci.org/bitovi/syn.png?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/bitovi/syn.svg)](https://greenkeeper.io/)

[![Join the chat at https://gitter.im/bitovi/syn](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bitovi/syn?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

For questions or discussion checkout our [forums](http://forums.donejs.com/c/testing).

> If you are looking for the Synergy project, you can find it [here](https://www.npmjs.com/~postquagga). Thanks
> [postquagga](https://www.npmjs.com/~postquagga) for letting us use the name!

Syn lets you simulate user behavior like typing, clicking, moving, and
dragging exactly how a real user would perform those actions.

```js
Syn.click( 'hello' )
   .type( 'Hello World' )
   .drag( 'trash' );
```

## Install

Install Syn via the command line with npm:

    > npm install syn

or bower:

    > bower install syn

Or by downloading it [here](https://github.com/bitovi/syn/archive/v0.2.0.zip).

Inside the download, npm package and bower package, there are the following folders:

 - `dist/global/syn.js` - A standalone file that can be used with a `<script>` tag.
 - `dist/amd` - An AMD build that can be used with [RequireJS](http://requirejs.org) and other AMD loaders.
 - `dist/cjs` - A CommonJS build that is used by node or browserify.
 - `src` - The source files that can be loaded by [StealJS](http://stealjs.com), SystemJS, and eventually JSPM.

## Setup

The following walk you through how to load Syn into various environments.

### Node / Browserify

Assuming you installed with `npm`, simply `require("syn")` like the following:

    var syn = require("syn");
    syn.click(document.getElementById('hello'));

### StealJS

If you installed via NPM or Bower and are using the [npm](http://stealjs.com/docs/npm.html)
or [bower](http://stealjs.com/docs/bower.html) module for configuration,
you can use import, require, or define to load the syn module without any configuration.

    import syn from "syn";
    syn.click(document.getElementById('hello'));

### AMD / RequireJS

Add the following package configuration:

    require.config({
        packages: [{
            name: 'syn',
            location: 'PATH/TO/syn/dist/amd',
            main: 'syn'
        }]
    });

_PATH/TO_ should be the path from your baseUrl to the location of the syn folder.  Once this is
properly configured, you should be able to write:

    define(['syn'], function(syn){
      syn.click(document.getElementById('hello'));
    });

### Script Tag / Standalone

If you don't use a module loader, you can simply add the following to your page:

    <script src='PATH/TO/dist/syn.js'></script>

_PATH/TO_ should be the path to the installed syn folder.

## Use




### syn.click( element [, options][, callback] )

### syn.dblclick( element [, options][, callback] )

### syn.type( element, text [, callback] )

### syn.key( element, key [, callback] )

### syn.delay( time=600 )

### syn.drag( element, optionsOrTarget [, callback])



## Contributing

Check out the [contribution guide](CONTRIBUTING.md).

## Relevant Links

1. Blog post introducing [Syn — a Standalone Synthetic Event Library](https://www.bitovi.com/blog/syn-a-standalone-synthetic-event-library)
2. [Gitter chat](https://gitter.im/bitovi/syn)
