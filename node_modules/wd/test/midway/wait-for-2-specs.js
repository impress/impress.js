require('../helpers/setup');

describe('wait-for-2 ' + env.ENV_DESC, function() {
  var Asserter = wd.Asserter;
  var asserters = wd.asserters;
  var page = '<div id="theDiv"></div>';

  var removeChildren =
    '$("#theDiv").empty();\n';

  // util function used tag chai assertion errors
  var tagChaiAssertionError = function(err) {
    // throw error and tag as retriable to poll again
    err.retriable = err instanceof AssertionError;
    throw err;
  };


  var elAsserter = new Asserter(
    function(el, cb) {
      el.text(function(err, text) {
        if(err) { return cb(err); }
          cb( null, text && text.length >0);
      });
    }
  );

  var elsAsserter = new Asserter(
    function(el, cb) {
      el.text(function(err, text) {
        if(err) { return cb(err); }
          cb( null, text && text.indexOf('OK') >= 0 );
      });
    }
  );

  var promisedElsAsserter = new Asserter(
    function(el) {
      return el
        .text().should.eventually.include('OK')
        .catch(tagChaiAssertionError);
    }
  );

  var elAsserterFalse = new Asserter(
    function(el, cb) {
      cb( null, false);
    }
  );

  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['browser.waitForElement - asserter - matching element not the first element'] = page;
  it('browser.waitForElement - asserter - matching element not the first element', function() {
      var appendChild =
        'setTimeout(function() {\n' +
        ' $("#theDiv").append(' + 
            '"<div class=\\"child\\" style=\\"display:none;\\">a waitFor child 1</div>' + 
            '<div class=\\"child\\">a waitFor child 2</div>");\n' +
        '}, arguments[0]);\n';
    return browser
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .elementByCss("#theDiv .child").should.be.rejectedWith(/status: 7/)
      .waitForElement("css selector", "#theDiv .child", asserters.isDisplayed, 2 * env.BASE_TIME_UNIT, 100)
      .text().should.become('a waitFor child 2');
  });

  partials['browser.waitForElements'] = page;
  it('browser.waitForElements', function() {
    var childs =   
      '<div class="child">child 1</div>' +
      '<div class="child">child 2</div>' +
      '<div class="child">child 3</div>' +
      '<div class="child">child 4</div>';
    var appendChild =
      'setTimeout(function() {\n' +
      ' $("#theDiv").append("' + childs.replace(/\"/g, '\\"' ) + '");\n' +
      '}, arguments[0]);\n';

    return browser
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .elementByCss("#theDiv .child").should.be.rejectedWith(/status: 7/)
      .waitForElements("css selector", "#theDiv .child", 2 * env.BASE_TIME_UNIT, 100)
      .should.eventually.have.length(4)
      .waitForElements("css selector", "#theDiv .child", 2 * env.BASE_TIME_UNIT)
      .should.eventually.have.length(4)
      .waitForElements("css selector", "#theDiv .child")
      .should.eventually.have.length(4)
      .execute( removeChildren )
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .waitForElements("css selector", "#theDiv .child", {
        timeout: 2 * env.BASE_TIME_UNIT, pollFreq: 100 })
      .should.eventually.have.length(4);
  });

  partials['browser.waitForElements - asserter'] = page;
  it('browser.waitForElements - asserter', function() {
    var childs =   
      '<div class="child">child 1</div>' +
      '<div class="child">child 2 OK</div>' +
      '<div class="child">child 3</div>' +
      '<div class="child">child 4 OK</div>';
    var appendChild =
      'setTimeout(function() {\n' +
      ' $("#theDiv").append("' + childs.replace(/\"/g, '\\"' ) + '");\n' +
      '}, arguments[0]);\n';

    return browser
      .execute( removeChildren )
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .waitForElements("css selector", "#theDiv .child", elsAsserter, 2 * env.BASE_TIME_UNIT, 200)
      .should.eventually.have.length(2)
      .waitForElements("css selector", "#theDiv .child", elsAsserter, 2 * env.BASE_TIME_UNIT)
      .should.eventually.have.length(2)
      .waitForElements("css selector", "#theDiv .child", elsAsserter)
      .should.eventually.have.length(2)
      .execute( removeChildren )
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .waitForElements("css selector", "#theDiv .child", { asserter: elsAsserter,
        timeout: 2 * env.BASE_TIME_UNIT, pollFreq: 200 })
      .should.eventually.have.length(2)
      .execute( removeChildren )
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .waitForElements("css selector", "#theDiv .child", promisedElsAsserter,
         2 * env.BASE_TIME_UNIT, 200)
      .should.eventually.have.length(2);
  });

  partials['browser.waitForElements - rejected'] = page;
  it('browser.waitForElements - rejected', function() {
    return browser.chain()
      .then(function() {
        return browser
          .waitForElements("css selector", "#theDiv .child", elAsserterFalse,
            0.1 * env.BASE_TIME_UNIT, 200)
          .should.be.rejectedWith(/Element condition wasn't satisfied/);
      })

      .then(function() {
        return browser
          .waitForElements("css selector", "#theDiv .child", { asserter: elAsserterFalse,
            timeout: 0.1 * env.BASE_TIME_UNIT, pollFreq: 200 })
          .should.be.rejectedWith(/Element condition wasn't satisfied/);
      })

      .then(function() {
        return browser
          .waitForElements("css selector", "#wrongsel .child", 0.1 * env.BASE_TIME_UNIT)
          .should.be.rejectedWith(/Element condition wasn't satisfied/);
      });
  });

  partials['browser.waitForElementsByCss'] = page;
  it('browser.waitForElementsByCss', function() {
    var childs =   
      '<div class="child">child 1</div>' +
      '<div class="child">child 2</div>' +
      '<div class="child">child 3</div>' +
      '<div class="child">child 4</div>';
    var appendChild =
      'setTimeout(function() {\n' +
      ' $("#theDiv").append("' + childs.replace(/\"/g, '\\"' ) + '");\n' +
      '}, arguments[0]);\n';
    return browser

      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .elementByCss("#theDiv .child").should.be.rejectedWith(/status: 7/)
      .waitForElementsByCss("#theDiv .child", 2 * env.BASE_TIME_UNIT, 200)
      .should.eventually.have.length(4)

      .execute( removeChildren )
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .waitForElementsByCss("#theDiv .child", elAsserter, 2 * env.BASE_TIME_UNIT, 200)
      .should.eventually.have.length(4)

      .execute( removeChildren )
      .execute( appendChild, [env.BASE_TIME_UNIT] )
      .waitForElementsByCss("#theDiv .child", { asserter: elAsserter,
        timeout: 2 * env.BASE_TIME_UNIT, pollFreq: 200 })
      .should.eventually.have.length(4);
  });

});
