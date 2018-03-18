/*global _:true, Q:true */ 
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    _ = require('./lodash'),
    Q = require('Q');

var sauceUsername = process.env.SAUCE_USERNAME;
var sauceAccessKey = process.env.SAUCE_ACCESS_KEY;

function runSpecs(dir, mochaConfig) {
  mochaConfig = mochaConfig || [];
  return Q.nfcall(function(done) {
    var mocha = new Mocha();
    fs.readdirSync(dir).filter(function(file){
      return file.match(/-specs\.js/);
    }).forEach(function(file){
      mocha.addFile( path.join(dir, file));
    });
    mocha.timeout(60000);
    mocha.ui('bdd');
    mocha.bail(false);
    mocha.reporter('dot');
    _(mochaConfig).each(function(opt) {
      var optName = opt.shift();
      mocha[optName].apply(mocha, opt);
    }).value();
    mocha.run(function(err) {
      // Need to cleanup require cache otherwise the test won't run twice
      // and there may be some weird side effects cause with have some global
      // state in our test setup helpers.
      // see https://github.com/visionmedia/mocha/issues/736
      _(require.cache)
        .keys()
        .filter(function(key) {
          return  key.match(/test\/helper/) ||
                  key.match(/test\/unit/) ||
                  key.match(/test\/e2e/) ||
                  key.match(/test\/midway/);
        })
        .each(function(key) {
          delete require.cache[path.resolve(key)];
        }).value();
      done(err);
    });
  });
}

var sequence = [
  function() {
    console.log('running unit tests');
    delete process.env.SAUCE_USERNAME;
    delete process.env.SAUCE_ACCESS_KEY;
    return runSpecs('test/specs');
  },
  function() {
    console.log('running midway tests(chrome)');
    process.env.SAUCE_USERNAME = sauceUsername;
    process.env.SAUCE_ACCESS_KEY = sauceAccessKey;
    process.env.BROWSER='chrome';
    return runSpecs('test/midway', [['grep',/@skip-chrome|@multi/],['invert']]);
  },
  function() {
    console.log('running midway tests(firefox)');
    process.env.BROWSER='firefox';
    return runSpecs('test/midway', [['grep',/@skip-firefox|@multi/],['invert']]);
  },
  function() {
    console.log('running midway tests(multi)');
    process.env.BROWSER='chrome';
    return runSpecs('test/midway', [['grep',/@multi/]]);
  },
  function() {
    console.log('running e2e tests(chrome)');
    process.env.BROWSER='chrome';
    return runSpecs('test/e2e', [['grep',/@skip-chrome/],['invert']]);
  },
 function() {
    console.log('running e2e tests(firefox)');
    process.env.BROWSER='firefox';
    return runSpecs('test/e2e', [['grep',/@skip-firefox/],['invert']]);
  },
  function() {
    console.log('running sauce e2e tests(chrome)');
    process.env.SAUCE=1;
    process.env.BROWSER='chrome';
    return runSpecs('test/e2e', [['grep',/@skip-chrome/],['invert']]);
  },
 function() {
    console.log('running sauce e2e tests(firefox)');
    process.env.BROWSER='firefox';
    return runSpecs('test/e2e', [['grep',/@skip-firefox/],['invert']]);
  }
];

return sequence.reduce(Q.when, new Q());
