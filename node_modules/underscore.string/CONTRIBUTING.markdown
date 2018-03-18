
# Contributing

- Always add tests
- Update documentation if needed
- Do not commit build artifacts in the `dist` directory

## Bug fixes

Always add a test for the bug in a separate commit so we can easily cherry pick
it for verification.

## New features

It's recommended to open an issue before sending a pull request to avoid
unnecessary work. There are quite few areas we consider to be out of scope for
this library. Idea is to add few generic string helpers for Javascript. For
example anything related to internalization or is too language specific is out
of scope.

## Release checklist

(for maintainers)

  - Upgrade version number `gulp bump --semver <version>`
  - Build the library `gulp build`
  - Commit build artifacts in `dist`
  - Write a changelog entry to `CHANGELOG.markdown`
    - Use Github compare to see what has changed from previous tag. Ex https://github.com/epeli/underscore.string/compare/3.0.0...master 
  - Add git tag
  - Push new release to npm
