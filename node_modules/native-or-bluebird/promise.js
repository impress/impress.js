
try {
  module.exports = require('bluebird')
} catch (_) {
  module.exports = global.Promise
}
