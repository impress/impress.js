/* eslint-env mocha */

var expect = require('chai').expect
var sinon = require('sinon')

var launcher = require('../index')

describe('isJSFlags()', function () {
  var isJSFlags = launcher.test.isJSFlags

  it('should return true if flag begins with --js-flags=', function () {
    expect(isJSFlags('--js-flags=--expose-gc')).to.be.eql(true)
    expect(isJSFlags('--js-flags="--expose-gc"')).to.be.eql(true)
    expect(isJSFlags("--js-flags='--expose-gc'")).to.be.eql(true)
  })

  it('should return false if flag does not begin with --js-flags=', function () {
    expect(isJSFlags(' --js-flags=--expose-gc')).to.be.eql(false)
    expect(isJSFlags('--js-flags"--expose-gc"')).to.be.eql(false)
    expect(isJSFlags('--jsflags="--expose-gc"')).to.be.eql(false)
  })
})

describe('sanitizeJSFlags()', function () {
  var sanitizeJSFlags = launcher.test.sanitizeJSFlags

  it('should do nothing if flags are not contained in quotes', function () {
    expect(sanitizeJSFlags('--js-flags=--expose-gc')).to.be.eql('--js-flags=--expose-gc')
  })

  it('should symmetrically remove single or double quote if wraps all flags', function () {
    expect(sanitizeJSFlags("--js-flags='--expose-gc'")).to.be.eql('--js-flags=--expose-gc')
    expect(sanitizeJSFlags('--js-flags="--expose-gc"')).to.be.eql('--js-flags=--expose-gc')
  })

  it('should NOT remove anything if the flags are not contained within quote', function () {
    expect(sanitizeJSFlags('--js-flags=--expose-gc="true"')).to.be.eql('--js-flags=--expose-gc="true"')
    expect(sanitizeJSFlags("--js-flags=--expose-gc='true'")).to.be.eql("--js-flags=--expose-gc='true'")
  })
})

describe('canaryGetOptions', function () {
  var canaryGetOptions = launcher.test.canaryGetOptions

  it('should return a merged version of --js-flags', function () {
    var parent = sinon.stub().returns(['-incognito'])
    var context = {}
    var url = 'http://localhost:9876'
    var args = {flags: ['--js-flags="--expose-gc"']}
    expect(canaryGetOptions.call(context, url, args, parent)).to.be.eql([
      '-incognito',
      '--js-flags=--expose-gc --nocrankshaft --noopt'
    ])
  })
})

describe('headlessGetOptions', function () {
  var headlessGetOptions = launcher.test.headlessGetOptions

  it('should return the headless flags', function () {
    var parent = sinon.stub().returns(['-incognito'])
    var context = {}
    var url = 'http://localhost:9876'
    var args = {}
    expect(headlessGetOptions.call(context, url, args, parent)).to.be.eql([
      '-incognito',
      '--headless',
      '--disable-gpu',
      '--remote-debugging-port=9222'
    ])
  })
})
