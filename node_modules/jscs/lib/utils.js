var path = require('path');
var Vow = require('vow');
var reservedWords = require('reserved-words');

var IDENTIFIER_NAME_ES5_RE = require('../patterns/identifiers-ES5');
var IDENTIFIER_NAME_ES6_RE = require('../patterns/identifiers-ES6');

var TRAILING_UNDERSCORES_RE = /(^_+|_+$)/g;

var SNAKE_CASE_RE = /^([a-z$][a-z0-9$]+)(_[a-z0-9$]+)+$/i;

/**
 * All keywords where spaces are a stylistic choice
 * @type {Array}
 */
exports.spacedKeywords = [
    'do',
    'for',
    'if',
    'else',
    'switch',
    'case',
    'try',
    'catch',
    'finally',
    'void',
    'while',
    'with',
    'return',
    'typeof',
    'function'
];

/**
 * All keywords where curly braces are a stylistic choice
 * @type {Array}
 */
exports.curlyBracedKeywords = [
    'if',
    'else',
    'for',
    'while',
    'do',
    'case',
    'default',
    'with'
];

/**
 * Returns true if name is valid identifier name.
 *
 * @param {String} name
 * @param {String} dialect
 * @returns {Boolean}
 */
exports.isValidIdentifierName = function(name, dialect) {
    dialect = dialect || 'es5';
    var identifierRegex = dialect === 'es5' ? IDENTIFIER_NAME_ES5_RE : IDENTIFIER_NAME_ES6_RE;
    return !reservedWords.check(name, dialect, true) && identifierRegex.test(name);
};

/**
 * Snake case tester
 *
 * @param {String} name
 * @return {Boolean}
 */
exports.isSnakeCased = function(name) {
    return SNAKE_CASE_RE.test(name);
};

/**
 * Returns the function expression node if the provided node is an IIFE,
 * otherwise returns null.
 *
 * @param  {Object} node
 * @return {?Object}
 */
exports.getFunctionNodeFromIIFE = function(node) {
    if (node.type !== 'CallExpression') {
        return null;
    }

    var callee = node.callee;

    if (callee.type === 'FunctionExpression') {
        return callee;
    }

    if (callee.type === 'MemberExpression' &&
        callee.object.type === 'FunctionExpression' &&
        callee.property.type === 'Identifier' &&
        (callee.property.name === 'call' || callee.property.name === 'apply')
    ) {
        return callee.object;
    }

    return null;
};

/**
 * Trims leading and trailing underscores
 *
 * @param {String} name
 * @return {String}
 */
exports.trimUnderscores = function(name) {
    var res = name.replace(TRAILING_UNDERSCORES_RE, '');
    return res ? res : name;
};

/**
 * Whether or not the given path is relative
 *
 * @param  {String}  path
 * @return {Boolean}
 */
exports.isRelativePath = function(path) {
    // Logic from: https://github.com/joyent/node/blob/4f1ae11a62b97052bc83756f8cb8700cc1f61661/lib/module.js#L237
    var start = path.substring(0, 2);
    return start === './' || start === '..';
};

/**
 * Resolves a relative filepath against the supplied base path
 * or just returns the filepath if not relative
 *
 * @param  {String} filepath
 * @param  {String} basePath
 * @return {String}
 */
exports.normalizePath = function(filepath, basePath) {
    if (this.isRelativePath(filepath)) {
        return path.resolve(basePath, filepath);
    }

    return filepath;
};

/**
 * Wraps a function such that you can interact with a promise and not a
 * node-style callback.
 *
 * @param  {Function} fn - function that expects a node-style callback
 * @return {Function} When invoked with arguments, returns a promise resolved/rejected
 *                    based on the results of the wrapped node-style callback
 */
exports.promisify = function(fn) {
    return function() {
        var deferred = Vow.defer();
        var args = [].slice.call(arguments);

        args.push(function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        fn.apply(null, args);

        return deferred.promise();
    };
};

/**
 * All possible binary operators supported by JSCS
 * @type {Array}
 */
exports.binaryOperators = [

    // assignment operators
    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
    '&=', '|=', '^=',

    '+', '-', '*', '/', '%', '<<', '>>', '>>>', '&',
    '|', '^', '&&', '||', '===', '==', '>=',
    '<=', '<', '>', '!=', '!=='
];

/**
 * Increment and decrement operators
 * @type {Array}
 */
exports.incrementAndDecrementOperators = ['++', '--'];

/**
 * All possible unary operators supported by JSCS
 * @type {Array}
 */
exports.unaryOperators = ['-', '+', '!', '~'].concat(exports.incrementAndDecrementOperators);

/**
 * All possible operators support by JSCS
 * @type {Array}
 */
exports.operators = exports.binaryOperators.concat(exports.unaryOperators);

/**
 * Returns a function that can check if a comment is a valid pragma.
 *
 * @param {Array} additionalExceptions can optionally be added to the existing pragmaKeywords
 * @returns {Function} that can be used to determine if a comment (supplied as an argument is a valid pragma
 *
 */
exports.isPragma = function(additionalExceptions) {
    var pragmaKeywords = [
        'eslint',
        'eslint-env',
        'eslint-enable',
        'eslint-disable',
        'eslint-disable-line',
        'global',
        'jshint',
        'jslint',
        'globals',
        'falls through',
        'exported',
        'jscs:',
        'jscs:enable',
        'jscs:disable',
        'jscs:ignore',
        'istanbul'
    ];
    if (additionalExceptions && Array.isArray(additionalExceptions)) {
        pragmaKeywords = pragmaKeywords.concat(additionalExceptions);
    }

    return function(comment) {
        // pragmaKeywords precede a space or the end of the comment
        var trimmedComment = comment.trim() + ' ';
        for (var i = 0; i < pragmaKeywords.length; i++) {
            if (trimmedComment.indexOf(pragmaKeywords[i] + ' ') === 0) {
                return true;
            }
        }
        return false;
    };
};
