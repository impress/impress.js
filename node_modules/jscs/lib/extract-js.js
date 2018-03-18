var htmlparser = require('htmlparser2');
var Errors = require('./errors');
var rLineSplit = /\r\n|\r|\n/;
var rHasNonWhitespace = /\S/;

/**
 * Html file representation (needed for errors output).
 *
 * @name HtmlFile
 * @param {Object} params
 * @param {String} params.filename
 * @param {String} params.source
 */
var HtmlFile = function(params) {
    this._filename = params.filename;
    this._lines = params.source.split(rLineSplit);
};

HtmlFile.prototype = {
    /**
     * Returns source filename for this object representation.
     *
     * @returns {String}
     */
    getFilename: function() {
        return this._filename;
    },

    /**
     * Returns array of source lines for the file.
     *
     * @returns {String[]}
     */
    getLines: function() {
        return this._lines;
    }
};

/**
 * Parse html and retrieve script sources.
 *
 * @param {String} html
 * @returns {Object[]}
 */
function getScripts(html) {
    function onopen(name, attrs) {
        // tag should be a <script>
        if (name !== 'script' ||
            // ignore scripts with src attribute
            attrs.src ||
            // script tag should has no type attribute or attribute should be equal to text/javascript
            (attrs.type && attrs.type.toLowerCase() !== 'text/javascript')) {
            return;
        }

        // store script content start pos
        scriptStartPos = parser.endIndex + 1;
    }

    function onclose() {
        if (!scriptStartPos) {
            return;
        }

        // get script content
        var scriptEndPos = parser.startIndex;
        var source = html.substring(scriptStartPos, scriptEndPos);

        // store script content only if it contains non-whitespace characters
        if (rHasNonWhitespace.test(source)) {
            scripts.push({
                source: source,
                start: scriptStartPos,
                end: scriptEndPos
            });
        }

        // reset script start position
        scriptStartPos = 0;
    }

    var scriptStartPos = 0;
    var scripts = [];
    var parser = new htmlparser.Parser({
        onopentag: onopen,
        onclosetag: onclose
    });

    parser.parseComplete(html);

    return scripts;
}

/**
 * JavaScript in HTML usually shifted based on first JS line. For example
 * if first line of fragment is offset by 4 spaces, each line in this
 * fragment will have offset 4 to restore the original column.
 * This function trim script source and normalize lines offset.
 *
 * @param {String} source
 * @returns {Object[]}
 */
function normalizeSource(source) {
    var lines = source.split(rLineSplit);
    var lineCount = lines.length;
    var tabOnlyOffset = false;
    var spaceOnlyOffset = false;
    var offset;

    // remove first list if it's an empty string
    // usually <script> starts with new line
    if (!rHasNonWhitespace.test(lines[0])) {
        lines.shift();
    }

    // replace last line by empty string if it contains only whitespaces
    // it helps avoid disallowTrailingWhitespace errors on last line
    if (!rHasNonWhitespace.test(lines[lines.length - 1])) {
        lines[lines.length - 1] = '';
    }

    // calculate min line offset
    offset = Math.min.apply(null, lines.map(function(line) {
        // skip empty lines
        if (!line) {
            return Infinity;
        }

        // fetch whitespaces at the line beginning
        var offsetStr = line.match(/^\s*/)[0];
        var tabCount = offsetStr.match(/\t*/)[0].length;

        if (offsetStr.length === line.length) {
            return 0;
        }

        // mixed spaces and tabs in one offset -> don't remove offsets
        if (tabCount && tabCount !== offsetStr.length) {
            return 0;
        }

        if (tabCount) {
            if (spaceOnlyOffset) {
                // no spaces, but previous offset has ony spaces -> mixed spaces and tabs
                return 0;
            } else {
                // remember offset contains only tabs
                tabOnlyOffset = true;
            }
        } else {
            if (tabOnlyOffset) {
                // no tabs, but previous offset has only tabs -> mixed spaces and tabs
                return 0;
            } else {
                // remember offset contains only spaces
                spaceOnlyOffset = true;
            }
        }

        return offsetStr.length;
    }));

    // remove common offsets if possible
    if (offset) {
        lines = lines.map(function(line) {
            return line.substr(offset);
        });
    }

    return {
        source: lines.join('\n'),
        offset: offset,
        lineCount: lineCount
    };
}

/**
 * Parse HTML and search for <script> sources. Each script source also normalize
 * by line offset. Result contains script sources with information about line
 * offset (that was removed for each line) and lines count before script source.
 * This information helps restore absolute positions in html file for errors.
 *
 * @param {String} filename
 * @param {String} data
 * @returns {Object[]}
 */
function extractJs(filename, data) {
    var errors = new Errors(new HtmlFile({
        filename: filename,
        source: data
    }));
    var scripts = getScripts(data);
    var sources = [];
    var line = 1;
    var lastHtmlPos = 0;

    scripts.forEach(function(scriptInfo) {
        // fetch script source and normalize it
        var normalized = normalizeSource(scriptInfo.source);

        // add line offset before script
        line += data.substring(lastHtmlPos, scriptInfo.start).split(rLineSplit).length - 1;

        sources.push({
            source: normalized.source,
            offset: normalized.offset,
            line: line
        });

        // save offsets for next fragment
        line += normalized.lineCount - 1;
        lastHtmlPos = scriptInfo.end;
    });

    return {
        sources: sources,
        errors: errors,
        addError: function(error) {
            errors._errorList.push({
                filename: filename,
                rule: error.rule,
                message: error.message,
                line: error.line,
                column: error.column
            });
        }
    };
}

module.exports = extractJs;
