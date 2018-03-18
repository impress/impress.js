/**
 * Requires imports to be alphabetised
 *
 * Types: `Boolean`
 *
 * Values: `true` to require imports to be ordered (A-Z)
 *
 * #### Example
 *
 * ```js
 * "requireImportAlphabetized": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * import a from 'a';
 * import c from 'c';
 * import z from 'z';
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * import a from 'a';
 * import z from 'z';
 * import c from 'c';
 * ```
 */

var assert = require('assert');

module.exports = function() {
};

module.exports.prototype = {

    configure: function(option) {
        assert(
            option === true,
            this.getOptionName() + ' option requires true value'
        );
    },

    getOptionName: function() {
        return 'requireImportAlphabetized';
    },

    check: function(file, errors) {

        var previous;
        var current;

        var createSpecHash = function(specifier) {

            var imported = '';
            var local = '';

            if (specifier.imported && specifier.imported.name) {
                imported = specifier.imported.name;
            }

            if (specifier.local && specifier.local.name) {
                local = specifier.local.name;
            }

            return imported === local ? imported : imported + local;

        };

        file.iterateNodesByType(
            'ImportDeclaration',
            function(node) {

                current = '';

                for (var i = 0; i < node.specifiers.length; i++) {
                    current += createSpecHash(node.specifiers[i]);
                }

                if (node.source && node.source.value) {
                    current += node.source.value;
                }

                if (previous && previous > current) {
                    errors.add('imports must be alphabetized',
                        node.loc.start.line, node.loc.start.column);
                }

                previous = current;
            }
        );
    }
};
