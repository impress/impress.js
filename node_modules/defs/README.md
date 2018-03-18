# SO LONG AND THANKS FOR ALL THE BITS
**defs is done. I recommend migrating to the TypeScript `tsc` compiler because
it does what defs does as good or better, and it does much more.**


# defs.js
Static scope analysis and transpilation of ES6 block scoped `const` and `let`
variables, to ES3.

Node already supports `const` and `let` so you can use that today
(run `node --harmony` and `"use strict"`). `defs.js` enables you to do the same
for browser code. While developing you can rely on the experimental support
in Chrome (chrome://flags, check Enable experimental JavaScript). `defs.js` is
also a pretty decent static scope analyzer/linter.

The talk
[LET's CONST together, right now (with ES3)](http://vimeo.com/66501924)
from Front-Trends 2013
([slides](http://blog.lassus.se/files/lets_const_together_ft2013.pdf)) includes
more information about `let`, `const` and `defs.js`. See also the blog post
[ES3 <3 block scoped const and let => defs.js](http://blog.lassus.se/2013/05/defsjs.html).


## Installation and usage
    npm install -g defs

Then run it as `defs file.js`. The errors (if any) will go to stderr,
the transpiled source to `stdout`, so redirect it like `defs file.js > output.js`.
More command line options are coming.

There's also a [Grunt](http://gruntjs.com/) plugin, see [grunt-defs](https://npmjs.org/package/grunt-defs).

See [BUILD.md](BUILD.md) for a description of the self-build and the browser bundle.

## License
`MIT`, see [LICENSE](LICENSE) file.


## Changes
See [CHANGES.md](CHANGES.md).


## Configuration
`defs` looks for a `defs-config.json` configuration file in your current
directory. If not found there, it searches parent directories until it hits `/`.
You may instead pass a custom `defs-config.json` using `--config`, i.e.
`defs --config path/to/defs-config.json file.js > output.js`.

Example `defs-config.json`:

    {
        "environments": ["node", "browser"],

        "globals": {
            "my": false,
            "hat": true
        },
        "loopClosures": "iife",
        "disallowVars": false,
        "disallowDuplicated": true,
        "disallowUnknownReferences": true
    }

`globals` lets you list your program's globals, and indicate whether they are
writable (`true`) or read-only (`false`), just like `jshint`.

`environments` lets you import a set of pre-defined globals, here `node` and
`browser`. These default environments are borrowed from `jshint` (see
[jshint_globals/vars.js](https://github.com/olov/defs/blob/master/jshint_globals/vars.js)).

`loopClosures` (defaults to `false`) can be set to "iife" to enable transformation
of loop-closures via immediately-invoked function expressions.

`disallowVars` (defaults to `false`) can be enabled to make
usage of `var` an error.

`disallowDuplicated` (defaults to `true`) errors on duplicated
`var` definitions in the same function scope.

`disallowUnknownReferences` (defaults to `true`) errors on references to
unknown global variables.

`ast` (defaults to `false`) produces an AST instead of source code
(experimental).

`stats` (defaults to `false`) prints const/let statistics and renames
(experimental).

`parse` (defaults to `null`) lets you provide a custom parse function if you
use defs as an API. By default it will use `require("esprima").parse`.


## Example

Input `example.js`:

```javascript
"use strict";
function fn() {
    const y = 0;
    for (let x = 0; x < 10; x++) {
        const y = x * 2;
        const z = y;
    }
    console.log(y); // prints 0
}
fn();
```

Output from running `defs example.js`:

```javascript
"use strict";
function fn() {
    var y = 0;
    for (var x = 0; x < 10; x++) {
        var y$0 = x * 2;
        var z = y$0;
    }
    console.log(y); // prints 0
}
fn();
```


## defs.js used as a library
`npm install defs`, then:

```javascript
const defs = require("defs");
const options = {};
const src = "const x = 1";
const res = defs(src, options);
assert(res.src === "var x = 1");

// you can also pass an AST (with loc and range) instead of a string to defs
const ast = require("esprima").parse(src, {loc: true, range: true});
const res = defs(ast, {ast: true}); // AST-in, AST-out
// inspect res.ast
```

res object:

    {
        src: string // on success
        errors: array of error messages // on errors
        stats: statistics object (toStringable)
        ast: transformed ast // when options.ast is set
    }


## Compatibility
`defs.js` strives to transpile your program as true to ES6 block scope semantics as
possible while being as maximally non-intrusive as possible.

It can optionally transform loop closures via IIFE's (when possible), if you include
`"loopClosures": "iife"` in your `defs-config.json`. More info in
[loop-closures.md](loop-closures.md).

See [semantic-differences.md](semantic-differences.md) for other minor differences.
