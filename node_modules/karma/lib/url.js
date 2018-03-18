// Url
// ===
//
// Url object used for tracking files in `file-list.js`

var Url = function (path) {
  this.path = path
  this.isUrl = true
}

Url.prototype.toString = function () {
  return this.path
}

// PUBLIC
module.exports = Url
