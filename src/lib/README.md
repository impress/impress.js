Impress.js Libraries
====================

The `src/lib/*.js` files contain library functions. The main difference to plugins is that:

1. Libraries are closer to the impress.js core than plugins (arguably a subjective metric)
2. Libraries are common utility functions used by many plugins
3. Libraries are called synchronously, which is why the event based paradigm that plugins use to
   communicate isn't useful.

Plugins can access libraries via the API:

    var api;
    document.addEventListener( "impress:init", function(event){
        api = event.detail.api;
        api().lib.<libraryName>.<libaryFunction>();
    });

...which is equivalent to:

    impress().lib.<libraryName>.<libraryFunction>();

Implementing a library
----------------------

1. Create a file under `src/lib/`.

2. Start with the standard boilerplate documentation, and the (function(document, window){})(); 
wrapper.

3. The library should implement a factory function, and make its existence known to impress.js core:

    window.impress.addLibraryFactory( { libName : libraryFactory} );

4. The library function should return a similar API object as core `impress()` function does:

    var libraryFactory = function(rootId) {
        /* implement library functions ... */
        
        var lib = {
            libFunction1: libFunction1,
            libFunction2: libFunction2
        }
        return lib;
    };

5. While rarely used, impress.js actually supports multiple presentation root div elements on a
single html page. Each of these have their own API object, identified by the root element id
attribute:

    impress("other-root-id").init();

(The default rootId obviously is `"impress"`.)

Libraries MUST implement this support for multiple root elements as well. 

- impress.js core will call the factory once for each separate root element being initialized via
  `impress.init(rootId)`.
- Any state that a library might hold, MUST be stored *per `rootId`*.
- Note that as we now support also `impress(rootId).tear()`, the same root element might be
  initialized more than once, and each of these MUST be treated as a new valid initialization.

Putting all of the above together, a skeleton library file will look like:

    /**
    * Example library libName
    *
    * Henrik Ingo (c) 2016
    * MIT License
    */
    (function ( document, window ) {
        'use strict';
        // Singleton library variables
        var roots = [];
        var singletonVar = {};
        
        var libraryFactory = function(rootId) {
            if (roots["impress-root-" + rootId]) {
                return roots["impress-root-" + rootId];
            }
            
            // Per root global variables (instance variables?)
            var instanceVar = {};

            // LIBRARY FUNCTIONS
            var libraryFunction1 = function () {
                /* ... */
            };
            
            var libraryFunction2 = function () {
                /* ... */
            };
            
            var lib = {
                    libFunction1: libFunction1,
                    libFunction2: libFunction2
                }
            roots["impress-root-" + rootId] = lib;
            return lib;
        };
        
        // Let impress core know about the existence of this library
        window.impress.addLibraryFactory( { libName : libraryFactory } );
        
    })(document, window);
