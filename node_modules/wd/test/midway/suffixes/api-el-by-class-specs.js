var partials = {
  one: '<div id="theDiv"><div class="theClass">Hello World!</div></div>\n',
  child: '<div class="theChild">a child</div>',
  several: 
    '<div id="theDiv">\n' +
    '  <div class="theClass">Hello World!</div>\n' +
    '  <div class="theClass">Hello World!</div>\n' +
    '  <div class="theClass">Hello World!</div>\n' +
    '</div>\n'
};

var criterias = {
  valid: 'theClass',
  invalid: 'theWrongClass',
  child: 'theChild'
};

require('../api-el-suffix-base').test('ByClassName','by-class', partials, criterias);
