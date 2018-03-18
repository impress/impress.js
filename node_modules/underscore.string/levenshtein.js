var makeString = require('./helper/makeString');

module.exports = function levenshtein(str1, str2) {
  str1 = makeString(str1);
  str2 = makeString(str2);

  var current = [],
    prev, value;

  for (var i = 0; i <= str2.length; i++)
    for (var j = 0; j <= str1.length; j++) {
      if (i && j)
        if (str1.charAt(j - 1) === str2.charAt(i - 1))
          value = prev;
        else
          value = Math.min(current[j], current[j - 1], prev) + 1;
        else
          value = i + j;

      prev = current[j];
      current[j] = value;
    }

  return current.pop();
};
