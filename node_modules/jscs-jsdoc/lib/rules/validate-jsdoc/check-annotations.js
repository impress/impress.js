var assert = require('assert');

var availablePresets = require('../../tags');
var jsdoc = require('../../jsdoc');

module.exports = validateAnnotations;
module.exports.scopes = ['file'];
module.exports.options = {
    checkAnnotations: true
};

/**
 * @param {Object} options
 */
validateAnnotations.configure = function(options) {
    var o = options.checkAnnotations;

    assert(o === true || typeof o === 'string' || typeof o === 'object',
        'jsDoc.checkAnnotation rule was not configured properly');

    if (typeof o === 'string') {
        o = {preset: o};
    } else if (typeof o === 'object') {
        var oKeys = Object.keys(o);
        oKeys.forEach(function(key) {
            if (key === 'preset') {
                assert(typeof o.preset === 'string', 'jsDoc.checkAnnotation.preset should be preset name');
            } else if (key === 'extra') {
                assert(typeof o[key] === 'object', 'jsDoc.checkAnnotation.preset should be `tag: fulfill` map');
            } else {
                throw new Error('jsDoc.checkAnnotation.' + key + ' is unsupported field');
            }
        });
    }

    var tags = this._tags = Object.create ? Object.create(null) : {};

    if (o === true) {
        Object.keys(availablePresets).forEach(function(preset) {
            var presetTags = availablePresets[preset];
            Object.keys(presetTags).forEach(function(tag) {
                tags[tag] = tags[tag] || presetTags[tag];
            });
        });

    } else if (typeof o === 'object') {
        if (o.preset) {
            assert(availablePresets[o.preset], 'Unknown tag preset ' + o.preset);
            Object.keys(availablePresets[o.preset]).forEach(function(tag) {
                tags[tag] = tags[tag] || availablePresets[o.preset][tag];
            });
        }
        if (o.extra) {
            Object.keys(o.extra).forEach(function(tag) {
                if (o.extra[tag] === null) {
                    delete tags[tag];
                } else {
                    tags[tag] = o.extra[tag];
                }
            });
        }
    }
};

/**
 * Validator for annotations
 *
 * @param {JSCS.JSFile} file
 * @param {JSCS.Errors} errors
 */
function validateAnnotations(file, errors) {
    var comments = file.getComments();
    var tags = this._tags;
    comments.forEach(function(commentNode) {
        if (commentNode.type !== 'Block' || commentNode.value[0] !== '*') {
            return;
        }

        // trying to create DocComment object
        var node = jsdoc.createDocCommentByCommentNode(commentNode);
        if (!node.valid) {
            return;
        }

        node.iterate(function(tag) {
            if (!(tag.id in tags)) {
                errors.add('Unavailable tag ' + tag.id, tag.loc);
                return;
            }

            // checking tag fullfill
            var isFilled = tag.name || tag.type || tag.description;
            switch (tags[tag.id]) {
                case false:
                    if (isFilled) {
                        errors.add('Unexpected data in tag ' + tag.id, tag.loc);
                    }
                    break;

                case true:
                    // any data
                    break;

                case 'some':
                    if (!isFilled) {
                        errors.add('Incomplete data in tag ' + tag.id, tag.loc);
                    }
                    break;

                default:
                    // unknown
                    break;
            }
        });
    });
}
