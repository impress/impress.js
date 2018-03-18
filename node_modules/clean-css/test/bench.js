var cleanCSS = require('../index'),
  bigcss = require('fs').readFileSync(require('path').join(__dirname, 'data', 'big.css'), 'utf8');

console.time('complete minification');
cleanCSS.process(bigcss, { debug: true });
console.timeEnd('complete minification');