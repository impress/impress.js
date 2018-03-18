/**
 * @param {Errors[]} errorsCollection
 */
module.exports = function(errorsCollection) {
    var errorCount = 0;
    /**
     * Formatting every error set.
     */
    errorsCollection.forEach(function(errors) {
        if (!errors.isEmpty()) {
            /**
             * Formatting every single error.
             */
            errors.getErrorList().forEach(function(error) {
                errorCount++;
                console.log(errors.explainError(error, true) + '\n');
            });
        }
    });
    if (errorCount) {
        /**
         * Printing summary.
         */
        console.log('\n' + errorCount + ' code style ' + (errorCount === 1 ? 'error' : 'errors') + ' found.');
    }
};
