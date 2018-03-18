var assert = require('assert');
var commentParser = require('comment-parser');

var TypeParser = require('jsdoctypeparser').Parser;
var TypeBuilder = require('jsdoctypeparser').Builder;

// wtf but it needed to stop writing warnings to stdout
// and revert exceptions functionality
TypeBuilder.ENABLE_EXCEPTIONS = true;

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var PARSERS = {
    tag: commentParser.PARSERS.parse_tag,
    type: commentParser.PARSERS.parse_type,
    description: commentParser.PARSERS.parse_description,
};
// jscs:enable
var RE_SPACE = /\s/;

module.exports = {

    /**
     * @param {string} commentNode
     * @returns {DocComment}
     */
    createDocCommentByCommentNode: function(commentNode) {
        var loc = commentNode.loc;
        var lines = [Array(loc.start.column + 1).join(' '), '/*', commentNode.value, '*/']
            .join('').split('\n').map(function(v) {
                return v.substr(loc.start.column);
            });
        var value = lines.join('\n');
        return new DocComment(value, loc);
    },

    doc: DocComment,
    tag: DocTag,
    type: DocType,
    location: DocLocation
};

/**
 * jsdoc comment object
 *
 * @param {string} value
 * @param {{start: DocLocation}} loc
 * @constructor
 */
function DocComment(value, loc) {
    assert.equal(typeof value, 'string', '');
    assert(typeof loc === 'object' && typeof loc.start === 'object' &&
        typeof loc.start.line === 'number' && typeof loc.start.column === 'number' &&
        loc.start.line > 0 && loc.start.column >= 0,
        'Location object should contains start field with valid line and column numbers');

    // parse comments
    var _parsed = _parseComment(value) || {};

    // fill up fields
    this.loc = loc;
    this.value = value;
    this.lines = value.split('\n');
    this.valid = _parsed.hasOwnProperty('line');

    // doc parsed data
    var _d = _parsed.source;
    var _dog = _d && _d.indexOf('\n@');
    this.description = !_d || _d[0] === '@' ?
        null
        : (_dog === -1 ? _d : _d.substr(0, _dog));

    this.tags = (_parsed.tags || []).map(function(tag) {
        return new DocTag(tag, new DocLocation(tag.line, 3, loc.start));
    });

    // calculate abstract flag
    this.abstract = this.tags.some(function(v) {
        return v.id === 'abstract' || v.id === 'virtual';
    });

    /**
     * @param {function(this: DocComment, DocTag): DocComment} fn
     * @returns {DocComment}
     */
    this.iterate = function forEachTag(fn) {
        this.tags.forEach(fn, this);
        return this;
    };

    /**
     * @param {string|Array.<string>} types
     * @param {function(this: DocComment, DocTag): DocComment} fn
     * @returns {DocComment}
     */
    this.iterateByType = function iterateByTypes(types, fn) {
        var k = 0;
        types = Array.isArray(types) ? types : [types];
        this.tags.forEach(function(tag) {
            if (types.indexOf(tag.id) === -1) {
                return;
            }
            fn.call(this, tag, k++);
        }, this);
        return this;
    };
}

/**
 * Simple jsdoc tag object
 *
 * @param {Object} tag object from comment parser, fields: tag, line, value, name, type, description
 * @param {DocLocation} loc
 * @constructor
 */
function DocTag(tag, loc) {
    this.id = tag.tag;
    this.line = tag.line;
    this.value = tag.value;
    this.name = undefined;
    this.type = undefined;

    this.description = tag.description;
    this.optional = tag.optional;
    this.default = tag.default;

    this.loc = loc;

    if (tag.name) {
        this.name = {
            loc: this.loc.shift(0, tag.value.indexOf(tag.name)),
            value: tag.name
        };
    }
    if (tag.type) {
        this.type = new DocType(tag.type, this.loc.shift(0, tag.value.indexOf(tag.type)));
    }
}

/**
 * Parses jsdoctype string and provides several methods to work with it
 *
 * @param {string} type
 * @param {DocLocation} loc
 * @constructor
 */
function DocType(type, loc) {
    assert(type, 'type can\'t be empty');
    assert(loc, 'location should be passed');

    this.value = type;
    this.loc = loc;

    var parsed = _parseDocType(type);
    var data = parsed.valid ? _simplifyType(parsed) : [];

    this.optional = parsed.optional;
    this.variable = parsed.variable;
    this.valid = parsed.valid;

    if (parsed.valid && parsed.variable) {
        this.loc.column = this.loc.column + 3; // ' * '.length
    }

    /**
     * Match type
     *
     * @param {EsprimaNode} node
     * @returns {boolean}
     */
    this.match = function(node) {
        return jsDocMatchType(data, node);
    };

    /**
     * @param {function(TypeBuilder)} cb Calling for each node
     * @returns {Array}
     */
    this.iterate = function(cb) {
        if (!parsed.valid) {
            return [];
        }
        return _iterateDocTypes(parsed, cb);
    };
}

/**
 * DocLocation
 *
 * @constructor
 * @param {number} line
 * @param {number} column
 * @param {(Object|DocLocation)} [rel]
 */
function DocLocation(line, column, rel) {
    assert(Number.isFinite(line) && line >= 0, 'line should be greater than zero');
    assert(Number.isFinite(column) && column >= 0, 'column should be greater than zero');
    rel = rel || {};
    this.line = Number(line) + Number(rel.line || 0);
    this.column = Number(column) + Number(rel.column || 0);
}

/**
 * Shift location by line and column
 *
 * @param {number|Object} line
 * @param {number} [column]
 * @returns {DocLocation}
 */
DocLocation.prototype.shift = function(line, column) {
    if (typeof line === 'object') {
        column = line.column;
        line = line.line;
    }
    return new DocLocation(line, column, this);
};

/**
 * Comment parsing helper
 *
 * @param {string} comment
 * @returns {Object}
 * @private
 */
function _parseComment(comment) {
    return commentParser(comment, {
        parsers: [
            // parse tag
            function(str) {
                var res = PARSERS.tag.call(this, str);
                res.data.value = str;
                return res;
            },
            PARSERS.type,
            _parseName,
            PARSERS.description,
        ]
    })[0];
}

/**
 * analogue of str.match(/@(\S+)(?:\s+\{([^\}]+)\})?(?:\s+(\S+))?(?:\s+([^$]+))?/);
 *
 * @param {string} str raw jsdoc string
 * @returns {?Object} parsed tag node
 */
function _parseName(str, data) {
    if (data.errors && data.errors.length) {
        return null;
    }

    var l        = str.length;
    var pos      = _skipws(str);
    var ch       = '';
    var name     = '';
    var brackets = 0;
    var chevrons = 0;
    var ticks    = 0;

    while (pos < l) {
        ch = str[pos];
        brackets += ch === '[' ? 1 : ch === ']' ? -1 : 0;
        chevrons += ch === '<' ? 1 : ch === '>' ? -1 : 0;
        if (ch === '`') {
            ticks++;
        }
        if (ticks % 2 === 0 && chevrons === 0 && brackets === 0 && RE_SPACE.test(ch)) {
            break;
        }
        name += ch;
        pos ++;
    }

    if (brackets !== 0) { throw Error('Invalid `name`, unpaired brackets'); }
    if (chevrons !== 0) { throw Error('Invalid `name`, unpaired chevrons'); }
    if (ticks % 2 !== 0) { throw Error('Invalid `name`, unpaired ticks'); }

    var res = {
        name: name,
        default: undefined,
        optional: false,
        required: false,
        ticked: false
    };

    // strip ticks (support for ticked variables)
    if (name[0] === '`' && name[name.length - 1] === '`') {
        res.ticked = true;
        name = name.slice(1, -1).trim();
    }

    // strip chevrons
    if (name[0] === '<' && name[name.length - 1] === '>') {
        res.required = true;
        name = name.slice(1, -1).trim();
    }

    // strip brackets
    if (name[0] === '[' && name[name.length - 1] === ']') {
        res.optional = true;
        name = name.slice(1, -1).trim();

        var eqPos = name.indexOf('=');
        if (eqPos !== -1) {
            res.default = name.substr(eqPos + 1).trim().replace(/^(["'])(.+)(\1)$/, '$2');
            name = name.substr(0, eqPos).trim();
        }
    }

    res.name = name;

    return {
        source: str.substr(0, pos),
        data: res
    };

    /**
     * Returns the next to whitespace char position in a string
     *
     * @param {string} str
     * @return {number}
     */
    function _skipws(str) {
        var i = 0;
        var l = str.length;
        var ch;
        do {
            ch = str[i];
            if (ch !== ' ' && ch !== '\t') {
                break;
            }
        } while (++i < l);
        return i;
    }
}

/**
 * @param {string} typeString
 * @returns {?Array.<SimplifiedType>} - parsed jsdoctype string as array
 */
function _parseDocType(typeString) {
    var parser = new TypeParser();
    var node;
    try {
        node = parser.parse(typeString);
        node.valid = true;
    } catch (e) {
        node = {};
        node.error = e.message;
        node.valid = false;
    }
    return node;
}

/**
 * @param {EsprimaNode} node
 * @param {Function} cb
 * @returns {Array}
 */
function _iterateDocTypes(node, cb) {
    var res;

    switch (true) {
    case node instanceof TypeBuilder.TypeUnion:
        // optional: boolean,
        // nullable: boolean,
        // variable: boolean,
        // nonNullable: boolean,
        // all: boolean,
        // unknown: boolean,
        // types: Array.<TypeName|GenericType|FunctionType|RecordType>
        res = node.types.map(function(subnode) {
            if (node.collectionNode) {
                subnode.parentNode = node.collectionNode;
            }
            return _iterateDocTypes(subnode, cb);
        }) || [];
        if (node.nullable) {
            var subnode = {typeName: 'null', collectionNode: node};
            res.concat(cb(subnode));
        }
        break;

    case node instanceof TypeBuilder.TypeName:
        // name: string
        node.typeName = node.name;
        res = cb(node);
        break;

    case node instanceof TypeBuilder.GenericType:
        // genericTypeName: string,
        // parameterTypeUnions: Array.<TypeUnion>
        node.typeName = node.genericTypeName.type;
        res = cb(node) || [];
        if (node.parameterTypeUnions) {
            // node.parameterTypeUnions.collectionNode = node;
            res.concat(node.parameterTypeUnions.map(function(subnode) {
                subnode.parentNode = node;
                _iterateDocTypes(subnode, cb);
            }));
        }
        break;

    case node instanceof TypeBuilder.FunctionType:
        // parameterTypeUnions: Array.<TypeUnion>,
        // returnTypeUnion: TypeUnion|null,
        // isConstructor: boolean,
        // contextTypeUnion: TypeUnion|null
        node.typeName = 'Function';
        res = cb(node) || [];
        res.concat(node.parameterTypeUnions.map(function(subnode) {
            subnode.parentNode = node;
            _iterateDocTypes(subnode, cb);
        }));
        if (node.returnTypeUnion) {
            node.returnTypeUnion.collectionNode = node;
            res.concat(_iterateDocTypes(node.returnTypeUnion, cb));
        }
        if (node.contextTypeUnion) {
            node.contextTypeUnion.collectionNode = node;
            res.concat(_iterateDocTypes(node.contextTypeUnion, cb));
        }
        break;

    case node instanceof TypeBuilder.RecordType:
        // entries: Array.<RecordEntry>
        node.typeName = 'Object';
        res = cb(node) || [];
        if (node.entries) {
            res.concat(node.entries.map(function(subnode) {
                subnode.parentNode = node;
                _iterateDocTypes(subnode, cb);
            }));
        }
        break;

    case node instanceof TypeBuilder.RecordType.Entry:
        // name: string,
        // typeUnion: TypeUnion
        node.typeUnion.collectionNode = node;
        res = _iterateDocTypes(node.typeUnion, cb);
        break;

    case node instanceof TypeBuilder.ModuleName:
        node.typeName = node.name;
        node.module = true;
        res = cb(node);
        break;

    default:
        throw new Error('DocType: Unsupported doc node');
    }

    return res;
}

/**
 * Converts AST jsDoc node to simple object
 *
 * @param {Object} node
 * @returns {!Array.<SimplifiedType>}
 * @see https://github.com/Kuniwak/jsdoctypeparser
 */
function _simplifyType(node) {
    var res = [];
    _iterateDocTypes(node, function(type) {
        if (!type.parentNode && (!type.collectionNode || !type.collectionNode.parentNode)) {
            res.push({type: type.typeName});
        }
    });
    return res;
}

var jsPrimitives = 'string number boolean null undefined Object Function Array Date RegExp'
    .toLowerCase().split(' ');

/**
 * Compare parsed jsDocTypes with esprima node
 *
 * @param {SimplifiedType[]} variants - result of jsDocParseType
 * @param {Object} argument - esprima source code node
 */
function jsDocMatchType(variants, argument) {
    var i;
    var l;
    var variant;
    var type;
    var primitive;
    var result = null;

    for (i = 0, l = variants.length; i < l; i += 1) {
        variant = variants[i][0] || variants[i];
        if (variant.unknown || !variant.type) {
            result = true;
            break;
        }

        type = variant.type.toLowerCase();
        primitive = jsPrimitives.indexOf(type) !== -1;

        if (argument.type === 'Literal') {
            if (argument.value === null) {
                result = result || (type === 'null');

            } else if (argument.value === undefined) {
                result = result || (type === 'undefined');

            } else if (typeof argument.value !== 'object') {
                result = result || (type === typeof argument.value);

            } else if (!argument.value.type) {
                result = result || (type === (argument.value instanceof RegExp ? 'regexp' : 'object'));

            } else {
                result = result || (type === argument.value.type);
            }

        } else if (argument.type === 'ObjectExpression') {
            result = result || (type === 'object');
            result = result || (!primitive);

        } else if (argument.type === 'ArrayExpression') {
            result = result || (type === 'array');

        } else if (argument.type === 'NewExpression' && type === 'object') {
            result = true;

        } else if (argument.type === 'NewExpression') {
            var c = argument.callee;
            var exam = c.name;
            if (!exam && c.type === 'MemberExpression') {
                if (c.object.type === 'ThisExpression') {
                    result = true;
                    break;
                }
                var cur = c;
                exam = [];
                while (cur.object) {
                    exam.unshift(cur.property.name);
                    cur = cur.object;
                }
                exam.unshift(cur.name);
                exam = exam.join('.');
            }
            exam = exam.toLowerCase();
            result = result || (type === exam);
        }

        if (result) {
            break;
        }
    }

    // variables, expressions, another behavior
    return result !== false;
}
