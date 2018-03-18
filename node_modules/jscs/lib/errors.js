var assert = require('assert');
var chalk = require('chalk');
var TokenAssert = require('./token-assert');

/**
 * Set of errors for specified file.
 *
 * @name Errors
 * @param {JsFile} file
 * @param {Boolean} verbose
 */
var Errors = function(file, verbose) {
    this._errorList = [];
    this._file = file;
    this._currentRule = '';
    this._verbose = verbose || false;

    /**
     * @type {TokenAssert}
     * @public
     */
    this.assert = new TokenAssert(file);
    this.assert.on('error', this._addError.bind(this));
};

Errors.prototype = {
    /**
     * Adds style error to the list
     *
     * @param {String} message
     * @param {Number|Object} line
     * @param {Number} [column] optional if line is an object
     */
    add: function(message, line, column) {
        if (typeof line === 'object') {
            column = line.column;
            line = line.line;
        }

        var errorInfo = {
            message: message,
            line: line,
            column: column
        };

        this._validateInput(errorInfo);
        this._addError(errorInfo);
    },

    /**
     * Adds style error to the list
     *
     * @param {Object} errorInfo
     */
    cast: function(errorInfo) {
        var additional = errorInfo.additional;

        assert(typeof additional !== undefined,
               '`additional` argument should not be empty');

        this._addError(errorInfo);
    },

    _validateInput: function(errorInfo) {
        var line = errorInfo.line;
        var column = errorInfo.column;

        // line and column numbers should be explicit
        assert(typeof line === 'number' && line > 0,
            'Unable to add an error, `line` should be a number greater than 0 but ' +
                line + ' given');

        assert(typeof column === 'number' && column >= 0,
            'Unable to add an error, `column` should be a positive number but ' +
                column + ' given');
    },

    /**
     * Adds error to error list.
     *
     * @param {Object} errorInfo
     * @private
     */
    _addError: function(errorInfo) {
        if (!this._file.isEnabledRule(this._currentRule, errorInfo.line)) {
            return;
        }

        this._validateInput(errorInfo);

        this._errorList.push({
            filename: this._file.getFilename(),
            rule: this._currentRule,
            message: this._prepareMessage(errorInfo),
            line: errorInfo.line,
            column: errorInfo.column,
            additional: errorInfo.additional,
            fixed: errorInfo.fixed
        });
    },

    /**
     * Prepare error message.
     *
     * @param {Object} errorInfo
     * @private
     */
    _prepareMessage: function(errorInfo) {
        if (this._verbose && this._currentRule) {
            return this._currentRule + ': ' + errorInfo.message;
        }

        return errorInfo.message;
    },

    /**
     * Returns style error list.
     *
     * @returns {Object[]}
     */
    getErrorList: function() {
        return this._errorList;
    },

    /**
     * Returns filename of file this error list is for.
     *
     * @returns {String}
     */
    getFilename: function() {
        return this._file.getFilename();
    },

    /**
     * Returns true if no errors are added.
     *
     * @returns {Boolean}
     */
    isEmpty: function() {
        return this._errorList.length === 0;
    },

    /**
     * Returns amount of errors added by the rules.
     *
     * @returns {Number}
     */
    getErrorCount: function() {
        return this._errorList.length;
    },

    /**
     * Strips error list to the specified length.
     *
     * @param {Number} length
     */
    stripErrorList: function(length) {
        this._errorList.splice(length);
    },

    /**
     * Filters out errors based on the supplied filter function
     *
     * @param {Function} filter
     */
    filter: function(filter) {
        this._errorList = this._errorList.filter(filter);
    },

    /**
     * Formats error for further output.
     *
     * @param {Object} error
     * @param {Boolean} [colorize = false]
     * @returns {String}
     */
    explainError: function(error, colorize) {
        var lineNumber = error.line - 1;
        var lines = this._file.getLines();
        var result = [
            renderLine(lineNumber, lines[lineNumber], colorize),
            renderPointer(error.column, colorize)
        ];
        var i = lineNumber - 1;
        var linesAround = 2;
        while (i >= 0 && i >= (lineNumber - linesAround)) {
            result.unshift(renderLine(i, lines[i], colorize));
            i--;
        }
        i = lineNumber + 1;
        while (i < lines.length && i <= (lineNumber + linesAround)) {
            result.push(renderLine(i, lines[i], colorize));
            i++;
        }
        result.unshift(formatErrorMessage(error.message, this.getFilename(), colorize));
        return result.join('\n');
    },

    /**
     * Sets the current rule so that errors are aware
     * of which rule triggered them.
     *
     * @param {String} rule
     */
    setCurrentRule: function(rule) {
        this._currentRule = rule;
    }

};

/**
 * Formats error message header.
 *
 * @param {String} message
 * @param {String} filename
 * @param {Boolean} colorize
 * @returns {String}
 */
function formatErrorMessage(message, filename, colorize) {
    return (colorize ? chalk.bold(message) : message) +
        ' at ' +
        (colorize ? chalk.green(filename) : filename) + ' :';
}

/**
 * Simple util for prepending spaces to the string until it fits specified size.
 *
 * @param {String} s
 * @param {Number} len
 * @returns {String}
 */
function prependSpaces(s, len) {
    while (s.length < len) {
        s = ' ' + s;
    }
    return s;
}

/**
 * Renders single line of code in style error formatted output.
 *
 * @param {Number} n line number
 * @param {String} line
 * @param {Boolean} [colorize = false]
 * @returns {String}
 */
function renderLine(n, line, colorize) {
    // Convert tabs to spaces, so errors in code lines with tabs as indention symbol
    // could be correctly rendered, plus it will provide less verbose output
    line = line.replace(/\t/g, ' ');

    // "n + 1" to print lines in human way (counted from 1)
    var lineNumber = prependSpaces((n + 1).toString(), 5) + ' |';
    return ' ' + (colorize ? chalk.grey(lineNumber) : lineNumber) + line;
}

/**
 * Renders pointer:
 * ---------------^
 *
 * @param {Number} column
 * @param {Boolean} [colorize = false]
 * @returns {String}
 */
function renderPointer(column, colorize) {
    var res = (new Array(column + 9)).join('-') + '^';
    return colorize ? chalk.grey(res) : res;
}

module.exports = Errors;
