exports.fatal = function (message, code) {
  console.error(message)
  process.exit(code)
}

exports.log = function (message) {
  console.log(message)
  process.exit()
}
