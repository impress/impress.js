
'use strict';

var fs     = require('fs');
var stream = require('readable-stream');
var util   = require('util');

var parse  = require('./parser.js');

module.exports = parse;

/* ------- Transform stream ------- */

function Parser(opts) {
  opts = opts || {};
  stream.Transform.call(this, {objectMode: true});
  this._extract = parse.mkextract(opts);
}

util.inherits(Parser, stream.Transform);

Parser.prototype._transform = function transform(data, encoding, done) {

  var block;
  var lines = data.toString().split(/\n/);

  while (lines.length) {
    block = this._extract(lines.shift());
    if (block) {
      this.push(block);
    }
  }

  done();
};

module.exports.stream = function stream(opts) {
  return new Parser(opts);
};

/* ------- File parser ------- */

module.exports.file = function file(file_path, done) {

  var opts = {};
  var collected = [];

  if (arguments.length === 3) {
    opts = done;
    done = arguments[2];
  }

  return fs.createReadStream(file_path, {encoding: 'utf8'})
    .on('error', done)
    .pipe(new Parser(opts))
    .on('error', done)
    .on('data', function(data) {
      collected.push(data);
    })
    .on('finish', function () {
      done(null, collected);
    });
};

