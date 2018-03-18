// File
// ====
//
// File object used for tracking files in `file-list.js`

// Dependencies
// ------------

var _ = require('./helper')._

// Constructor
var File = function (path, mtime, doNotCache) {
  // used for serving (processed path, eg some/file.coffee -> some/file.coffee.js)
  this.path = path

  // original absolute path, id of the file
  this.originalPath = path

  // where the content is stored (processed)
  this.contentPath = path

  this.mtime = mtime
  this.isUrl = false

  this.doNotCache = _.isUndefined(doNotCache) ? false : doNotCache
}

File.prototype.toString = function () {
  return this.path
}

// PUBLIC
module.exports = File
