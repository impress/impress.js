/*jshint mocha:true */
var Checker = require('jscs');
var assert = require('assert');
var fs = require('fs');

function summary(errors) {
    return errors.getErrorList().map(function (error) {
        return { column: error.column, rule: error.rule };
    });
}

describe('presets/wikimedia', function() {
    var checker;
    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
        checker.configure({
            preset: 'wikimedia'
        });
    });

    it('should not report any errors from the sample file', function() {
        var fileName = 'sample-wikimedia.js';
        var content = fs.readFileSync(__dirname + '/../data/' + fileName, 'utf8');
        assert(checker.checkString(content, fileName).isEmpty());
    });

    it('should disallow multiple var', function() {
        assert.deepEqual(
            summary(checker.checkString('var foo; var bar;\n')),
            [ { column: 9, rule: 'requireMultipleVarDecl' } ]
        );
    });
});
