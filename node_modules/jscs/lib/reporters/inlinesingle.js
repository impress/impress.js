/**
 * inlinesingle solves an issue that Windows (7+) users have been
 * experiencing using SublimeLinter-jscs. It appears this is due to
 * SublimeText not managing multi-line output properly on these machines.
 * This reporter differs from inline.js by producing one comment line
 * separated by linebreaks rather than a series of separate lines.
 */

var util = require('util');

/**
 * @param {Errors[]} errorsCollection
 */
module.exports = function(errorsCollection) {
    errorsCollection.forEach(function(errors) {
        if (!errors.isEmpty()) {
            var file = errors.getFilename();
            var out = errors.getErrorList().map(function(error) {
                return util.format('%s: line %d, col %d, %s', file, error.line, error.column, error.message);
            });
            console.log(out.join('\n'));
        }
    });
};
