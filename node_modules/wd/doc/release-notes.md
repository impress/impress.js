# Release Notes

## 0.3.x Release

### 0.3.12
  - geolocation fix
  - package update
  - lodash upgrade
  - doc fixes

### 0.3.11
  - http retry on EPIPE

### 0.3.10
  - package upgrade
  - wd-no-defaults cap

### 0.3.9
  - package upgrade

### 0.3.8
  - added unlockDevice method
  - chainable tap

### 0.3.7

  - added getSettings and updateSettings methods

### 0.3.6

  - added startActivity method

### 0.3.5

  - mjson element.setText method

### 0.3.4

  - error fix
  - http timeout fix 

### 0.3.3

  - new IME mjson methods.

### 0.3.2

  - hideKeyboard method update.

### 0.3.1

  - new pullFolder method.
  - Appium detection fix.

### 0.3.0

  - TouchAction/MultiAction update now works like the [W3 specs](https://dvcs.w3.org/hg/webdriver/raw-file/default/webdriver-spec.html#multiactions-1). 
  See the following sample: 

```js
TouchAction a1 = (new wd.TouchAction(driver)).press({el: el}).release();
a1.perform();
TouchAction a2 = (new wd.TouchAction()).press({el: el}).release();
TouchAction a3 = (new wd.TouchAction()).tap({el: el, x50, y: 50}).wait({ms: 10000});
MultiAction ma = (new wd.MultiAction(driver)).add(a2, a2);
ma.perform();
```

## 0.2.x Release

### 0.2.27
  - http proxy fix.

### 0.2.26
  - openNotifications + getAppStrings fix.

### 0.2.25
  - getNetworkConnection fix.

### 0.2.24
  - add custom methods to element prototypes.

### 0.2.23
  - appium/selendroid network connection methods.

### 0.2.22
  - packages upgrade
  - http proxy options
  - configurable default chaining scope

### 0.2.21
  - better sauce job update logic 

### 0.2.20
  - configurable sauce rest root

### 0.2.19
  - packages upgrade

### 0.2.18
  - bugfixes: getAppString + element unique arguments
  - extra Appium method

### 0.2.17
  - bugfix: TouchAction.moveTo
  - stricter jshint

### 0.2.16
  - more mjson/appium methods
  - command argument bugfix

### 0.2.15
  - extra mobile/appium method
  - command arguments bugfix 

### 0.2.14 
  - no defaults for appium
  - better mobile examples

### 0.2.13
  - waitForElement fix
  - added waitForElements method
  - auth fix
  - new context methods

### 0.2.12
  - minor bugfix

### 0.2.11
  - better logging
  - better error handling

### 0.2.10
  - packages upgrade to latest.

### 0.2.9
  - http emit fix.
  - added print method
  - added at, nth, first, second, third, last to promise api

### 0.2.8
  - added nodeify to transferPromiseness.


### 0.2.7
  - `attach`/`detach` session.
  - add `asyncRemote` and make `remote` generic.

### 0.2.6

  - bugfix: Removed the tmp dependencies.
  - isDisplayed/isNotDisplayed asserters
  - isVisible depreciation
  - bugfix: Removed the tmp dependencies.
  - bugfix: Value not defaulted when inititializing with `url.parse`.
  - bugfix: url relative now use `url.resolve`.

### 0.2.5

  - Webdriver and Element refactoring
  - Easier wd customization via `wd.setBaseClasses(Webdriver, Element)`

### 0.2.4

  - bugfix: android safeExecute.
  - bugfix: passing argument to execute.
  - bugfix: setOrientation.
  - migrating from string.js to underscore.string.

### 0.2.3

  - Http configuration enhancements + base url, see doc [here](https://github.com/admc/wd#http-configuration--base-url).
  - `waitFor`, `waitForElement` and asserters replacing existing wait methods.
  - `addPromiseChainMethod`/`addPromiseMethod`/`addAsyncMethod`/`removeMethod` replacing monkey patching
  (Please refer to the add method section in README).
  - Support for external promise libraries.
  - New saveScreenshot method.

### 0.2.2

- chai-as-promised v4 compatible.
- Promise wrappers can now be monkey patched directly.
- New saucelabs helpers.

Incompatibilities:

  - There is a new method to call, `wd.rewrap()`, to propagate async monkey patching to promise.
  (see [here](https://github.com/admc/wd/blob/master/examples/promise/monkey.patch-with-async.js#L35)
  and the monkey patch section in README) [Note: monkey patching and `rewrap` note recommended from 0.2.3].
  - The chai-as-promised setup has changed in v4, look out for the `transferPromiseness` (Requires chai-as-promised 4.1.0 or greater)
  line in the examples. (see [here](https://github.com/admc/wd/blob/master/examples/promise/chrome.js#L15)).

### 0.2.1

- New test suite using the promise chain api.
- `browser.Q` was moved to `wd.Q`.

### 0.2.0

- New wrapper: promise chain.
- Old chain api is deprecated (It is still available, but you will see a depreciation message).
- There are some changes in the way the element and webdriver classes are passed around
which may affect external wrappers. External wrappers should now subclass those 2 classes.


### TODO
  - write tests for sauceJobUpdate/sauceJobStatus
  - Modify doc generator to cope with commands.js
  - Integrate with node-saucelabs + make the sauce rest url configurable
  - Add wait for elements
  - Implement all the missing methods
  - Appium mobile methods
  - add a util with most commonly used desired config (selenium+appium)
  - jQuery addOn + asserters (including jquery visible/hidden) (todo)
  - better remote/init process
