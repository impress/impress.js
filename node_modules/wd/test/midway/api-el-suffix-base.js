// spliting the test cause it takes too long, list of possible suffixes below
// var suffixes =
//   ['ByClassName', 'ByCssSelector', 'ById', 'ByName', 'ByLinkText',
//   'ByPartialLinkText', 'ByTagName', 'ByXPath', 'ByCss'];

require('../helpers/setup');

exports.test = function function_name (suffix, extraDesc, suffixPartials, criterias) {

  describe('api-el-' + extraDesc + ' ' + env.ENV_DESC, function() {
    var partials = {};

    var browser;
    require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

    var elementFuncName = 'element' + suffix;
    partials['browser.' + elementFuncName]  = suffixPartials.one;
    it('browser.' + elementFuncName, function() {
      return Q.all([
        browser[elementFuncName](criterias.valid).should.eventually.exist,
        browser[elementFuncName](criterias.invalid).should.be.rejectedWith(/status: 7/)
      ]);
    });

    var elementFuncNameOrNull = 'element' + suffix + 'OrNull';
    partials['browser.' + elementFuncNameOrNull]  = suffixPartials.one;
    it('browser.' + elementFuncNameOrNull, function() {
      return browser
        [elementFuncNameOrNull](criterias.valid).should.eventually.exist
        [elementFuncNameOrNull](criterias.invalid).should.eventually.be.a('null');
    });

    var elementFuncNameIfExists = 'element' + suffix + 'IfExists';
    partials['browser.' + elementFuncNameIfExists]  = suffixPartials.one;
    it('browser.' + elementFuncNameIfExists, function() {
      return browser
        [elementFuncNameIfExists](criterias.valid).should.eventually.exist
        [elementFuncNameIfExists](criterias.invalid).should.eventually.be.a('undefined');
    });

    var hasElementFuncName = 'hasElement' + suffix;
    partials['browser.' + hasElementFuncName]  = suffixPartials.one;
    it('browser.' + hasElementFuncName, function() {
      return browser
        [hasElementFuncName](criterias.valid).should.eventually.be.ok
        [hasElementFuncName](criterias.invalid).should.eventually.not.be.ok;
    });

    var waitForElementFuncName = 'waitForElement' + suffix;
    partials['browser.' + waitForElementFuncName]  = '<div id="theDiv"></div>';
    it('browser.' + waitForElementFuncName, function() {
      return browser
        .executeAsync(
          'var args = Array.prototype.slice.call( arguments, 0 );\n' +
          'var done = args[args.length -1];\n' +
          'setTimeout(function() {\n' +
          ' $("#theDiv").append(args[0]);\n' +
          '}, args[1]);\n' +
          'done();\n',
          [suffixPartials.child, env.BASE_TIME_UNIT]
        )[waitForElementFuncName](criterias.child, 2 * env.BASE_TIME_UNIT, env.BASE_TIME_UNIT)
        .should.be.fulfilled
        .then(function() {
          return browser
            [waitForElementFuncName]("__wrongsel", 0.1 * env.BASE_TIME_UNIT)
              .should.be.rejectedWith('Element condition wasn\'t satisfied!');
        });
    });

    var waitForVisibleFuncName = 'waitForVisible' + suffix;
    partials['browser.' + waitForVisibleFuncName]  = '<div id="theDiv"></div>';
    it('browser.' + waitForVisibleFuncName, function() {
      return browser
        .executeAsync(
          'var args = Array.prototype.slice.call( arguments, 0 );\n' +
          'var done = args[args.length -1];\n' +
          '$("#theDiv").append(args[0]);\n' +
          '$("#theDiv .child").hide();\n' +
          'setTimeout(function() {\n' +
          ' $("#theDiv .child").show();\n' +
          '}, args[1]);\n' +
          'done();\n',
          [suffixPartials.child, env.BASE_TIME_UNIT]
        )
        [elementFuncName](criterias.child).should.eventually.exist
        [waitForVisibleFuncName](criterias.child, 2 * env.BASE_TIME_UNIT)
        .should.be.fulfilled
        .then(function() {
          return browser
            [waitForVisibleFuncName]("__wrongsel", 0.1 * env.BASE_TIME_UNIT)
              .should.be.rejectedWith(/Element didn\'t become visible/);
        });
    });

    var elementsFuncName = 'elements' + suffix;
    partials['browser.' + elementsFuncName]  = suffixPartials.several;
    it('browser.' + elementsFuncName, function() {
      return browser
        [elementsFuncName](criterias.valid).then(function(res) {
          if (elementsFuncName.match(/ById/)) {
            res.should.have.length(1);
          } else if (elementsFuncName.match(/ByTagName/)) {
            (res.length > 1).should.be.true;
          } else {
            res.should.have.length(3);
          }
        })
        [elementsFuncName](criterias.invalid)
          .should.eventually.deep.equal([]);
    });

  });
};

