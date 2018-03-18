var partials = {
  one: '<div name="theName">Hello World!</div>\n',
  child: '<div name="theChildName">a child</div>',
  several: 
    '<div id="theDiv">\n' +
    '  <div name="theName">Hello World!</div>\n' +
    '  <div name="theName">Hello World!</div>\n' +
    '  <div name="theName">Hello World!</div>\n' +
    '</div>\n'
};

var criterias = {
  valid: 'theName',
  invalid: 'theWrongName',
  child: 'theChildName'
};

require('../api-el-suffix-base').test('ByName','by-name', partials, criterias);
