/**
 * Requires the first alphabetical character of a comment to be uppercase, unless it is part of a multi-line textblock.
 *
 * This rule automatically ignores jscs, jshint, eslint and istanbul specific comments.
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `true`
 *  - `Object`:
 *     - `allExcept`: array of quoted exceptions
 *     - `inlined`: Ignore comments in the middle of the code line
 *
 * #### Example
 *
 * ```js
 * "requireCapitalizedComments": true
 * ```
 *
 * ##### Valid:
 *
 * ```js
 * // Valid
 * //Valid
 *
 * /*
 *   Valid
 *  *\/
 *
 * /**
 *  * Valid
 *  *\/
 *
 * // A textblock is a set of lines
 * // that starts with a capitalized letter
 * // and has one or more non-capitalized lines
 * // afterwards
 *
 * // A textblock may also have multiple lines.
 * // Those lines can be uppercase as well to support
 * // sentence breaks in textblocks
 *
 * // 123 or any non-alphabetical starting character
 * // @are also valid anywhere
 *
 * // jscs: enable
 * ```
 *
 * ##### Invalid:
 *
 * ```js
 * // invalid
 * //invalid
 * /** invalid *\/
 * /**
 *  * invalid
 *  *\/
 * ```
 *
 * ```js
 * "requireCapitalizedComments": { "allExcept": ["pragma"] }
 * ```
 *
 * ##### Valid:
 *
 * ```js
 * function sayHello() {
 *     /* pragma something *\/
 *
 *     // I can now say hello in lots of statements, if I like.
 *     return "Hello";
 * }
 * ```
 *
 * ##### Valid:
 *
 * ```js
 * function sayHello() {
 *     /* istanbul ignore next *\/
 *
 *     // I'd like to ignore this statement in coverage reports.
 *     return "Hello";
 * }
 * ```
 *
 * ##### Invalid:
 *
 * ```js
 * function sayHello() {
 *     /* otherPragma something *\/
 *
 *     // i can now say hello in lots of statements, if I like.
 *     return "Hello";
 * }
 * ```
 *
 * ```js
 * "requireCapitalizedComments": { "inlined": true }
 * ```
 * ##### Valid:
 *
 * ```js
 * function sayHello( world /*internal*\/ ) {
 * }
 * ```
 */

var assert = require('assert');

var isPragma = require('../utils').isPragma;
var letterPattern = require('../../patterns/L');
var upperCasePattern = require('../../patterns/Lu');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        var exceptions;

        this.inlined = false;
        this._isPragma = null;

        var optionName = this.getOptionName();

        var isObject = typeof options === 'object';
        var error = optionName + ' option requires a true value ' +
            'or an object with String[] `allExcept` property or true with `inlined`';

        assert(
            options === true ||
            isObject,
            error
        );

        if (isObject && options.allExcept) {
            exceptions = options.allExcept;

            // verify items in `allExcept` property in object are string values
            assert(
                Array.isArray(exceptions) &&
                exceptions.every(function(el) { return typeof el === 'string'; }),
                'Property `allExcept` in ' + optionName + ' should be an array of strings'
            );

            this._isPragma = isPragma(exceptions);
        }

        if (!this._isPragma) {
            this._isPragma = isPragma();
        }

        if (isObject && options.inlined) {
            this.inlined = true;
        }

        if (isObject && !options.allExcept && !options.inlined) {
            assert(false, error);
        }
    },

    getOptionName: function() {
        return 'requireCapitalizedComments';
    },

    _isUrl: function(comment) {
        var protocolParts = comment.value.split('://');

        if (protocolParts.length === 1) {
            return false;
        }

        return comment.value.indexOf(protocolParts[0]) === 0;
    },

    _isException: function(comment) {
        return this._isPragma(comment.value);
    },

    _isValid: function(comment) {
        var first = this._getFirstChar(comment);

        return first && upperCasePattern.test(first);
    },

    _isLetter: function(comment) {
        var first = this._getFirstChar(comment);

        return first && letterPattern.test(first);
    },

    _getFirstChar: function(comment) {
        return comment.value.replace(/[\n\s\*]/g, '')[0];
    },

    _isTextBlock: function(comment, file) {
        var prevComment = file.getPrevToken(comment, {includeComments: true});

        if (prevComment) {
            return prevComment.type === 'Line' &&
                prevComment.loc.start.line + 1 === comment.loc.start.line &&
                prevComment.value.trim().length > 0;
        }

        return false;
    },

    _shouldIgnoreIfInTheMiddle: function(file, comment) {
        if (!this.inlined) {
            return false;
        }

        var firstToken = file.getFirstNodeToken(comment);
        var otherToken = file.getPrevToken(firstToken, { includeComments: true });

        return otherToken ? otherToken.loc.start.line === firstToken.loc.start.line : false;
    },

    check: function(file, errors) {
        var _this = this;

        function add(comment) {
            errors.cast({
                message: 'Comments must start with an uppercase letter, unless it is part of a textblock',
                line: comment.loc.start.line,
                column: comment.loc.start.column,
                additional: comment
            });
        }

        file.iterateTokensByType('Line', function(comment) {
            if (_this._isException(comment)) {
                return;
            }

            if (_this._isUrl(comment)) {
                return;
            }

            if (!_this._isLetter(comment)) {
                return;
            }

            if (_this._isTextBlock(comment, file)) {
                return;
            }

            if (_this._isValid(comment)) {
                return;
            }

            add(comment);
        });

        file.iterateTokensByType('Block', function(comment) {
            if (_this._isException(comment)) {
                return;
            }

            if (_this._isUrl(comment)) {
                return;
            }

            if (!_this._isLetter(comment)) {
                return;
            }

            if (_this._shouldIgnoreIfInTheMiddle(file, comment)) {
                return;
            }

            if (_this._isValid(comment)) {
                return;
            }

            add(comment);
        });
    },

    _fix: function(file, error) {
        var comment = error.additional;
        var first = this._getFirstChar(comment);

        comment.value = comment.value.replace(first, first.toUpperCase());
    }
};
