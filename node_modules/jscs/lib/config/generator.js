var fs = require('fs');

var Vow = require('vow');
var Table = require('cli-table');
var prompt = require('prompt');
var chalk = require('chalk');
var assign = require('lodash').assign;

var Checker = require('../checker');
var utils = require('../utils');

prompt.message = '';
prompt.delimiter = '';
prompt.start();

/**
 * Script that walks the user through the autoconfig flow
 *
 * @type {String[]}
 * @private
 */
var prompts = [
    {
        name: chalk.green('Please choose a preset number:'),
        require: true,
        pattern: /\d+/
    },
    {
        name: 'Create an (e)xception for this rule, or (f)ix the errors yourself?',
        require: true,
        pattern: /(e|f)/
    }
];

/**
 * JSCS Configuration Generator
 *
 * @name Generator
 */
function Generator() {
    this._config = {};
}

/**
 * Generates a configuration object based for the given path
 * based on the best fitting preset
 *
 * @param  {String} path - The path containing file(s) used to guide the configuration
 *
 * @return {Promise} Resolved with the generated, JSCS configuration
 */
Generator.prototype.generate = function(path) {
    var checker = getChecker();
    var _path = utils.normalizePath(path, checker.getConfiguration().getBasePath());
    var presetNames = Object.keys(checker.getConfiguration().getRegisteredPresets());
    var statsForPresets;

    console.log('Checking', _path, 'against the presets');

    return Vow
    .all(presetNames.map(this._checkAgainstPreset.bind(this, _path)))
    .then(function(resultsPerPreset) {
        statsForPresets = this._generateStatsForPresets(resultsPerPreset, presetNames);
        return statsForPresets;
    }.bind(this))
    .then(this._showErrorCounts.bind(this))
    .then(this._getUserPresetChoice.bind(this, prompts[0]))
    .then(function showViolatedRules(choiceObj) {
        var presetIndex = choiceObj[prompts[0].name] - 1;
        var presetName = statsForPresets[presetIndex].name;

        console.log('You chose the ' + presetName + ' preset');

        this._config.preset = presetName;

        var errorStats = getErrorsByRuleName(statsForPresets[presetIndex].errors);

        var violatedRuleCount = Object.keys(errorStats).length;

        if (!violatedRuleCount) { return this._config; }

        console.log(_path + ' violates ' + violatedRuleCount + ' rule' + (violatedRuleCount > 1 ? 's' : ''));

        var errorPrompts = generateRuleHandlingPrompts(errorStats);

        return this._getUserViolationChoices(errorPrompts)
        .then(this._handleViolatedRules.bind(this, errorPrompts))
        .then(function() {
            return this._config;
        }.bind(this));
    }.bind(this))
    .then(function flushConfig() {
        fs.writeFileSync(process.cwd() + '/.jscsrc', JSON.stringify(this._config, null, '\t'));
        console.log('Generated a .jscsrc configuration file in ' + process.cwd());
    }.bind(this));
};

/**
 * @private
 * @param  {Array.<Object[]>} resultsPerPreset - List of error objects for each preset's run of checkPath
 * @param  {String[]} presetNames
 * @return {Object[]} Aggregated datapoints for each preset
 */
Generator.prototype._generateStatsForPresets = function(resultsPerPreset, presetNames) {
    return resultsPerPreset.map(function(presetResults, idx) {
        var errorCollection = [].concat.apply([], presetResults);

        var presetStats = {
            name: presetNames[idx],
            sum: 0,
            errors: []
        };

        errorCollection.forEach(function(error) {
            presetStats.sum += error.getErrorCount();
            presetStats.errors = presetStats.errors.concat(error.getErrorList());
        });

        return presetStats;
    });
};

/**
 * @private
 * @param  {Object[]} statsForPresets
 */
Generator.prototype._showErrorCounts = function(statsForPresets) {
    var table = getTable();

    statsForPresets.forEach(function(presetStats, idx) {
        table.push([idx + 1, presetStats.name, presetStats.sum, getUniqueErrorNames(presetStats.errors).length]);
    });

    console.log(table.toString());
};

/**
 * Prompts the user to choose a preset
 *
 * @private
 * @param {Object} prompt
 * @return {Promise}
 */
Generator.prototype._getUserPresetChoice = function(prompt) {
    return this._showPrompt(prompt);
};

/**
 * Prompts the user to nullify rules or fix violations themselves
 *
 * @private
 * @param  {Object[]} errorPrompts
 * @return {Promise}
 */
Generator.prototype._getUserViolationChoices = function(errorPrompts) {
    return this._showPrompt(errorPrompts);
};

/** @private */
Generator.prototype._showPrompt = utils.promisify(prompt.get.bind(prompt));

/**
 * @private
 * @param  {Object[]} errorPrompts
 * @param  {Object} choices
 */
Generator.prototype._handleViolatedRules = function(errorPrompts, choices) {
    errorPrompts.forEach(function(errorPrompt) {
        var userChoice = choices[errorPrompt.name];

        if (userChoice.toLowerCase() === 'e') {
            this._config[errorPrompt.associatedRuleName] = null;
        }
    }, this);
};

/**
 * @private
 * @param  {String} path
 * @param  {String} presetName
 * @return {Promise}
 */
Generator.prototype._checkAgainstPreset = function(path, presetName) {
    var checker = getChecker();

    checker.configure({preset: presetName, maxErrors: Infinity});

    return checker.checkPath(path);
};

/**
 * @private
 * @return {module:lib/Checker}
 */
function getChecker() {
    var checker = new Checker();
    checker.registerDefaultRules();
    return checker;
}

/**
 * @private
 * @param  {Object} errors
 * @return {Object[]}
 */
function generateRuleHandlingPrompts(errors) {
    // Generate list of rule names, sorted by violation count (descending)
    var violatedRuleNames = Object.keys(errors);
    violatedRuleNames.sort(function(a, b) {
        return errors[b].violations - errors[a].violations;
    });

    return violatedRuleNames.map(function(ruleName) {
        var violationCount = errors[ruleName].violations;
        var fileCount = Object.keys(errors[ruleName].files).length;
        var prompt = assign({}, prompts[1]);

        prompt.associatedRuleName = ruleName;
        prompt.name = chalk.green(ruleName) +
            ' (' + violationCount + ' violation' + (violationCount > 1 ? 's' : '') +
            ' in ' + fileCount + ' file' + (fileCount > 1 ? 's' : '') + '):\n    ' +
            prompt.name;
        return prompt;
    });
}

/**
 * @private
 * @param  {Object[]} errorsList
 * @return {Object}
 */
function getErrorsByRuleName(errorsList) {
    var errors = {};

    errorsList.forEach(function(error) {
        var rulename = error.rule;
        errors[rulename] = errors[rulename] || {
            files: {},
            violations: 0
        };
        errors[rulename].violations += 1;
        errors[rulename].files[error.filename] = true;
    });

    return errors;
}

/**
 * @private
 * @param  {Object[]} errorsList
 * @return {String[]}
 */
function getUniqueErrorNames(errorsList) {
    var errorNameLUT = {};

    errorsList.forEach(function(error) {
        errorNameLUT[error.rule] = true;
    });

    return Object.keys(errorNameLUT);
}

/**
 * @private
 * @return {Object}
 */
function getTable() {
    return new Table({
        chars: {
            top: '', 'top-mid': '', 'top-left': '', 'top-right': '',
            bottom: '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
            left: '', 'left-mid': '',
            mid: '', 'mid-mid': '',
            right: '', 'right-mid': '' ,
            middle: ' '
        },
        style: {
            'padding-left': 0,
            'padding-right': 0
        },
        head: ['', 'Preset', '#Errors', '#Rules']
    });
}

module.exports = Generator;
