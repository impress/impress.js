var assert = require('better-assert');
var expect = require('expect.js');
var parsejson = require('./index.js');

describe('my suite', function(){
	it('should parse a JSON string', function () {
		
		var jsonString =  '{"users" :[{"first_name":"foo", "last_name":"bar"}],' +
						   '"id"    :40,' + 
						   '"cities":["los angeles", "new york", "boston"]}';
		
		var jsonObj = parsejson(jsonString);
		expect(jsonObj.users[0].first_name).to.be("foo");
		expect(jsonObj.users[0].last_name).to.be("bar");
		expect(jsonObj.id).to.be(40);
		expect(jsonObj.cities[0]).to.be('los angeles');
		expect(jsonObj.cities[1]).to.be('new york');
		expect(jsonObj.cities[2]).to.be('boston');
				
  });
});
