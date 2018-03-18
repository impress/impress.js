var partials = {
  one: '<div id="theDiv"><span>Hello World!</span></div>\n',
  child: '<div><i>a child here</i></div>',
  several: 
    '<div id="theDiv">\n' +
    '  <span>Hello World!</span>\n' +
    '  <span>Hello World!</span>\n' +
    '  <span>Hello World!</span>\n' +
    '</div>\n'
};

var criterias = {
  valid: 'span',
  invalid: 'input',
  child: 'i'
};

require('../api-el-suffix-base').test('ByTagName','by-tag-name', partials, criterias);
