
# Changelog

### 3.0.3

* Provide `dist` in npm package [#402](https://github.com/epeli/underscore.string/pull/402)
* [Full changelog](https://github.com/epeli/underscore.string/compare/3.0.2...3.0.3)

### 3.0.2

* Fix .gitignore for bower [#400](https://github.com/epeli/underscore.string/issues/400)
* Some docs cleanup
* [Full changelog](https://github.com/epeli/underscore.string/compare/3.0.1...3.0.2)

### 3.0.1

* Minor fixes in the documentation [#390](https://github.com/epeli/underscore.string/pull/390) and [5135cb9](https://github.com/epeli/underscore.string/commit/5135cb9026034e9ea206c2ed8588db1eeb3ce95a)
* Fix bower warnings [#393](https://github.com/epeli/underscore.string/pull/393)
* `humanize` now uses `trim` [#392](https://github.com/epeli/underscore.string/pull/392)
* [Full changelog](https://github.com/epeli/underscore.string/compare/3.0.0...3.0.1)

### 3.0.0

* Each function is now extracted to individual CommonJS modules
  * Browserify users can now load only the functions they actually use
* Usage as Underscore.js or Lo-Dash mixin is now discouraged as there is too many colliding methods
* The prebuild library now exports a `s` global instead of `_s` and trying to
  stick itself to existing underscore instances
* New gh-pages with documentation
* Implement chaining without Underscore.js
* String.prototype methods can be chained with underscore.string functions [#383](https://github.com/epeli/underscore.string/pull/383)
* Don't compare lowercase versions of strings in naturalCmp [#326](https://github.com/epeli/underscore.string/issues/326)
* Always return +-1 or 0 in naturalCmp [#324](https://github.com/epeli/underscore.string/pull/324)
* Align [starts|ends]With with the ES6 spec [#345](https://github.com/epeli/underscore.string/pull/345)
* New functions `decapitalize`, `pred`, `dedent` and `replaceAll`
* `slugify` now actually replaces all special chars with a dash
* `slugify` supports Easter E languages [#340](https://github.com/epeli/underscore.string/pull/340)
* `join` is now a conflicting function [#320](https://github.com/epeli/underscore.string/pull/320)
* New decapitalize flag for `camelize` [#370](https://github.com/epeli/underscore.string/pull/370)
* `toNumber` allows negative decimal precision [#332](https://github.com/epeli/underscore.string/pull/332)
* [Full changelog](https://github.com/epeli/underscore.string/compare/2.4.0...3.0.0)

## 2.4.0

* Move from rake to gulp
* Add support form classify camelcase strings
* Fix bower.json
* [Full changelog](https://github.com/epeli/underscore.string/compare/v2.3.3...2.4.0)

## 2.3.3

* Add `toBoolean`
* Add `unquote`
* Add quote char option to `quote`
* Support dash-separated words in `titleize`
* [Full changelog](https://github.com/epeli/underscore.string/compare/v2.3.2...2.3.3)

## 2.3.2

* Add `naturalCmp`
* Bug fix to `camelize`
* Add ă, ș, ț and ś to `slugify`
* Doc updates
* Add support for [component](http://component.io/)
* [Full changelog](https://github.com/epeli/underscore.string/compare/v2.3.1...v2.3.2)

## 2.3.1

* Bug fixes to `escapeHTML`, `classify`, `substr`
* Faster `count`
* Documentation fixes
* [Full changelog](https://github.com/epeli/underscore.string/compare/v2.3.0...v2.3.1)

## 2.3.0

* Added `numberformat` method
* Added `levenshtein` method (Levenshtein distance calculation)
* Added `swapCase` method
* Changed default behavior of `words` method
* Added `toSentenceSerial` method
* Added `surround` and `quote` methods

## 2.2.1

* Same as 2.2.0 (2.2.0rc on npm) to fix some npm drama

## 2.2.0

* Capitalize method behavior changed
* Various perfomance tweaks

## 2.1.1

* Fixed words method bug
* Added classify method

## 2.1.0

* AMD support
* Added toSentence method
* Added slugify method
* Lots of speed optimizations

## 2.0.0

* Added prune, humanize functions
* Added _.string (_.str) namespace for Underscore.string library
* Removed includes function

For upgrading to this version you need to mix in Underscore.string library to Underscore object:

```javascript
_.mixin(_.string.exports());
```

and all non-conflict Underscore.string functions will be available through Underscore object.
Also function `includes` has been removed, you should replace this function by `_.str.include`
or create alias `_.includes = _.str.include` and all your code will work fine.

## 1.1.6

* Fixed reverse and truncate
* Added isBlank, stripTags, inlude(alias for includes)
* Added uglifier compression

## 1.1.5

* Added strRight, strRightBack, strLeft, strLeftBack

## 1.1.4

* Added pad, lpad, rpad, lrpad methods and aliases center, ljust, rjust
* Integration with Underscore 1.1.6

## 1.1.3

* Added methods: underscored, camelize, dasherize
* Support newer version of npm

## 1.1.2

* Created functions: lines, chars, words functions

## 1.0.2

* Created integration test suite with underscore.js 1.1.4 (now it's absolutely compatible)
* Removed 'reverse' function, because this function override underscore.js 'reverse'
