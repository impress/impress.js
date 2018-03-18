## v1.1.1 2015-10-09
 * defs is done

## v1.1.0 2014-11-28
 * Use esprima-fb instead of upstream Esprima harmony branch

## v1.0.1 2014-10-09
 * Bump yargs dependency to get rid of transitive ^ dependencies

## v1.0.0 2014-07-18
 * Use bleeding edge Esprima (harmony branch)
 * Support ForOfStatement (issue #24)
 * Added --config switch

## v0.6.2 2013-12-09
 * Fix regenerator breakage due to input handling (pr #22)

## v0.6.1 2013-12-09
 * Graceful error handling on malformed source input (issue #18)

## v0.6.0 2013-12-01
 * Accept a custom parse function
 * Accept AST input when used as a library
 * Bugfix AST modification (issue #19)

## v0.5.0 2013-09-30
 * Loop closure IIFE transformation support
 * Search for defs-config.json upwards in filesystem
 * Improved error messages

## v0.4.3 2013-09-05
 * Improved loop closure detection as to remove false positives
 * Improved wrapper shell script (symlink handling)

## v0.4.2 2013-09-01
 * Improved wrapper script and runner for Linux compat
 * breakout module ast-traverse

## v0.4.1 2013-07-28
 * Bugfix named function expressions (issue #12)

## v0.4 2013-07-10
 * defs became self aware
 * NPM package includes (and defaults to) the self-transpiled version
 * Bugfix renaming of index-expressions such as `arr[i]` (issue #10)

## v0.3 2013-07-05
 * defs used as a library returns errors collected to `ret.errors` instead
   of writing to stderr. This also deprecates `ret.exitcode`
