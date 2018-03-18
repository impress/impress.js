# exeq

Excute shell commands in queue.

[![NPM version](https://img.shields.io/npm/v/exeq.svg?style=flat)](https://npmjs.org/package/exeq)
[![Build Status](https://img.shields.io/travis/afc163/exeq.svg?style=flat)](https://travis-ci.org/afc163/exeq)
[![David Status](https://img.shields.io/david/afc163/exeq.svg?style=flat)](https://david-dm.org/afc163/exeq)
[![NPM downloads](http://img.shields.io/npm/dm/exeq.svg?style=flat)](https://npmjs.org/package/exeq)

---

## Install

```bash
$ npm install exeq --save
```

## Usage

### exeq()

```js
exeq(
  'mkdir example',
  'rm -rf example'
);
```

### Promise `2.0.0+`

```js
// promise
exeq(
  'mkdir example',
  'cd example',
  'touch README.md',
  'touch somefile',
  'rm somefile',
  'ls -l',
  'cd ..',
  'rm -rf example',
  'ls -l > output.txt'
).then(function() {
  console.log('done!');
}).catch(function(err) {
  console.log(err);
});
```

### Array

```js
exeq([
  'mkdir example',
  'rm -rf example'
]);
```

### stdout & stderr

```js
exeq(
  'echo 123',
  'echo 456',
  'echo 789'
).then(function(results) {
  console.log(results[0].stdout); // '123'
  console.log(results[1].stdout); // '456'
  console.log(results[2].stdout); // '789'
});
```

```js
exeq(
  'not-existed-command'
).then(function(results) {
}).catch(function(err) {
  console.log(err); // { code: '127', stderr: ' ... ' }
});
```

### change cwd

```js
// cd command would change spawn cwd automatically
// create README.md in example
exeq(
  'mkdir example',
  'cd example',
  'touch README.md'
);
```

### Kill the execution

```js
var proc = exeq([
  'echo 1',
  'sleep 10',
  'echo 2'
]);
proc.q.kill();
```

### Events

```js
var proc = exeq([
  'echo 1',
  'echo 2'
]);

proc.q.on('stdour', function(data) {
  console.log(data);
});

proc.q.on('stderr', function(data) {
  console.log(data);
});

proc.q.on('killed', function(reason) {
  console.log(reason);
});

proc.q.on('done', function() {
});

proc.q.on('failed', function() {
});
```

## Test

```bash
$ npm test
```

## License

The MIT License (MIT)
