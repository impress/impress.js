/**
 * Requires to return early in a function.
 *
 * Types: `Boolean`
 *
 * Values:
 *  - `true`: disallow to use of else if the corrisponding `if` block contain a return.
 *
 * #### Example
 *
 * ```js
 * "requireEarlyReturn": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function test() {
 *     if (x) {
 *         return x;
 *     }
 *     return y;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function test() {
 *     if (x) {
 *         return x;
 *     } else {
 *         return y;
 *     }
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option allow only the `true` value'
        );
    },

    getOptionName: function() {
        return 'requireEarlyReturn';
    },

    check: function(file, errors) {
        function addError(entity) {
            errors.add(
                'Use of else after return',
                entity.loc.start.line,
                entity.loc.start.column
            );
        }

        // Check if the IfStatement node contain a ReturnStatement.
        // If the node has a block, check all the statements in backward order to see if there is one.
        // This is to ensure that code like this will still return true:
        //
        // if (true) {
        //    return;
        //    eval();
        // }
        function hasNodeReturn(node) {
            if (node.type === 'BlockStatement') {
                for (var i = node.body.length - 1; i >= 0; i--) {
                    if (node.body[i].type === 'ReturnStatement') {
                        return true;
                    }
                }
                return false;
            }
            return node.type === 'ReturnStatement';
        }

        file.iterateNodesByType('IfStatement', function(node) {
            if (!node.alternate) {
                return;
            }

            // Check if all the parents have a return statement, if not continue to the following IfStatement node.
            //
            // Example:
            //
            // if (foo) {
            //     return;
            // } else if (bar) {  <-- error
            //     bar();
            // } else if (baz) {  <-- safe
            //     return baz();
            // } else {           <-- safe
            //     bas();
            // }
            for (var nodeIf = node; nodeIf && nodeIf.type === 'IfStatement'; nodeIf = nodeIf.parentNode) {
                if (nodeIf.alternate && !hasNodeReturn(nodeIf.consequent)) {
                    return;
                }
            }

            return addError(file.getPrevToken(file.getFirstNodeToken(node.alternate)));
        });
    }
};
