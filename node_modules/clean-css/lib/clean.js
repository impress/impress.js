var util = require('util');

var CleanCSS = {
  colors: {
    white: '#fff',
    black: '#000',
    fuchsia: '#f0f',
    yellow: '#ff0'
  },

  process: function(data, options) {
    var context = {
      specialComments: [],
      contentBlocks: []
    };
    var replace = function(pattern, replacement) {
      if (typeof arguments[0] == 'function')
        arguments[0]();
      else
        data = data.replace.apply(data, arguments);
    };

    options = options || {};

    // replace function
    if (options.debug) {
      var originalReplace = replace;
      replace = function(pattern, replacement) {
        var name = typeof pattern == 'function' ?
          /function (\w+)\(/.exec(pattern.toString())[1] :
          pattern;
        console.time(name);
        originalReplace(pattern, replacement);
        console.timeEnd(name);
      };
    }

    // strip comments one by one
    replace(function stripComments() {
      data = CleanCSS._stripComments(context, data);
    });

    // replace content: with a placeholder
    replace(function stripContent() {
      data = CleanCSS._stripContent(context, data);
    });

    replace(/;\s*;+/g, ';') // whitespace between semicolons & multiple semicolons
    replace(/\n/g, '') // line breaks
    replace(/\s+/g, ' ') // multiple whitespace
    replace(/ !important/g, '!important') // whitespace before !important
    replace(/[ ]?,[ ]?/g, ',') // space with a comma
    replace(/progid:[^(]+\(([^\)]+)/g, function(match, contents) { // restore spaces inside IE filters (IE 7 issue)
      return match.replace(/,/g, ', ');
    })
    replace(/ ([+~>]) /g, '$1') // replace spaces around selectors
    replace(/\{([^}]+)\}/g, function(match, contents) { // whitespace inside content
      return '{' + contents.trim().replace(/(\s*)([;:=\s])(\s*)/g, '$2') + '}';
    })
    replace(/;}/g, '}') // trailing semicolons
    replace(/rgb\s*\(([^\)]+)\)/g, function(match, color) { // rgb to hex colors
      var parts = color.split(',');
      var encoded = '#';
      for (var i = 0; i < 3; i++) {
        var asHex = parseInt(parts[i], 10).toString(16);
        encoded += asHex.length == 1 ? '0' + asHex : asHex;
      }
      return encoded;
    })
    replace(/([^"'=\s])\s*#([0-9a-f]{6})/gi, function(match, prefix, color) { // long hex to short hex
      if (color[0] == color[1] && color[2] == color[3] && color[4] == color[5])
        return (prefix + (/:$/.test(prefix) ? '' : ' ')) + '#' + color[0] + color[2] + color[4];
      else
        return (prefix + (/:$/.test(prefix) ? '' : ' ')) + '#' + color;
    })
    replace(/(color|background):(\w+)/g, function(match, property, colorName) { // replace standard colors with hex values (only if color name is longer then hex value)
      if (CleanCSS.colors[colorName]) return property + ':' + CleanCSS.colors[colorName];
      else return match;
    })
    replace(/([: ,\(])#f00/g, '$1red') // replace #f00 with red as it's shorter
    replace(/font\-weight:(\w+)/g, function(match, weight) { // replace font weight with numerical value
      if (weight == 'normal') return 'font-weight:400';
      else if (weight == 'bold') return 'font-weight:700';
      else return match;
    })
    replace(/progid:DXImageTransform\.Microsoft\.(Alpha|Chroma)(\([^\)]+\))([;}'"])/g, function(match, filter, args, suffix) { // IE shorter filters but only if single (IE 7 issue)
      return filter.toLowerCase() + args + suffix;
    })
    replace(/(\s|:)0(px|em|ex|cm|mm|in|pt|pc|%)/g, '$1' + '0') // zero + unit to zero
    replace(/(border|border-top|border-right|border-bottom|border-left|outline):none/g, '$1:0') // none to 0
    replace(/(background):none([;}])/g, '$1:0$2') // background:none to 0
    replace(/0 0 0 0([^\.])/g, '0$1') // multiple zeros into one
    replace(/([: ,=\-])0\.(\d)/g, '$1.$2')
    if (options.removeEmpty) replace(/[^}]+?{\s*?}/g, '') // empty elements
    if (data.indexOf('charset') > 0) replace(/(.+)(@charset [^;]+;)/, '$2$1') // move first charset to the beginning
    replace(/(.)(@charset [^;]+;)/g, '$1') // remove all extra charsets that are not at the beginning
    replace(/\*([\.#:\[])/g, '$1') // remove universal selector when not needed (*#id, *.class etc)
    replace(/ {/g, '{') // whitespace before definition
    replace(/\} /g, '}') // whitespace after definition

    // Get the special comments, content content, and spaces inside calc back
    replace(/calc\([^\}]+\}/g, function(match) {
      return match.replace(/\+/g, ' + ');
    });
    replace(/__CSSCOMMENT__/g, function() { return context.specialComments.shift(); });
    replace(/__CSSCONTENT__/g, function() { return context.contentBlocks.shift(); });

    return data.trim() // trim spaces at beginning and end
  },

  // Strips special comments (/*! ... */) by replacing them by __CSSCOMMENT__ marker
  // for further restoring. Plain comments are removed. It's done by scanning datq using
  // String#indexOf scanning instead of regexps to speed up the process.
  _stripComments: function(context, data) {
    var tempData = [],
      nextStart = 0,
      nextEnd = 0,
      cursor = 0;

    for (; nextEnd < data.length; ) {
      nextStart = data.indexOf('/*', nextEnd);
      nextEnd = data.indexOf('*/', nextStart);
      if (nextStart == -1 || nextEnd == -1) break;

      tempData.push(data.substring(cursor, nextStart))
      if (data[nextStart + 2] == '!') {
        // in case of special comments, replace them with a placeholder
        context.specialComments.push(data.substring(nextStart, nextEnd + 2));
        tempData.push('__CSSCOMMENT__');
      }
      cursor = nextEnd + 2;
    }

    return tempData.length > 0 ?
      tempData.join('') + data.substring(cursor, data.length) :
      data;
  },

  // Strips content tags by replacing them by __CSSCONTENT__ marker
  // for further restoring. It's done via string scanning instead of
  // regexps to speed up the process.
  _stripContent: function(context, data) {
    var tempData = [],
      nextStart = 0,
      nextEnd = 0,
      tempStart = 0,
      cursor = 0,
      matchedParenthesis = null;

    // Finds either first (matchedParenthesis == null) or second matching parenthesis
    // so we can determine boundaries of content block.
    var nextParenthesis = function(pos) {
      var min,
        max = data.length;

      if (matchedParenthesis) {
        min = data.indexOf(matchedParenthesis, pos);
        if (min == -1) min = max;
      } else {
        var next1 = data.indexOf("'", pos);
        var next2 = data.indexOf('"', pos);
        if (next1 == -1) next1 = max;
        if (next2 == -1) next2 = max;

        min = next1 > next2 ? next2 : next1;
      }

      if (min == max) return -1;

      if (matchedParenthesis) {
        matchedParenthesis = null;
        return min;
      } else {
        // check if there's anything else between pos and min that doesn't match ':' or whitespace
        if (/[^:\s]/.test(data.substring(pos, min))) return -1;
        matchedParenthesis = data.charAt(min);
        return min + 1;
      }
    };

    for (; nextEnd < data.length; ) {
      nextStart = data.indexOf('content', nextEnd);
      if (nextStart == -1) break;

      nextStart = nextParenthesis(nextStart + 7);
      nextEnd = nextParenthesis(nextStart);
      if (nextStart == -1 || nextEnd == -1) break;

      tempData.push(data.substring(cursor, nextStart - 1));
      tempData.push('__CSSCONTENT__');
      context.contentBlocks.push(data.substring(nextStart - 1, nextEnd + 1));
      cursor = nextEnd + 1;
    }

    return tempData.length > 0 ?
      tempData.join('') + data.substring(cursor, data.length) :
      data;
  }
};

module.exports = CleanCSS;
