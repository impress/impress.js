# karma-qunit

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-qunit)
 [![npm version](https://img.shields.io/npm/v/karma-qunit.svg?style=flat-square)](https://www.npmjs.com/package/karma-qunit) [![npm downloads](https://img.shields.io/npm/dm/karma-qunit.svg?style=flat-square)](https://www.npmjs.com/package/karma-qunit)

[![Build Status](https://img.shields.io/travis/karma-runner/karma-qunit/master.svg?style=flat-square)](https://travis-ci.org/karma-runner/karma-qunit) [![Dependency Status](https://img.shields.io/david/karma-runner/karma-qunit.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-qunit) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-qunit.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-qunit#info=devDependencies)

> Adapter for the [QUnit](http://qunitjs.com/) testing framework.

## Installation

The easiest way is to keep `karma-qunit` as a devDependency in your `package.json` by running

```bash
$ npm install karma-qunit --save-dev
```

## Configuration

Add `qunit` in the `frameworks` array in your `karma.conf.js` file. Then, in the `plugins`
array, add `karma-qunit`.
The following code shows the default configuration:

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['qunit'],
    plugins: ['karma-qunit'],
    files: [
      '*.js'
    ]
  })
}
```

You can also pass options for `QUnit.config` (documented [here](https://api.qunitjs.com/QUnit.config/)) as such:

```js
/// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['qunit'],
    plugins: ['karma-qunit'],
    files: [
      '*.js'
    ],

    // client configuration
    client: {
      qunit: {
        testTimeout: 5000
      }
    }
  })
}
```

----

For more information on Karma see the [homepage]. If you're using `karma-qunit` to test Ember.js, you might find Karma's [Ember guide](http://karma-runner.github.io/0.12/plus/emberjs.html) helpful.

[homepage]: http://karma-runner.github.com
