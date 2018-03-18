var vows = require('vows'),
  assert = require('assert'),
  cleanCSS = require('../index');

var cssContext = function(groups, options) {
  var context = {};
  var clean = function(cleanedCSS) {
    return function(css) {
      assert.equal(cleanCSS.process(css, options), cleanedCSS);
    }
  };

  for (var g in groups) {
    var transformation = groups[g];
    if (typeof transformation == 'string') transformation = [transformation, transformation];
    if (!transformation[0].push) {
      transformation = [[transformation[0], transformation[1]]];
    }

    for (var i = 0, c = transformation.length; i < c; i++) {
      context[g + ' #' + (i + 1)] = {
        topic: transformation[i][0],
        clean: clean(transformation[i][1])
      };
    }
  }

  return context;
};

vows.describe('clean-units').addBatch({
  'identity': cssContext({
    'preserve minified content': 'a{color:#f10}'
  }),
  'semicolons': cssContext({
    'multiple semicolons': [
      'a{color:#fff;;;width:0; ;}',
      'a{color:#fff;width:0}'
    ],
    'trailing semicolon': [
      'a{color:#fff;}',
      'a{color:#fff}'
    ],
    'trailing semicolon and space': [
      'a{color:#fff ; }',
      'a{color:#fff}'
    ],
    'comma and space': [
      'a{color:rgba(0, 0,  5, .5)}',
      'a{color:rgba(0,0,5,.5)}'
    ]
  }),
  'whitespace': cssContext({
    'one argument': [
      'div  a  { color:#fff  }',
      'div a{color:#fff}'
    ],
    'line breaks': [
      'div \na\r\n { width:500px }',
      'div a{width:500px}'
    ],
    'line breaks #2': [
      'div \na\r\n, p { width:500px }',
      'div a,p{width:500px}'
    ],
    'multiple arguments': [
      'a{color:#fff ;  font-weight:  bolder }',
      'a{color:#fff;font-weight:bolder}'
    ],
    'space delimited arguments': [
      'a {border: 1px solid #f10; margin: 0 auto }',
      'a{border:1px solid #f10;margin:0 auto}'
    ],
    'at beginning': [
      ' a {color:#fff}',
      'a{color:#fff}'
    ],
    'at end': [
      'a{color:#fff } ',
      'a{color:#fff}'
    ],
    'not inside calc method #1': [
      'a{width:-moz-calc(100% - 1em);width:calc(100% - 1em)}',
      'a{width:-moz-calc(100% - 1em);width:calc(100% - 1em)}'
    ],
    'not inside calc method #2': [
      'div{margin:-moz-calc(50% + 15px) -moz-calc(50% + 15px);margin:calc(50% + .5rem) calc(50% + .5rem)}',
      'div{margin:-moz-calc(50% + 15px) -moz-calc(50% + 15px);margin:calc(50% + .5rem) calc(50% + .5rem)}'
    ],
    'not inside calc method with more parentheses': [
      'div{height:-moz-calc((10% + 12px)/2 + 10em)}',
      'div{height:-moz-calc((10% + 12px)/2 + 10em)}'
    ],
    'not inside calc method with multiplication': [
      'div{height:-moz-calc(3 * 2em + 10px)}',
      'div{height:-moz-calc(3 * 2em + 10px)}'
    ]
  }),
  'selectors': cssContext({
    'remove spaces around selectors': [
      'div + span >   em',
      'div+span>em'
    ],
    'not remove spaces for pseudo-classes': [
      'div :first-child',
      'div :first-child'
    ],
    'strip universal selector when coming with id/class/attribute selectors': [
      [
        '* > *#id > *.class',
        '*>#id>.class'
      ],[
        '*:first-child > *[data-id]',
        ':first-child>[data-id]'
      ]
    ],
    'not strip standalone universal selector': [
      'label ~ * + span',
      'label~*+span'
    ],
    'not expand + in selectors mixed with calc methods': [
      'div{width:calc(50% + 3em)}div + div{width:100%}div:hover{width:calc(50% + 4em)}* > div {border:1px solid #f0f}',
      'div{width:calc(50% + 3em)}div+div{width:100%}div:hover{width:calc(50% + 4em)}*>div{border:1px solid #f0f}'
    ]
  }),
  'comments': cssContext({
    'single line': [
      'a{color:#fff}/* some comment*/p{height:10px/* other comment */}',
      'a{color:#fff}p{height:10px}'
    ],
    'multiline': [
      '/* \r\n multiline \n comment */a{color:rgba(0,0,0,0.8)}',
      'a{color:rgba(0,0,0,.8)}'
    ],
    'comment chars in comments': [
      '/* \r\n comment chars * inside / comments */a{color:#fff}',
      'a{color:#fff}'
    ],
    'comment inside block': [
      'a{/* \r\n some comments */color:#fff}',
      'a{color:#fff}'
    ],
    'special comments': [
      '/*! special comment */a{color:#f10} /* normal comment */',
      '/*! special comment */a{color:#f10}'
    ],
    'should keep exact structure': [
      '/*!  \n  a > span { } with some content */',
      '/*!  \n  a > span { } with some content */'
    ]
  }),
  'text content': cssContext({
    'normal #1': 'a{content:"."}',
    'normal #2': [
      'a:before{content : "test\'s test"; }',
      'a:before{content:"test\'s test"}'
    ],
    'open quote': [
      'a{content : open-quote;opacity:1}',
      'a{content:open-quote;opacity:1}'
    ],
    'close quote': [
      'a{content:  close-quote;clear:left}',
      'a{content:close-quote;clear:left}'
    ],
    'special characters': [
      'a{content : "  a > div { }  "}',
      'a{content:"  a > div { }  "}'
    ]
  }),
  'zero values': cssContext({
    'with units': [
      'a{margin:0px 0pt 0em 0%;padding: 0in 0cm 0mm 0pc;border-top-width:0ex}',
      'a{margin:0;padding:0;border-top-width:0}'
    ],
    'multiple into one': [
      'a{margin:0 0 0 0;padding:0 0 0 0;border-width:0 0 0 0}',
      'a{margin:0;padding:0;border-width:0}'
    ],
    'none to zeros': [
      'a{border:none;background:none}',
      'a{border:0;background:0}'
    ],
    'outline:none to outline:0': [
      'a{outline:none}',
      'a{outline:0}'
    ],
    'display:none not changed': 'a{display:none}',
    'longer background declaration not changed': 'html{background:none repeat scroll 0 0 white}',
    'mixed zeros not changed': 'div{margin:0 0 1px 0}',
    'mixed zeros not changed #2': 'div{padding:0 1px 0 0}',
    'mixed zeros not changed #3': 'div{padding:10px 0 0 0}',
    'multiple zeros with fractions #1': [
      'div{padding:0 0 0 0.5em}',
      'div{padding:0 0 0 .5em}'
    ],
    'multiple zeros with fractions #2': [
      'div{padding:0 0 0 .5em}',
      'div{padding:0 0 0 .5em}'
    ]
  }),
  'floats': cssContext({
    'strips zero in fractions': [
      'a{ margin-bottom: 0.5em}',
      'a{margin-bottom:.5em}'
    ],
    'not strips zero in fractions of numbers greater than zero': [
      'a{ margin-bottom: 20.5em}',
      'a{margin-bottom:20.5em}'
    ]
  }),
  'colors': cssContext({
    'shorten rgb to standard hexadecimal format': [
      'a{ color:rgb (5, 10, 15) }',
      'a{color:#050a0f}'
    ],
    'skip rgba shortening': [
      'a{ color:rgba(5, 10, 15, 0.5)}',
      'a{color:rgba(5,10,15,.5)}'
    ],
    'shorten colors to 3 digit hex instead of 6 digit': [
      'a{ background-color: #aa0000; color:rgb(0, 17, 255)}',
      'a{background-color:#a00;color:#01f}'
    ],
    'skip shortening IE filter colors': [
      'a{ filter: chroma(color = "#ff0000")}',
      'a{filter:chroma(color="#ff0000")}'
    ],
    'color names to hex values': [
      'a{color:white;border-color:black;background-color:fuchsia}p{background:yellow}',
      'a{color:#fff;border-color:#000;background-color:#f0f}p{background:#ff0}'
    ],
    'hex value to color name if shorter': [
      'p{color:#f00}',
      'p{color:red}'
    ],
    'hex value to color name in borders': [
      'p{border:1px solid #f00}',
      'p{border:1px solid red}'
    ],
    'hex value to color name in gradients': [
      'p{background:-moz-linear-gradient(-90deg,#000,#f00)}',
      'p{background:-moz-linear-gradient(-90deg,#000,red)}'
    ],
    'hex value to color name in gradients #2': [
      'p{background:-webkit-gradient(linear, left top, left bottom, from(#000), to(#f00))}',
      'p{background:-webkit-gradient(linear,left top,left bottom,from(#000),to(red))}'
    ],
    'border color': [
      'p{border:1px solid #f94311}',
      'p{border:1px solid #f94311}'
    ]
  }),
  'font weights': cssContext({
    'font-weight:normal to 400': [
      'p{font-weight:normal}',
      'p{font-weight:400}'
    ],
    'font-weight:bold to 700': [
      'p{font-weight:bold}',
      'p{font-weight:700}'
    ]
  }),
  'ie filters': cssContext({
    'short alpha': [
      "a{ filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80); -ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)';}",
      "a{filter:alpha(Opacity=80);-ms-filter:'alpha(Opacity=50)'}"
    ],
    'short chroma': [
      'a{filter:progid:DXImageTransform.Microsoft.Chroma(color=#919191)}', 'a{filter:chroma(color=#919191)}'
    ],
    'matrix filter spaces': [
      "a{filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.984, M22=0.984, M12=0.17, M21=-0.17, SizingMethod='auto expand')",
      "a{filter:progid:DXImageTransform.Microsoft.Matrix(M11=.984, M22=.984, M12=.17, M21=-.17, SizingMethod='auto expand')"
    ],
    'multiple filters (IE7 issue)': [
      "a{filter:progid:DXImageTransform.Microsoft.Chroma(color=#919191) progid:DXImageTransform.Microsoft.Matrix(M11=0.984, M22=0.984, M12=0.17, M21=-0.17, SizingMethod='auto expand')}",
      "a{filter:progid:DXImageTransform.Microsoft.Chroma(color=#919191) progid:DXImageTransform.Microsoft.Matrix(M11=.984, M22=.984, M12=.17, M21=-.17, SizingMethod='auto expand')}"
    ]
  }),
  'charsets': cssContext({
    'not at beginning': [
      "a{ color: #f10; }@charset 'utf-8';b { font-weight: bolder}",
      "@charset 'utf-8';a{color:#f10}b{font-weight:bolder}"
    ],
    'multiple charsets': [
      "@charset 'utf-8';div :before { display: block }@charset 'utf-8';a { color: #f10 }",
      "@charset 'utf-8';div :before{display:block}a{color:#f10}"
    ]
  }),
  'important': cssContext({
    'space before': [
      "body{background-color:#fff  !important}",
      "body{background-color:#fff!important}"
    ]
  }),
  'empty elements': cssContext({
    'single': [
      ' div p {  \n}',
      ''
    ],
    'between non-empty': [
      'div {color:#fff}  a{  } p{  line-height:1.35em}',
      'div{color:#fff}p{line-height:1.35em}'
    ],
    'just a semicolon': [
      'div { ; }',
      ''
    ]
  }, { removeEmpty: true }),
  'skip empty elements': cssContext({
    'empty #1': 'a{}',
    'empty #2': 'div>a{}',
    'empty #3': 'div:nth-child(2n){}',
    'empty #3': 'a{color:#fff}div{}p{line-height:2em}'
  })
}).export(module);