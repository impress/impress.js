
var fs     = require('fs');
var stream = require('readable-stream');
var expect = require('chai').expect
var parse  = require('../index');

describe('File parsing', function() {

  it('should parse the file by path', function(done) {
      parse.file(__dirname + '/fixtures/sample.js', function(err, parsed) {
        if (err) { done(err); }

        expect(parsed)
          .to.be.an('array');

        expect(parsed.length)
          .to.eq(4);

        expect(parsed[0].description)
          .to.eq('File description');

        expect(parsed[1].tags[0].tag)
          .to.eq('class');

        expect(parsed[2].tags[0].tag)
          .to.eq('property');

        expect(parsed[3].tags[0].tag)
          .to.eq('method');

        done();
      });
  });

  it('should path the error if file dows not exist', function(done) {
      parse.file('does/not/exists', function(err, parsed) {
        expect(err)
          .to.be.instanceof(Error);
        done();
      });
  });

  it('should return `Transform` stream', function(done) {

    var count = 0;

    var readable = fs.createReadStream(__dirname + '/fixtures/sample.js', {encoding: 'utf8'});

    var writable = new stream.Writable({objectMode: true});
    writable._write = function(data, encoding, done) {
        count++;
        done();
    };

    readable
      .on('error', done)
      .pipe(parse.stream())
      .on('error', done)
      .pipe(writable)
      .on('error', done)
      .on('finish', function() {
        expect(count)
          .to.eq(4);

        done();
      });
  });
});
