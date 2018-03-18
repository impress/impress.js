var express = require('express');
var http = require('http');

function Express(rootDir, partials) {
  this.rootDir = rootDir;
  this.partials = partials;
}

Express.prototype.start = function(done) {
  var _this = this;
  this.app = express();
  this.app.use(function(req, res, next) {
    next();
  });
  this.app.set('view engine', 'hbs');
  this.app.set('views', this.rootDir + '/views');

  this.app.get('/test-page', function(req, res) {
    var content = '';
    if(req.query.p){
      content = _this.partials[req.query.p];
    }
    res.render('test-page', {
      testSuite: req.query.ts? req.query.ts.replace(/\@[\w\-]+/g,'') : '',
      testTitle: (req.query.c? req.query.c + ' - ': '') + req.query.p,
      content: content,
      uuid: req.query.uuid
    });
  });

  this.app.use(express["static"](this.rootDir + '/public'));
  this.server = http.createServer(this.app);
  console.log('server listening on', env.EXPRESS_PORT);
  this.server.listen(env.EXPRESS_PORT, done);
};

Express.prototype.stop = function(done) {
  this.server.close(done);
};

module.exports = {
  Express: Express
};
