// Copyright 2015 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

var fs       = require("fs")
var esprima  = require("esprima")
var jsTokens = require("./")


var typeMap = {
  Boolean:           "name",
  Identifier:        "name",
  Keyword:           "name",
  Null:              "name",
  Numeric:           "number",
  Punctuator:        "punctuator",
  RegularExpression: "regex",
  String:            "string"
}

function getEsprimaTokens(code) {
  var tokens = esprima.tokenize(code, {loc: true})
  tokens.forEach(function(token) { token.type = typeMap[token.type] })
  return tokens
}


function jsTokensTokenize(string) {
  jsTokens.lastIndex = 0
  if (string === "") return []
  var tokens = []
  var match
  while (match = jsTokens.exec(string)) {
    tokens.push(jsTokens.matchToToken(match))
  }
  return tokens
}

var exclusionMap = {
  comment:    true,
  whitespace: true
}

function getJsTokensTokens(code) {
  return jsTokensTokenize(code)
    .filter(function(token) { return !exclusionMap.hasOwnProperty(token.type) })
}


function compare(file) {
  var code = fs.readFileSync(require.resolve(file)).toString()
  var esprimaTokens  = getEsprimaTokens(code)
  var jsTokensTokens = getJsTokensTokens(code)

  var length = Math.min(esprimaTokens.length, jsTokensTokens.length)
  for (var index = 0; index < length; index++) {
    var esprimaToken  = esprimaTokens[index]
    var jsTokensToken = jsTokensTokens[index]
    if (
      esprimaToken.type  !== jsTokensToken.type ||
      esprimaToken.value !== jsTokensToken.value
    ) {
      var loc = esprimaToken.loc.start
      console.error(
        file + ":" + loc.line + ":" + (loc.column + 1) + ": " +
        "(token #" + (index + 1) + ")\n" +
        "  esprima:  '" + esprimaToken.type  + "': " + esprimaToken.value + "\n" +
        "  jsTokens: '" + jsTokensToken.type + "': " + jsTokensToken.value
      )
      return false
    }
  }

  if (esprimaTokens.length !== jsTokensTokens.length) {
    console.error(
      file + ': Number of tokens mismatch.\n' +
      "  esprima:  " + (esprimaTokens.length + 1) + "\n" +
      "  jsTokens: " + (jsTokensTokens.length + 1)
    )
    return false
  }

  return true
}


var results = process.argv.slice(2).map(compare)

if (results.every(Boolean)) {
  console.log(
    "Comparison succeeded: esprima and jsTokens produced the same tokens!"
  )
} else {
  console.error("Comparison failed.")
}
