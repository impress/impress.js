var partials = {
  one: '<div id="theDiv"><a>the link</a></div>\n',
  child: '<div class="theChild"><a>the child link</a></div>',
  several: 
    '<div id="theDiv">\n' +
    '  <div><a>the link</a></div>\n' +
    '  <div><a>the link</a></div>\n' +
    '  <div><a>the link</a></div>\n' +
   '</div>\n'
};

var criterias = {
  valid: 'the link',
  invalid: 'the wrong link',
  child: 'the child link'
};

require('../api-el-suffix-base').test('ByLinkText','by-link', partials, criterias);
