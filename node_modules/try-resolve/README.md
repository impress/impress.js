# try-resolve

## Installation

```sh
$ npm install try-resolve
```

## Usage

```javascrpt
var resolve = require("try-resolve");
```

### `resolve(filename, [require])`

 - `filename` is a filename to be resolved.
 - `require` is an optional instance of the `require` function from any file.

Returns `null` if the file can't be required, otherwise it returns an absolute filename string.

#### Example

```javascript
if (require("try-resolve")("/home/sebastian/file")) {
  // this file can be required
} else {
  // it can't
}
```

### `resolve.relative(filename)`

Resolve a filename relative to the cwd.
