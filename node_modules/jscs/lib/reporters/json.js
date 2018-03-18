/**
 * @param {Errors[]} errorsCollection
 */
module.exports = function(errorsCollection) {
    var jsonOutput = {};
    var anyError = false;
    errorsCollection.forEach(function(errors) {
        var file = errors.getFilename();
        var arr = jsonOutput[file] = [];

        if (!errors.isEmpty()) {
            anyError = true;
        }
        errors.getErrorList().forEach(function(error) {
            arr.push({
                line: error.line,
                column: error.column + 1,
                message: error.message
            });
        });
    });
    if (anyError) {
        console.log(JSON.stringify(jsonOutput));
    }
};
