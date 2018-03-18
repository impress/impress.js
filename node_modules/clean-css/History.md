0.6.0 / 2012-08-05
==================

 * Full Windows support with tests (./test.bat)

0.5.0 / 2012-08-02
==================

 * Made path to vows local.
 * Explicit node 0.6 requirement.

0.4.2 / 2012-06-28
==================

 * Updated binary -v option (version).
 * Updated binary to output help when no options given (but not in piped mode).
 * Added binary tests.

0.4.1 / 2012-06-10
==================

 * Fixed stateless mode where calling CleanCSS#process directly was giving errors (reported by @facelessuser).

0.4.0 / 2012-06-04
==================

 * Speed improvements (up to 4x) thanks to rewrite of comments and CSS' content processing.
 * Stripping empty CSS tags is now optional (see ./bin/cleancss for details).
 * Improved debugging mode (see ./test/bench.js)
 * Added `make bench` for a one-pass benchmark.

0.3.3 / 2012-05-27
==================

  * Fixed tests, package.json for development, and regex for removing empty declarations (thanks to @vvo).

0.3.2 / 2012-01-17
==================

  * Fixed output method under node 0.6 which incorrectly tried to close process.stdout.

0.3.1 / 2011-12-16
==================

  * Fixed cleaning up '0 0 0 0' expressions.

0.3.0 / 2011-11-29
==================

  * Clean-css requires node 0.4.0+ to run.
  * Removed node's 0.2.x 'sys' package dependency (thanks to @jmalonzo for a patch).

0.2.6 / 2011-11-27
==================

  * Fixed expanding + signs in calc() when mixed up with adjacent (+) selector.

0.2.5 / 2011-11-27
==================

  * Fixed issue with cleaning up spaces inside calc/-moz-calc declarations (thanks to @cvan for reporting it).
  * Fixed converting #f00 to red in borders and gradients.

0.2.4 / 2011-05-25
==================

  * Fixed problem with expanding 'none' to '0' in partial/full background declarations.
  * Fixed including clean-css library from binary (global to local).

0.2.3 / 2011-04-18
==================

  * Fixed problem with optimizing IE filters.

0.2.2 / 2011-04-17
==================

  * Fixed problem with space before color in 'border' property.

0.2.1 / 2011-03-19
==================

  * Added stripping space before !important keyword.
  * Updated repository location and author information in package.json.

0.2.0 / 2011-03-02
==================

  * Added options parsing via optimist.
  * Changed code inclusion (thus version bump).

0.1.0 / 2011-02-27
==================

  * First version of clean-css library.
  * Implemented all basic CSS transformations.