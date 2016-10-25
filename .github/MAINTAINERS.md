Maintainers Guidelines
----------------------

* Merge all Pull Requests using Github's "Squash and Merge Feature"

Manual release steps
--------------------

* Bump version in `package.json`
* Create commit with the message "Release version x.x.x"
* Create Github tag and release
* Publish on npm: `git fetch && npm publish ./`