var partials = {
  one: '<div id="theDiv"/><input></div>\n',
  child: '<div class="theChild"><a>a child</a></div>',
  several: 
    '<div id="theDiv">\n' +
    '  <input>\n' +
    '  <input>\n' +
    '  <input>\n' +
    '</div>\n'
};

var criterias = {
  valid: "//div[@id='theDiv']/input",
  invalid: "//div[@id='theInvalidDiv']/input",
  child: "//div[@class='theChild']"
};

require('../api-el-suffix-base').test('ByXPath','by-xpath', partials, criterias);
