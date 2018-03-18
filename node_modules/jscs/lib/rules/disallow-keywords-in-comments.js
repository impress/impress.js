/**
 * Disallows keywords in your comments, such as TODO or FIXME
 *
 * Types: `Boolean`, `String` or `Array`
 *
 * Values:
 * - `true`
 * - `'\b(word1|word2)\b'`
 * - `['word1', 'word2']`
 *
 * #### Examples
 *
 * ```js
 * "disallowKeywordsInComments": true
 * "disallowKeywordsInComments": "\\b(word1|word2)\\b"
 * "disallowKeywordsInComments": ["word1", "word2"]
 * ```
 *
 * #### Invalid:
 * ```
 * // ToDo
 * //TODO
 * /** fixme *\/
 * /**
 *  * FIXME
 *  *\/
 * ```
 */

var assert = require('assert');

function getCommentErrors(comment, keywordRegEx) {
    var splitComment = comment.value.split('\n');
    var errors = [];

    splitComment.forEach(function(commentNode, index) {
        var lineIndex = index;
        var matches = commentNode.match(keywordRegEx);
        var lastIndex = -1;

        if (!matches) { return; }

        errors = errors.concat(matches.map(function(match) {
            lastIndex++;
            lastIndex = commentNode.indexOf(match, lastIndex);

            // line + lineIndex because comment block was split at new lines
            //   will place carat at correct place within multiline comment
            // foundAtIndex += 2 because comment opening is stripped
            //   +2 finds accurate carat position on opening line comment
            return {
                line: comment.loc.start.line + lineIndex,
                column: lastIndex + (lineIndex > 0 ? 0 : 2)
            };
        }));
    });

    return errors;
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(keywords) {
        this._message = 'Comments cannot contain the following keywords: ';
        this._keywords = ['todo', 'fixme'];

        switch (true) {
            case Array.isArray(keywords):
                // use the array of strings provided to build RegExp pattern
                this._keywords = keywords;
                /* falls through */
            case keywords:
                // use default keywords
                this._message += this._keywords.join(', ');
                this._keywordRegEx = new RegExp('\\b(' + this._keywords.join('|') + ')\\b', 'gi');
                break;
            case typeof keywords === 'string':
                // use string passed in as the RegExp pattern
                this._message = 'Comments cannot contain keywords based on the expression you provided';
                this._keywordRegEx = new RegExp(keywords, 'gi');
                break;
            default:
                assert(false, this.getOptionName() + ' option requires a true value, a string or an array');
        }
    },

    getOptionName: function() {
        return 'disallowKeywordsInComments';
    },

    check: function(file, errors) {
        file.iterateTokensByType(['Line', 'Block'], function(comment) {
            getCommentErrors(comment, this._keywordRegEx).forEach(function(errorObj) {
                errors.add(this._message, errorObj);
            }.bind(this));
        }.bind(this));
    }
};
