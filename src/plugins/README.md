Impress.js Plugins documentation
================================

The default set of plugins
--------------------------

A lot of impress.js features are and will be implemented as plugins. Each plugin
has user documentation in a README.md file in [its own directory](./).

The plugins in this directory are called default plugins, and - unsurprisingly -
are enabled by default. However, most of them won't do anything by default, 
rather require the user to invoke them somehow. For example:

* The *navigation* plugin waits for the user to press some keys, arrows, page
  down, page up, space or tab.
* The *autoplay* plugin looks for the HTML attribute `data-autoplay` to see
  whether it should do its thing.
* The *toolbar* plugin looks for a `<div>` element to become visible.

Extra addons
------------

Yet more features are available in presentations that enable 
[extra addons](https://github.com/impress/impress-extras). Extra addons are 3rd party plugins 
that are not part of impress.js, but that we have nevertheless collected together into the 
impress-extras repo to provide convenient and standardized access to them. To include 
the extra addons when checking out impress.js, use git clone --recursive. Even then, they 
are not activated by default in a presentation, rather each must be included with their own `<script>` tag.

Note: The enabled extra addons are automatically initialized by the *extras*
plugin.

Example HTML and CSS
--------------------

Generally plugins will do something sane, or nothing, by default. Hence, no
particular HTML or CSS is required. The README file of each plugin documents the
HTML and CSS that you can use with that plugin.

For your convenience, below is some sample HTML and CSS code covering all the
plugins that you may want to use or adapt.

### Sample HTML to enable plugins and extra addons

    <head>
      <!-- CSS files if using Highlight.js or Mermaid.js extras. -->
      <link rel="stylesheet" href="../../extras/highlight/styles/github.css">
      <link rel="stylesheet" href="../../extras/mermaid/mermaid.forest.css">
    </head>
    <body>
      <div id="impress" data-autoplay="10">
        <div class="step"
             data-autoplay="15"
             data-rel-x="1000"
             data-rel-y="1000">

          <h1>Slide content</h1>
          
          <ul>
            <li class="substep">Point 1</li>
            <li class="substep">Point 2</li>
          </ul>

          <div class="notes">
          Speaker notes are shown in the impressConsole.
          </div>
        </div>
      </div>
      
      <div id="impress-toolbar"></div>
      <div class="impress-progressbar"><div></div></div>
      <div class="impress-progress"></div>
      <div id="impress-help"></div>

      <script type="text/javascript" src="../../extras/highlight/highlight.pack.js"></script>
      <script type="text/javascript" src="../../extras/mermaid/mermaid.min.js"></script>
      <script type="text/javascript" src="../../extras/markdown/markdown.js"></script>
      <script type="text/javascript" src="../../extras/mathjax/MathJax.js?config=TeX-AMS_CHTML"></script>
    </body>

### Sample CSS related to plugins and extra addons

    /* Using the substep plugin, hide bullet points at first, then show them one by one. */
    #impress .step .substep {
        opacity: 0;
    }

    #impress .step .substep.substep-visible {
        opacity: 1;
        transition: opacity 1s;
    }
    /*
      Speaker notes allow you to write comments within the steps, that will not 
      be displayed as part of the presentation. However, they will be picked up
      and displayed by impressConsole.js when you press P.
    */
    .notes {
        display: none;
    }

    /* Toolbar plugin */
    .impress-enabled div#impress-toolbar {
        position: fixed;
        right: 1px;
        bottom: 1px;
        opacity: 0.6;
        z-index: 10;
    }
    .impress-enabled div#impress-toolbar > span {
        margin-right: 10px;
    }
    .impress-enabled div#impress-toolbar.impress-toolbar-show {
        display: block;
    }
    .impress-enabled div#impress-toolbar.impress-toolbar-hide {
        display: none;
    }

    /* If you disable pointer-events (like in the impress.js official demo), you need to re-enable them for the toolbar.
       And the speaker console while at it.*/
    .impress-enabled #impress-toolbar         { pointer-events: auto }
    .impress-enabled #impress-console-button  { pointer-events: auto }

    /* Progress bar */
    .impress-enabled .impress-progressbar {
      position: absolute;
      right: 318px;
      bottom: 1px;
      left: 118px;
      border-radius: 7px;
      border: 2px solid rgba(100, 100, 100, 0.2);
    }
    .impress-enabled .impress-progressbar DIV {
      width: 0;
      height: 2px;
      border-radius: 5px;
      background: rgba(75, 75, 75, 0.4);
      transition: width 1s linear;
    }
    .impress-enabled .impress-progress {
      position: absolute;
      left: 59px;
      bottom: 1px;
      text-align: left;
      opacity: 0.6;
    }
    .impress-enabled #impress-help {
        background: none repeat scroll 0 0 rgba(0, 0, 0, 0.5);
        color: #EEEEEE;
        font-size: 80%;
        position: fixed;
        left: 2em;
        bottom: 2em;
        width: 24em;
        border-radius: 1em;
        padding: 1em;
        text-align: center;
        z-index: 100;
        font-family: Verdana, Arial, Sans;
    }
    .impress-enabled #impress-help td {
        padding-left: 1em;
        padding-right: 1em;
    }


For developers
==============

The vision for impress.js is to provide a compact core library doing the
actual presentations, with a collection of plugins that provide additional
functionality. A default set of plugins are distributed together with the core 
impress.js, and are located in this directory. They are called *default plugins*
because they are distributed and active when users use the [js/impress.js](../../js/impress.js)
in their presentations.

Building js/impress.js
-----------------------

The common way to use impress.js is to link to the file 
[js/impress.js](../../js/impress.js). This is a simple concatenation of the 
core impress.js and all plugins in this directory. If you edit or add code 
under [src/](../), you can run `node build.js` to recreate the distributable
`js/impress.js` file. The build script also creates a minified file, but this
is not included in the git repository.

### Tip: Build errors

If your code has parse errors, the `build.js` will print a rather unhelpful
exception like

    /home/hingo/hacking/impress.js/js/impress.js

    /home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:271
        throw new JS_Parse_Error(message, line, col, pos);
              ^
    Error
        at new JS_Parse_Error (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:263:18)
        at js_error (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:271:11)
        at croak (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:733:9)
        at token_error (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:740:9)
        at unexpected (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:746:9)
        at Object.semicolon [as 1] (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:766:43)
        at prog1 (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:1314:21)
        at simple_statement (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:906:27)
        at /home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:814:19
        at block_ (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:1003:20)

You will be pleased to know, that the concatenation of the unminified file
[js/impress.js](../../js/impress.js) has already succeeded at this point. Just
open a test in your browser, and the browser will show you the line and error.


### Structure, naming and policy

Each plugin is contained within its own directory. The name of the directory
is the name of the plugin. For example, imagine a plugin called *pluginA*:

    src/plugins/plugina/

The main javascript file should use the directory name as its root name:

    src/plugins/plugina/plugina.js

For most plugins, a single `.js` file is enough.

Note that the plugin name is also used as a namespace for various things. For
example, the *autoplay* plugin can be configured by setting the `data-autoplay="5"`
attribute on a `div`.

As a general rule ids, classes and attributes within the `div#impress` root
element, may use the plugin name directly (e.g. `data-autoplay="5"`). However,
outside of the root element, you should use `impress-pluginname` (e.g.
`<div id="impress-toolbar">`. The latter (longer) form also applies to all
events, they should be prefixed with `impress:pluginname`.

You should use crisp and descriptive names for your plugins. But
sometimes you might optimize for a short namespace. Hence, the
[Relative Positioning Plugin](rel/rel.js) is called `rel` to keep html attributes
short. You should not overuse this idea!

Note that for default plugins, which is all plugins in this directory,
**NO css, html or image files** are allowed.

Default plugins must not add any global variables.

### Testing

The plugin directory should also include tests, which should use the *QUnit* and
*Syn* libraries under [test/](../../test). You can have as many tests as you like,
but it is suggested your first and main test file is called `plugina_tests.html`
and `plugina_tests.js` respectively. You need to add your test `.js` file into
[/qunit_test_runner.html](../../qunit_test_runner.html), and the `.js` file 
should start by loading the test `.html` file into the 
`iframe#presentation-iframe`. See [navigation-ui](navigation-ui) plugin for an 
example.

You are allowed to test your plugin whatever way you like, but the general
approach is for the test to load the [js/impress.js](../../js/impress.js) file
produced by build.js. This way you are testing what users will actually be
using, rather than the uncompiled source code.

HowTo write a plugin
--------------------

### Encapsulation

To avoid polluting the global namespace, plugins must encapsulate them in the
standard javascript anonymous function:

    /**
     * Plugin A - An example plugin
     *
     * Description...
     *
     * Copyright 2016 Firstname Lastname, email or github handle
     * Released under the MIT license.
     */
    (function ( document, window ) {

        // Plugin implementation...

    })(document, window);


### Init plugins

We categorize plugins into various categories, based on how and when they are 
called, and what they do.

An init plugin is the simplest kind of plugin. It simply listens for the
`impress().init()` method to send the `impress:init` event, at which point
the plugin can initialize itself and start doing whatever it does, for example 
by calling methods in the public api returned by `impress()`.

The `impress:init` event has the `div#impress` element as its `target` attribute,
whereas `event.detail.api` contains the same object that is returned by calling
`impress()`. It is customary to store the api object sent by the event rather than
calling `impress()` from the global namespace.

Example:

    /**
     * Plugin A - An example plugin
     *
     * Description...
     *
     * Copyright 2016 Firstname Lastname, email or github handle
     * Released under the MIT license.
     */
    (function ( document, window ) {
        var root;
        var api;
        var lib;

        document.addEventListener( "impress:init", function( event ) {
            root = event.target;
            api = event.detail.api;
            lib = api.lib;

            // Element attributes starting with "data-", become available under
            // element.dataset. In addition hyphenized words become camelCased.
            var data = root.dataset;
            // Get value of `<div id="impress" data-plugina-foo="...">`
            var foo = data.pluginaFoo;
            // ...
        }
    })(document, window);


Both [Navigation](navigation/navigation.js) and [Autoplay](autoplay/autoplay.js)
are init plugins.

To provide end user configurability in your plugin, a good idea might be to
read html attributes from the impress presentation. The
[Autoplay](autoplay/autoplay.js) plugin does exactly this, you can provide
a default value in the `div#impress` element, or in each `div.step`.

A plugin must only use html attributes in its designated namespace, which is

    data-pluginName-*="value"

For example, if *pluginA* offers config options `foo` and `bar`, it would look
like this:

    <div id="impress" data-plugina-foo="5" data-plugina-bar="auto" >


### Pre-init plugins

Some plugins need to run before even impress().init() does anything. These
are typically *filters*: they want to modify the html via DOM calls, before
impress.js core parses the presentation. We call these *pre-init plugins*.

A pre-init plugin must be called synchronously, before `impress().init()` is
executed. Plugins can register themselves to be called in the pre-init phase
by calling:

    impress.addPreInitPlugin( plugin [, weight] );

The argument `plugin` must be a function. `weight` is optional and defaults to
`10`. Plugins are ordered by weight when they are executed, with lower weight
first.

The [Relative Positioning Plugin](rel/rel.js) is an example of a pre-init plugin.

### Pre-StepLeave plugins

A *pre-stepleave plugin* is called synchronously from impress.js core at the
beginning of `impress().goto()`. 

To register a plugin, call

    impress.addPreStepLeavePlugin( plugin [, weight] );

When the plugin function is executed, it will be passed an argument
that resembles the `event` object from DOM event handlers:

`event.target` contains the current step, which we are about to leave. 

`event.detail.next` contains the element we are about to transition to.

`event.detail.reason` contains a string, one of "next", "prev" or "goto",
which tells you which API function was called to initiate the transition.

`event.detail.transitionDuration` contains the transitionDuration for the 
upcoming transition.

A pre-stepleave plugin may alter the values in `event.detail` (except for 
`reason`), and this can change the behavior of the upcoming transition.
For example, the `goto` plugin will set the `event.detail.next` to point to
some other element, causing the presentation to jump to that step instead. 


### GUI plugins

A *GUI plugin* is actually just an init plugin, but is a special category that
exposes visible widgets or effects in the presentation. For example, it might
provide clickable buttons to go to the next and previous slide. 

Note that all plugins shipped in the default set **must not** produce any visible
html elements unless the user asks for it. A recommended best practice is to let 
the user add a div element, with an id equaling the plugin's namespace, in the 
place where he wants to see whatever visual UI elements the plugin is providing:

    <div id="impress-plugina"></div>

Another way to show the elements of a UI plugin might be by allowing the user
to explicitly press a key, like "H" for a help dialog.

[Toolbar plugin](toolbar/README.md) is an example of a GUI plugin. It presents
a toolbar where other plugins can add their buttons in a centralized fashion.

Remember that for default plugins, even GUI plugins, no html files, css files
or images are allowed. Everything must be generated from javascript. The idea
is that users can theme widgets with their own CSS. (A plugin is of course welcome
to provide example CSS that can be copypasted :-)

Dependencies
------------

If *pluginB* depends on the existence of *pluginA*, and also *pluginA* must run 
before *pluginB*, then *pluginB* should not listen to the `impress:init` event, 
rather *pluginA* should send its own init event, which *pluginB* listens to.

Example:

    // pluginA
    document.addEventListener("impress:init", function (event) {
        // plugin A does it's own initialization first...

        // Signal other plugins that plugin A is now initialized
        var root = document.querySelector( "div#impress" );
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent("impress:plugina:init', true, true, { "plugina" : "data..." });
        root.dispatchEvent(event);
    }, false);
    
    // pluginB
    document.addEventListener("impress:plugina:init", function (event) {
        // plugin B implementation
    }, false);

A plugin should use the namespace `impress:pluginname:*` for any events it sends.

In theory all plugins could always send an `init` and other events, but in
practice we're adding them on an as needed basis.
