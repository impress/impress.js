var partials = {
  one: '<div id="theDiv"><a>click the link now</a></div>\n',
  child: '<div class="theChild"><a>click the child link now</a></div>',
  several: 
    '<div id="theDiv">\n' +
    '  <div><a>click the link now</a></div>\n' +
    '  <div><a>click the link now</a></div>\n' +
    '  <div><a>click the link now</a></div>\n' +
   '</div>\n'
};

var criterias = {
  valid: 'the link',
  invalid: 'the wrong link',
  child: 'the child link'
};

require('../api-el-suffix-base').test('ByPartialLinkText','by-partial-link', partials, criterias);
