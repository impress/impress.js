var ProgressReporter = require('./progress')
var BaseColorReporter = require('./base_color')

var ProgressColorReporter = function (formatError, reportSlow) {
  ProgressReporter.call(this, formatError, reportSlow)
  BaseColorReporter.call(this)
}

// PUBLISH
module.exports = ProgressColorReporter
