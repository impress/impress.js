
# batch

  Simple async batch with concurrency control and progress reporting.

## Installation

```
$ npm install batch
```

## API

```js
var Batch = require('batch')
  , batch = new Batch;

batch.concurrency(4);

ids.forEach(function(id){
  batch.push(function(done){
    User.get(id, done);
  });
});

batch.on('progress', function(e){

});

batch.end(function(err, users){

});
```

### Progress events

  Contain the "job" index, response value, duration information, and completion data.

```js
{ index: 1,
  value: 'bar',
  pending: 2,
  total: 3,
  complete: 2,
  percent: 66,
  start: Thu Oct 04 2012 12:25:53 GMT-0700 (PDT),
  end: Thu Oct 04 2012 12:25:53 GMT-0700 (PDT),
  duration: 0 }
```

## License

(The MIT License)

Copyright (c) 2013 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

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
