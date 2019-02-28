const fs = require('fs');
var ls = require('ls');
var path = require('path');

var files = ['src/impress.js'];
// Libraries from src/lib
files.push('src/lib/gc.js', 'src/lib/util.js')
// Plugins from src/plugins
files.push('src/plugins/autoplay/autoplay.js',
           'src/plugins/blackout/blackout.js',
           'src/plugins/extras/extras.js',
           'src/plugins/form/form.js',
           'src/plugins/fullscreen/fullscreen.js',
           'src/plugins/goto/goto.js',
           'src/plugins/help/help.js',
           'src/plugins/impressConsole/impressConsole.js',
           'src/plugins/media/media.js',
           'src/plugins/mobile/mobile.js',
           'src/plugins/mouse-timeout/mouse-timeout.js',
           'src/plugins/navigation/navigation.js',
           'src/plugins/navigation-ui/navigation-ui.js',
           'src/plugins/progress/progress.js',
           'src/plugins/rel/rel.js',
           'src/plugins/resize/resize.js',
           'src/plugins/skip/skip.js',
           'src/plugins/stop/stop.js',
           'src/plugins/substep/substep.js',
           'src/plugins/touch/touch.js',
           'src/plugins/toolbar/toolbar.js')
var output = files.map((f)=>{
  return fs.readFileSync(f).toString();
}).join('\n')

fs.writeFileSync('js/impress.js', '// This file was automatically generated from files in src/ directory.\n\n' + output)

/* Auto generate an index.html that lists all the directories under examples/
 * This is useful for gh-pages, so you can link to http://impress.github.io/impress.js/examples
 */
var html_list = '<ul><br />\n'
ls( 'examples/*', { type: 'dir' }).forEach(function(dir) {
    html_list += '  <li><a href="' + dir['file'] + '/">' + dir['name'] + '</a></li>\n';
});
html_list += '</ul>\n'

var html = '<html>\n<head>\n<title>Example presentations</title>\n</head>\n<body>'
html += '<h1>Example presentations</h1>\n' + html_list
html += '</body>\n</html>'

var filename = path.resolve(__dirname, 'examples', 'index.html');
fs.writeFileSync(filename, html);
console.log(filename);
