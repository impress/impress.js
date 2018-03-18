var acornToEsprima = require("./acorn-to-esprima");
var parse          = require("babel-core").parse;

exports.attachComments = function (ast, comments, tokens) {
  if (comments.length) {
    var firstComment = comments[0];
    var lastComment = comments[comments.length - 1];
    // fixup program start
    if (!tokens.length) {
      // if no tokens, the program starts at the end of the last comment
      ast.start = lastComment.end;
      ast.loc.start.line = lastComment.loc.end.line;
      ast.loc.start.column = lastComment.loc.end.column;
    } else if (firstComment.start < tokens[0].start) {
      // if there are comments before the first token, the program starts at the first token
      var token = tokens[0];
      ast.start = token.start;
      ast.loc.start.line = token.loc.start.line;
      ast.loc.start.column = token.loc.start.column;

      // estraverse do not put leading comments on first node when the comment
      // appear before the first token
      if (ast.body.length) {
        var node = ast.body[0];
        node.leadingComments = [];
        var firstTokenStart = token.start;
        var len = comments.length;
        for (var i = 0; i < len && comments[i].start < firstTokenStart; i++) {
          node.leadingComments.push(comments[i]);
        }
      }
    }
    // fixup program end
    if (tokens.length) {
      var lastToken = tokens[tokens.length - 1];
      if (lastComment.end > lastToken.end) {
        // If there is a comment after the last token, the program ends at the
        // last token and not the comment
        ast.end = lastToken.end;
        ast.loc.end.line = lastToken.loc.end.line;
        ast.loc.end.column = lastToken.loc.end.column;
      }
    }
  }
};

exports.parse = function (code, mode) {
  var opts = {
    locations: true,
    ranges: true,
    strictMode: !mode || mode === "strict"
  };

  var comments = opts.onComment = [];
  var tokens = opts.onToken = [];

  var ast;
  try {
    ast = parse(code, opts);
  } catch (err) {
    if (err instanceof SyntaxError) {
      err.lineNumber = err.loc.line;
      err.column = err.loc.column;

      // remove trailing "(LINE:COLUMN)" acorn message and add in esprima syntax error message start
      err.message = "Line X: " + err.message.replace(/ \((\d+):(\d+)\)$/, "");
    }

    throw err;
  }

  // remove EOF token, eslint doesn't use this for anything and it interferes with some rules
  // see https://github.com/babel/babel-eslint/issues/2 for more info
  // todo: find a more elegant way to do this
  tokens.pop();

  // convert tokens
  ast.tokens = acornToEsprima.toTokens(tokens, code);

  // add comments
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    if (comment.type === "CommentBlock") {
      comment.type = "Block";
    } else if (comment.type === "CommentLine") {
      comment.type = "Line";
    }
  }
  ast.comments = comments;
  exports.attachComments(ast, comments, ast.tokens);

  // transform esprima and acorn divergent nodes
  acornToEsprima.toAST(ast);

  return ast;
};
