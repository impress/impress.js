/**
	@name String
	@class Additions to the core string object.
*/

/** @author Steven Levithan, released as public domain. */
String.prototype.trim = function() {
	var str = this.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
/*t:
	plan(6, "Testing String.prototype.trim.");
	
	var s = "   a bc   ".trim();
	is(s, "a bc", "multiple spaces front and back are trimmed.");

	s = "a bc\n\n".trim();
	is(s, "a bc", "newlines only in back are trimmed.");
	
	s = "\ta bc".trim();
	is(s, "a bc", "tabs only in front are trimmed.");
	
	s = "\n \t".trim();
	is(s, "", "an all-space string is trimmed to empty.");
	
	s = "a b\nc".trim();
	is(s, "a b\nc", "a string with no spaces in front or back is trimmed to itself.");
	
	s = "".trim();
	is(s, "", "an empty string is trimmed to empty.");

*/

String.prototype.balance = function(open, close) {
	var i = 0;
	while (this.charAt(i) != open) {
		if (i == this.length) return [-1, -1];
		i++;
	}
	
	var j = i+1;
	var balance = 1;
	while (j < this.length) {
		if (this.charAt(j) == open) balance++;
		if (this.charAt(j) == close) balance--;
		if (balance == 0) break;
		j++;
		if (j == this.length) return [-1, -1];
	}
	
	return [i, j];
}
/*t:
	plan(16, "Testing String.prototype.balance.");
	
	var s = "{abc}".balance("{","}");
	is(s[0], 0, "opener in first is found.");
	is(s[1], 4, "closer in last is found.");
	
	s = "ab{c}de".balance("{","}");
	is(s[0], 2, "opener in middle is found.");
	is(s[1], 4, "closer in middle is found.");
	
	s = "a{b{c}de}f".balance("{","}");
	is(s[0], 1, "nested opener is found.");
	is(s[1], 8, "nested closer is found.");
	
	s = "{}".balance("{","}");
	is(s[0], 0, "opener with no content is found.");
	is(s[1], 1, "closer with no content is found.");
	
	s = "".balance("{","}");
	is(s[0], -1, "empty string opener is -1.");
	is(s[1], -1, "empty string closer is -1.");
	
	s = "{abc".balance("{","}");
	is(s[0], -1, "opener with no closer returns -1.");
	is(s[1], -1, "no closer returns -1.");
	
	s = "abc".balance("{","}");
	is(s[0], -1, "no opener or closer returns -1 for opener.");
	is(s[1], -1, "no opener or closer returns -1 for closer.");
	
	s = "a<bc}de".balance("<","}");
	is(s[0], 1, "unmatching opener is found.");
	is(s[1], 4, "unmatching closer is found.");
*/