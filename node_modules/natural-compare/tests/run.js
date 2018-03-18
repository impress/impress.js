
var naturalCompare = require("../")

var arr = ["1.001","1.002","1.010","1.02","1.1","1.3"]
require("testman").
describe ("naturalCompare").
	it ( "should compare strings as usual" ).
		equal( naturalCompare("a", "a"), 0 ).
		equal( naturalCompare("a", "b"), -1 ).
		equal( naturalCompare("b", "a"), 1 ).
		equal( naturalCompare("a", "aa"), -1 ).
		equal( naturalCompare("aa", "a"), 1 ).
		equal( naturalCompare("a", "ba"), -1 ).
		equal( naturalCompare("aa", "b"), -1 ).
		equal( naturalCompare("aa", "ba"), -1 ).
		equal( naturalCompare("ba", "a"), 1 ).
		equal( naturalCompare("b", "aa"), 1 ).
		equal( naturalCompare("ba", "aa"), 1 ).
		equal( ["a", "c", "b", "d"].sort(naturalCompare)+"", "a,b,c,d" ).

	it ( "should compare decimal integer substrings by their numeric value" ).
		equal( naturalCompare("a", "a1"), -1 ).
		equal( naturalCompare("a1", "a"), 1 ).
		equal( naturalCompare("a", "1"), 1 ).
		equal( naturalCompare("1", "1"), 0 ).
		equal( naturalCompare("2", "3"), -1 ).
		equal( naturalCompare("3", "2"), 1 ).
		equal( naturalCompare("9", "2"), 1 ).
		equal( naturalCompare("1", "a"), -1 ).
		equal( naturalCompare("a1", "a1"), 0 ).
		equal( naturalCompare("a1", "a2"), -1 ).
		equal( naturalCompare("a2", "a1"), 1 ).
		equal( naturalCompare("a1", "a11"), -1 ).
		equal( naturalCompare("a11","a12"), -1 ).
		equal( naturalCompare("a12","a11"), 1 ).
		equal( naturalCompare("a11", "a1"), 1 ).
		equal( naturalCompare("a1a", "a1"), 1 ).
		equal( naturalCompare("a1", "a1a"), -1 ).
		equal( naturalCompare("a1a", "a11"), -1 ).
		equal( naturalCompare("a11", "a1a"), 1 ).
		equal( naturalCompare("a11a", "a1a"), 1 ).
		equal( naturalCompare("a1a", "a11a"), -1 ).
	it ( "should work with 0 in string" ).
		equal( naturalCompare("a 0 a", "a 0 b"), -1 ).
		equal( naturalCompare("a 0 a", "a 00 b"), -1 ).
		equal( naturalCompare("a 0 b", "a 0 a"), 1 ).
	it ( "should compare positive and negative number" ).
		equal( naturalCompare("a 1", "a -1"), 1 ).
		equal( naturalCompare("a -1", "a 1"), -1 ).
		equal( naturalCompare("a 2", "a -1"), 1 ).
		equal( naturalCompare("a -1", "a 2"), -1 ).
		equal( naturalCompare("a 1", "a -2"), 1 ).
		equal( naturalCompare("a -2", "a 1"), -1 ).
		equal( naturalCompare("a -1", "a -1"), 0 ).
		equal( [-1,1,-2,2,-10,10,-11,11,-100,100].sort(naturalCompare)+"", "-100,-11,-10,-2,-1,1,2,10,11,100" ).
	it ( "should preserve leading zeros on decimal fractions.").
		equal( naturalCompare("1.01", "1.001"), 1 ).
		equal( naturalCompare("1.001", "1.01"), -1 ).
		equal(arr.sort(naturalCompare).join(","), "1.001,1.002,1.010,1.02,1.1,1.3").
		equal(arr.reverse().sort(naturalCompare).join(","), "1.001,1.002,1.010,1.02,1.1,1.3").
done()

