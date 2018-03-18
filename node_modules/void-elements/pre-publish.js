var cheerio = require('cheerio')
  , http = require('http');

http.get('http://www.w3.org/html/wg/drafts/html/master/syntax.html', function (res) {
  var str = '';
  res.setEncoding('utf8');
  res.on('data', function (buf) {
    str += buf;
  }).on('end', function () {
    var $ = cheerio.load(str);
    var codes = $('dfn#void-elements')
                .parent()
                .next()
                .text()
                .replace(/\s/gm,'')
                .split(",")
                .reduce(function (obj, code) {
                  obj[code] = true;
                  return obj;
                }, {});

    console.log('/**');
    console.log(' * This file automatically generated from `pre-publish.js`.');
    console.log(' * Do not manually edit.');
    console.log(' */');
    console.log();
    console.log('module.exports = %s;', JSON.stringify(codes, null, 2));
  });
});
