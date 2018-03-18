module.exports = requireDescriptionCompleteSentence;
module.exports.scopes = ['function', 'variable'];
module.exports.options = {
    requireDescriptionCompleteSentence: {allowedValues: [true]}
};

/**
 * Checks that every sentence starts with an upper case letter.
 *
 * This matches when a new line or start of a blank line
 * does not start with an upper case letter.
 * It also matches a period not fllowed by an upper case letter.
 */
var RE_NEW_LINE_START_WITH_UPPER_CASE = /((\n\s*\n)|(?:\w{2,})\.)\s*[a-z]/g;

var START_DESCRIPTION = /^\s*[a-z]/g;

var RE_END_DESCRIPTION = /\n/g;

/**
 * Checks next lines with uppercase letters have periods.
 *
 * This checks for the existance of a new line that starts with an
 * upper case letter where the previous line does not have a period
 * Note that numbers count as word characters.
 */
var RE_NEW_LINE_UPPERCASE = /\w(?!\.)(\W)*\n\W*[A-Z]/g;

/**
 * Checks that a sentence followed by a blank line has a period
 *
 * If the above line did not have a period this would match.
 * this also checks that the last sentence in the description ends with a period.
 *
 * This also matches white-space followed by a period.
 */
var RE_END_WITH_PERIOD = /(\s\.|[^\s\.])(?!\.)(\n|$)\s*(\n|$)/g;

/**
 * Requires description to be a complete sentence in a jsdoc comment.
 *
 * a complete sentence is defined by starting with an upper letter
 * and ending with a period.
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function requireDescriptionCompleteSentence(node, err) {
    var doc = node.jsdoc;
    if (!doc || !doc.description || !doc.description.length) {
        return;
    }

    var loc = doc.loc.start;
    var sanitized = doc.description
        .replace(/(`)([^`]+)\1/, quotedSanitizer)
        .replace(/(')([^']+)\1/, quotedSanitizer)
        .replace(/(")([^"]+)\1/, quotedSanitizer)
        // sanitize HTML tags which close
        .replace(/<([^ >]+)[^>]*>[\s\S]*?.*?<\/\1>|<[^\/]+\/>/g, htmlSanitizer)
        // sanitize self-closing HTML tags eg <br>
        .replace(/<([^ >]+)[^>]*>/g, htmlSanitizer)
        .replace(/\{([^}]+)\}/, function(_, m) {
            return '{' + (new Array(m.length + 1)).join('*') + '}';
        })
        .replace(/\r/g, ' ')
        .replace(/:(\n+)/, function(_, n) {
            return ':' + n.replace(/\n/g, ' ');
        });
    var lines = sanitized.split(RE_END_DESCRIPTION);

    var errors = [];

    if (START_DESCRIPTION.test(sanitized)) {
        var matches = returnAllMatches(sanitized, START_DESCRIPTION);
        matches.map(function(match) {
            match.message = 'Description must start with an upper case letter';
            match.index = match.start;
        });
        errors = errors.concat(matches);
    }

    if (RE_NEW_LINE_START_WITH_UPPER_CASE.test(sanitized)) {
        var matches1 = returnAllMatches(sanitized, RE_NEW_LINE_START_WITH_UPPER_CASE);
        matches1.map(function(match) {
            match.message = 'Sentence must start with an upper case letter';
            match.index = match.end - 1;
        });
        errors = errors.concat(matches1);
    }

    if (RE_END_WITH_PERIOD.test(sanitized)) {
        var matches2 = returnAllMatches(sanitized, RE_END_WITH_PERIOD);
        matches2.map(function(match) {
            match.message = 'Sentence must end with a period';
            match.index = match.start;
        });
        errors = errors.concat(matches2);
    }

    if (RE_NEW_LINE_UPPERCASE.test(sanitized)) {
        var matches3 = returnAllMatches(sanitized, RE_NEW_LINE_UPPERCASE);
        matches3.map(function(match) {
            match.message = 'You started a new line with an upper case letter but ' +
                'previous line does not end with a period';
            match.index = match.end - 1;
        });
        errors = errors.concat(matches3);
    }

    computeErrors(err, loc, errors, lines);
}

/**
 * Given a list of matches it records offenses.
 *
 * This will only go through the description once for all offenses.
 *
 * @param {Function} err
 * @param {Object} loc
 * @param {Array} matches An array of matching offenses.
 * @param {number} matches.start The starting index of the match.
 * @param {string} matches.message The message of the offence.
 * @param {Array} lines The lines in this description.
 */
function computeErrors(err, loc, matches, lines) {
    var indexInString = 0;
    var currentMatch = 0;
    for (var currentLine = 0; currentLine < lines.length &&
            currentMatch < matches.length; currentLine++) {

        var nextIndexInString = indexInString + lines[currentLine].length;
        while (currentMatch < matches.length && matches[currentMatch].index >= indexInString &&
                matches[currentMatch].index <= nextIndexInString) {

            // currentLine is to account for additional extra characters being added.
            var columnOffset = (matches[currentMatch].index - indexInString) - currentLine;
            err(matches[currentMatch].message, {
                line: loc.line + 1 + currentLine,
                column: loc.column + 3 + columnOffset
            });

            currentMatch++;
        }
        indexInString = nextIndexInString;
    }
}

/**
 * Returns all matches of regex in input as an array.
 *
 * @return {Array} Each element in the array has two values: start and end.
 */
function returnAllMatches(input, regex) {
    var match;
    var indexes = [];

    // resets the last index so that exec does not return null.
    regex.lastIndex = 0;
    do {
        match = regex.exec(input);
        if (match === null) {
            break;
        }
        indexes.push({
            start: match.index,
            end: match.index + match[0].length
        });
    } while (match !== null);
    return indexes;
}

/**
 * Quoted part sanitizer used for replace matcher.
 *
 * @private
 * @param {string} _ - Full matched string
 * @param {string} q - Quote character
 * @param {string} m - Matched string
 * @returns {string} - Sanitized string
 */
function quotedSanitizer(_, q, m) {
    var endsWithDot = /\.\s*$/.test(m);
    return q + (new Array(m.length + (endsWithDot ? 0 : 1))).join('*') + q + (endsWithDot ? '.' : '');
}

/**
 * HTML part sanitizer.
 * To prevent RE_NEW_LINE_START_WITH_UPPER_CASE
 * return string will padded by 'x.'
 *
 * @private
 * @param {string} _ - Full matched string
 * @returns {string} - Sanitized string
 */
function htmlSanitizer(_) {
  return _.split('').map(function(token, iterator) {
    if (iterator === _.length - 1) { return 'x.'}
    return token === '\n' ? '\n' : '*';
  }).join('');
}
