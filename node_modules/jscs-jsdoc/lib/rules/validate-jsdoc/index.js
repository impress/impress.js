var assert = require('assert');

var validatorsByName = module.exports = {
    checkTypes: require('./check-types'),

    checkParamExistence: require('./check-param-existence'),
    checkParamNames: require('./check-param-names'),
    checkRedundantParams: require('./check-redundant-params'),
    requireParamTypes: require('./require-param-types'),
    requireParamDescription: require('./require-param-description'),
    requireHyphenBeforeDescription: require('./require-hyphen-before-description'),

    checkReturnTypes: require('./check-return-types'),
    requireReturnTypes: require('./require-return-types'),
    requireReturnDescription: require('./require-return-description'),
    checkRedundantReturns: require('./check-redundant-returns'),

    checkAnnotations: require('./check-annotations'),

    requireNewlineAfterDescription: require('./require-newline-after-description'),
    disallowNewlineAfterDescription: require('./disallow-newline-after-description'),

    requireDescriptionCompleteSentence: require('./require-description-complete-sentence'),

    checkRedundantAccess: require('./check-redundant-access'),
    enforceExistence: require('./enforce-existence'),
    leadingUnderscoreAccess: require('./leading-underscore-access')
};

Object.defineProperty(validatorsByName, 'load', {
    /**
     * loads and initializes existing and required validators
     *
     * @param {Object} passedOptions
     * @returns {Array.<Function>}
     */
    value: function loadValidators(passedOptions) {
        if (!passedOptions) {
            return [];
        }

        var validators = [];

        Object.keys(validatorsByName).forEach(function(name) {
            var v = validatorsByName[name];

            // skip unknown
            var coveredOptions = v.coveredOptions || (v.options && Object.keys(v.options));
            if (!coveredOptions || !coveredOptions.length) {
                return;
            }

            // store used
            for (var i = 0, l = coveredOptions.length; i < l; i += 1) {
                if (passedOptions.indexOf(coveredOptions[i]) !== -1) {
                    v._name = name;
                    validators.push(v);
                    return;
                }
            }
        });

        return validators;
    }
});

Object.defineProperty(validatorsByName, 'checkOptions', {
    /**
     * Validates passed options
     *
     * @param {Object} validator
     * @param {Object} options
     * @throws {Error} If option is not valid
     */
    value: function checkOptions(validator, options) {
        Object.keys(validator.options).forEach(function(option) {
            var data = validator.options[option];
            if (!data.allowedValues) {
                return;
            }

            var values = data.allowedValues;
            if (typeof values === 'function') {
                values = values();
            }

            assert(Array.isArray(values), 'Internal error in jsDoc validator ' + validator._name);

            if (values.length > 1) {
                assert(values.indexOf(options[option]) !== -1,
                    'Accepted values for option jsDoc.' + option + ' are ' + values.map(JSON.stringify).join(', '));

            } else if (values.length) {
                assert(values[0] === options[option],
                    'Only accepted value for jsDoc.' + option + ' is ' + JSON.stringify(values[0]));
            }
        });
    }
});
