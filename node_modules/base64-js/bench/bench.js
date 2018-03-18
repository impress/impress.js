var random = require('crypto').pseudoRandomBytes

var b64 = require('../')
var fs = require('fs')
var path = require('path')
var data = random(1e6).toString('base64')
//fs.readFileSync(path.join(__dirname, 'example.b64'), 'ascii').split('\n').join('')
var start = Date.now()
var raw = b64.toByteArray(data)
var middle = Date.now()
var data = b64.fromByteArray(raw)
var end = Date.now()

console.log('decode ms, decode ops/ms, encode ms, encode ops/ms')
console.log(
	middle - start,  data.length / (middle - start), 
	end - middle,  data.length / (end - middle))
//console.log(data)

