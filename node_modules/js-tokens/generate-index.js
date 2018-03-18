// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

var fs = require("fs")

require("coffee-script/register")
var regex = require("./regex.coffee")

var code = fs.readFileSync("index.js").toString()
code = code.replace(/\/.+\/.+/, regex.toString())
fs.writeFileSync("index.js", code)
