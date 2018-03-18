//
// Example demonstrating element function chaining.
// Please refer to the 'Element function chaining' section in README.
//

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var Q = wd.Q;

var browser = wd.promiseChainRemote();

// optional extra logging
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(eventType, command, response) {
  console.log(' > ' + eventType.cyan, command, (response || '').grey);
});
browser.on('http', function(meth, path, data) {
  console.log(' > ' + meth.magenta, path, (data || '').grey);
});

browser
  .init({browserName: 'chrome'})
  .get('http://angularjs.org/')


  // element method chaining
  .elementById('the-basics')
  .click()    // The 'click' call returns nothing,
  .click()    // So we can call it many times without loosing the element scope
  .click()    // ...
  .text()     // The element scope is preserved and this 'text' call works.
  .should.become('The Basics')

  // caveat
  .elementById('the-basics')
  .text()     // The 'text' call returns a string, so the element context is lost.
  .text()     // This text call doesn't behave as expected.
  .should.not.become('The Basics') // The whole 'body' element was actually retrieved.

  // element methods are browser scoped by default
  .elementById('add-some-control')
  .elementById('the-basics') // this call is browser scoped
  .text().should.become('The Basics') // this works

  // retrieving a subelement
  .elementById('add-some-control')
  .elementById('>', 'the-basics') // This looks for an element in the current element scope
  .text().should.become('The Basics')
  .should.be.rejectedWith(/status: 7/) // no 'the-basics' subelement

  // getting out of the element scope
  .elementById('the-basics')
  .text('<') // text is now called in the browser scope
  .should.not.become('The Basics') // The whole 'body' element was actually retrieved.

  // sometimes it is easier to just retrieve the same element twice
  .elementById('the-basics').text().should.become('The Basics')
  .elementById('the-basics').text().should.eventually.include('The Basics')

  // resolve the text in a  then method
  .elementById('the-basics').text().then(function(text) {
    text.should.equal('The Basics');
    text.should.include('The Basics');
  })

  // using Q.all, probably overkill in this case
  // the 2 test are done in parallel
  // don't forget the 'return'
  .then(function() {
    var basicEl = browser.elementById('the-basics');
    return Q.all([
      basicEl.text().should.become('The Basics'),
      basicEl.text().should.eventually.include('The Basics')
    ]);
  })

  // using Q sequence
  // the 2 test are done in sequence
  // don't forget the 'return'(s)
  .then(function() {
    var basicEl = browser.elementById('the-basics');
    var sequence = [
      function() {return basicEl.text().should.become('The Basics');},
      function() {return basicEl.text().should.eventually.include('The Basics');}
    ];
    return sequence.reduce(Q.when, new Q()); // yes this is ugly
  })

  .fin(function() { return browser.quit(); })
  .done();
