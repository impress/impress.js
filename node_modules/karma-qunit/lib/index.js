function createPattern (path) {
  return {
    pattern: path,
    included: true,
    served: true,
    watched: false
  }
}

function initQUnit (files) {
  files.unshift(createPattern(__dirname + '/adapter.js'))
  files.unshift(createPattern(require.resolve('qunitjs')))
}

initQUnit.$inject = ['config.files']

module.exports = {
  'framework:qunit': ['factory', initQUnit]
}
