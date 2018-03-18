# karma-chrome-launcher

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-chrome-launcher)
 [![npm version](https://img.shields.io/npm/v/karma-chrome-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-chrome-launcher) [![npm downloads](https://img.shields.io/npm/dm/karma-chrome-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-chrome-launcher)

[![Build Status](https://img.shields.io/travis/karma-runner/karma-chrome-launcher/master.svg?style=flat-square)](https://travis-ci.org/karma-runner/karma-chrome-launcher) [![Dependency Status](https://img.shields.io/david/karma-runner/karma-chrome-launcher.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-chrome-launcher) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-chrome-launcher.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-chrome-launcher#info=devDependencies)

> Launcher for Google Chrome, Google Chrome Canary and Google Chromium.

## Installation

The easiest way is to keep `karma-chrome-launcher` as a devDependency in your `package.json`,
by running

```bash
$ npm install karma-chrome-launcher --save-dev
```

## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['Chrome', 'Chrome_without_security'], // You may use 'ChromeCanary', 'Chromium' or any other supported browser

    // you can define custom flags
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    }
  })
}
```

The `--user-data-dir` is set to a temporary directory but can be overridden on a custom launcher as shown below.
One reason to do this is to have a permanent Chrome user data directory inside the project directory to be able to
install plugins there (e.g. JetBrains IDE Support plugin).

```js
customLaunchers: {
  Chrome_with_debugging: {
    base: 'Chrome',
    chromeDataDir: path.resolve(__dirname, '.chrome')
  }
}
```

You can pass list of browsers as a CLI argument too:

```bash
$ karma start --browsers Chrome,Chrome_without_security
```

### Available browsers

- Chrome
- ChromeCanary
- Chromium
- ChromeHeadless (only on Chrome >= 59)
- ChromeCanaryHeadless (only on Chrome >= 59)
- Dartium

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
