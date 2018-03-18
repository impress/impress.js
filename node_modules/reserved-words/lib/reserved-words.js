var assert = require('assert');

/**
 * Structure for storing keywords.
 *
 * @typedef {Object.<String,Boolean>} KeywordsHash
 */

/**
 * ECMAScript dialects.
 *
 * @const
 * @type {Object.<String,Number|String>} - keys as readable names and values as versions
 */
var DIALECTS = {
    es3: 3,
    es5: 5,
    es2015: 6,
    es7: 7,

    // aliases
    es6: 6,
    'default': 5,
    next: 6
};

/**
 * ECMAScript reserved words.
 *
 * @type {Object.<String,KeywordsHash>}
 */
var KEYWORDS = exports.KEYWORDS = {};

/**
 * Check word for being an reserved word.
 *
 * @param {String} word - word to check
 * @param {String|Number} [dialect] - dialect or version
 * @param {Boolean} [strict] - strict mode
 * @returns {?Boolean}
 */
exports.check = function check(word, dialect, strict) {
    dialect = dialect || DIALECTS.default;
    var version = DIALECTS[dialect] || dialect;

    if (strict && version >= 5) {
        version += '-strict';
    }

    assert(KEYWORDS[version], 'Unknown dialect');

    return KEYWORDS[version].hasOwnProperty(word);
};

/**
 * Reserved Words for ES3
 *
 * ECMA-262 3rd: 7.5.1
 * http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf
 *
 * @type {KeywordsHash}
 */
KEYWORDS['3'] = _hash(
    // Keyword, ECMA-262 3rd: 7.5.2
    'break    else       new     var',
    'case     finally    return  void',
    'catch    for        switch  while',
    'continue function   this    with',
    'default  if         throw',
    'delete   in         try',
    'do       instanceof typeof',
    // FutureReservedWord, ECMA-262 3rd 7.5.3
    'abstract enum       int        short',
    'boolean  export     interface  static',
    'byte     extends    long       super',
    'char     final      native     synchronized',
    'class    float      package    throws',
    'const    goto       private    transient',
    'debugger implements protected  volatile',
    'double   import     public',
    // NullLiteral & BooleanLiteral
    'null true false'
);

/**
 * Reserved Words for ES5.
 *
 * http://es5.github.io/#x7.6.1
 *
 * @type {KeywordsHash}
 */
KEYWORDS['5'] = _hash(
    // Keyword
    'break    do       instanceof typeof',
    'case     else     new        var',
    'catch    finally  return     void',
    'continue for      switch     while',
    'debugger function this       with',
    'default  if       throw',
    'delete   in       try',
    // FutureReservedWord
    'class enum extends super',
    'const export import',
    // NullLiteral & BooleanLiteral
    'null true false'
);

/**
 * Reserved Words for ES5 in strict mode.
 *
 * @type {KeywordsHash}
 */
KEYWORDS['5-strict'] = _hash(
    KEYWORDS['5'],
    // FutureReservedWord, strict mode. http://es5.github.io/#x7.6.1.2
    'implements let     private   public yield',
    'interface  package protected static'
);

/**
 * Reserved Words for ES6.
 *
 * 11.6.2
 * http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reserved-words
 *
 * @type {KeywordsHash}
 */
KEYWORDS['6'] = _hash(
    // Keywords, ES6 11.6.2.1, http://www.ecma-international.org/ecma-262/6.0/index.html#sec-keywords
    'break    do       in         typeof',
    'case     else     instanceof var',
    'catch    export   new        void',
    'class    extends  return     while',
    'const    finally  super      with',
    'continue for      switch     yield',
    'debugger function this',
    'default  if       throw',
    'delete   import   try',
    // Future Reserved Words, ES6 11.6.2.2
    // http://www.ecma-international.org/ecma-262/6.0/index.html#sec-future-reserved-words
    'enum await',
    // NullLiteral & BooleanLiteral
    'null true false'
);

/**
 * Reserved Words for ES6 in strict mode.
 *
 * @type {KeywordsHash}
 */
KEYWORDS['6-strict'] = _hash(
    KEYWORDS['6'],
    // Keywords, ES6 11.6.2.1
    'let static',
    // Future Reserved Words, ES6 11.6.2.2
    'implements package protected',
    'interface private public'
);

/**
 * Generates hash from strings
 *
 * @private
 * @param {...String|KeywordsHash} keywords - Space-delimited string or previous result of _hash
 * @return {KeywordsHash} - Object with keywords in keys and true in values
 */
function _hash() {
    var set = Array.prototype.map.call(arguments, function(v) {
        return typeof v === 'string' ? v : Object.keys(v).join(' ');
    }).join(' ');

    return set.split(/\s+/)
        .reduce(function(res, keyword) {
            res[keyword] = true;
            return res;
        }, {});
}
