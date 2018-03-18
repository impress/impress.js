## Version [2.11.0](https://github.com/jscs-dev/node-jscs/compare/v2.10.1...v2.11.0) (2016-03-01):

Spring release! Although we know that techinically spring only comes in middle of the March (you nerds), were coming to you a bit earlier!

Anyways, there are three new rules, a couple of changes for the `airbnb` preset and important fixes for [`disallowSpacesInsideTemplateStringPlaceholders`](https://jscs.info/rule/disallowSpacesInsideTemplateStringPlaceholders) and [`validateQuoteMarks`](https://jscs.info/rule/validateQuoteMarks) (for all you ES7 lovers).

### New Rules

### [`requireSpaceBeforeDestructuredValues`](https://jscs.info/rule/requireSpaceBeforeDestructuredValues) by Maks Sadowsky

Enforces colon spacing after destructuring assignment i.e. [`requireSpaceBeforeObjectValues`](http://jscs.info/rule/requireSpaceBeforeObjectValues) but for destructuring.

```js
// good
const { String: EmberString } = Ember;

// bad
const { String:EmberString } = Ember;
```

### [`disallowArrayDestructuringReturn`](https://jscs.info/rule/disallowArrayDestructuringReturn) by Maks Sadowsky

Enforces the [5:3 verse](https://github.com/airbnb/javascript#5.3) of airbnb code style, which prohibits use of array destructuring for thy `CallExpressions`.

```js
// God is on your side
const { left, right } = processInput(input);

// Devil is on your shoulder!
const [left, __, top] = processInput(input);
```

### [`requireNewlineBeforeSingleStatementsInIf`](https://jscs.info/rule/requireNewlineBeforeSingleStatementsInIf) by Brian Schemp

Enforces using newlines in your *parenthesesless* code.

```js

// Cool stairs brah
if (x)
   doX();
else
   doY();

// Just how could you have "X" and "Y"'s on the same line?!
if (x) doX();
else doY();
```

### Presets
* Preset: ease up on `requireCamelCaseOrUpperCaseIdentifiers` in airbnb (Oleg Gaidarenko)
* Preset: add `disallowArrayDestructuringReturn` to airbnb preset (Maks Sadowsky)

### Bug fixes
* `disallowSpacesInsideTemplateStringPlaceholders`: check template literal (ikokostya)
* `validateQuoteMarks`: do not throw on es7 decorators (Oleg Gaidarenko)

Other commits (as always) are omitted, since they're all about internal stuff and we care about your viewing pleasure.

## Version [2.10.1](https://github.com/jscs-dev/node-jscs/compare/v2.10.0...v2.10.1) (2016-02-15):

### Bug Fix
- Regression in `requireSpaceBeforeKeywords` [#2135](https://github.com/jscs-dev/node-jscs/issues/2135)

## Version [2.10.0](https://github.com/jscs-dev/node-jscs/compare/v2.9.0...v2.10.0) (2016-02-15):

Happy Presidents Day!

In this release, it's just some additional rules to update to the airbnb preset, new rules, and fixes.

### Preset Changes

* Add `maximumLineLength` to the `airbnb` preset [(reference)](https://github.com/airbnb/javascript#18.12) (Oleg Gaidarenko)
* Add `disallowSpacesInsideTemplateStringPlaceholders` to the `airbnb` preset (not explicit but used in examples) (Oleg Gaidarenko)
* Add `disallowNewlineBeforeBlockStatements` rule to the `mdcs` preset [(reference)](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2#blocks) (Mauricio Massaia)
 
### New Rules

#### `disallowSpacesInsideTemplateStringPlaceholders`
(ikokostya)

> Disallows spaces before and after curly brace inside template string placeholders.

```js
// usage in config
"disallowSpacesInsideTemplateStringPlaceholders": true
```

```js
// Valid
`Hello ${name}!`
```

```js
// Invalid
`Hello ${ name}!`
`Hello ${name }!`
`Hello ${ name }!`
```

#### `requireImportsAlphabetized` (Ray Hammond)

> Requires imports to be alphabetized

```js
// usage in config
"requireImportAlphabetized": true
```

```js
// Valid
import a from 'a';
import c from 'c';
import z from 'z';
```

```js
// Invalid
import a from 'a';
import z from 'z';
import c from 'c';
```

### Rule Updates

* `requireSpaceBeforeKeywords`: add a `allExcept` option for filtering out default keywords (gpiress)
  * This allows you do specify exceptions to the all keywords instead of creating an array of whitelisted keywords when you only want to blacklist a few.

### Bug Fixes

* `requireNumericLiterals`: miss if first argument is an Identifier (Robert Jackson)
* `disallowSpacesInsideTemplateStringPlaceholders`: skip the edge case (Oleg Gaidarenko)
* `requirePaddingNewLinesBeforeExport`: exclude if only statement in block (Brian Schemp)
* `maximumLineLength`: some nodes might contain null values (Oleg Gaidarenko)
 
### Docs

* Correct date in the changelog (Oleg Gaidarenko)
* Various rule corrections (Christopher Cook)
 
## Version [2.9.0](https://github.com/jscs-dev/node-jscs/compare/v2.8.0...v2.9.0) (2016-01-23):

> Changed the changelog date format to be YYYY-MM-DD.

Whoo a release during this blizzard! Hopefully, this will be our last release before we start pushing out pre-release versions of 3.0. (If necessary, we can push bug fixes to 2.x)

The plan:

- Push the `2.9.0` release
- Create a `2.x` branch off of `master`
- Switch `master` to be the `3.0` branch
- Merge in 2.x changes + cleanup stuff for a 3.0 alpha release.
- Do what we can in our [3.0 milestone](https://github.com/jscs-dev/node-jscs/issues/1854). We would really appreciate any help!
  - Especially for deprecating rules/options, rule merging, renames/inconsistencies that we don't catch.

### New Rules

#### [`requireCapitalizedConstructorsNew`](http://jscs.info/rule/requireCapitalizedConstructorsNew) (Alexander O'Mara)

```js
// Description: Requires capitalized constructors to to use the `new` keyword

// Usage
"requireCapitalizedConstructors": {
  "allExcept": ["somethingNative"]
}

// Valid
var x = new Y();
var x = new somethingNative(); // exception

// Invalid
var x = Y();
```

### Rule Updates

- [`validateNewlineAfterArrayElements`](http://jscs.info/rule/validateNewlineAfterArrayElements): add autofix support for this rule (Joeri de Gooijer)

```js
// can turn
var a = [0,
1,
2];

// into
var a = [
0,
1,
2
];
```

This was [@joerideg's](https://github.com/joerideg) first PR, so congrats and hope to see more contributions (not necessarily here)!

> I think we would need a seperate rule to both check/fix alignment properly.

- [`requireSemicolons`](http://jscs.info/rule/requireSemicolons): account for stage-2 `ClassProperty` (Henry Zhu)

```js
class A {
  prop; // will add a semicolon here
  prop2 = 1; // and here
}
```

- [`requireCamelCaseOrUpperCaseIdentifiers`](http://jscs.info/rule/requireCamelCaseOrUpperCaseIdentifiers): add extra options `allowedPrefixes, allowedSuffixes, allExcept`

  - This lets you specify a permitted array of String, RegExp, or ESTree RegExpLiteral values

For options: `{ allowedSuffixes: ["_dCel", {regex:{pattern:"_[kMG]?Hz"}}] }`

```js
// Extra valid options
var camelCase_dCel = 5;
var _camelCase_MHz = 6;
 ```

```js
// Invalid
var camelCase_cCel = 4;
var CamelCase_THz = 5;
```

- [`requireNewlineBeforeBlockStatements`](http://jscs.info/rule/requireNewlineBeforeBlockStatements), [`disallowNewlineBeforeBlockStatements`](http://jscs.info/rule/disallowNewlineBeforeBlockStatements): account for `SwitchStatement`

```js
// Valid for requireNewlineBeforeBlockStatements
switch (a)
{
  case 1: break;
}

// Valid for disallowNewlineBeforeBlockStatements
switch (a) {
  case 1: break;
}
```

### Presets

- `airbnb`: Enforce rule [25.1](https://github.com/airbnb/javascript/blob/c25dbac620b258c4421251bc403fffa1051de61e/README.md#25.1) (Joe Bartlett)
  - This adds `requireDollarBeforejQueryAssignment`
- `airbnb`: Enforce rule [7.11](https://github.com/airbnb/javascript/blob/c25dbac620b258c4421251bc403fffa1051de61e/README.md#7.11) (Joe Bartlett)
  - This fixes up function spacing issues (autofixable)
- `google`: Enforce [naming rules](https://google.github.io/styleguide/javascriptguide.xml#Naming__body)
  - This adds `"requireCamelCaseOrUpperCaseIdentifiers": {
  "allowedPrefixes": ["opt_"],
  "allExcept": ["var_args"]
}`

### Bug Fixes

- [`requireEnhancedObjectLiterals`](http://jscs.info/rule/requireEnhancedObjectLiterals): Don't error for computed properties (Henry Zhu)
- [`requireTemplateStrings`](http://jscs.info/rule/requireTemplateStrings): should not report string to binary (Oleg Gaidarenko)
- [`requireVarDeclFirst`](http://jscs.info/rule/requireVarDeclFirst): be aware of the comments (Kushan Joshi)

### Misc
- `OVERVIEW.md`: add the [Visual Studio Code extension](https://marketplace.visualstudio.com/items/ms-vscode.jscs) to list of "Friendly Packages" (Tyler Hughes)

## Version [2.8.0](https://github.com/jscs-dev/node-jscs/compare/v2.7.0...v2.8.0)

Happy new year! Small changes this time, small, but important fixes which still warrants the minor bump.

Aside from bug fixes, this update includes improvement for the airbnb preset and `allExcept` option for the [`disallowNewlineBeforeBlockStatements`](http://jscs.info/rule/disallowNewlineBeforeBlockStatements)


## Version [2.7.0](https://github.com/jscs-dev/node-jscs/compare/v2.6.0...v2.7.0)

It's this time of the year again, 2.7 is here!

One new rule, cool amount of fixes and massive jsdoc rule set update.

### New Rules

Although there's only one new rule in this release, it's pretty powerful! Say thanks to @ficristo!

#### [`requireEarlyReturn`](http://jscs.info/rule/requireEarlyReturn)

```js
// This is cool 
function test() {
     if (x) {
         return x;
     }
     return y;
}

// This is not 
function test() {
    if (x) {
        return x;
    } else {
        return y;
    }
}
```

This is one of the most popular patterns out there, such as in [idiomatic](https://github.com/rwaldron/idiomatic.js/) and [node-style-guide](https://github.com/felixge/node-style-guide).

### Presets
- The `idiomatic` and `node-style-guide` presets now have the  `requireEarlyReturn` rule.
- Whereas the `airbnb` preset is better in treating JSX.

### Bug Fixes

* [`disallowTrailingWhitespace`](http://jscs.info/rule/disallowTrailingWhitespace) changes for autofix (thanks @lukeapage!)
* `requirePaddingNewlinesBeforeKeywords`: allow function return on the same line
* `disallowMixedSpacesAndTabs`: fix issue with erroring on block comments
* `auto-configure`: set `maxErrors` to `Infinity`

### Notable Changes in [`jsDoc`](http://jscs.info/rule/jsDoc)

* Improves ES6 support for `enforceExistence`: add exceptions for arrow functions and ES6 modules exports
* Many fixes related to `requireDescriptionCompleteSentence`
* Fixes for incorrecly sticked docblocks to IIFE
* Docblocks without tags now parsing correctly
* Adds `@override` to `jsdoc3` preset
* Arrow functions now treats as usual functions 

See the full list in [jscs-jsdoc changelog](https://github.com/jscs-dev/jscs-jsdoc/blob/master/CHANGELOG.md#user-content-v130---2015-12-05).


## Version [2.6.0](https://github.com/jscs-dev/node-jscs/compare/v2.5.1...v2.6.0) (11-18-2015):

Thanks to @seanpdoyle, we're able to move some of the ES6 rules from [ember-suave](https://github.com/dockyard/ember-suave) to JSCS!

### New Rules

#### [`disallowVar`](http://jscs.info/rule/disallowVar) (Sean Doyle)

Disallows declaring variables with `var`.

`"disallowVar": true`

```js
// Valid
let foo;
const bar = 1;
```

```js
// Invalid
var baz;
```

You can also use `"disallowKeywords": ["var"]`

#### [`requireArrayDestructuring`](http://jscs.info/rule/requireArrayDestructuring) (Sean Doyle)

Requires that variable assignment from array values are destructured.

`"requireArrayDestructuring": true`

```js
// Valid
var colors = ['red', 'green', 'blue'];
var [ red ] = colors;
```

```js
// Invalid
var colors = ['red', 'green', 'blue'];
var red = colors[0];
```

#### [`requireEnhancedObjectLiterals`](http://jscs.info/rule/requireEnhancedObjectLiterals) (Sean Doyle)

Requires declaring objects via ES6 enhanced object literals (shorthand versions of properties)

`"requireEnhancedObjectLiterals": true`

```js
var obj = {
  foo() { },
  bar
};
```

```js
var obj = {
  foo: function() { },
  bar: bar
};
```

#### [`requireObjectDestructuring`](http://jscs.info/rule/requireObjectDestructuring) (Sean Doyle)

Requires variable declarations from objects via destructuring

`"requireObjectDestructuring": true`

```js
// Valid
var { foo } = SomeThing;
var { bar } = SomeThing.foo;
```

```js
// Invalid
var foo = SomeThing.foo;
var bar = SomeThing.foo.bar;
```

#### [`disallowSpacesInGenerator`](http://jscs.info/rule/disallowSpacesInGenerator) (Francisc Romano)

Checks the spacing around the `*` in a generator function.

```js
"disallowSpacesInGenerator": {
    "beforeStar": true,
    "afterStar": true
}
```

```js
var x = function*() {};
function*a() {};
var x = async function*() {};
```

### New Rule Options

* `requireCamelCaseOrUpperCaseIdentifiers`: add `strict` option (Jan-Pieter Zoutewelle)

Also forces the first character to not be capitalized.

```js
"requireCamelCaseOrUpperCaseIdentifiers": {
  "strict": true
}
```

```js
// Valid
var camelCase = 0;
var UPPER_CASE = 4;

// Invalid
var Mixed_case = 2;
var Snake_case = { snake_case: 6 };
var snake_case = { SnakeCase: 6 };
```

* `disallowSpace(After|Before)Comma`: add `allExcept: ['sparseArrays']` (Brian Dixon)
* `validateQuoteMarks`: add "ignoreJSX" value (Oleg Gaidarenko)
* `requireMatchingFunctionName`: add `includeModuleExports` option (George Chung)
 
### Fixes

* Account for sparse arrays in rules with spacing and commas (Brian Dixon)

  - [`disallowCommaBeforeLineBreak`](http://jscs.info/rule/disallowCommaBeforeLineBreak)
  - [`requireCommaBeforeLineBreak`](http://jscs.info/rule/requireCommaBeforeLineBreak)

* `requireSpaceBeforeBinaryOperators`: report "operator =" correctly when erroring (Rob Wu)
* `requireAlignedMultilineParams`: do not throw on function without body (Oleg Gaidarenko)

### Preset Changes
* `WordPress`: add `requireBlocksOnNewLines` (Gary Jones)

## Version [2.5.1](https://github.com/jscs-dev/node-jscs/compare/v2.5.0...v2.5.1) (11-06-2015):

Just some bug fixes and an internal change before we integrate CST.

### Fixes

* `disallowUnusedParams`: ignore eval exressions (Oleg Gaidarenko)
* `Configuration`: do not try to load presets with function values (Oleg Gaidarenko)
*  `requirePaddingNewLinesAfterBlocks` - don't throw on empty block  (Oleg Gaidarenko)
* `requireSpacesInGenerator` - account for named functions (Henry Zhu)

### Internal changes

* Add `Whitespace` token in preparation for using CST (Marat Dulin)

## Version [2.5.0](https://github.com/jscs-dev/node-jscs/compare/v2.4.0...v2.5.0) (10-28-2015):

### Preset Updates

Thanks to markelog and Krinkle, the built-in wikimedia preset will be hosted at https://github.com/wikimedia/jscs-preset-wikimedia. 

The purpose of this change is so that organizations can update their preset as needed without waiting for JSCS to update to another minor version (even though we are releasing more often anyway). The plan is to not update our preset dependencies until a new minor version of JSCS.

Example:

```js
// JSCS package.json
"jscs-preset-wikimedia": "~1.0.0",
```

- Wikimedia updates their preset to to `1.1.0`
- A new user runs `npm install` with jscs and will get version `1.0.0` of the wikimedia preset
- If the user wants to update the preset themselves, they can add a direct dependency in their package.json
- Otherwise they can wait for JSCS to have a minor version update (`2.4.0` to `2.5.0`) which will update all presets.

If you would like to maintain one of the default supported presets, please let us [know](https://github.com/jscs-dev/node-jscs/issues/1811).

### New Rules

#### [`requireSpacesInGenerator`](http://jscs.info/rule/requireSpacesInGenerator) (stefania11)

Checks the spacing around the `*` in a generator function.

```js
"requireSpacesInGenerator": {
    "beforeStar": true,
    "afterStar": true
}
```

```js
// allowed
var x = function * () {};
function * a() {};
var x = async function * () {};
```

> Thanks to Stefania and Christopher for working on this rule this past Sunday during the JS Open Source workshop at the NY Javascript meetup!

### New Rule Options

#### [`requireCurlyBraces`](http://jscs.info/rule/requireCurlyBraces) (Henry Zhu)

```js
"requireCurlyBraces": {
    "allExcept": ["return", "continue", "break", ...],
    "keywords": ["if", "else", "for", "while", ... ]
}
```

```js
// allowed
if (x) return;
if (x) return 1;
if (x) continue;
if (x) break;

// still not allowed
if (x) i++;
```

#### [`requireSpaceAfterComma`](http://jscs.info/rule/requireSpaceAfterComma) add option `{ allExcept: ['trailing'] }` (Brian Dixon)

```js
// allows
var a = [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
}];
```

### Fixes

#### Account for sparse arrays in comma spacing rules (Brian Dixon)

- [`disallowSpaceBeforeComma`](http://jscs.info/rule/disallowSpaceBeforeComma), [`disallowSpaceAfterComma`](http://jscs.info/rule/disallowSpaceAfterComma)
- [`disallowSpaceBeforeBinaryOperators`](http://jscs.info/rule/disallowSpaceBeforeBinaryOperators), [`disallowSpaceAfterBinaryOperators`](http://jscs.info/rule/disallowSpaceAfterBinaryOperators)

```js
// allowed
var x = [1, , ,2];
```

#### Configuration: correct config dir detection (Oleg Gaidarenko)

Fixes a regression with loading additional rules in a `.jscsrc`

## Version [2.4.0](https://github.com/jscs-dev/node-jscs/compare/v2.3.5...v2.4.0) (10-22-2015):

We're releasing pretty often now, right? :-)

### `Fix` option

- The `--fix` CLI flag can now be used programatically and [through](http://jscs.info/overview#fix) a `.jscsrc` config. 

> This is be useful for plugin authors (not only for jscs plugins but also for `grunt`/`gulp`/`etc...`) 

### Preset updates

- The `jquery` preset (and dependant ones like `wordpress` and `wikimedia`) is less strict, whereas `idiomatic` is now more meticulous.

### Couple new rules

* [`disallowSpaceAfterComma`](http://jscs.info/rule/disallowSpaceAfterComma) - to have an opposite rule to [`disallowSpaceBeforeComma`](http://jscs.info/rule/disallowSpaceBeforeComma):

```js
[1,2,3] // valid
[1, 2, 3] // invalid
```

* [`requireAlignedMultilineParams`](http://jscs.info/rule/requireAlignedMultilineParams) - a nice addition to our indentation rules:

```js
var test = function(one, two,
/*indent!*/  three) {
  ...
};
```

### Some new rule options

* [`requireDotNotation`](http://jscs.info/rule/requireDotNotation) now supports  fancy letters like `π` - 

```js
obj["ಠ_ಠ"] // This is wrong!
obj.ಠ_ಠ // Now you get it :-)
```

* [`maxNumberOfLines`](http://jscs.info/rule/maxNumberOfLines) can now ignore comments with the `{"allExcept": ["comments"]}` option
* [`requireObjectKeysOnNewLine`](http://jscs.info/rule/requireObjectKeysOnNewLine) can ignore object properties on the same line with `{"allExcept": ["sameLine"]}` option - 
```js
var whatDoesAnimalsSay = {
    cat: 'meow', dog: 'woof', fox: 'What does it say?' // this is cool now
};
```

### Fixes

* Account for bare blocks in both [`disallowNewlineBeforeBlockStatements`](http://jscs.info/rule/disallowNewlineBeforeBlockStatements) and [`disallowSpaceBeforeBlockStatements`](http://jscs.info/rule/disallowSpaceBeforeBlockStatements)

```js
// allows
var a = 1;

{
  let b = 1;
}
```

## Version [2.3.5](https://github.com/jscs-dev/node-jscs/compare/v2.3.4...v2.3.5) (10-19-2015):

Why not fix some more bugs!

### Bug Fixes
 * Fix: `requireSpacesInForStatement` account for parenthesizedExpression (Henry Zhu)
 
```js
// allows ()
for (var i = 0; (!reachEnd && (i < elementsToMove)); i++) {
```
 
 * Fix: `disallowCommaBeforeLineBreak`: fix for function params (Henry Zhu)
 
```js
// allows
function a(b, c) {
  console.log('');
}
```
 
 * Fix: `requirePaddingNewLineAfterVariableDeclaration` - allow exported declarations (Henry Zhu)
 
```js
// allows
export var a = 1;
export let a = 1;
export const a = 1;
```

 * Fix: `disallowSpaceAfterKeywords` - fix issue with using default keyword list (Henry Zhu)

```js
// fixes autofix from `return obj` to `returnobj`
```

 * Fix: `disallowTrailingComma`, `requireTrailingComma` - support ObjectPattern and ArrayPattern (Henry Zhu)

```js
// disallow
const { foo, bar } = baz;
const [ foo, bar ] = baz;

// require
const { foo, bar, } = baz;
const [ foo, bar, ] = baz;
```

hzoo

## Version [2.3.4](https://github.com/jscs-dev/node-jscs/compare/v2.3.3...v2.3.4) (10-17-2015):

### Bug Fixes
- Change `requireVarDeclFirst` to ignore let and const [`2199ca4`](https://github.com/jscs-dev/node-jscs/commit/2199ca488a56ff1472d876ac2b21fe2292ae8413) [`#1783`](https://github.com/jscs-dev/node-jscs/issues/1783)

- Fixed an issue with all function spacing rules not accounting for the generators [`a2c009f`](https://github.com/jscs-dev/node-jscs/commit/a2c009f19aaf410a46abb3edfbc56d4aa9931f41) [`#1175`](https://github.com/jscs-dev/node-jscs/issues/1175)

hzoo

## Version [2.3.3](https://github.com/jscs-dev/node-jscs/compare/v2.3.2...v2.3.3) (10-16-2015):

### Bug Fixes
- Fixed an error with `disallowUnusedParams` and es6 imports [`63526b7`](https://github.com/jscs-dev/node-jscs/commit/63526b73d55eed3719d79527a7a7c7490b4cd2cb) [`#1875`](https://github.com/jscs-dev/node-jscs/issues/1875)

- Fixed an autofix issue with all function spacing rules and not accounting for the async keyword [`cf134a1`](https://github.com/jscs-dev/node-jscs/commit/cf134a12c1ab0bb7a23c7197780593bfdb8682e2) [`#1873`](https://github.com/jscs-dev/node-jscs/issues/1873)

hzoo

## Version [2.3.2](https://github.com/jscs-dev/node-jscs/compare/v2.3.1...v2.3.2) (10-14-2015):

Fix an issue with `--extract` option being true by default

## Version [2.3.1](https://github.com/jscs-dev/node-jscs/compare/v2.3.0...v2.3.1) (10-14-2015):

A bunch of bug fixes in this release!

### The Future

We are probably going to start 3.0 for the next release (mainly integrating [CST](https://github.com/cst/cst) into JSCS). If you want to know more about CST check out the [previous changelog](https://github.com/jscs-dev/node-jscs/blob/master/CHANGELOG.md#-つ-_-つ--give-cst).

Our current plan is to move our 3.0/cst branch to master and then create a 2.x branch to continue to release bug fixes / contributer PRs. The core team will be mainly focused on tackling issues on our [3.0 roadmap](https://github.com/jscs-dev/node-jscs/issues/1854) (which we are still planning). We would love to hear your feedback on what you think should be in 3.0 and beyond!

### Bug Fixes:

* [`disallowMultipleVarDecl`](http://jscs.info/rule/disallowMultipleVarDecl) - improve `{"allExcept": ["require"]}` logic (ValYouW)

```js
// Allow MemberExpressions: require('a').b.c;
var fs = require('fs');
var Emitter = require('events').EventEmitter;
```

* [`disallowSpaceAfterObjectKeys`](http://jscs.info/rule/disallowSpaceAfterObjectKeys) - Allow no space after key with `align` option. (Andrey Ermakov)


```js
// this should be allowed
var f = {
    "name": 1,
    "x": 2
};
```

* [`disallowUnusedParams`](http://jscs.info/rule/disallowUnusedParams) - correctly output unused param name (Oleg Gaidarenko)

```js
// Should output:
// Param unusedParam is not used at input
var a = function(unusedParam) {}
```

* [`requireDollarBeforejQueryAssignment`](http://jscs.info/rule/requireDollarBeforejQueryAssignment) - validate all keys (Brian Dixon)

```js
// check all keys
var x = {
  bar: 1,
  foo: $(".foo") // error here
};
```

* [`requireDollarBeforejQueryAssignment`](http://jscs.info/rule/requireDollarBeforejQueryAssignment) - Ignore array
destructuring (Simen Bekkhus)

```js
// Don't error with this
const [beep, boop] = meep;
var $s = $("#id")
```

* `CLI` - "auto-configure" argument should always be at the end
(Oleg Gaidarenko)

```bash
// correct autoconfigure args
jscs --autoconfigure ./files/here
```

*  `js-file` - make parser not confuse token types (Oleg Gaidarenko)

```js
// Fixes issues with keywords like with
class A {
  catch() {}
}
```

Again, a big thanks to everything using [JSCS](jscs.info)! Definitely continue to report any bugs and new ideas! We always appreciate any help/PRs!

We'll probably be moving more of the new rule/option issues to [`orphaned`](https://github.com/jscs-dev/node-jscs/issues?q=label%3Aorphaned+is%3Aclosed) which just means that they are on hold but anyone can still PR it or reopen it later. Remember to tweet at us at [@jscs_dev](https://twitter.com/jscs_dev) and chat with us on our [gitter room](https://gitter.im/jscs-dev/node-jscs)!

hzoo

## Version [2.3.0](https://github.com/jscs-dev/node-jscs/compare/v2.2.1...v2.3.0) (10-07-2015):

A quick update! A few more rules, preset updates, and bug fixes!

> If anyone missed it from the previous minor release, we've been working on https://github.com/cst/cst. This will help us continue to autofix more complex rules in the future. If you want to know more about it check out the [changelog](https://github.com/jscs-dev/node-jscs/blob/master/CHANGELOG.md#-つ-_-つ--give-cst).

Now that we're done implementing all of ES6 the next major thing we'll be working on is intergrating CST into JSCS.

### New Rules:

#### [`disallowIdenticalDestructuringNames`](http://jscs.info/rule/disallowIdenticalDestructuringNames) (ES6) (Henry Zhu)

```js
// Valid for "disallowIdenticalDestructuringNames": true
var {left, top} = obj; // shorthand
var {left, top: topper} = obj; // different identifier
let { [key]: key } = obj; // computed property
```

```js
// Invalid for "disallowIdenticalDestructuringNames": true
var {left: left, top: top} = obj;
```

#### [`disallowNestedTernaries`](http://jscs.info/rule/disallowNestedTernaries) (Brian Dixon)

```js
// Valid for "disallowNestedTernaries": "true"
// Valid for "disallowNestedTernaries": { "maxLevel": 0 }
var foo = (a === b) ? 1 : 2;
```

```js
// Invalid for "disallowNestedTernaries": true
// Valid for "disallowNestedTernaries": { "maxLevel": 0 }
var foo = (a === b)
  ? (a === c)
    ? 1
    : 2
  : (b === c)
    ? 3
    : 4;
```


#### [`requireSpaceAfterComma`](http://jscs.info/rule/requireSpaceAfterComma) (Brian Dixon)

> To match [requireSpaceBeforeComma](http://jscs.info/rule/requireSpaceBeforeComma)

```js
// Valid for "requireSpaceAfterComma": true
var a, b;
```

```js
// Invalid for "requireSpaceAfterComma": true
var a,b;
```


### Preset Updates:

- Preset: add more comma rules to jquery and airbnb presets (Oleg Gaidarenko) [`94f175e`](https://github.com/jscs-dev/node-jscs/commit/94f175eec822f62528e6e5ca5aab0eb1de037243)
- Preset: `wordpress` - change `requireCamelCaseOrUpperCaseIdentifiers` from `true` to `ignoreProperties` [`58ba037`](https://github.com/jscs-dev/node-jscs/commit/58ba030744e8c7e55fa40a08bf19e89fc93a7eed)

### Bug Fixes:

- Fix: `disallowParenthesesAroundArrowParam` - account for non-identifiers (`RestElement`, `ArrayPattern`) correctly (Henry Zhu) [`bcfaa51`](https://github.com/jscs-dev/node-jscs/commit/bcfaa5192b09391bdec31adecab14d3861817c8a) [#1831](https://github.com/jscs-dev/node-jscs/issues/1831)
- Fix: `disallowCommaBeforeLineBreak` correctly handle empty object (Oleg Gaidarenko)
[`6571ebb`](https://github.com/jscs-dev/node-jscs/commit/6571ebbbf29e5b96be45ade585e4676de3c2817d) [#1841](https://github.com/jscs-dev/node-jscs/issues/1841)

Again, a big thanks to everything using JSCS! Definitely continue to report any bugs and new ideas! We always appreciate any help/PRs as we don't have that many resources!

hzoo

### Other

 * disallowDanglingUnderscores: correct documentation (Oleg Gaidarenko)
 * Docs: `disallowMultipleVarDecl` typo (ValYouW)
 * Docs: couple small fixes (Oleg Gaidarenko)
 * Internal: `Checker` - return correct arguments for excluded files (Oleg Gaidarenko)
 * Misc: remove babelType and just use node.type (Henry Zhu)
 * Misc: Update CHANGELOG.md (Craig Klementowski)
 * Misc: Use Chai (Marat Dulin)

## Version [2.2.1](https://github.com/jscs-dev/node-jscs/compare/v2.2.0...v2.2.1) (09-29-2015):

### Bug Fix:

Quick fix related to checker not returning correctly with excluded files.

- [`f12830a`](https://github.com/jscs-dev/node-jscs/commit/f12830a469959f3543c51bfc632fe37292ea6d09) [#1816](https://github.com/jscs-dev/node-jscs/issues/1816)
    - Internal: `Checker` - return correct arguments for excluded files ([markelog](https://github.com/markelog))

## Version [2.2.0](https://github.com/jscs-dev/node-jscs/compare/v2.1.1...v2.2.0) (09-28-2015):

Again, it's been way too long since the last version; we're going to be releasing more often in the future!

In this release, we have a nicer [homepage](http://jscs.info/), 5 new rules, 4 more autofixable rules, many new rule options/bug fixes, and a [jscs-jsdoc@1.2.0](https://github.com/jscs-dev/jscs-jsdoc/blob/master/CHANGELOG.md#v120---2015-09-22) update.

We also added support for using YAML in config files, checking JS style in HTML files, and are **trying out some non-stylistic rules** (like [`disallowUnusedParams`](http://jscs.info/rule/disallowUnusedParams))!

Be on the look out for https://github.com/cst/cst (just finished ES6 support this weekend) if you haven't already.

### Autofixing: Support for 4 more rules!

Thanks to [@markelog](https://github.com/markelog), we also have autofix support for the following rules:

- [`disallowSemicolons`](http://jscs.info/rule/disallowSemicolons)
- [`requireSemicolons`](http://jscs.info/rule/requireSemicolons)
- [`disallowQuotedKeysInObjects`](http://jscs.info/rule/disallowQuotedKeysInObjects)
- [`requireCapitalizedComments`](http://jscs.info/rule/requireCapitalizedComments)

> We will also be labeling which rules don't support autofixing (only a few).

### Configuration: YAML support, and linting JS in HTML files

We weren't even thinking about different config formats, but [@ronkorving](https://github.com/ronkorving) stepped in and added support for using YAML as a config format!

So now you can use a `.jscsrc / jscs.json` (JSON) file or a `.jscs.yaml` (YAML) file.

[@lahmatiy](https://github.com/lahmatiy) has landed support for linting javascript in HTML files with the [extract](http://jscs.info/overview#extract) option! Thanks so much for sticking with us for that PR.

Example usage:
```
jscs ./hello.html --extract *.html
```

### New Rules

#### [`disallowMultiLineTernary`](http://jscs.info/rule/disallowMultiLineTernary) (Brian Dixon)

```js
// Valid for "disallowMultiLineTernary": true
var foo = (a === b) ? 1 : 2;
```

#### [`requireMultiLineTernary`](http://jscs.info/rule/requireMultiLineTernary) (Brian Dixon)

```js
// Valid for "requireMultiLineTernary": true
var foo = (a === b)
  ? 1
  : 2;
```

#### [`disallowTabs`](http://jscs.info/rule/disallowTabs) (Mike Ottum)

It disallows tab characters everywhere!

#### [`disallowUnusedParams`](http://jscs.info/rule/disallowUnusedParams) (Oleg Gaidarenko)

Another cool rule [@markelog](https://github.com/markelog) added is actually a non-stylistic rule with autofixing support! It checks to make sure you use the parameters in function declarations and function expressions!


```js
// Invalid since test is unused
function x(test) {
}
var x = function(test) {
}
```

#### [`validateCommentPosition`](http://jscs.info/rule/validateCommentPosition) (Brian Dixon)

Comments that start with keywords like `eslint, jscs, jshint` are ignored by default.

```js
/* Valid for "validateCommentPosition": { position: `above`, allExcept: [`pragma`] } */
// This is a valid comment
1 + 1; // pragma (this comment is fine)

/* Valid for "validateCommentPosition": { position: `beside` } */
1 + 1; // This is a valid comment
```

Just as a reminder, you can disable certain AST node types with the [`disallowNodeTypes`](http://jscs.info/rule/disallowNodeTypes.html) rule which takes in an array of node types.

For example: if you want to disable arrow functions for some reason, you could do

`"disallowNodeTypes": ['ArrowFunctionExpression']`.

### Presets: Idiomatic.js and other updates

We finally added support for [Idiomatic.js](https://github.com/rwaldron/idiomatic.js)! There are a few more rules we still need to add, so leave a comment in the [issue](https://github.com/jscs-dev/node-jscs/issues/1065) or create a new one.

* `Google`: remove `capitalizedNativeCase` option in the JSDoc `checkTypes` rule (Sam Thorogood)
* `Idiomatic`: add initial preset (Henry Zhu)
* `jQuery`: add `disallowSpacesInCallExpression` rule to (Oleg Gaidarenko)
* `jQuery`: use `ignoreIfInTheMiddle` value for `requireCapitalizedComments` rule (Oleg Gaidarenko)
* `jQuery`: add `validateIndentation` rule (Oleg Gaidarenko)
* `Wikimedia`: enable `es3` (James Forrester)

### Rule Options/Changes

* `requireSpacesInsideParentheses`: `ignoreParenthesizedExpression` option (Oleg Gaidarenko)
* `disallowSpaceAfterObjectKeys`: add `method` exception option (Alexander Zeilmann)
* `disallowSpaceBeforeSemicolon`: add `allExcept` option (Oleg Gaidarenko)
* `requireCapitalizedComments`: add `ignoreIfInTheMiddle` option (Oleg Gaidarenko)
* `disallowSpacesInsideParentheses`: add quotes option (Oleg Gaidarenko)
* `requireSpacesInsideParentheses`: add quotes option (Oleg Gaidarenko)
* `requireCapitalizedComments`: add default exceptions (alawatthe)
* `requireArrowFunctions`: create an error on function bind (Henry Zhu)
* Misc: Bucket all rules into groups, test case to ensure new rules have a group (indexzero)

### Bug Fixes

We fixed a bug with exit codes not matching the [wiki](https://github.com/jscs-dev/node-jscs/wiki/Exit-codes) (Oleg Gaidarenko).

* `disallowParenthesesAroundArrowParam`: fix check for params (Henry Zhu)
* `spacesInsideBrackets`: account for block comments (Oleg Gaidarenko)
* `disallowSemicolons`: ignore needed exceptions (Oleg Gaidarenko)
* `spacesInFunctionExpression`: account for async functions (MikeMac)
* `disallowSpaceBeforeSemicolon`: do not trigger error if it's first token (Oleg Gaidarenko)
* `requireCapitalizedComments`: consider edge cases (Oleg Gaidarenko)
* `requireSemicolons`: handle phantom cases (Oleg Gaidarenko)
* `spaceAfterObjectKeys`: fix for computed properties with more than one token (Henry Zhu)
* Exclude `.git` folder by default (Vladimir Starkov)

### JSDoc updates
* New Rule: [`checkParamExistence`](http://jscs.info/rule/jsDoc#checkparamexistence)
* New Rule: [`requireReturnDescription`](http://jscs.info/rule/jsDoc#requirereturndescription)
* [`enforceExistence`](http://jscs.info/rule/jsDoc#enforceexistence) add `paramless-procedures` exception

### What's JSCS?

The homepage now showcases what JSCS actually does. We were missing a :cat: picture as well so ...

![cat](http://i.imgur.com/sIIoLDI.png)

> If you have any feedback on the site, leave a comment at our [website repo](https://github.com/jscs-dev/jscs-dev.github.io).

### ༼ つ ◕_◕ ༽つ  GIVE CST!

We've also been busy working on https://github.com/cst/cst.

![cst](https://raw.githubusercontent.com/cst/cst/master/docs/cst-example.png)

CST stands for `Concrete Syntax Tree`, as opposed to AST which stands for `Abstract Syntax Tree`. CST uses a regular AST but adds support for information that you normally don't care about but is vital for a style checker, e.g. spaces, newlines, comments, semicolons, etc. Using a CST will allow us to support more complex autofixing such as adding curly braces while retaining other formatting or much larger transformations.

We just finished supporting all of ES6 this past weekend. [ES6+](https://github.com/cst/cst/issues/39) and [JSX](https://github.com/cst/cst/issues/3) support is also in progress! We'll be integrating CST into JSCS in the [3.0 branch](https://github.com/jscs-dev/node-jscs/tree/3.0), so look out for that soon (CST uses babel as its AST parser).

If you're interested, there was a lot of discussion on CSTs at the [ESTree](https://github.com/estree/estree/issues/41) repo.

---

Hopefully we can get more community help for JSCS! (check out [CONTRIBUTING.md](https://github.com/jscs-dev/node-jscs/blob/master/CONTRIBUTING.md#how-you-can-help) if you're interested)

We have a [`beginner-friendly`](https://github.com/jscs-dev/node-jscs/labels/beginner-friendly) tag for people to get started on issues.

### Small personal sidenote

Thanks to everyone who has been submitting issues/PRs!

It's been almost a year since I (hzoo) really started contributing to open source. It's still crazy to me that my first pull request was just adding the [table of contents](https://github.com/jscs-dev/node-jscs/pull/677). I was so excited to contribute that day!

Little did I know I would slowly do more and more - typo fixes, docs changes, bugfixes, rules, and then eventually become part of the team! I've become a better communicator and become more confident to give and take constructive feedback. I'm currently still figuring out how to review PRs, label issues, do changelogs (like right now), release, etc.

So much has happened after starting that one simple contribution! Even though I know a lot more about ASTs, javascript/node, and programming style, it all adds up to much more than that technical knowledge.

Contributing here helped me make PRs to a lot of other projects (in my case babel, eslint, and others). I understand more that it doesn't take a special person to start helping out. I really hope to encourage others to join our awesome open source community at large!

[hzoo](https://github.com/hzoo)

### Other Awesome Changes!

* CLI: correct `describe` description (Roman Dvornov)
* ClI: move `handleMaxErrors` helper to the more appropriate place (Oleg Gaidarenko)
* CLI: set `maxErrors` to `Infinity` for autoconfigure (Henry Zhu)
* disallowSemicolons: simplify `disallowSemicolons` rule (Oleg Gaidarenko)
* Docs: another portion of changelog fixes (Oleg Gaidarenko)
* Docs: Correct documentation for `requireCapitalizedComments` (Alexander Zeilmann)
* Docs: `disallowParenthesesAroundArrowParam` (Samuel Lindblom)
* Docs: fix markdown for `disallowMultipleSpaces` (Marián Rusnák)
* Docs: fix markdown in `requireBlocksOnNewline` (Marián Rusnák)
* Docs: fix markdown in `requireCapitalizedComments` (Marián Rusnák)
* Docs: fixup broken links (Henry Zhu)
* Docs: improve documentation for various rules (oredi)
* Docs: improve documentation for various rules (oredi)
* Docs: remove unnecessary paragraph, use js syntax highlighting (Dennis Wissel)
* Docs: small changelog corrections (Oleg Gaidarenko)
* Docs: small correction for the `disallowEmptyBlocks` rule (Oleg Gaidarenko)
* js-file: add `getScope` method (Oleg Gaidarenko)
* js-file: add `removeToken` method (Oleg Gaidarenko)
* js-file: all return values should be consistent (Oleg Gaidarenko)
* js-file: check argument of the `file#getNodeRange` (Oleg Gaidarenko)
* js-file: do not interpret html as grit instructions (Oleg Gaidarenko)
* js-file: make grit regexp case-insensitive (Oleg Gaidarenko)
* Misc: add `only` property to `reportAndFix` assert helper (Oleg Gaidarenko)
* Misc: make jslint happy (Oleg Gaidarenko)
* Misc: make lint happy (Oleg Gaidarenko)
* Misc: use node "4" instead of node "4.0" in travis (Henry Zhu)
* Misc: correct code style violations (Oleg Gaidarenko)
* Misc: add node 4.0 to travis (Henry Zhu)
* Misc: autofix tests for rules that are not supported by default presets (Oleg Gaidarenko)
* Misc: change default mocha reporter (Oleg Gaidarenko)
* Misc: disable duplicative jshint check for semicolons (Oleg Gaidarenko)
* Misc: do not show console.error at the test run (Oleg Gaidarenko)
* Misc: increase coverage and use console.error for maxError output (Oleg Gaidarenko)
* Misc: increase rules coverage (Oleg Gaidarenko)
* Misc: use full lodash package (Oleg Gaidarenko)
* Misc: add `requireSemicolons` rule to our jscsrc (Oleg Gaidarenko)
* `requireCapitalizedComments`: remove merge artefacts (Oleg Gaidarenko)
* `*Semicolons`: increase coverage (Oleg Gaidarenko)
* String-checker: pass `file` instance to `_fix` method (Oleg Gaidarenko)
* Strip `BOM` from config files (Jonathan Wilsson)
* Support `null` and `-1` values for `maxErrors` option (Daniel Anechitoaie)
* Tests: improve `reportAndFix` assertion helper (Oleg Gaidarenko)
* Utils: add `isPragma` method (Brian Dixon)

## Version [2.1.1](https://github.com/jscs-dev/node-jscs/compare/v2.1.0...v2.1.1)

### Overview

This release consists mostly of bug-fixes. Check them out – there are a lot of them!

We also managed to squeeze two new rules - [requireSpacesInsideParenthesizedExpression](http://jscs.info/rule/requireSpacesInsideParenthesizedExpression.html) and [disallowSpacesInsideParenthesizedExpression](http://jscs.info/rule/disallowSpacesInsideParenthesizedExpression.html), increase performance, and improve ES6 support.

#### Fix regarding global jscs installs and plugins

One of the biggest issues fixed: a **global** jscs install can finally load **local** extensions (à la gulp style) like error-filters, plugins, additional rules, and presets.

This will fix issues with using a custom preset with something like [SublimeLinter](https://packagecontrol.io/packages/SublimeLinter-jscs) which uses the global jscs install.

- To make a custom preset, you need to publish a npm package with a jscs config file
- We recommend the package name starts with `jscs-preset-` or with `jscs-config-` to help with searching for presets on npm and defining it in your config
- This would allow you to specify your preset more succinctly: `”preset”: “awesome”` instead of `”preset”: “jscs-preset-awesome”`
- You can also share multiple presets in one package with `”preset”: “awesome/super-awesome”`, provided that you have `super-awesome.{json, js}` in your package root directory
- Create a `jscs.json` file to store your jscs config
- In your `package.json`, set the `main` field to `jscs.json`

```js
// example package.json in `jscs-config-awesome`
{
  “name”: “jscs-config-awesome”,
  “version”: “1.0.0”,
  “main”: “jscs.json”
}

// example .jscsrc using a custom preset
// assuming the preset package name is `jscs-config-awesome`
{
  “preset”: “awesome”,
  “disallowEmptyBlocks”: false // example of disabling a preset rule with false
}
```

We will add more comprehensive documentation for this feature a bit later, so stay tuned.

#### Disable a rule with `false` or `null`

You can use `false` (instead of only `null`) to disable a rule (such as in a preset). This was a point of confusion for newer users. To disable a rule you can do:

```js
{
  “preset”: “airbnb”,
  “disallowEmptyBlocks”: null // disabling a rule with null
  “disallowSpacesInCallExpression”: false // disabling a rule with false
}
```

### New Rules
* New Rule: SpacesInsideParenthesizedExpression (Richard Gibson)

### Enhancements
* Configuration: disable any rule if its value equals to "false” (Oleg Gaidarenko)

### Bug Fixes
* requireDollarBeforejQueryAssignment: Ignore destructuring assignment (Simen Bekkhus)
* validateIdentation: fix on empty switch blocks (Henry Zhu)
* disallowQuotedKeysInObjects: fix allowing quoted non-reserved keys (Alexej Yaroshevich)
* disallowParenthesesAroundArrowParam: allow destructuring of param (Henry Zhu)
* requireTrailingComma: correct error message (monk-time)
* requirePaddingNewLinesAfterBlocks: do not report arrow fn chaining (Oleg Gaidarenko)
* safeContextKeyword: miss destructuring assignment (Oleg Gaidarenko)
* disallowNodeTypes: correct configure error (Alexander Zeilmann)
* requireDollarBeforejQueryAssignment: Ignore destructuring assignment (Simen Bekkhus)
* paddingNewlinesInBlocks: add exceptions and open/close options (Kai Cataldo)
* requireSpacesInAnonymousFunctionExpression: add allExcept option (Ken Sheedlo)
* curlyBraces: support `for..of` statements (regseb)

### Misc
* Configuration: allow load of external entities from external preset (Oleg Gaidarenko)
* CLI:Configuration: load local jscs modules if present (Oleg Gaidarenko)
* JsFile: Improve getNodeByRange performance (Richard Gibson)
* disallowQuotedKeysInObjects: rework tests and deprecate allButReserved value (Alexej Yaroshevich)

### Docs
* Docs: update examples on how to disable (Oleg Gaidarenko)
* Docs: improve documentation for various rules (oredi)
* Docs: fix typos in examples for disallowSpaceAfterObjectKeys (Yoni Medoff)
* Docs: improve documentation for various rules (oredi)
* Docs: small changelog corrections (Oleg Gaidarenko)
* Docs: make it clearer node_modules is excluded, and ! can be used to include (Henry Zhu)

## Version [2.1.0](https://github.com/jscs-dev/node-jscs/compare/v2.0.0...v2.1.0)

### Overview
In this release, we added three more rules: two of them are ES6-only, they "protect" you
from the downside of arrow functions (see [1](http://jscs.info/rule/disallowArrowFunctions.html) and [2](http://jscs.info/rule/disallowShorthandArrowFunctions.html) for an explanation of why you might want to enable them) and another universal one if you [like](http://jscs.info/rule/validateOrderInObjectKeys.html) to keep your object neat and tidy.

Airbnb, jQuery, and Wordpress presets are now using some of the new rules we added in the previous release. Whereas, the wikimedia preset is now less strict for [JSDoc](http://jscs.info/rule/jsDoc.html) comments.

This release also includes a JSON reporter, lots of bug fixes and enhancements, plus couple new rule values for your linting pleasure.

### Presets
* Preset: define exclusions for wordpress preset (Weston Ruter)
* Preset: add couple new rules to airbnb preset (Christophe Hurpeau)
* Preset: Set jsDoc.checkTypes to "strictNativeCase" for Wikimedia (Timo Tijhof)
* Preset: add "disallowSpaceBeforeComma" rule to jquery preset (Oleg Gaidarenko)

### New rules
* New Rule: disallowShorthandArrowFunctions (Jackson Ray Hamilton)
* New Rule: disallowArrowFunctions (Jackson Ray Hamilton)
* New Rule: validateOrderInObjectKeys (Rui Marinho)

### New rule values
* disallowEmptyBlocks: allow blocks with comments (Michael Robinson)
* requirePaddingNewlinesAfterUseStrict: allow immediate "require" (Michael Robinson)
* requireAnonymousFunctions: Add exception for function declarations (Kai Cataldo)
* requireBlocksOnNewline: Add object option to handle comments (oredi)
* requireTemplateString: string and template string concatentation support (Michelle Bu)

### Enhancements
* Configuration: allow load configs with ".jscsrc" extension (Oleg Gaidarenko)
* Reporters: add new JSON reporter (Roman Blanco)
* Configuration: extend and improve default value of array options (Oleg Gaidarenko)
* SpaceBeforeObject(Keys|Values): support spread in object literals (Ronn Ross)
* SpacesInAnonymousFunctionExpression: consider ES6 "constructor" method (Oleg Gaidarenko)
* validateIndentation: reduce RegExp create count (optimization) (Roman Dvornov)
* validateAlignedFunctionParameters: small simplification (Oleg Gaidarenko)
* disallowEmptyBlocks: should not report empty arrow blocks (Jake Zatecky)
* validateAlignedFunctionParameters: account for arrow functions (Jake Zatecky)
* requirePaddingNewlinesAfterBlocks: ignore parentheses of last item (Christophe Hurpeau)

### Bugs
* requireMatchingFunctionName: fix critical bug and add tests (Alexej Yaroshevich)
* disallowSpacesInCallExpression: report only on a node's round brace (Joel Kemp)
* disallowSpacesInCallExpression: consider fitting parentheses case (Oleg Gaidarenko)
* CLI: correct reporter error (Roman Dvornov)
* SpacesIn*: fix for shorthand methods/class methods, update tests (Henry Zhu)
* requireAlignedObjectValues: fix computed keys with MemberExpressions (Henry Zhu)
* requireParenthesesAroundArrowParam: account for a single rest parameter (Henry Zhu)
* requirePaddingNewLinesBeforeLineComments: fix for newlines above comment (Henry Zhu)

### Docs
* Docs: Fix a typo in requireVarDeclFirst (Chayoung You)
* Docs: point to jscs.info for the list of maintainers (Oleg Gaidarenko)
* Docs: improve preset documentation (Oleg Gaidarenko)
* Docs: Fix typos in requireCapitalizedComments (Chayoung You)
* Docs: Fix a typo in maximumNumberOfLines (Chayoung You)
* Docs: Add justifications for arrow function rules (Jackson Ray Hamilton)
* Docs: correct docs for the" disallowNodeTypes" rule (Dmitry Semigradsky)
* Docs: Fixed typo, update link for clarity/correct URL (Kai Cataldo)
* Docs: Fixed typo in disallowSpaceAfterObjectKeys (Brian Ng)
* Docs: use correct links to new rules (Pavel Zubkou)
* Docs: bring back coveralls badge (Oleg Gaidarenko)
* Docs: Error 404 on the requireObjectKeysOnNewLine link (Roman Nuritdinov)
* Docs: Link to built-in JSCS plugin for JetBrains IDEs (Simen Bekkhus)
* Docs: improve and correct the changelog (Oleg Gaidarenko)
* Docs: small example improvement for "disallowSpaceBeforeComma" rule (Oleg Gaidarenko)

### Misc
* requireLineFeedAtFileEnd: Test to ensure IIFE case still reports (Joel Kemp)
* Misc: add Henry to list of maintainers (Oleg Gaidarenko)
* Misc: make jshint happy (Oleg Gaidarenko)
* Misc: exclude only problematic module from coverage (Oleg Gaidarenko)
* Misc: once again hide coverage status (Oleg Gaidarenko)
* Misc: correct merge artefact (Oleg Gaidarenko)
* Misc: support spread in object literals (Henry Zhu)
* Misc: update Esprima to 2.5.0 (Henry Zhu)
* Misc: cache `node_modules` dir in travis CI (Oleg Gaidarenko)
* AutoConfigure: Tests now depend on a preset clone (Joel Kemp)
* Revert "Changelog: use conventional-change..." (Oleg Gaidarenko)
* Changelog: use conventional-changelog and conventional-github-releaser (Steve Mao)

## Version [2.0.0](https://github.com/jscs-dev/node-jscs/compare/v1.13.1...v2.0.0)

### Overview

Gosh! We haven’t released a new version in more than two months! What have we done all this time?
Well, we were working hard on the next big step - 2.0!

And we’re finally ready to show it to you. We’ve improved JSCS all over the place!

### `esnext`
It was a big pain to check ES6/JSX code with JSCS, since you had to install special extensions or different parsers. Well, no more of that! Thanks to all the hard work of the @hzoo, now you can just write `"esnext": true` in your config or execute JSCS from the CLI with the `--esnext` flag.
Now all that new fancy code will be examined without any hassle, as [decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841), [function bind (::)](https://github.com/zenparsing/es-function-bind) operator, and all valid babel code can be checked by JSCS.

We also added seven ES6-only rules; see below for more information.

### Autofixing
We really want to support autofixing for as many rules as possible. But as it turns out, we are at forefront of this problem; it’s really hard to change the code without affecting unrelated instructions.

What we need is a [Concrete Syntax Tree](https://en.wikipedia.org/wiki/Parse_tree), instead of the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) + tokens structures that we use now. Unfortunately, there is no CST standard for JavaScript at the moment – this is why we decided to step up and come up with our vision of a CST - https://github.com/mdevils/cst. Currently, we are working with the [estree](https://github.com/estree/estree/issues/41) team on this proposal – hoping the development of this crucial part of JavaScript parsing will move faster.

Meanwhile, using some workarounds and hacks, we managed to support autofixing for 4 more rules:

* [requireTrailingComma](http://jscs.info/rule/requireTrailingComma.html)
* [disallowTrailingComma](http://jscs.info/rule/disallowTrailingComma.html)
* [disallowTrallingWhitespace](http://jscs.info/rule/disallowTrailingWhitespace.html)
* [validateQuoteMarks](http://jscs.info/rule/validateQuoteMarks.html)

### New rules
There are 31 new rules, including 16 rules for JSDoc [validation](http://jscs.info/rule/jsDoc.html), and 7 ES6-only rules:

* [requireSpaceBeforeComma](http://jscs.info/rule/requireSpaceBeforeComma.html)
Require spaces before commas
* [disallowSpaceBeforeComma](http://jscs.info/rule/disallowSpaceBeforeComma.html)
Disallow spaces before commas
* [requireVarDeclFirst](http://jscs.info/rule/requireVarDeclFirst.html)
Requires `var` declaration to be on the top of an enclosing scope
* [disallowSpaceBeforeSemicolon](http://jscs.info/rule/disallowSpaceBeforeSemicolon.html)
Disallows spaces before semicolons.
* [requireMatchingFunctionName](http://jscs.info/rule/requireMatchingFunctionName.html)
Requires function names to match member and property names.
* [disallowNodeTypes](http://jscs.info/rule/disallowNodeTypes.html)
Disallow use of certain [node types](https://github.com/jquery/esprima/blob/758196a1c5dd20c3ead6300283a1112428bc7045/esprima.js#L108-L169) (from Esprima/ESTree).
* [requireObjectKeysOnNewLine](http://jscs.info/rule/requireObjectKeysOnNewLine.html)
Requires placing object keys on new line
* [disallowObjectKeysOnNewLine](http://jscs.info/rule/disallowObjectKeysOnNewLine.html)
Disallows placing object keys on new line

#### New ES6-only rules
* [disallowParenthesesAroundArrowParam](http://jscs.info/rule/disallowParenthesesAroundArrowParam.html)
Disallows parentheses around arrow function expressions with a single parameter.
* [requireArrowFunctions](http://jscs.info/rule/requireArrowFunctions.html)
Requires that arrow functions are used instead of anonymous function expressions in callbacks.
* [requireNumericLiterals](http://jscs.info/rule/requireNumericLiterals.html)
Requires use of binary, hexadecimal, and octal literals instead of `parseInt`.
* [requireParenthesesAroundArrowParam](http://jscs.info/rule/requireParenthesesAroundArrowParam.html)
Requires parentheses around arrow function expressions with a single parameter.
* [requireShorthandArrowFunctions](http://jscs.info/rule/requireShorthandArrowFunctions.html)
Require arrow functions to use an expression body when returning a single statement
* [requireSpread](http://jscs.info/rule/requireSpread.html)
Disallows using `.apply` in favor of the spread operator
* [requireTemplateStrings](http://jscs.info/rule/requireTemplateStrings.html)
Requires the use of template strings instead of string concatenation.

There are also a lot of new rule values (see the ["Changelog"](#changelog) section) which makes a lot of rules more flexible.

We also added new rules and values to some presets. If you feel that we’ve missed something, don't be quiet! Send us a PR and we will surely add the needed rules to your favorite preset.

### Simplified inclusion of plugins, presets, and custom rules
Since every possible JSCS extension can now be loaded without defining its full path, it is enough to just specify the needed dependency to your project so it can be found by JSCS.

```js
{
  "plugins": ["./your-local-package"], // Same with `additionalRules` and `preset` options
  "plugins": ["jscs-your-npm-package"],
  "plugins": ["your-npm-package"], // can omit “jscs-” prefix if you want
}
```

### Other
* Support for disabling rules on a [single line](http://jscs.info/overview.html#disabling-specific-rules-for-a-single-line) -
```js
if (x) y(); // jscs:ignore requireCurlyBraces
if (z) a(); // will show the error with `requireCurlyBraces`
```

* Two new reporters - `summary` (could be very helpful to acquire full overview of all possible errors in your project) and `unix`. You could enable them by providing [`--reporter=<reporter name>`](http://jscs.info/overview.html#-reporter-r) flag.

* `node_modules` path is included by default to [`excludeFiles`](http://jscs.info/overview.html#excludefiles)

* For every possible error, like missing or corrupted config, JSCS now provides [different](https://github.com/jscs-dev/node-jscs/wiki/Exit-codes) exit-codes. We believe it might be useful for piping, editors plugins, etc.

* JSCS (like any good unix program) now obeys the [rule of silence](http://www.linfo.org/rule_of_silence.html).

And of course, a lot of bug-fixes, improved ES6 support of existing rules, docs, infrastructure changes, etc.

Although this is major version, we didn't remove deprecated rule values or changed config format, we expecting to do this in the 3.0 version while switching to CST and fully refactor JSCS code-base.

### Changelog

Backward incompatible changes
* Utils: remove comma from list of binary operators (Oleg Gaidarenko)
* Checker: remove deprecated constructor options (Oleg Gaidarenko)
* Obey the Rule of Silence (Feross Aboukhadijeh)
* Configuration: add ability to load external presets (Oleg Gaidarenko)
* Configuration: small corrections to JSDoc of "node-configuration" module (Oleg Gaidarenko)
* Configuration: small refactoring of the configuration module (Oleg Gaidarenko)
* Configuration: allow "getReporter" method to require node modules (Oleg Gaidarenko)
* Configuration: initial pass on the polymorphic require (Oleg Gaidarenko)
* Checker: more API changes for 2.0 (Oleg Gaidarenko)
* CLI: Differentiate exit codes (Oleg Gaidarenko)
* Misc: set default value of maxErrors option to 50 (Oleg Gaidarenko)
* yodaConditions: remove comparison operators from default set (Oleg Gaidarenko)
* Misc: remove all deprecated rules/tests (Henry Zhu)
* API: allow external entities to be defined without "jscs" prefix (Oleg Gaidarenko)
* Configuration: exclude `node_modules/` by default (Louis Pilfold)
* CLI: set "maxErrors" to Infinity with enabled "fix" option (Oleg Gaidarenko)
* Misc: change default dialect to es5 and make appropriate changes (Alexej Yaroshevich)

Autofix
* Autofix: remove merge artefact (Oleg Gaidarenko)
* Autofix: support disallowTrailingComma rule (Oleg Gaidarenko)
* Autofix: support trailing whitespaces and missing commas (Andrzej Wamicz)
* validateQuoteMarks: try out "fix" field (Oleg Gaidarenko)

Preset
* Preset: requireSemicolons = true for google preset (BigBlueHat)
* Preset: add jsDoc rules to relevant presets (Oleg Gaidarenko)
* Preset: add disallowTrailingWhitespace to MDCS (Joshua Koo)
* Preset: add requireVarDeclFirst rule to the relevant presets (Oleg Gaidarenko)
* Preset: update Wordpress preset (Ivo Julca)
* Preset: add requireCapitalizedComments to jquery and wordpress presets (Oleg Gaidarenko)
* Preset: update mdcs (Joshua Koo)
* Preset: require trailing comma in airbnb preset (Christophe Hurpeau)
* Preset: add missing rules to google preset (Christophe Hurpeau)
* Preset: update airbnb preset (Craig Jennings)
* Preset: update jquery and dependant presets (Oleg Gaidarenko)
* Preset: require spaces in anonymous FE for crockford style (Oleg Gaidarenko)
* Preset: fix requireDotNotation rule value according to es3 changes (Alexej Yaroshevich)
* Preset: remove jsdoc rules from yandex preset (Oleg Gaidarenko)

New rules
* New rules: add SpaceBeforeComma rules (shashanka)
* New Rule: requireVarDeclFirst (oredi)
* New Rule: add JSDoc rules (Oleg Gaidarenko)
* New Rule: (disallow|require)SpaceBeforeSemicolon (Richard Munroe)
* New Rule: requireMatchingFunctionName (Pavel Strashkin)
* New Rule: requireTemplateStrings (Henry Zhu)
* New Rule: (require|disallow)ParenthesesAroundArrowParam (Henry Zhu)
* New Rule: requireSpread (Henry Zhu)
* New Rule: requireShorthandArrowFunctions (Henry Zhu)
* New Rule: requireArrowFunctions (Henry Zhu)
* New Rule: disallowNodeTypes (Henry Zhu)
* New Rule: requireNumericLiterals (Henry Zhu)
* New Rule: (disallow|require)ObjectKeysOnNewLine (Eli White)

New rule values
* requireYodaConditions: support an array of operators (Ivo Julca)
* disallowYodaConditions: support an array of operators (Ivo Julca)
* (require|disallow)AnonymousFunctionExpression: account for shorthand methods (Henry Zhu)
* disallowMultipleVarDecl: add exception for require statements (Stefano Sala)
* disallowSpaceAfterObjectKeys: added ignoreAligned option (Andrey Ermakov)
* maximumLineLength: allow function delcarations to exceed limit (Clay Reimann)
* requirePaddingNewLinesAfterBlocks: add "inNewExpressions" to exceptions (Mato Ilic)
* disallowCommaBeforeLineBreak: added allExcept function (Andrey Ermakov)
* requirePaddingNewlinesInBlocks: Add object option to configuration (oredi)
* maximumLineLength: Add exception for long require expressions (Philip Hayes)
* NewlineBeforeBlockStatement: allow settings per block statement type (Dave Hilton)
* validateIndentation: add option to ignore comments (Danny Shternberg)

Enhancements for ES6 support
* requireSemicolons: Add support for import and export declarations (Roman Dvornov)
* Esprima: Upgrade to 2.4.0 (Joel Kemp)
* requireArrowFunctions: don't check AssignmentExpression or Property (Henry Zhu)
* SpacesInFunctionDeclaration: check export default function (Henry Zhu)
* AlignedObjectValues: support computed property names (Henry Zhu)
* (disallow|require)SpaceAfterObjectKeys: check object method shorthand (Henry Zhu)
* (require|disallow)SpaceAfterObjectKeys: support computed properties (Henry Zhu)
* SpacesInsideObjectBrackets: Add Check for destructive assignments (Oleg Gaidarenko)
* Misc: use babel-jscs for the esnext option (Henry Zhu)
* requireSemicolons: Don't warn on class and function exports (Roman Dvornov)

Inline control
* Errors: Ability to suppress a single line (Louis Pilfold)
* StringChecker: Remove grit processing includes (Tony Ganch)

New reporters
* Reporters: add new machine readable unix-style reporter (Andreas Tolfsen)
* Reporters: add new summary reporter (oredi)

Bug fixes
* Revert "New Rule: (disallow|require)SpaceBeforeSemicolon" (Oleg Gaidarenko)
* requireMultipleVarDecl: add exception for require statements (Stefano Sala)
* requirePaddingNewlinesAfterBlocks: initialize exceptions in configure (Eli White)
* disallowSpaceAfterKeywords: fix "else if" case (Henry Zhu)
* String-checker: do not check empty strings (Oleg Gaidarenko)
* requirePaddingNewLinesAfterBlocks: fixing blocks that end with semicolons (Eli White)
* disallowPaddingNewLinesAfterBlocks: fix blocks which end with semicolon (Oleg Gaidarenko)
* disallowSpaceAfterObjectKeys: support for legacy options (Andrey Ermakov)
* requireAlignedObjectValues: do not assert exact amount of spaces before colons (Andrey Ermakov)
* disallowImplicitTypeConversion: Don't report concat for same string literals (Oleg Gaidarenko)
* disallowSpacesInCallExpression: Extend rule to validate NewExpression (Inian Parameshwaran)
* Iterator: correct "TryStatement" path (Oleg Gaidarenko)
* requirePaddingNewLinesAfterBlocks: consider IIFE case (Oleg Gaidarenko)
* disallowKeywordsOnNewLine: Allow comments before keywords (oredi)

Docs
* Docs: last minutes updates for 2.0 (Oleg Gaidarenko)
* Docs: update rules sum (Oleg Gaidarenko)
* Docs: add es3 option to OVERVIEW.md (Oleg Gaidarenko)
* Docs: reflect some of the 2.0 changes (Oleg Gaidarenko)
* Docs: clarify space brackets rules description (Oleg Gaidarenko)
* Docs: Remove needless semicolon (yong woo jeon)
* Docs: fix diff range link for 1.13.1 version (Alexej Yaroshevich)
* Docs: add link to commits between minor releases in CHANGELOG (Henry Zhu)
* Docs: Document how to programmatically invoke jscs (K. Adam White)
* Docs: Add and improve docs for inline comments (oredi)
* Docs: add message about demo not working, fix link to team (Henry Zhu)
* Docs: Change label to beginner-friendly (oredi)
* Docs: Mention which tickets are beginner-friendly (Joel Kemp)
* Docs: add "allowEOLComments" option info for disallowMultipleSpaces rule (bigmonkeyboy)
* Docs: correct syntax error for disallowFunctionDeclarations rule (Christophe Hurpeau)
* Misc: Docs: add docs and test for "esprima" config option (Oleg Gaidarenko)
* Docs: correct `true` value description (Adrian Heine né Lang)
* Docs: add quotes to the "wordpress" preset (raimon)
* Docs: align gitter badge with others (Oleg Gaidarenko)
* Docs: Add gitter room to readme (Joel Kemp)
* Docs: fix table of contents anchor links in contributing.md (Henry Zhu)
* Docs: add protocol to homepage address (Oleg Gaidarenko)
* Docs: update outdated info & fix small issue in jscs config (Oleg Gaidarenko)
* Docs: correct validateAlignedFunctionParameters values (Adrian Heine né Lang)
* Docs: various corrections for the rules page (Oleg Gaidarenko)
* disallowPaddingNewlinesInObjects: Clarify documentation (Ángel Sanz)
* requireSpacesInAnonymousFunctionExpression: fix syntax error in docs (Christophe Hurpeau)

Misc
* Misc: add disallowTrailingComma rule to jscs config (Oleg Gaidarenko)
* Tests: correct preset examples (Oleg Gaidarenko)
* Misc: use babel-jscs 2.0.0, move jscs-jsdoc to dependencies (Henry Zhu)
* Misc: remove merge artefact (Oleg Gaidarenko)
* String-checker: make "fix" field private (Oleg Gaidarenko)
* Configuration: improve JSDoc notes (Oleg Gaidarenko)
* String-checker: use "fix" field in rule declaration if it exist (Oleg Gaidarenko)
* Errors: add "cast" method (Oleg Gaidarenko)
* Configuration: add "getConfiguredRule" method (Oleg Gaidarenko)
* Configuration: simplify and modulize configuration module (Oleg Gaidarenko)
* Tests: do not define anything if test should not run (Oleg Gaidarenko)
* Iterator: update to latest estraverse and don't monkeypatch (Oleg Gaidarenko)
* Misc: Add node .12 and io.js to the travis (Oleg Gaidarenko)
* Misc: add support for babel-jscs (Henry Zhu)
* Misc: bump estraverse to 2.x (Oleg Gaidarenko)
* requireArrowFunctions: only error for callbacks (Henry Zhu)
* Tests: Move require-matching-function-name to spec folder (Joel Kemp)
* requirePaddingNewlinesInBlocks: Refactor unit tests (oredi)
* requirePaddingNewlinesBeforeKeywords: Modify special scenarios (oredi)
* Tests: ES2015 Airbnb Preset (Christophe Hurpeau)
* requireTemplateStrings: refactor, check if either node is a string (Henry Zhu)
* Deps: Update JSHint and Lodash.assign (paladox)
* Improve JsFile constructor for better encapsulation (Marat Dulin)
* Refactor integration tests (Marat Dulin)
* Misc: remove extraneous file (Henry Zhu)
* Misc: increase coverage of remaining rules (Henry Zhu)
* disallowParenthesesAroundArrowParam: make exception when using a default parameter (Henry Zhu)
* requireTemplateStrings: improve logic (Oleg Gaidarenko)
* Misc: update dependencies (Henry Zhu)
* Misc: support class methods for various function rules (Henry Zhu)
* Misc: fix test filename for disallowSpaceBeforeObjectValues (Henry Zhu)
* Misc: add intergration tests for "autofix" feature (Oleg Gaidarenko)
* Tests: correct couple assertions (Oleg Gaidarenko)
* Misc: fix jsdoc types with non-standard Promise-star declaration (Alexej Yaroshevich)
* Lint: Add jscs-jsdoc plugin (Alexej Yaroshevich)
* Misc: update dependencies & temporary remove coverage badge (Oleg Gaidarenko)
* Misc: code style fixes (Alexej Yaroshevich)
* Misc: introduce reservedWords instead of utils.isES3 (Alexej Yaroshevich)
* Intergration: correct integration tests for big amount of results (Oleg Gaidarenko)
* validateIndentation: deprecate includeEmptyLines in favour of allExcept (Oleg Gaidarenko)

## Version [1.13.1](https://github.com/jscs-dev/node-jscs/compare/v1.13.0...v1.13.1)

### Overview
Small update for fix distribution of the `--esnext` CLI option (#1321)

### Bug fixes
* CLI: use "esnext" cli option in the configuration module (Oleg Gaidarenko)
* CLI: ensure options to path.resolve are strings (Jason Karns)
* disallowMultipleSpaces: fix configuration error message (Marc Knaup)

### Docs
* Docs: correct example for the "requireCapitalizedComments" rule (XhmikosR)
* Docs: Update mixup between rules in docstring example (Jérémie Astori)
* Docs: Fix missing quotes in a docstring example (Jérémie Astori)

## Version [1.13.0](https://github.com/jscs-dev/node-jscs/compare/v1.12.0...v1.13.0)

### Overview

This is mostly an incremental update, which includes important fixes for annoyances like `npm ERR! EEXIST, symlink` error at `npm install`. We also improved ES6 support, added seven new rules, three new rule values and now you can declare `verbose` option at the config.

There are no preset updates in this release, but if you feel that rules are missing in
the supported [presets](http://jscs.info/overview.html#presets) - please send us a PR.

We eagerly wait for the Esprima 2.3 release, since soon after, `esnext` option will be set to `true` by default.

We would like specifically thanks @TheSavior and @hzoo for their hard work on this release.

### New options
* New option: add "verbose" option as a config option (Oleg Gaidarenko)

### New rules
* New rule: validateAlignedFunctionParameters (Bram Cordie)
* New rule: (disallow|require)PaddingNewLinesBeforeExport (Eli White)
* New rule: validateNewlineAfterArrayElements (Alexej Yaroshevich)
* New rule: (require |disallow)NamedUnassignedFunctions (Todd Wolfson)
* New rule: maximumNumberOfLines (Henry Zhu)
* New rule: (disallow|require)PaddingNewLinesAfterUseStrict (Eli White)
* New rule: disallowNotOperatorsInConditionals (Henry Zhu)

### New rule values
* requirePaddingNewLinesAfterBlocks: add exceptions (Eli White)
* requireSpaceBeforeBlockStatements: add number of spaces argument (Oleg Pesok)
* requireDollarBeforejQueryAssignment: add "ignoreProperties" rule value (Alexej Yaroshevich)

### Bug fixes
* paddingNewLinesBeforeLineComments: code and comment on the same line (Oleg Gaidarenko)
* disallowKeywordsOnNewLine: "do..while" on new line (oredi)
* requirePaddingNewLinesBeforeLineComments: first token and not first line (Eli White)
* Errors: should not show rule for "Unsupported rule" error (Oleg Gaidarenko)
* requireOperatorBeforeLineBreak: autofix by moving operator (Nick Santos)
* disallowIdentifierNames: fix errors with using object properties as an identifier (Henry Zhu)
* requireDollarBeforejQueryAssignment: Allow leading underscores before $ sign (Eli White)
* requireCamelCaseOrUpperCaseIdentifiers: skip es5 getters if ignoreProperties is set (Alexej Yaroshevich)
* requireSemicolons: fix warning positions (Roman Dvornov)
* requireMultipleVarDecl: fix switch statement case (Todd Wolfson)
* paddingNewLineAfterVariableDeclaration: simlification and more tests (Oleg Gaidarenko)
* paddingNewLineAfterVariableDeclaration: add check for let and const (Martin Kolárik)
* paddingNewLineAfterVariableDeclaration: do not trip off on the semicolon (Oleg Gaidarenko)
* paddingNewLinesAfterBlocks: ease up on function calls (Oleg Gaidarenko)
* requirePaddingNewLineAfterVariableDeclaration: allow exception (Henry Zhu)
* requireLineBreakAfterVariableAssignment: add check for let and const (Henry Zhu)
* requireCapitalizedComments: handle textblocks correctly (Martin Kolárik)

### Misc
* js-file: small JSDoc improvement (Oleg Gaidarenko)
* Tests: fix node-style-guide preset (Martin Kolárik)
* Utils: add "true" and "false" to list of reserved words (Dmitry Sorin)
* Update esprima-harmony version (Oleg Gaidarenko)
* Tests: Add a test helper for asserting errors and autofix (Eli White)
* disallowKeywordsOnNewLine: make jshint happy (Oleg Gaidarenko)
* disallowMultipleVarDecl: add test for var inside switch clause (Alexej Yaroshevich)
* errors: additional tests, coverage (Alexej Yaroshevich)
* string-checker: wrap rule.check into try-catch (Alexej Yaroshevich)
* errors: fix test flow with filtering (Alexej Yaroshevich)

### Docs
* Docs: add link to overcommit under "Friendly packages" (Joe Lencioni)
* Docs: add a message to mention the verbose option (Henry Zhu)
* Docs: clarify that CLI options can be used in the config (Henry Zhu)
* Docs: clarify that disallowMultipleSpaces matches tabs and spaces (Henry Zhu)
* Docs: clarify how to disable a rule and use a config file (Henry Zhu)
* Docs: Clarify behavior of requireCamelCaseOrUpperCaseIdentifiers (Henry Zhu)
* Docs: fix disallowMultipleSpaces rule name in CHANGELOG (Alexej Yaroshevich)
* Docs: add two new presets to list of preset values (Jed Wood)
* Docs: add link to the preset option from the list of presets (Steve Lee)
* Docs: add shorten flags to cli (Henry Zhu)
* Docs: add auto fix option to cli docs (Henry Zhu)
* Docs: fix disallowMultipleSpaces invalid example (Henry Zhu)
* Docs: fix various docs typos (Eli White)

## Version [1.12.0](https://github.com/jscs-dev/node-jscs/compare/v1.11.0...v1.12.0)

### Overview
Ladies and Gentlemen... Elvis is in the building - auto-fixing is finally here! We were working really hard to make this powerful new feature, and to make it right. We're hoping it will truly help make your code look good.

Auto-fixing supports the [EOF rule](http://jscs.info/rules.html#requirelinefeedatfileend) and all rules related to spacing, including [validateIndentation](http://jscs.info/rules.html#validateindentation) which is the most complicated rule we have (big thanks to @mikesherov for making that happen).

Although this chunk of rules covers most of the popular use-cases, we're determine to add more rules to this list, please help us out and report any bugs or consider contributing with some code - http://jscs.info/contributing.html. We're really friendly to every new contributor.

Apart from auto-fixing, there are six new rules – fresh out of the oven. Special thanks goes to @lahmatiy, who had the patience and perseverance to implement [`requireSemicolons`](http://jscs.info/rules.html#requiresemicolons).

Because of tireless efforts of @hzoo, we're adding two new presets in this release - [`node-style-guide`](https://github.com/felixge/node-style-guide ) and [`wordpress`](https://make.wordpress.org/core/handbook/coding-standards/javascript). They have pretty consistent style guides... try it out; They are a breeze to work with.

We're very grateful to everyone who helped out with this release, especially to @TheSavior who helped review the pull requests and shape out our API.

### Preset updates
* Preset: remove "requireMultipleVarDecl" rule from jquery preset (Oleg Gaidarenko)
* Preset: wordpress (Henry Zhu)
* Preset: Add "requireSemicolons" rule to the Yandex preset (ikokostya)
* Preset: Add validate indentation rule for Yandex (Gunnar Lium)
* Preset: node-style-guide (Henry Zhu)
* Preset: update airbnb preset (Eli White)
* Preset: require blank line before all line comments for jQuery preset (Eli White)
* Preset: Add "requireSpaceBeforeObjectValues" to crockford test (Jackson Ray Hamilton)

### Auto-fixing
* validateIndentation: autofixing! (Mike Sherov)
* TokenAssert: only fix lines when comments do not exist between tokens (Mike Sherov)
* disallowMultipleLineString: do not yet allow autofixing, which is a non-whitespace change (Mike Sherov)
* disallowSemicolons: do not yet allow autofixing, which is a non-whitespace change (Mike Sherov)
* Autofixing: add more rules to use assertion framework (Henry Zhu)
* Autofixing: make most rules use assertion framework when possible (Eli White)
* Autofixing: initial implementation (mdevils)
* Autofixing: token data (mdevils)

### New rules
* New Rule: requireSemicolons (Roman Dvornov)
* New Rule: disallowMultipleSpaces (Todd Wolfson)
* New Rule: disallowIdentifierNames (alawatthe)
* New Rule: requirePaddingNewLineAfterVariableDeclaration (Evan Jacobs)
* New Rule: requireDollarBeforejQueryAssignment (Eli White)
* New Rules: (disallow/require)PaddingNewLinesBeforeLineComments (Eli White)

### Rule Values
* requireCapitalizedComments: Add `allExcept` option (Ash Clarke)

### Auto-configuration
* Auto-Configuration: show error count when handling violated rules (fubu)
* Auto-Configuration: show number of violated rules (fubu)

### CLI
* CLI: simplify and increase coverage of "cli-config" module (Oleg Gaidarenko)
* CLI: increase coverage of the "cli" module (Oleg Gaidarenko)

### Bug fixes
* (require|disallow)spacesIn*: add more invalid examples and fixes for rules (Henry Zhu)
* disallowSpacesInsideArrayBrackets: fix error messages (Henry Zhu)
* requireSpacesInsideArrayBrackets: comments should be also taken into account (gero3)
* disallowSpaceBeforeBinaryOperators: comments are allowed (gero3)
* requireLineBreakAfterVariableAssignment: allow exception for init part of for loop (Henry Zhu)
* (require|disallow)SpacesInsideArrayBrackets: use includeComments in token (Henry Zhu)
* disallowAnonymousFunctions: remove errant "s" from error message (James Chin)
* disallowDanglingUnderscores: Corrected rule name in assert message (Oswald Maskens)
* Parsing: Extend estraverse rules to support both XJS and JSX (Henry Zhu)
* (disallow/require)PaddingNewLinesAfterBlocks: Ignoring the end of files (Eli White)
* requirePaddingNewLinesBeforeLineComments: Allow consecutive comments and firstAfterCurly exception (Eli White)

### Misc
* disallowSpacesInsideParentheses: fix es6 template literal token issues (Mike Sherov)
* RequireAlignedObjectValues: use assertions (Mike Sherov)
* DisallowMultipleLineBreaks: use assertions (Mike Sherov)
* Tests: Move to spec folder (Joel Kemp)
* Tests: Adding some more fix tests (Eli White)
* Tests: move specs into a subdir so that tests, fixtures, and utilities aren't intermingled (Mike Sherov)
* Misc: update dependencies (Oleg Gaidarenko)
* JsFile: Make getTokens include comments (Eli White)
* Assertions: Add fixing tests to several rules (Eli White)
* Assertions: add tests for linesBetween (Mike Sherov)
* Assertions: Make sure newlines get fixed (gero3)
* TokenAssert: remove newline fixing logic duplication to prepare for further fixes (Mike Sherov)
* TokenAssert: simplify and strengthen linesBetween rules (Mike Sherov)
* Token Assert: normalize whiteSpace assertions to match line assertions (Mike Sherov)
* requireLineFeedAtFileEnd: make use of assert (gero3)
* Don't trim whitespace in markdown-files (Simen Bekkhus)
* Cleanup: use this.getOptionName() for consistency, options variable (Henry Zhu)
* Cleanup: use iterateTokensByTypeAndValue where appropriate (Mike Sherov)
* Cleanup: remove archaic functions from JsFile (Mike Sherov)
* Cleanup: remove usage of getComment(After|Before)Token (Mike Sherov)
* Cleanup: remove redundant boolean check, use consistent error messages (Henry Zhu)
* Cleanup: use iterateTokensByTypeAndValue and this.getOptionName() (Henry Zhu)
* requireSpaceAfterKeywords: use token assert (Henry Zhu)
* JsFile::getFirstTokenOnLine implementation (for indentation rules) (mdevils)
* Replaces the 'colors' and 'supports-colors' packages with 'chalk'. (Joshua Appelman)
* Fix various doc typos (Jérémie Astori)
* requirePaddingNewLinesAfterBlockDeclarations / disallowPaddingNewLinesAfterBlockDeclarations Adding an option to specify lines for errors.assert.differentLine (Eli White)
* JsFile: add getLineBreaks function to support future whitespace fixes (Mike Sherov)
* Appveyor: freeze node version to 0.12.x (Alexej Yaroshevich)
* requireCapitalizedComments: automatically except `jscs` comments (James Reggio)

### Docs
* Docs: Change "Values" and "Types" to grammatically correct forms (Shmavon Gazanchyan)
* Docs: add reporter (sanemat)
* Docs: less.js uses jscs (Bass Jobsen)
* Docs: added Goodvidio to the list of adopters (Adonis K)
* Fix types and descriptions in documentation (Shmavon Gazanchyan)

## Version [1.11.3](https://github.com/jscs-dev/node-jscs/compare/v1.10.0...v1.11.3)

### Bug Fixes
* JsFile: ensure getLinesWithCommentsRemoved does not alter future getComments calls. (Mike Sherov)

### Misc.
* modules/utils normalizePath: fixed test for windows env (Alexej Yaroshevich)

## Version [1.11.2](https://github.com/jscs-dev/node-jscs/compare/v1.10.0...v1.11.2)

### Bug Fixes
* validateIndentation: ignore empty module bodies (Mike Sherov)
* Object rules: ignore ES5 getters/setters when appropriate. (Mike Sherov)
* Ensure esprimaOptions is not mistaken for a rule (Yannick Croissant)

### Infrastructure Changes
* CI: Add AppVeyor (Adeel)

### Misc.
* Add @zxqfox to the list of maintainers (mdevils)

## Version [1.11.1](https://github.com/jscs-dev/node-jscs/compare/v1.10.0...v1.11.1)

### New Rules / Rule Values
* disallowSpaceAfterObjectKeys: implement ignoreSingleLine and ignoreMultiLine options (Henry Zhu)

### Bug Fixes
* disallowAllowSpacesInsideParentheses: reintroduce archaic "all" config option (Mike Sherov)
* requireSpaceBetweenArguments: loosen rule restriction (Mike Sherov)
* Object Key rules: ignore method syntax (Alexej Yaroshevich)
* (require|disallow)TrailingComma: fixed error location (Alexej Yaroshevich)

### Infrastructure Changes
* Auto-generate: Move promisify to utils (Joel Kemp)

### Misc.
* JSHint: add unused true (Mike Sherov)
* Updating rules to use File Traversal APIs. (Eli White)
* Docs: Add website rebuild instructions to maintenance (Mike Sherov)

## Version [1.11.0](https://github.com/jscs-dev/node-jscs/compare/v1.10.0...v1.11.0)

### Preset Updates
* Preset: add "requireSpaceBetweenArguments" rule to all presets (Oleg Gaidarenko)
* Presets: Remove use of outdated validateJSDoc rule (Joel Kemp)
* Preset: Add "requireSpacesInsideParentheses" to jquery preset (Oleg Gaidarenko)
* Preset: switch multipleVarDecl rule in airbnb preset (Martin Bohal)
* Preset: change value of "requireDotNotation" rule for jquery preset (Oleg Gaidarenko)

### New Config Options
* Configuration: Auto-generation (Joel Kemp)
* Config: Add support for custom Esprima options. (Chris Rebert)

### New Rules / Rule Values
* New Rule: disallowKeywordsInComments (Joe Sepi)
* New Rules: (require|disallow)SpacesInsideBrackets (Mike Sherov)
* validateIndentation: new rule value - includeEmptyLines (Jonathan Gawrych)
* disallowTrailingWhitespace: new rule value - ignoreEmptyLines (Jonathan Gawrych)
* New Rule: disallowCurlyBraces (Henry Zhu)
* requireCapitalizedConstructors: accept list of exempt constructors (Sam L'ecuyer)
* validateIndentation: exception to indentation rules for module pattern (Mike Sherov)

### Bug Fixes
* (require|disallow)SpacesInsideArrayBrackets: only check for ArrayExpressions (Mike Sherov)
* JsFile: remove all duplicate tokens. (Mike Sherov)
* ObjectExpression Rules: take into account shorthand syntax. (Mike Sherov)
* disallowSpaceBeforeKeywords: don't report an error on back-to-back keywords (Mike Sherov)
* requireParenthesesAroundIIFE: fix crash on semicolon-free IIFE (Yuheng Zhang)
* Parsing: tolerate non-leading import statements (Chris Rebert)
* requireCapitalizedComments: improve letter recognition (Mathias Bynens)
* requireSpaces*: fix error message to 'Exactly one space required' (Henry Zhu)
* StringChecker: leading hashbangs should still report correct error line numbers (Mike Sherov)
* validateIndentation: don't check bracelets else indentation. (Mike Sherov)
* validateIndentation: don't consider return when classifying break indentation (Mike Sherov)
* validateIndentation: fix multiline while in doWhile statements (Mike Sherov)
* validateIndentation: ensure pushes and pops are matching (Mike Sherov)
* validateIndentation: ensure semicolon free indentations are on correct line (Mike Sherov)
* SpaceBetweenArguments: catch call expression arguments (Oleg Gaidarenko)
* token-assert: add check for document start to prevent crashes (Alexej Yaroshevich)
* requireSpaceBeforeBlockStatements: reworded an error message (Alexej Yaroshevich)

### Infrastructure Changes
* js-file: added getCommentAfter/BeforeToken functions (Alexej Yaroshevich)
* cleanup: remove lib/token-helper (Mike Sherov)
* JsFile: move getLinesWithCommentsRemoved from comment-helper (Mike Sherov)

### Misc.
* disallowSpacesInsideArrayBrackets: fix rule name in example (Gustavo Henke)
* Misc: update dependencies (Oleg Gaidarenko)
* various rules: use tokenAssert (Henry Zhu)
* Speed up builds by using Docker-based Travis CI (Pavel Strashkin)
* 100% code coverage on various files(Mike Sherov)
* disallowSpace(Before | After)Keywords: more tests (Alexej Yaroshevich)
* requireCurlyBrace: more tests (Alexej Yaroshevich)
* CLI: correct JSDoc comment (Oleg Gaidarenko)
* requireQuotedKeysInObjects: fixing file permissions (Joe Sepi)
* Changelog: correct version number (Oleg Gaidarenko)
* Docs: add missed commit to the changelog (Oleg Gaidarenko)
* Misc: .editorconfig - fix for invalid indent_style value (Dmitriy Schekhovtsov)
* Update regenerate to ~1.2.1 (Chris Rebert)
* Add description to commander CLI help (Chris Rebert)

## Version [1.10.0](https://github.com/jscs-dev/node-jscs/compare/v1.9.0...v1.10.0)
* Preset: correct wikimedia preset test (Oleg Gaidarenko)
* Preset: correct jquery preset test (Oleg Gaidarenko)
* Preset: add disallowKeywordsOnNewLine rule to google preset (Oleg Gaidarenko)
* Preset: add "requireSpacesInForStatement" rule to the presets (Oleg Gaidarenko)
* Preset: add 'catch' to "disallowKeywordsOnNewLine" rule for wikimedia (James Forrester)

* disallowSpacesInForStatement: Disallow spaces in between for statement (gero3)
* requireSpacesInForStatement: Requires spaces inbetween for statement (gero3)
* New rule: requireQuotedKeysInObjects (hpshelton)

* disallowSpacesInsideObjectBrackets: implement "allExcept" option (Oleg Gaidarenko)
* requireSpacesInsideObjectBrackets: implement "allExcept" option (Oleg Gaidarenko)
* disallowSpacesInsideArrayBrackets: implement "allExcept" option (Oleg Gaidarenko)
* requireSpacesInsideArrayBrackets: implement "allExcept" option (Oleg Gaidarenko)
* requireDotNotation: new rule value - except_snake_case (Alexej Yaroshevich)

* Configuration: ability to specify and query es3/es6 support in files. (Mike Sherov)

* cli-config: add "getReporter" method (Oleg Gaidarenko)

* requireSpaceBeforeBlockStatements: fix for else statement (Oleg Gaidarenko)
* disallowSpaceBeforeBlockStatements: fix for else statement (Beau Gunderson)
* disallowKeywordsOnNewLine: add special case for "else" without braces (Oleg Gaidarenko)
* validateIndentation: fix bug with anonymous function return in switch case (Mike Sherov)
* validateIndentation: fix bug with brace-less if in a switch case. (Mike Sherov)
* validateIndentation: fix bug with indentation of bare blocks. (Mike Sherov)
* disallowSpaceAfterBinaryOperators: report correct operator error (Oleg Gaidarenko)
* requireSpaceAfterBinaryOperators: report correct operator error (Oleg Gaidarenko)
* Fixes #909 (wrong type for disallow-capitalized-comments) (alawatthe)
* token-assert: add guards for token and subjectToken properties (Oleg Gaidarenko)
* ESNext: update esprima to properly parse regex tokens (Mike Sherov)
* requireNewlineBeforeBlockStatements: add guard for the first symbol (Oleg Gaidarenko)
* disallowNewlineBeforeBlockStatements: add guard for the first symbol (Oleg Gaidarenko)
* requireDotNotation: require dots for es3 keywords when not in es3 mode (Mike Sherov)
* JsFile: make getNodeByRange check condition less strict (gero3)
* requireSpacesInConditionalExpression: notice parentheses (Alexej Yaroshevich)
* disallowSpacesInConditionalExpression: notice parentheses (Alexej Yaroshevich)
* requirePaddingNewlinesBeforeKeywords: add token exceptions (jdlrobson)
* requireLineBreakAfterVariableAssignment: fix edge cases (jdlrobson)

* Docs: various readme fixes (Oleg Gaidarenko)
* Docs: improve "excludeFiles" documentation (Alex Yaroshevich)
* Docs: Fixed level for 1.9.0 to be the same as for 1.8.x (Alexander Artemenko)
* README: Fix Bootstrap's name (Chris Rebert)

* requireOperatorBeforeLineBreak: Use the new assertion framework (hpshelton)
* cli-config: add JSDoc for exposed methods (Oleg Gaidarenko)
* (require | disallow)SpacesInsideObjectBrackets: add bunch of newlines (Oleg Gaidarenko)
* Misc: make jscs happy (Oleg Gaidarenko)
* disallowSpaceBeforeBlockStatements: correct test names (Oleg Gaidarenko)
* disallowSpaceBeforeBlockStatements: use assertion API (Oleg Gaidarenko)
* requireKeywordsOnNewLine: use assertion API (Oleg Gaidarenko)
* Misc: complitly replace hooker with sinon (Oleg Gaidarenko)
* CLI: correct tests for the "reporter" option (Oleg Gaidarenko)
* (require | disallow)NewlineBeforeBlockStatements: remove needless guards (Oleg Gaidarenko)
* (require | disallow)NewlineBeforeBlockStatements: use assertion API (Nicholas Bartlett)
* Move website to a different repo (mdevils)
* utils: add isSnakeCased, trimUnderscores methods (Alexej Yaroshevich)
* requireSpace(Before|After)BinaryOperators: Add tests for error column (hpshelton)
* modules/checker: call spy.restore() after assertions in checkStdin (Alexej Yaroshevich)
* Misc: correct file flags - chmod -x (Oleg Gaidarenko)
* Build: update dependencies (Oleg Gaidarenko)

## Version [1.9.0](https://github.com/jscs-dev/node-jscs/compare/v1.8.0...v1.9.0)
* Preset: update wikimedia preset (Timo Tijhof)
* Preset: update crockford preset (Jackson Ray Hamilton)

* New Rules: (require | disallow)SpaceBetweenArguments (James Allardice)
* New Rules: requireLineBreakAfterVariableAssignment (jdlrobson)
* New Rules: disallowSemicolons (Christopher Cliff)

* CLI: relative path resolving fix (mdevils)
* requireCurlyBraces: correctly set error pointer (Oleg Gaidarenko)
* requireOperatorBeforeLineBreak: Detect binary operator after literal (Lucas Cimon)
* requireCapitalizedComments: correct letter recognition (alawatthe)

* CLI: Remove duplicated error reporting code paths (Mike Sherov)
* CLI: remove duplicated preset existence check (Mike Sherov)
* Iterator: extend estraverse rules to support JSX (Yannick Croissant)
* Iterator: use estraverse in tree-iterator. (mdevils)
* CLI: Move configuration override to node-configuration (Mike Sherov)

* Docs: small correction to contributing guide (Oleg Gaidarenko)
* Docs: fixed incorrect rule name in example (alawatthe)
* Docs: added keywords for Googleability (Devin Ekins)
* Docs: Correct documentation for disallowOperatorBeforeLineBreak (jdlrobson)
* Docs: Added quotes for uniformity (Callum Macrae)
* Docs: Typo fix (Alexander Sofin)
* Docs: fix urls to yandex codestyle (Andrey Morozov)

## Version [1.8.1](https://github.com/jscs-dev/node-jscs/compare/v1.7.0...v1.8.1)
 * Assertions: always allow new lines in whitespaceBetween (Henry Zhu)
 * Tests: reorganization, full coverage for JsFile (mdevils)

## Version [1.8.0](https://github.com/jscs-dev/node-jscs/compare/v1.7.0...v1.8.0)
 * Preset: Grunt (Joel Kemp)
 * Preset: remove "disallowMultipleLineBreaks" rule from crockford preset (Oleg Gaidarenko)

 * New Rules: disallowOperatorBeforeLineBreak (jdlrobson)
 * New Rules: (require | disallow)PaddingNewlinesBeforeKeywords (Anton Vishnyak)
 * New Rules: disallowSpaceBeforeKeywords (Bryan Donovan)
 * New Rules: requireSpaceBeforeKeywords (Bryan Donovan)

 * Parsing: Ability to specify a custom esprima version via CLI or config (Konstantin Tarkus)
 * Errors: Support a filter to control which errors are reported (Joel Kemp)
 * Assertions: better rule error reporting. (mdevils)
 * Better configuration, plugin support (mdevils)

 * disallowDanglingUnderscores: Support an array of additional exceptions (Henry Zhu)
 * requireTrailingComma: add option ignoreSingleLine (eltacodeldiablo)
 * StringChecker: unsupported rules shown as style errors and not thrown exceptions (Joel Kemp)
 * Iterate over "export" statement of ES6 (Oleg Gaidarenko)
 * disallowMultipleVarDecl: add exception for undefined variable declarations (Henry Zhu)
 * disallowDanglingUnderscores: add "super_" to allowed identifier list (Markus Dolic)
 * disallowSpacesInAnonymousFunctionExpression: set correct error pointer (Oleg Gaidarenko)
 * requireSpaceAfterLineComment: add "except" option (Alexej Yaroshevich)

 * validateParameterSeparator: fix for multiple spaces between parameters (Henry Zhu)
 * Added test and patch for `finally` as a spaced keyword (Todd Wolfson)
 * requireCapitalizedComments: Better support for multi-line comments (indexzero)
 * disallowSpaceBeforeKeywords: Fix assertion typo (Jeremy Fleischman)
 * Errors: Simplify rules debugging and prevent crashes in error reporters (Alexej Yaroshevich)
 * Correct error message for "requireSpaceAfterKeywords" rule (Bryan Donovan)

 * Docs: Fix Yandex codestyle link (Garmash Nikolay)
 * Docs: Added clarification of tokens in disallowSpacesInConditionalExpression (indexzero)
 * Docs: add twitter and mailling list links (Oleg Gaidarenko)
 * Docs: add more specific cases for function spaces rules (Henry Zhu)
 * Docs: make indentation to be consistent at 4 spaces (Henry Zhu)
 * Docs: Correct docs for requireAnonymousFunctions rule (Oleg Gaidarenko)
 * Docs: Clarify "config" option (MaximAL)
 * Docs: Add Plugins section (Alexej Yaroshevich)

## Version [1.7.3](https://github.com/jscs-dev/node-jscs/compare/v1.6.0...v1.7.3)
 * Parsing: Use the harmony parser via the esnext flag in the config (Joel Kemp)
 * validateIndentation: handle breakless case statements (Mike Sherov)

## Version [1.7.2](https://github.com/jscs-dev/node-jscs/compare/v1.6.0...v1.7.2)
 * validateIndentation: fix return in switch failure (Mike Sherov)
 * Cast StringChecker maxErrors property to Number the first time (Florian Fesseler)
 * Fix format of --esnext and --max-errors in README (Joe Lencioni)

## Version [1.7.1](https://github.com/jscs-dev/node-jscs/compare/v1.6.0...v1.7.1)
 * validateIndentation: fix empty multiline function body regression (Mike Sherov)

## Version [1.7.0](https://github.com/jscs-dev/node-jscs/compare/v1.6.0...v1.7.0)
 * validateJSDoc: Deprecate rule (Joel Kemp)
 * Updated google preset (Richard Poole)
 * Add "requireSpaceBeforeBlockStatements" rule into the jquery preset (Oleg Gaidarenko)

 * CLI: Support --esnext to Parse ES6. (Robert Jackson)
 * CLI: Support a --max-errors option to limit the number of reported errors (mdevils)

 * New Rules: (require|disallow)CapitalizedComments (Joel Kemp)
 * New Rules: (require|disallow)SpacesInCallExpression (Mathieu Schroeter)
 * New Rules: (disallow|require)FunctionDeclarations (Nikhil Benesch)
 * New Rules: (require|disallow)PaddingNewLinesInObjects (Valentin Agachi)

 * Implement "only" for parens rule (Oleg Gaidarenko)
 * Simplify "allButNested" option for spaces rule (Oleg Gaidarenko)
 * Implement "except" option for spaces rule (Oleg Gaidarenko)
 * disallowMultipleVarDecl: Strict mode to disallow for statement exception (Joel Kemp)

 * disallowSpaceBeforeObjectKeys: fix parenthesised property value (Jindrich Besta)
 * requireSpaceBeforeObjectValues: fix parenthesised property value (Jindrich Besta)
 * validateIndentation: Allow non-indented "break" in "switch" statement (kevin.destrem)
 * ValidateIndentation: remove array and object indentation validation (Mike Sherov)
 * validateIndentation: Allow the "if" test to be nested. (Jesper Birkestrøm)
 * ValidateIndentation: Relax indentation rules for function expressions. (Mike Sherov)
 * requireCurlyBraces: support the with statement (Joel Kemp)
 * Fix invalid result of findXxxxToken methods when value is provided (Romain Guerin)
 * requireSpaceAfterLineComment: skips msjsdoc comments (Alexej Yaroshevich)

 * Docs: add a table of contents to README (Henry Zhu)
 * Docs: Make version numbers real markdown headers (Alexander Artemenko)

## Version [1.6.2](https://github.com/jscs-dev/node-jscs/compare/v1.5.0...v1.6.2)
 * Fix disallowMultipleLineBreaks with shebang line (Nicolas Gallagher)
 * Improve validateParameterSeparator rule (David Chambers)
 * Add rule for parameter separation validation (James Allardice)
 * Add new rules for object values (Vivien TINTILLIER)
 * Docs: add intellij plugin to friendly packages (idok)
 * Support predefined values for another three rules (Joel Kemp)

## Version [1.6.1](https://github.com/jscs-dev/node-jscs/compare/v1.5.0...v1.6.1)
 * Airbnb preset (Joel Kemp)
 * Improve crockford preset (Vivien TINTILLIER)
 * Avoid node.js 0.10.x exit code bug for MS Windows (Taku Watabe)
 * Docs: Update packages and extensions sections with new URLs. (Mike Sherov)

## Version [1.6.0](https://github.com/jscs-dev/node-jscs/compare/v1.5.0...v1.6.0)
 * Errors: ability to suppress errors via inline comments. (Mike Sherov)
 * Fix Anonymous Functions in google preset (Ayoub Kaanich)
 * Enhance google's preset (Joel Kemp)
 * Add "iterateTokenByValue" method (Oleg Gaidarenko)
 * Node -> Tokens navigation, token list navigation (Marat Dulin)
 * Do not strip json config from comments (Oleg Gaidarenko)
 * maximumLineLength should not be destructive (Oleg Gaidarenko)
 * Use tilde for package definition (Jordan Harband)
 * Improve stdin support (Joel Kemp)
 * Use correct logic for piped input (Joel Kemp)
 * Properly concatenate large files read from stdin (Nikhil Benesch)
 * Add link to the Atom editor plugin for JSCS (Addy Osmani)
 * Setting default tree to empty object (Bryan Donovan)

## Version 1.5.9
 * Binary Rules: Remove colon check from all binary rules (Oleg Gaidarenko)
 * Presets: Add Mr. Doob's Code Style (MDCS) (gero3)
 * Presets: Add Crockford (Timo Tijhof)
 * Google Preset: Add missing constraints (Turadg Aleahmad)
 * Yandex Preset: Remove repeated rule in yandex preset (Benjamin Tamborine)
 * Yandex Preset: updated to be more accurate (ikokostya)
 * New Rules: (require|disallow)NewlineBeforeBlockStatements (cipiripper)
 * New Rules: (require|disallow)AnonymousFunctions (Rachel White)
 * New Rules: (disallow|require)SpacesInFunction (Mike Sherov)
 * CLI: Accepts piped input from stdin (Joel Kemp)
 * CLI: Add --verbose option that adds rule names to error output. (Mike Sherov)
 * Errors: report Esprima parse errors as rule violations. (Mike Sherov)
 * disallowMultipleLineBreaks: fix issues with shebang line (Bryan Donovan)
 * spacesInFunctionExpressions: ignore function declarations. (Mike Sherov)

## Version 1.5.8
 * Errors: include which rule triggered the error in the error output (gero3)
 * requireTrailingComma: Allow single property objects  / arrays to ignore the rule. (Joel Kemp)
 * requireTrailingComma: Avoids false positives from non object/array literal definitions. (Joel Kemp)
 * validateIndentation: fix indentation for non-block `if` that has block `else`. (Mike Sherov)
 * maximumLineLength: Document the required and default values. (Joel Kemp)

## Version 1.5.7
 * Exclude colon from binary rule of yandex preset (Oleg Gaidarenko)
 * wikimedia: Add 'case' and 'typeof' to requireSpaceAfterKeywords (Timo Tijhof)
 * Correct deal with exclusion and extensions (Oleg Gaidarenko)
 * disallowPaddingNewlinesInBlocks: fix false negatives with newline after closing curly. (Iskren Chernev)
 * Include jscs-browser file to npm package (Oleg Gaidarenko)
 * Clarify docs of use of jscs-browser.js (Oleg Gaidarenko)

## Version 1.5.6
 * Correct prebublish script (Oleg Gaidarenko)

## Version 1.5.5
 * Add allowUrlComments to yandex preset (ikokostya)
 * Improve requireMultipleVarDecl rule (Oleg Gaidarenko)
 * Improve fileExtension option (Oleg Gaidarenko)
 * Perform file check by direct reference (Oleg Gaidarenko)
 * Comma not on the same line with the first operand (Oleg Gaidarenko)
 * Simplify doc instruction a bit (Oleg Gaidarenko)
 * Generate "jscs-browser.js" only during publishing (Oleg Gaidarenko)
 * Fix tests for requireSpaceBeforeBinaryOperators (lemmy)

## Version 1.5.4
 * Fix crash caused by multiline case statements that fall through for validateIndentation rule (Mike Sherov)

## Version 1.5.3
 * Add missing rules in jQuery preset (Oleg Gaidarenko)
 * Exclude comma operator from requireSpaceBeforeBinaryOperators rule (Oleg Gaidarenko)
 * Ignore ios instruments style imports (@sebv)
 * Various doc fixes (Christian Vuerings, Timo Tijhof, Oleg Gaidarenko)

## Version 1.5.2
 * Improve binary rule (Oleg Gaidarenko)
 * Fix recursive descend, #445 (Oleg Gaidarenko)

## Version 1.5.1
 * Version bump to address incorrectly published docs (Mike Sherov)

## Version 1.5.0
 * Sticked Operators Rules: Deprecate in favor of more specific rules (Mike Sherov)
 * Update google preset (Oleg Gaidarenko)
 * Update jQuery preset (Mike Sherov)
 * Implement wikimedia preset (Timo Tijhof)
 * Impelement yandex preset (Alexander Tarmolov)
 * Implement fileExtensions option (Joel Brandt)
 * Implement requireYodaConditions rule (Oleg Gaidarenko)
 * Disallow Space After Line Comment: New Rule (Ben Bernard)
 * Require Space After Line Comment: New Rule (Ben Bernard)
 * Implement requireSpacesInsideParentheses (Mikko Rantanen)
 * MaximumLineLength: add ignoreUrlComments option which ignore comments with long urls. (Mike Sherov)
 * requireCamelCaseOrUpperCaseIdentifiers: add option to ignore object properties. (Mike Sherov)
 * MaximumLineLength: provide relaxing option for comments and/or regular expression literals. (Mike Sherov)
 * disallowPaddingNewlinesInBlocks: Count comments as valid tokens. (Joshua Koo)
 * Add new option to maximumLineLength rule (Oleg Gaidarenko)
 * Function expressions ignore getters and setters (Ruben Tytgat)
 * Add "true" as a possible value for binary/unary rules (Oleg Gaidarenko)
 * Improve disallowSpacesInsideObjectBrackets (Oleg Gaidarenko)
 * Improve disallowSpacesInsideArrayBrackets (Oleg Gaidarenko)
 * Improve disallowSpacesInsideArrayBrackets rule (Oleg Gaidarenko)
 * Improve disallowSpacesInsideObjectBrackets rule (Oleg Gaidarenko)
 * Improve disallowQuotedKeysInObjects rule (Oleg Gaidarenko)
 * Improve requireSpacesInsideObjectBrackets rule (Oleg Gaidarenko)
 * Improve handling comments for *SpaceAfterKeywords (Oleg Gaidarenko)
 * Improve requireOperatorBeforeLineBreak (Oleg Gaidarenko)
 * Improve defintions of operators in utils module (Oleg Gaidarenko)
 * Improve requireSpaceBeforePostfixUnaryOperators (Oleg Gaidarenko)
 * Improve disallowSpaceBeforePostfixUnaryOperators (Oleg Gaidarenko)
 * Improve requireSpaceAfterPrefixUnaryOperators (Oleg Gaidarenko)
 * Improve disallowSpaceAfterPrefixUnaryOperators (Oleg Gaidarenko)
 * Improve disallowSpaceAfterBinaryOperators rule (Oleg Gaidarenko)
 * Improve requireSpaceBeforeBinaryOperators rule (Oleg Gaidarenko)
 * Improve disallowSpaceBeforeBinaryOperators rule (Oleg Gaidarenko)
 * Improve requireSpaceAfterBinaryOperators rule (Oleg Gaidarenko)
 * Improve requireOperatorBeforeLineBreak rule (Oleg Gaidarenko)
 * Improve requireSpaceAfterPrefixUnaryOperators rule (Oleg Gaidarenko)
 * Improve requireOperatorBeforeLineBreak rule (Oleg Gaidarenko)
 * Differentiate errors for requireSpaceAfterKeywords (Oleg Gaidarenko)
 * Modify lint options of jshint and jscs (Oleg Gaidarenko)
 * Test Cleanup (Oleg Gaidarenko)
 * Throw error if specified preset does not exist (Oleg Gaidarenko)
 * utils: Remove duplicate '+=' from binaryOperators (Timo Tijhof)
 * Various readme fixes (Syoichi Tsuyuhara)
 * Provide friendly message for corrupted config (Oleg Gaidarenko)
 * Use new Vow API (Jordan Harband)
 * Update Mocha (Jordan Harband)
 * Update dependencies (Jordan Harband)
 * Various improvements to the utils module (Oleg Gaidarenko)
 * "null" must be a quoted key in IE 6-8 (Jordan Harband)
 * Change signature of findOperatorByRangeStart (Oleg Gaidarenko)
 * Add isTokenParenthesis method to token helper (Oleg Gaidarenko)
 * Improve getTokenByRangeStart method (Oleg Gaidarenko)
 * Correct docs for requireSpacesInsideParentheses (Oleg Gaidarenko)
 * readme: Clean up assignment operators (Timo Tijhof)

## Version 1.4.5
 * Hotfix: Fix binary rules for "," and "=" operators (@markelog)

## Version 1.4.4
 * Improve `requireSpaceAfterBinaryOperators` rule (@markelog)
 * Improve `disallowSpaceAfterBinaryOperators` rule (@markelog)
 * Improve `requireSpaceBeforeBinaryOperators` rule (@markelog)
 * Improve `disallowSpaceBeforeBinaryOperators` rule (@markelog)
 * Update google preset (@markelog)
 * Fixes `requirePaddingNewlinesInBlocks`: support multi-line padding (@zz85)
 * Update error message when no config is found (@mikesherov)
 * Rule `requireSpacesInConditionalExpression` (@mikesherov)
 * Rule `disallowSpacesInConditionalExpression` (@mikesherov)
 * Fixes for `validateIndentation` rule: fix more weird onevar constructs and associated indentation rules. (@mikesherov)
 * Fixes for `validateIndentation` rule: fix bug when IfStatement test contains a BlockStatement

## Version 1.4.3:
 * Presets folder was missing in the package (@mdevils).

## Version 1.4.2:
 * Rule `requireSpaceAfterKeywords`: do not fail on linebreaks (@mdevils).

## Version 1.4.1:
 * Rule `disallowPaddingNewlinesInBlocks`: check for comments in the whitespace. Fixes #347 (@mikesherov).
 * Introduce extensions section in README (@zxqfox)
 * Fixes for `validateIndentation` rule: properly validate finally clauses. Fixes #311 (@mikesherov).
 * Fixes for `validateIndentation` rule: tests for holes in array and more complex temporary fix for it (@zxqfox).
 * Fixes for `validateIndentation` rule: allow for extra indents when first variable
   in a declaration is multi-line (@mikesherov).
 * Fixes for `validateIndentation` rule: prevent false positive when array elements are
   on same line as array opener, but array is not single line. Fixes #353 (@mikesherov)
 * Restructuration of lib/test files (@markelog)

## Version 1.4.0:
 * Dropped `node.js` 0.8 support.
 * Update all dependencies to their latest versions except `vow`/`vow-fs` (@XhmikosR).
 * Add dependency status badges (@XhmikosR).
 * Advanced search for the configuration files (@markelog).
 * Improve `requireSpaceAfterKeywords` rule: trigger error if there is more then two spaces (@markelog).
 * Rule `spaceAfterKeywords`: fix up funarg issue (@markelog).
 * Make `requireMultipleVarDecl` rule more like onevar (@markelog).
 * Allow comments in parentheses for rule `disallowSpacesInsideParentheses` (@Famlam).
 * Extract own settings into google preset (@jzaefferer).
 * Rule `disallowTrailingComma` (@rxin).
 * Rule `requireTrailingComma` (@rxin).
 * Rule `disallowSpaceBeforeBlockStatements` (@rxin).
 * Rule `requireSpaceBeforeBlockStatements` (@rxin).
 * Rule `requireBlocksOnNewline` (@mikesherov).
 * Rule `requirePaddingNewlinesInBlock` (@mikesherov).
 * Rule `disallowPaddingNewlinesInBlock` (@mikesherov).

## Version 1.3.0:
 * New JSCS config format: `.jscsrc`. JSON-file with comments.
 * Rule `requireBlocksOnNewline` (@Famlam).
 * Rule `requireSpacesInAnonymousFunctionExpression` (@jamesallardice).
 * Rule `disallowSpacesInAnonymousFunctionExpression` (@jamesallardice).
 * Rule `requireSpacesInNamedFunctionExpression` (@jamesallardice).
 * Rule `disallowSpacesInNamedFunctionExpression` (@jamesallardice).
 * Custom path to reporter (@Adeel).
 * Option `escape` for rule `validateQuote` (@mikesherov).
 * Fixed `validateIndentation` rule (@mikesherov).
 * Fixed `excludeFiles` option (@markelog).
 * CLI/Reporter fixes (@markelog, @am11).
 * Documentation fixes (@tenorok).
 * Minor tweaks (@XhmikosR).

## Version 1.2.4:
 * Fixed typos.
 * Fixed `validateIndentation` rule.
 * Sorting errors.

## Version 1.2.3:
 * New reporter: `inline` (@clochix).
 * Fixed for rule `requireDotNotation` (@ikokostya).

## Version 1.2.2:
 * Fixed case with number for `requireDotNotation` rule (@andrewblond).

## Version 1.2.1:
 * Fix in error message for rule `maximumLineLength` (@pdehaan).

## Version 1.2.0:
 * Rule `requireCommaBeforeLineBreak` (@mikesherov).
 * Rule `disallowCommaBeforeLineBreak` (@mikesherov).
 * Rule `requireDotNotation` (@mikesherov).
 * Rule `requireCamelCaseOrUpperCaseIdentifiers` (@mikesherov).
 * Rule `disallowEmptyBlocks` (@mikesherov).
 * Rule `validateQuoteMarks` (@mikesherov).
 * Rule `requireParenthesesAroundIIFE` (@mikesherov).
 * Rule `requireOperatorBeforeLineBreak` (@mikesherov).
 * Rule `requireCapitalizedConstructors` (@mikesherov).
 * Rule `disallowDanglingUnderscores` (@mikesherov).
 * Rule `disallowTrailingWhitespace` (@mikesherov).
 * Сurly brace checking for 'case' and 'default' statements (@mikesherov).
 * Rule `maximumLineLength` (@mikesherov).
 * Rule `disallowMixedSpacesAndTabs` (@mikesherov).
 * Rule `validateIndentation` (@mikesherov).
 * README: Reformat to use headings (@nschonni).
 * ES3 future reserved words added to tokenIsReservedWord() (@maxatwork).
 * Fixes for: requireSpaceBeforePostfixUnaryOperators, requireSpaceAfterPrefixUnaryOperators,
   disallowSpaceBeforePostfixUnaryOperators, disallowSpaceAfterPrefixUnaryOperators (@mdevils).
 * Rule `disallowMultipleLineStrings` (@mikesherov).

## Version 1.0.15:
 * junit reporter (@markelog).

## Version 1.0.14:
 * Option `additionalRules` (@markelog).
 * disallowQuotedKeysInObjects: Exclusion array (@nschonni).

## Version 1.0.13:
 * Option `validateLineBreaks` (@twoRoger).

## Version 1.0.12:
 * Fixes for jsdoc params.

## Version 1.0.11:
 * Prefix unary rules: `disallowSpaceAfterPrefixUnaryOperators`, `requireSpaceAfterPrefixUnaryOperators` (@mishaberezin).
 * Postfix unary rules: `disallowSpaceBeforePostfixUnaryOperators`, `requireSpaceBeforePostfixUnaryOperators` (@mishaberezin).

## Version 1.0.10:
 * Reporter support — `console`, `text`, `checkstyle`.

## Version 1.0.9:
 * Browser-compatible version.
 * Fix for `disallowMultipleLineBreaks` option to report only once per each sequence of line breaks.
 * Fix for `disallowMultipleLineBreaks` option to work properly when CRLF line break is used.

## Version 1.0.8:
 * Fixes for `safeContextKeyword`.

## Version 1.0.7:
 * Disallow spaces inside parentheses (@ignovak).

## Version 1.0.6:
 * Convert tabs into spaces (@markelog).
 * Report illegal space between nested closing curly braces (@twoRoger).
 * Use absolute path to config when specified (@vtambourine).
 * safeContextKeyword option to check "var that = this" expressions (@doochik).

## Version 1.0.4-1.0.5:
 * Fixed mistype `disallowMulipleVarDecl` -> `disallowMultipleVarDecl`.
 * Fixed error for invalid symlink checking.

## Version 1.0.3:
 * Changed behaviour for `disallowMultipleVarDecl` options. Now accepts multiple var decl in `for` decl.

## Version 1.0.2:
 * Option `requireSpacesInsideArrayBrackets` (@mishanga).

## Version 1.0.1:
 * Not reporting about extra quotes for zero-starting numbers in `disallowQuotedKeysInObjects`.

## Version 1.0.0:
 * Camel-case configuration options.
 * Option `requireAlignedObjectValues`.
 * Option `requireSpaceAfterObjectKeys`.
 * JSDoc for core functions and classes.
 * Fix error position for disallowSpacesInsideObjectBrackets and disallowSpacesInsideArrayBrackets.


## Version 0.0.12:
 * Fix in `disallowSpaceAfterObjectKeys` location reporting.

## Version 0.0.11:
 * Option `disallowSpaceAfterObjectKeys`.
 * Option `disallowSpacesInsideArrayBrackets`.
 * Do not automatically exclude hidden files.

## Version 0.0.10:
 * Fix in `disallowQuotedKeysInObjects`.

## Version 0.0.9:
 * Fix in `disallowQuotedKeysInObjects`.

## Version 0.0.8:
 * Fix in `requireSpacesInsideObjectBrackets`.
 * Option `disallowQuotedKeysInObjects`.

## Version 0.0.7:
 * Option `requireSpacesInsideObjectBrackets`.
 * Option `disallowSpacesInsideObjectBrackets`.

## Version 0.0.6:
 * Fixes incorrent checkPath behavior.

## Version 0.0.5:
 * .jshintrc config.
 * Error message format fixes.

## Version 0.0.4:
 * Option `disallowYodaConditions`.
 * Option `requireMultipleVarDecl`.

## Version 0.0.3:
 * Option `excludeFiles`, which accepts patterns.

## Version 0.0.2:
 * Link to parent nodes.

## Version 0.0.1:
 * Initial implementation.
