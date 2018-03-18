var fs = require('fs')
var exec = require('child_process').exec
var path = require('path')
var plist = require('plist')

exports.find = function(id, cb) {
  var pathQuery = 'mdfind "kMDItemCFBundleIdentifier=="' + id + '""'

  exec(pathQuery, function (err, stdout) {
    var loc = stdout.trim()
    if (loc === '') {
      loc = null
      err = err || new Error('Not found.')
    }
    cb(err, loc)
  })
}

exports.parseVersionByPlist = function(plPath, key, cb) {
  if (!fs.existsSync(plPath)) {
    cb(null)
  } else {
    var data = plist.parse(fs.readFileSync(plPath, 'utf8'))
    cb(data[key])
  }
}
