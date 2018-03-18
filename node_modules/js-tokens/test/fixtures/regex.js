foo(/a/)
foo(/a/g)
foo( /a/ )
foo( /a/g )
foo(/a/, bar)
foo(/a/g, bar)
foo(/a/, /a/g, /b/g, /b/)

arr = [/a/]
arr = [/a/g]
arr = [ /a/ ]
arr = [ /a/g ]

obj = {re: /a/}
obj = {re: /a/g}
obj = { re: /a/ }
obj = { re: /a/g }

re = foo ? /a/ : RegExp(bar)
re = foo ? /a/g : RegExp(bar)

/a/.exec(foo)
/a/g.exec(foo)

foo = (1/2) + /a/.exec(bar)[0]
foo = (1/2) + /a/g.exec(bar)[0]

re = /a/// comment
re = /a/g// comment
re = /a//* comment */
re = /a/g/* comment */

re = /a/ // comment
re = /a/g // comment
re = /a/ /* comment */
re = /a/g /* comment */

silly = /a/ ? true : false
if (/a/ == "/a/") {}
if (/a/ && foo) {}
if (/a/ || foo) {}
