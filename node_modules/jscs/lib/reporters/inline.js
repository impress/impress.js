var util = require('util');
/**
 * @param {Errors[]} errorsCollection
 */
module.exports = function(errorsCollection) {
    var errorCount = 0;
    /**
     * Formatting every error set.
     */
    errorsCollection.forEach(function(errors) {
        var file = errors.getFilename();
        if (!errors.isEmpty()) {
            errors.getErrorList().forEach(function(error) {
                errorCount++;
                console.log(util.format('%s: line %d, col %d, %s', file, error.line, error.column, error.message));
            });
        }
    });
};
