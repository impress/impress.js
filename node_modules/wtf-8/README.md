# wtf-8 [![Build status](https://travis-ci.org/mathiasbynens/wtf-8.svg?branch=master)](https://travis-ci.org/mathiasbynens/wtf-8) [![Dependency status](https://gemnasium.com/mathiasbynens/wtf-8.svg)](https://gemnasium.com/mathiasbynens/wtf-8)

_wtf-8_ is a well-tested [WTF-8](https://simonsapin.github.io/wtf-8/) encoder/decoder written in JavaScript. WTF-8 is a superset of UTF-8: it can encode/decode any given Unicode code point, including those of (unpaired) surrogates. [Here’s an online demo.](https://mothereff.in/wtf-8)

Feel free to fork if you see possible improvements!

## Installation

Via [npm](http://npmjs.org/):

```bash
npm install wtf-8
```

Via [Bower](http://bower.io/):

```bash
bower install wtf-8
```

Via [Component](https://github.com/component/component):

```bash
component install mathiasbynens/wtf-8
```

In a browser:

```html
<script src="wtf-8.js"></script>
```

In [Narwhal](http://narwhaljs.org/), [Node.js](http://nodejs.org/), and [RingoJS ≥ v0.8.0](http://ringojs.org/):

```js
var wtf8 = require('wtf-8');
```

In [Rhino](http://www.mozilla.org/rhino/):

```js
load('wtf-8.js');
```

Using an AMD loader like [RequireJS](http://requirejs.org/):

```js
require(
  {
    'paths': {
      'wtf-8': 'path/to/wtf-8'
    }
  },
  ['wtf-8'],
  function(wtf8) {
    console.log(wtf8);
  }
);
```

## API

### `wtf8.encode(string)`

Encodes any given JavaScript string (`string`) as WTF-8, and returns the WTF-8-encoded version of the string.

```js
// U+00A9 COPYRIGHT SIGN; see http://codepoints.net/U+00A9
wtf8.encode('\xA9');
// → '\xC2\xA9'
// U+10001 LINEAR B SYLLABLE B038 E; see http://codepoints.net/U+10001
wtf8.encode('\uD800\uDC01');
// → '\xF0\x90\x80\x81'
```

### `wtf8.decode(byteString)`

Decodes any given WTF-8-encoded string (`byteString`) as WTF-8, and returns the WTF-8-decoded version of the string. It throws an error when malformed WTF-8 is detected.

```js
wtf8.decode('\xC2\xA9');
// → '\xA9'

wtf8.decode('\xF0\x90\x80\x81');
// → '\uD800\uDC01'
// → U+10001 LINEAR B SYLLABLE B038 E
```

### `wtf8.version`

A string representing the semantic version number.

## Support

_wtf-8_ has been tested in (at least) the latest versions of Chrome, Opera, Firefox, Safari, IE, Node.js, Narwhal, RingoJS, PhantomJS, and Rhino.

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## License

_wtf-8_ is available under the [MIT](https://mths.be/mit) license.
