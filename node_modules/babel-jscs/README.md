# babel-jscs [![Build Status][travis-image]][travis-url]

**babel-jscs** allows you to lint **ALL** valid Babel code with [JSCS](https://github.com/jscs-dev/node-jscs). Big thanks to @sebmck!

> ### This package will be used in jscs itself. The recommended way to use it is to use use the `esnext` option.

> Usage: `jscs . --esnext` or add `"esnext": true` to your `.jscsrc`

> Also check out the fantastic [babel-eslint](https://github.com/babel/babel-eslint) to lint using [ESLint](https://github.com/eslint/eslint). 

**NOTE:** Please note that this is experimental and may have numerous bugs. It has been run against `ember.js` and `babel-core` with no errors (at the moment).

### Known Issues

### Issues
> If there's an issue, first check if you can reproduce with the regular parser (esprima) and the latest version of jscs and babel-jscs.

Include: `jscs` and `babel-jscs` version, code snippet/screenshot

- See if the issue is a duplicate.
- Check if the issue is reproducible with regular jscs.
- Run jscs in `--verbose` mode to get the rule name(s) that have issues.

## How does it work?

JSCS allows custom parsers. This is great but some of the syntax nodes that Babel supports
aren't supported by JSCS. When using this plugin, JSCS is monkeypatched and your code is
transformed into code that JSCS can understand. All location info such as line numbers,
columns is also retained so you can track down errors with ease.

## Usage

### Install

> Since jscs 2.0 isn't released you will need to `npm i jscs-dev/node-jscs#c5adeba`

```sh
$ npm i -g jscs # global
$ npm i jscs # local
```

### Setup

**Example .jscsrc**

```js
{
  "esnext": true
}
```

Check out the [JSCS docs](http://jscs.info/rules.html) for all possible rules.

### Run

```sh
$ jscs your-files-here
# if you didn't add esnext to your config
$ jscs your-files-here --esnext
```

[travis-url]: https://travis-ci.org/jscs-dev/babel-jscs
[travis-image]: https://travis-ci.org/jscs-dev/babel-jscs.svg?branch=master
