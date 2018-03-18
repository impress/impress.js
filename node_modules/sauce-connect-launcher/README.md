# sauce-connect-launcher

[![Build Status](https://api.travis-ci.org/bermi/sauce-connect-launcher.svg)](http://travis-ci.org/bermi/sauce-connect-launcher)  [![Dependency Status](https://david-dm.org/bermi/sauce-connect-launcher.svg)](https://david-dm.org/bermi/sauce-connect-launcher) [![](http://img.shields.io/npm/v/sauce-connect-launcher.svg) ![](http://img.shields.io/npm/dm/sauce-connect-launcher.svg)](https://www.npmjs.org/package/sauce-connect-launcher)

A library to download and launch Sauce Connect.

## Installation

```sh
npm install sauce-connect-launcher
```

If you wish to also download Sauce Connect at this stage, rather than on first run, use the `SAUCE_CONNECT_DOWNLOAD_ON_INSTALL` environment variable.

```sh
SAUCE_CONNECT_DOWNLOAD_ON_INSTALL=true npm install
```

## Usage


### Simple Usage

```javascript
var sauceConnectLauncher = require('sauce-connect-launcher');

sauceConnectLauncher({
  username: 'bermi',
  accessKey: '12345678-1234-1234-1234-1234567890ab'
}, function (err, sauceConnectProcess) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Sauce Connect ready");

  sauceConnectProcess.close(function () {
    console.log("Closed Sauce Connect process");
  })
});
```

### Advanced Usage

```javascript

var sauceConnectLauncher = require('sauce-connect-launcher'),
  options = {

    // Sauce Labs username.  You can also pass this through the
    // SAUCE_USERNAME environment variable
    username: 'bermi',

    // Sauce Labs access key.  You can also pass this through the
    // SAUCE_ACCESS_KEY environment variable
    accessKey: '12345678-1234-1234-1234-1234567890ab',

    // Log output from the `sc` process to stdout?
    verbose: false,

    // Enable verbose debugging (optional)
    verboseDebugging: false,

    // Port on which Sauce Connect's Selenium relay will listen for
    // requests. Default 4445. (optional)
    port: null,

    // Proxy host and port that Sauce Connect should use to connect to
    // the Sauce Labs cloud. e.g. "localhost:1234" (optional)
    proxy: null,

    // Change sauce connect logfile location (optional)
    logfile: null,

    // Period to log statistics about HTTP traffic in seconds (optional)
    logStats: null,

    // Maximum size before which the logfile is rotated (optional)
    maxLogsize: null,

    // Set to true to perform checks to detect possible misconfiguration or problems (optional)
    doctor: null,

    // Identity the tunnel for concurrent tunnels (optional)
    tunnelIdentifier: null,

    // an array or comma-separated list of regexes whose matches
    // will not go through the tunnel. (optional)
    fastFailRexegps: null,

    // an array or comma-separated list of domains that will not go
    // through the tunnel. (optional)
    directDomains: null,

    // A function to optionally write sauce-connect-launcher log messages.
    // e.g. `console.log`.  (optional)
    logger: function (message) {},

    // an optional suffix to be appended to the `readyFile` name.
    // useful when running multiple tunnels on the same machine,
    // such as in a continuous integration environment. (optional)
    readyFileId: null
  };

sauceConnectLauncher(options, function (err, sauceConnectProcess) {
  console.log("Started Sauce Connect Process");
  sauceConnectProcess.close(function () {
    console.log("Closed Sauce Connect process");
  });
});

```

Additional Sauce Connect options not specified above can still be passed.  `additionalArg: "foo"` options will be converted to `--addtional-arg foo` args (camelCase to kebeb-case).  Arrays will be `join()`ed (like `directDomains`) and boolean options will be passed as flags. See [Sauce Connect's docs](https://docs.saucelabs.com/reference/sauce-connect/) for a full list of arguments.

### Credentials

You can pass the Sauce Labs credentials as `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables. (reccommended)

You can also create a user.json file in your current working directory with the username and key

user.json
```
{"username": "bermi", "accessKey": "12345678-1234-1234-1234-1234567890ab"}
```

### Sauce Connect Version

You can override the default Sauce Connect version with the `SAUCE_CONNECT_VERSION` environment variable.

```sh
$ SAUCE_CONNECT_VERSION=4.2 node myTestApp.js
```


## Development

Clone the repository and run

```
make setup
```

You will be prompted for Sauce Labs credentials (used for testing).  Run
```
make dev
```
to start the watcher.


## Testing

```
npm test
```

or

```
make test
```

## Changelog

### v0.13.0

- Sauce Connect version 4.3.11
- Bug-fix: Correctly catch api errors and log a message

### v0.12.0

- Sauce Connect version 4.3.10
- Updated dependencies

### v0.11.0

- Updating dependencies
- Catching connection errors (#54)

### v0.10.3
- Handle another error log output (#35)

### v0.10.2
- Bumping default Sauce Connect version to 4.3.7 (#51)

### v0.10.1
- Fixed file omitted by gitignore

### v0.10.0
- Refactored options handling to allow for future Sauce Connect options

### v0.9.3
- Disabling troublesome download on install unless the
  `SAUCE_CONNECT_DOWNLOAD_ON_INSTALL=true` env flag is used

### v0.9.2
- Handling errors reported as JSON (#43)

### v0.9.1
- Downloading on install only when installing globally or the
  `SAUCE_CONNECT_DOWNLOAD_ON_INSTALL=true` environment variable is set (#42)
  Either way, a failure on `npm postinstall` will not halt the installation
  as lazy installation can still be performed.

### v0.9.0
- Bumping default Sauce Connect version to 4.3.5

### v0.8.2
- Removing linux binaries published by mistake

### v0.8.1
- Changed prepublish script to postinstall(#38)

### v0.8.0
- Add readyFile suffix option (#39/#41)

### v0.7.1
- Changed install script to prepublish (#37/#38)

### v0.7.0
- Downloading sc during "npm install" (#36)
- Adding --verboseDebugging for passing the --verbose flag to sc (#33)

### v0.6.0
- Exposing more logging options (#32)

### v0.5.2
- Use Sauce Connect v4.3 by default (#31)

### v0.5.1
- Set execute bit after download (#29)

### v0.5.0
- Use Sauce Connect v4.2 by default
- Allow run-time overriding of Sauce Connect Version (#25)
- Always set and check execute permissions (#27)

### v0.4.2
- Obfuscate credentials in logger output (#23)

### v0.4.1
- Remove Mac binaries added by mistake

### v0.4.0
- Use Sauce Connect v4.1 with Heartbleed fixes (#22)

### v0.3.3
- Support node 0.8.x (#20)

### v0.3.2
- Properly execute permissions on Windows (#19)

### v0.3.1
- Set execute permissions after downloading (#17)

### v0.3.0
- Support Sauce Connect 4.0
- Use `os.tmpdir()` for readyfile


## License

(The MIT License)

Copyright (c) 2013 Bermi Ferrer &lt;bermi@bermilabs.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
