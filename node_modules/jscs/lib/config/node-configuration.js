var path = require('path');
var util = require('util');
var fs = require('fs');
var assert = require('assert');

var glob = require('glob');
var resolve = require('resolve');

var utils = require('../utils');
var Configuration = require('./configuration');
var configFinder = require('../cli-config');

var OVERRIDE_OPTIONS = [
    'fix',
    'preset',
    'maxErrors',
    'errorFilter',
    'esprima',
    'es3',
    'verbose',
    'esnext',
    'extract'
];

function req(entity, dir) {
    return require(
        resolve.sync(entity, { basedir: dir })
    );
}

/**
 * nodejs-compatible configuration module.
 *
 * @name NodeConfiguration
 * @augments Configuration
 * @constructor
 */
function NodeConfiguration() {
    Configuration.call(this);
    this._basePath = process.cwd();
}

util.inherits(NodeConfiguration, Configuration);

/**
 * Overrides configuration with options specified by the CLI
 *
 * @param {Object} program
 */
NodeConfiguration.prototype.overrideFromCLI = function(program) {
    var overrides = {};

    OVERRIDE_OPTIONS.forEach(function(option) {
        if (option in program) {
            overrides[option] = program[option];
        }
    });

    this.override(overrides);
};

/**
 * Load external module.
 *
 * @param {String|null} external - path (relative or absolute) or name to the external module
 * @param {String} type - type of the module
 * @param {String} [config = _basePath] - path to config relative to which external entities will be loaded
 * @returns {Module|null}
 * @protected
 */
NodeConfiguration.prototype.loadExternal = function(external, type, config) {
    assert(
        typeof external === 'string' || external === null,
        '"' + type + '" option requires a string or null value'
    );

    if (external === null) {
        return null;
    }

    var dir = config ? path.dirname(config) : this._basePath;
    var get = function(prefix, postfix) {
        prefix = prefix || '';
        postfix = postfix || '';

        try {
            return finder(
                utils.normalizePath(prefix + external + postfix, dir),
                dir
            );
        } catch (e) {}

        return null;
    }.bind(this);

    var finder;
    if (type === 'preset') {
        finder = configFinder.getContent;

    } else {
        finder = req;
    }

    var content;

    if (external.indexOf('jscs-') !== 0) {
        content = get('jscs-');

        if (!content && type === 'preset') {
            content = get('jscs-preset-') || get('jscs-config-');

            if (!content && external.indexOf('/') !== -1 && !external.split('.')[1]) {
                content = get('jscs-', '.json') ||
                    get('jscs-', '.js') ||
                    get('jscs-preset-', '.json') ||
                    get('jscs-config-', '.json') ||
                    get('jscs-preset-', '.js') ||
                    get('jscs-config-', '.js');
            }
        }
    }

    return content || get();
};

/**
 * Loads plugin data.
 *
 * @param {String|function(Configuration)} plugin
 * @param {String} [config] - path to config relative to which plugin will be loaded
 * @protected
 */
NodeConfiguration.prototype._loadPlugin = function(plugin, config) {
    if (typeof plugin !== 'function') {
        plugin = this.loadExternal(plugin, 'plugin', config);
    }

    return Configuration.prototype._loadPlugin.call(this, plugin);
};

/**
 * Loads preset.
 *
 * @param {String|null} preset
 * @param {String} config - path to config relative to which plugin will be loaded
 * @protected
 */
NodeConfiguration.prototype._loadPreset = function(preset, config) {
    var name = path.basename(preset).split('.')[0];

    try {
        this.registerPreset(name, this.loadExternal(preset, 'preset', config));
    } catch (e) {
        var registeredPresets = this.getRegisteredPresets();

        if (preset in registeredPresets) {
            Configuration.prototype._loadPreset.call(this, preset);
            return;
        }
    }

    // If preset is an external module, error will be thrown by the caller
    Configuration.prototype._loadPreset.call(this, name);
};

/**
 * Loads an error filter module.
 *
 * @param {String|null} filter
 * @param {String} config - path to config relative to which plugin will be loaded
 * @protected
 */
NodeConfiguration.prototype._loadErrorFilter = function(filter, config) {
    Configuration.prototype._loadErrorFilter.call(
        this,
        this.loadExternal(filter, 'errorFilter', config)
    );
};

/**
 * Loads a custom esprima.
 *
 * @param {String|null} esprima
 * @param {String} config - path to config relative to which esprima will be loaded
 * @private
 */
NodeConfiguration.prototype._loadEsprima = function(esprima, config) {
    Configuration.prototype._loadEsprima.call(
        this,
        this.loadExternal(esprima, 'esprima', config)
    );
};

/**
 * Loads additional rule.
 *
 * @param {String|Rule} additionalRule
 * @param {String} config - path to config relative to which plugin will be loaded
 * @private
 */
NodeConfiguration.prototype._loadAdditionalRule = function(additionalRule, config) {
    config = config || this._basePath;

    if (typeof additionalRule === 'string') {
        if (glob.hasMagic(additionalRule)) {

            // In some cases there might not be a config
            // like if options are defined through direct initialization (grunt plugin case)
            config = fs.statSync(config).isDirectory() ? config : path.dirname(config);

            glob.sync(path.resolve(config, additionalRule)).forEach(function(p) {
                var Rule = require(p);
                Configuration.prototype._loadAdditionalRule.call(this, new Rule());
            }, this);
        } else {
            var Rule = this.loadExternal(additionalRule, 'rule', config);
            Configuration.prototype._loadAdditionalRule.call(this, new Rule());
        }
    } else {
        Configuration.prototype._loadAdditionalRule.call(this, additionalRule);
    }
};

module.exports = NodeConfiguration;
