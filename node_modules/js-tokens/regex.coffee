# Copyright 2014, 2015 Simon Lydell
# X11 (“MIT”) Licensed. (See LICENSE.)

# <http://es5.github.io/#A.1>
# <http://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-lexical-grammar>

# Don’t worry, you don’t need to know CoffeeScript. It is only used for its
# readable regex syntax. Everything else is done in JavaScript in index.js.

module.exports = ///
  ( # <string>
    ([ ' " ])
    (?:
      (?! \2 | \\ ).
      |
      \\(?: \r\n | [\s\S] )
    )*
    (\2)?
    |
    `
    (?:
      [^ ` \\ $ ]
      |
      \\[\s\S]
      |
      \$(?!\{)
      |
      \$\{
      (?:
        [^{}]
        |
        \{ [^}]* \}?
      )*
      \}?
    )*
    (`)?
  )
  |
  ( # <comment>
    //.*
  )
  |
  ( # <comment>
    /\*
    (?:
      [^*]
      |
      \*(?!/)
    )*
    ( \*/ )?
  )
  |
  ( # <regex>
    /(?!\*)
    (?:
      \[
      (?:
        (?![ \] \\ ]).
        |
        \\.
      )*
      \]
      |
      (?![ / \] \\ ]).
      |
      \\.
    )+
    /
    (?:
      (?!
        \s*
        (?:
          \b
          |
          [ \u0080-\uFFFF $ \\ ' " ~ ( { ]
          |
          [ + \- ! ](?!=)
          |
          \.?\d
        )
      )
      |
      [ g m i y u ]{1,5} \b
      (?!
        [ \u0080-\uFFFF $ \\ ]
        |
        \s*
        (?:
          [ + \- * % & | ^ < > ! = ? ( { ]
          |
          /(?! [ / * ] )
        )
      )
    )
  )
  |
  ( # <number>
    (?:
      0[xX][ \d a-f A-F ]+
      |
      0[oO][0-7]+
      |
      0[bB][01]+
      |
      (?:
        \d*\.\d+
        |
        \d+\.? # Support one trailing dot for integers only.
      )
      (?: [eE][+-]?\d+ )?
    )
  )
  |
  ( # <name>
    # See <http://mathiasbynens.be/notes/javascript-identifiers>.
    (?!\d)
    (?:
      (?!\s)[ $ \w \u0080-\uFFFF ]
      |
      \\u[ \d a-f A-F ]{4}
      |
      \\u\{[ \d a-f A-F ]{1,6}\}
    )+
  )
  |
  ( # <punctuator>
    -- | \+\+
    |
    && | \|\|
    |
    =>
    |
    \.{3}
    |
    (?:
      [ + \- * / % & | ^ ]
      |
      <{1,2} | >{1,3}
      |
      !=? | ={1,2}
    )=?
    |
    [ ? : ~ ]
    |
    [ ; , . [ \] ( ) { } ]
  )
  |
  ( # <whitespace>
    \s+
  )
  |
  ( # <invalid>
    ^$ # Empty.
    |
    [\s\S] # Catch-all rule for anything not matched by the above.
  )
///g
