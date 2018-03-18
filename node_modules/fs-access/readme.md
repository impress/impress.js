# fs-access [![Build Status](https://travis-ci.org/sindresorhus/fs-access.svg?branch=master)](https://travis-ci.org/sindresorhus/fs-access)

> Node.js 0.12 [`fs.access()`](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback) & [`fs.accessSync()`](https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode) [ponyfill](https://ponyfill.com)


## Install

```
$ npm install --save fs-access
```


## Usage

```js
var fsAccess = require('fs-access');

fsAccess('unicorn.txt', function (err) {
	if (err) {
		console.error('no access');
		return;
	}

	console.log('access');
});
```

```js
var fsAccess = require('fs-access');

try {
	fsAccess.sync('unicorn.txt');
	console.log('access');
} catch (err) {
	console.error('no access');
}
```


## API

See the [`fs.access()` & `fs.accessSync()` docs](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback).

Mode flags are on the `fsAccess` instance instead of `fs`.

Only the `F_OK` mode is supported for now. [Help welcome for additional modes.](https://github.com/sindresorhus/fs-access/issues/1)


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
