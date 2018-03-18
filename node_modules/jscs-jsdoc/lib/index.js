/**
 * @param {module:jscs/lib/Configuration} configuration
 */
module.exports = function(configuration) {
    delete configuration._rules.jsDoc;
    configuration.registerRule(require('./rules/validate-jsdoc'));
};
