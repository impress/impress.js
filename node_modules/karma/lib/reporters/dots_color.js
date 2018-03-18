var DotsReporter = require('./dots')
var BaseColorReporter = require('./base_color')

var DotsColorReporter = function (formatError, reportSlow) {
  DotsReporter.call(this, formatError, reportSlow)
  BaseColorReporter.call(this)
}

// PUBLISH
module.exports = DotsColorReporter
