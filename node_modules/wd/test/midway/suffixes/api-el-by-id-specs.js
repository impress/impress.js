var partials = {
  one: '<div id="theDiv">Hello World!</div>\n',
  child: '<div id="theChild">a child</div>',
  several: '<div id="theDiv">Hello World!</div>\n'
};

var criterias = {
  valid: 'theDiv',
  invalid: 'theWrongDiv',
  child: 'theChild'
};

require('../api-el-suffix-base').test('ById','by-id', partials, criterias);
