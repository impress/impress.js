Issues
------

If you've found a bug or have a great idea for a new feature that will help **all users** of impress.js, let us know by [adding your suggestion]
(https://github.com/bartaz/impress.js/issues/new) to the [issue tracker](https://github.com/bartaz/impress.js/issues).

Guidelines:

* If reporting a bug, please provide a [simplified example](https://sscce.org/) on [Pastebin](https://pastebin.com/) or [JsFiddle](https://jsfiddle.net/).

Pull Requests
-------------

[Pull Requests](https://help.github.com/articles/using-pull-requests/) should be opened against the [master branch]
(https://github.com/bartaz/impress.js/tree/master). But remember that the team will only accept code that fits the purpose of impress.js.

Guidelines:

* If proposing a feature, make sure to discuss that as an issue first.
* Create a new [topic branch](https://github.com/dchelimsky/rspec/wiki/Topic-Branches) for every separate change you make.
* Execute `npm run lint && npm test` to make sure the tests pass and the code is consistent with the project standards.

Manual release steps
--------------------

* Bump version in `package.json`
* Bump version in `src/impress.js`
* Create commit with the message "Release version x.x.x"
* Create Github tag and release
* Publish on npm: `git fetch && npm publish ./`