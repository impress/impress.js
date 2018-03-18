// default configuration

module.exports = {
    disallowVars: false,
    disallowDuplicated: true,
    disallowUnknownReferences: true,
    parse: require("esprima-fb").parse,
};
