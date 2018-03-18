require('../helpers/setup');

describe('api-exec ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['browser.eval'] =
    '<div id="eval"><ul><li>line 1</li><li>line 2</li></ul></div>';
  it('browser.eval', function() {
    /* jshint evil: true */
    return browser
      .eval('1+2').should.become(3)
      .eval('document.title').should.eventually.include("WD Tests")
      .eval('$("#eval").length').should.become(1)
      .eval('$("#eval li").length').should.become(2);
  });

  partials['browser.safeEval'] =
    '<div id="eval"><ul><li>line 1</li><li>line 2</li></ul></div>';
  it('browser.safeEval', function() {
    /* jshint evil: true */
    return browser
      .safeEval('1+2').should.become(3)
      .safeEval('document.title').should.eventually.include("WD Tests")
      .safeEval('$("#eval").length').should.become(1)
      .safeEval('$("#eval li").length').should.become(2)
      .then(function() {
        return browser
          .safeEval('invalid-code> here').should.be.rejectedWith(/status: 13/);
      });
  });

  it('browser.execute', function() {
    /* jshint evil: true */
    var jsScript = prepareJs(
      'var a = arguments[0], b = arguments[1];\n' +
      'window.wd_sync_execute_test = \'It worked! \' + (a+b)'
    );

    return browser
      // without args
      .execute('window.wd_sync_execute_test = "It worked!"')
      .eval('window.wd_sync_execute_test').should.become('It worked!')
      // with args
      .execute(jsScript, [6, 4])
      .eval('window.wd_sync_execute_test').should.become('It worked! 10');
  });

  partials['browser.execute - el arg'] =
    '<div id="theDiv">It worked!</div>';
  it('browser.execute - el arg', function() {
    var jsScript = prepareJs(
      'var el = arguments[0];\n' +
      'return $(el).text();\n'
    );
    return browser
      .elementByCss('#theDiv').then(function(el) {
        return browser
          .execute(jsScript, [el])
          .should.become('It worked!');
      });
  });

  partials['browser.execute - els arg'] =
    '<div id="theDiv">\n' +
    '  <div class="line">line 1</div>\n' +
    '  <div class="line">line 2</div>\n' +
    '  <div class="line">line 3</div>\n' +
    '</div>\n';
  it('browser.execute - els arg', skip('ios'), function() {
    var jsScript = prepareJs(
      'var els = arguments[0];\n' +
      'return $(els[1]).text();\n'
    );
    return browser
      .sleep(500)
      .elementsByCss('#theDiv .line').then(function(els) {
        return browser
          .execute(jsScript, [els])
          .should.become('line 2');
      });
  });

  partials['browser.execute - el return'] =
    '<div id="theDiv"></div>';
  it('browser.execute - el return', function() {
    var jsScript = prepareJs(
      'return $("#theDiv").get()[0];\n'
    );
    return browser
      .elementByCss('#theDiv').then(function() {
        return browser
          .execute(jsScript)
          .getTagName().should.eventually.match(/^div$/i);
      });
  });

  partials['browser.execute - els return'] =
    '<div id="theDiv">\n' +
    '  <div class="line">line 1</div>\n' +
    '  <div class="line">line 2</div>\n' +
    '  <div class="line">line 3</div>\n' +
    '</div>\n';
  it('browser.execute - els return', function() {
    var jsScript = prepareJs(
      'return $("#theDiv .line").get();\n'
    );
    return browser
      .sleep(500)
      .execute(jsScript)
      .then(function(els) {
        return els[1].text().should.become('line 2');
      });
  });

  it('browser.safeExecute - noargs', function() {
    /* jshint evil: true */
    return browser
      .safeExecute('window.wd_sync_execute_test = "It worked!"')
      .eval('window.wd_sync_execute_test').should.become('It worked!')
      .then(function() {
        return browser
          .safeExecute('invalid-code> here').should.be.rejectedWith(/status: 13/);
      });
  });

  it('browser.safeExecute - args', skip('android'), function() {
    /* jshint evil: true */
    var jsScript = prepareJs(
      'var a = arguments[0], b = arguments[1];\n' +
      'window.wd_sync_execute_test = \'It worked! \' + (a+b)'
    );
    return browser
      .safeExecute(jsScript, [6, 4])
      .eval('window.wd_sync_execute_test').should.become('It worked! 10')
      .then(function() {
        return browser
          .safeExecute('invalid-code> here', [6, 4]).should.be.rejectedWith(/status: 13/);
      });
  });

  it('browser.executeAsync', skip('ios', 'android'), function() {
    var jsScript = prepareJs(
      'var args = Array.prototype.slice.call( arguments, 0 );\n' +
      'var done = args[args.length -1];\n' +
      'done("OK");'
    );
    var jsScriptWithArgs = prepareJs(
      'var args = Array.prototype.slice.call( arguments, 0 );\n' +
      'var done = args[args.length -1];\n' +
      'done("OK " + (args[0] + args[1]));'
    );
    return browser
      .executeAsync(jsScript).should.become('OK')
      .executeAsync(jsScriptWithArgs, [10, 5]).should.become('OK 15');
  });

  it('browser.safeExecuteAsync', skip('ios', 'android'), function() {
    var jsScript = prepareJs(
      'var args = Array.prototype.slice.call( arguments, 0 );\n' +
      'var done = args[args.length -1];\n' +
      'done("OK");'
    );
    var jsScriptWithArgs = prepareJs(
      'var args = Array.prototype.slice.call( arguments, 0 );\n' +
      'var done = args[args.length -1];\n' +
      'done("OK " + (args[0] + args[1]));'
    );
      return browser
        .safeExecuteAsync(jsScript).should.become('OK')
        .then(function() {
          return browser.safeExecuteAsync('123 invalid<script')
            .should.be.rejectedWith(/status: (13|17)/);
      })
        .safeExecuteAsync(jsScriptWithArgs, [10, 5]).should.become('OK 15')
        .then(function() {
          return browser.safeExecuteAsync('123 invalid<script', [10, 5])
            .should.be.rejectedWith(/status: (13|17)/);
      });
  });

  it('browser.setAsyncScriptTimeout', skip('ios', 'android'), function() {
    var jsScript = prepareJs(
      'var args = Array.prototype.slice.call( arguments, 0 );\n' +
      'var done = args[args.length -1];\n' +
      'setTimeout(function() {\n' +
        'done("OK");\n' +
      '}, arguments[0]);'
    );
    return browser
      .setAsyncScriptTimeout( env.BASE_TIME_UNIT/2 )
      .executeAsync( jsScript, [env.BASE_TIME_UNIT]).should.be.rejectedWith(/status\: 28/)
      .setAsyncScriptTimeout( 2* env.BASE_TIME_UNIT )
      .executeAsync( jsScript, [env.BASE_TIME_UNIT])
      .setAsyncScriptTimeout(0);
  });


  partials['browser.waitForCondition'] =
    '<div id="theDiv"></div>\n';
  it('browser.waitForCondition', skip('ios', 'android'), function() {
    var exprCond = "$('#theDiv .child').length > 0";
    return browser
      .executeAsync( prepareJs(
        'var args = Array.prototype.slice.call( arguments, 0 );\n' +
        'var done = args[args.length -1];\n' +
        ' setTimeout(function() {\n' +
        ' $("#theDiv").html("<div class=\\"child\\">a waitForCondition child</div>");\n' +
        ' }, arguments[0]);\n' +
        'done();\n'),
        [env.BASE_TIME_UNIT]
      )
      .elementByCss("#theDiv .child").should.be.rejectedWith(/status: 7/)
      .waitForCondition(exprCond, 2 * env.BASE_TIME_UNIT, 200).should.eventually.be.ok
      .waitForCondition(exprCond, 2 * env.BASE_TIME_UNIT).should.eventually.be.ok
      .waitForCondition(exprCond).should.eventually.be.ok
      .then(function() {
        return browser.waitForCondition('$wrong expr!!!').should.be.rejectedWith(/status: 13/);
      });
  });

  partials['browser.waitForConditionInBrowser'] =
    '<div id="theDiv"></div>\n';
  it('browser.waitForConditionInBrowser', skip('ios', 'android'), function() {
    var exprCond = "$('#theDiv .child').length > 0";
    return browser
      .executeAsync( prepareJs(
        'var args = Array.prototype.slice.call( arguments, 0 );\n' +
        'var done = args[args.length -1];\n' +
        ' setTimeout(function() {\n' +
        ' $("#theDiv").html("<div class=\\"child\\">a waitForCondition child</div>");\n' +
        ' }, arguments[0]);\n' +
        'done();\n'),
        [env.BASE_TIME_UNIT]
      )
      .elementByCss("#theDiv .child").should.be.rejectedWith(/status: 7/)
      .setAsyncScriptTimeout(5 * env.BASE_TIME_UNIT)
      .waitForConditionInBrowser(exprCond, 2 * env.BASE_TIME_UNIT, 0.2 * env.BASE_TIME_UNIT)
        .should.eventually.be.ok
      .waitForConditionInBrowser(exprCond, 2 * env.BASE_TIME_UNIT)
        .should.eventually.be.ok
      .waitForConditionInBrowser(exprCond).should.eventually.be.ok
      .then(function() {
        return browser.waitForConditionInBrowser("totally #} wrong == expr")
          .should.be.rejectedWith(/status: (13|17)/);
      })
      .setAsyncScriptTimeout(0);
  });

});
