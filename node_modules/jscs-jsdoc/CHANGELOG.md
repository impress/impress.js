# CHANGELOG
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [unreleased]


## [v1.3.2] - 2016-03-22

### Bug fixes
* [[`ae6259bf4e`](https://github.com/jscs-dev/jscs-jsdoc/commit/ae6259bf4e)] - **requireDescriptionCompleteSentence**: To detect and ignore HTML content (Kushan Joshi)

### Tag sets
* [[`f301aaea5b`](https://github.com/jscs-dev/jscs-jsdoc/commit/f301aaea5b)] - **Tags**: add listens to jsdoc3.json (Ian McBurnie)

### Misc
* [[`01e26502bb`](https://github.com/jscs-dev/jscs-jsdoc/commit/01e26502bb)] - **Chore**: fix links in CHANGELOG.md (Alexey Yaroshevich)

## [v1.3.1] - 2015-12-09

This is more like cosmetic patch release to keep bundling into `jscs`.
It was a bad idea to add back peerDeps.

### Misc
* [[`d4e28d85f7`](https://github.com/jscs-dev/jscs-jsdoc/commit/d4e28d85f7)] - **Chore**: drop peer deps (there is no way to use it) (Alexey Yaroshevich)
* [[`bb3e784377`](https://github.com/jscs-dev/jscs-jsdoc/commit/bb3e784377)] - **Chore**: drop rudimentary compiled browserified version (Alexey Yaroshevich)

## [v1.3.0] - 2015-12-05

It was more than 2 months gap since the last release and here we are with a couple of bug fixes and better ES2015 support. A big part of fixes related to `requireDescriptionCompleteSentence` rule. If you had troubles with it you can give it a try now. `enforceExistence` now supports ES2015 exports and treats it like CommonJS `module.exports`.

Also we should note that [Jordan Harband](http://github.com/ljharb) came with a `node v0.8` support :tada:. Thank you, Jordan!

Besides the current release there will be a huge update with a new [:gift:`jsdoctypeparser`](https://github.com/Kuniwak/jsdoctypeparser) with better support of jsdoc types and several very important changes especially for linters. It's still in alpha but feels like it could be a good idea to release an alpha version with it (I guess it will be the next :shipit: one).

P.S. Futher releases should be more often since I'll found few hours a week to do it...
But if you feel that your ideas should be implemented, or you are ready to assist with issues, or even help with maintaining, let's collaborate, :trophy: waits you.

### Changes in rules
* [[`b9ffead365`](https://github.com/jscs-dev/jscs-jsdoc/commit/b9ffead365)] - Update Rule: inlined tags in requireDescriptionCompleteSentence (Alexey Yaroshevich)
* [[`5cae0345b6`](https://github.com/jscs-dev/jscs-jsdoc/commit/5cae0345b6)] - Update Rule: add arrow exception to enforceExistence rule (Alexej Yaroshevich)

### Bug fixes
* [[`4735603a75`](https://github.com/jscs-dev/jscs-jsdoc/commit/4735603a75)] - **Fix**: dont stick IIFE with outpadded docblock (Alexey Yaroshevich)
* [[`42c642a98a`](https://github.com/jscs-dev/jscs-jsdoc/commit/42c642a98a)] - **Fix**: lists now treats like a sentence in requireDescriptionCompleteSentence (Alexey Yaroshevich)
* [[`9805a4ebf5`](https://github.com/jscs-dev/jscs-jsdoc/commit/9805a4ebf5)] - **Fix**: dot in abbreviation is treated like an end (Alexey Yaroshevich)
* [[`c771b255ed`](https://github.com/jscs-dev/jscs-jsdoc/commit/c771b255ed)] - **Fix**: slightly correct description calculation (Alexey Yaroshevich)
* [[`84def6aedc`](https://github.com/jscs-dev/jscs-jsdoc/commit/84def6aedc)] - **Fix**: scope for arrow functions (Sergey Zarouski)
* [[`739ed3fe2f`](https://github.com/jscs-dev/jscs-jsdoc/commit/739ed3fe2f)] - **Fix**: add ExportNamedDeclaration to enforceExistence (Alexej Yaroshevich)
* [[`5f7d756aa8`](https://github.com/jscs-dev/jscs-jsdoc/commit/5f7d756aa8)] - **Fix**: add support of es6 exports in enforceExistence (Alexej Yaroshevich)

### Tag sets
* [[`d2070ef6e0`](https://github.com/jscs-dev/jscs-jsdoc/commit/d2070ef6e0)] - **Tags**: add override as a valid tag to jsdoc3 set (Brittany Tarvin)

### Docs
* [[`4db0f2b5d4`](https://github.com/jscs-dev/jscs-jsdoc/commit/4db0f2b5d4)] - **Docs**: add changelog for release and fix readme (Alexey Yaroshevich)
* [[`244c3876b8`](https://github.com/jscs-dev/jscs-jsdoc/commit/244c3876b8)] - **Docs**: fix travis link, change gitter chat to node-jscs (Alexey Yaroshevich)
* [[`4d28215a06`](https://github.com/jscs-dev/jscs-jsdoc/commit/4d28215a06)] - **Docs**: drop browser section, add note about bundling into jscs (Alexey Yaroshevich)
* [[`21f5eda422`](https://github.com/jscs-dev/jscs-jsdoc/commit/21f5eda422)] - **Docs**: fix mistyped example for requireDescriptionCompleteSentense (Alexey Yaroshevich)
* [[`d91140dc43`](https://github.com/jscs-dev/jscs-jsdoc/commit/d91140dc43)] - **Docs**: fix grammar for couple of rules (Alexej Yaroshevich)
* [[`6c74293b97`](https://github.com/jscs-dev/jscs-jsdoc/commit/6c74293b97)] - **Docs**: update deprecated enforceExistence in Usage section (Damien SEGUIN)

### Misc
* [[`0094e85d47`](https://github.com/jscs-dev/jscs-jsdoc/commit/0094e85d47)] - **Chore**: return peerDeps since they are valid (Alexey Yaroshevich)
* [[`842dcb5f3d`](https://github.com/jscs-dev/jscs-jsdoc/commit/842dcb5f3d)] - **Chore**: add more nodes to travis: 0.8, 4 and 5 (Alexey Yaroshevich)
* [[`c25a184fb4`](https://github.com/jscs-dev/jscs-jsdoc/commit/c25a184fb4)] - **Chore**: bump comment-parser to v0.3.1 (Jordan Harband)
* [[`5df4bff183`](https://github.com/jscs-dev/jscs-jsdoc/commit/5df4bff183)] - **Misc**: replace tabs with spaces (Alexej Yaroshevich)

## [v1.2.0] - 2015-09-22

### New rules and values
* [[`aa40ed5c6e`](https://github.com/jscs-dev/jscs-jsdoc/commit/aa40ed5c6e)] - New Rule: checkParamExistence (Jon Robson)
* [[`e381c1a6e1`](https://github.com/jscs-dev/jscs-jsdoc/commit/e381c1a6e1)] - New Rule: requireReturnDescription (weekens)
* [[`379e9ff023`](https://github.com/jscs-dev/jscs-jsdoc/commit/379e9ff023)] - **enforceExistence**: add paramless-procedures exception (Sergey Zarouski)

### Tag sets
* [[`1d6e20f588`](https://github.com/jscs-dev/jscs-jsdoc/commit/1d6e20f588)] - **Tags**: add @inheritdoc, @implements tags to jsdoc3 set (Alexej Yaroshevich)
* [[`d670802aa8`](https://github.com/jscs-dev/jscs-jsdoc/commit/d670802aa8)] - **checkAnnotations**: add interface tag to jsdoc3 set (Alexej Yaroshevich)

### Bug fixes
* [[`1beefd3823`](https://github.com/jscs-dev/jscs-jsdoc/commit/1beefd3823)] - **checkReturnTypes**: skip checking 'this.something' (Alexej Yaroshevich)
* [[`1a085085c0`](https://github.com/jscs-dev/jscs-jsdoc/commit/1a085085c0)] - **enforceExistence**: fix error location property (Shmavon Gazanchyan)
* [[`140dfd683a`](https://github.com/jscs-dev/jscs-jsdoc/commit/140dfd683a)] - **enforceExistence**: rework rule, add options to suppress exporting, expressions, etc. (Matt Votsikas)
* [[`f3985b0930`](https://github.com/jscs-dev/jscs-jsdoc/commit/f3985b0930)] - **requireDescriptionCompleteSentence**: fix trailing non-word character bug (Titus Wormer)
* [[`c74cc592d4`](https://github.com/jscs-dev/jscs-jsdoc/commit/c74cc592d4)] - **requireHyphenBeforeDescription**: improve multiline support checks (Alexej Yaroshevich)

### Misc
* [[`4548ecfe7a`](https://github.com/jscs-dev/jscs-jsdoc/commit/4548ecfe7a)] - **Misc**: find docblock before a blank line (Luke Vivier)
* [[`b0d220f8b2`](https://github.com/jscs-dev/jscs-jsdoc/commit/b0d220f8b2)] - **Misc**: add test for checkParamNames (Alexej Yaroshevich)
* [[`c768497833`](https://github.com/jscs-dev/jscs-jsdoc/commit/c768497833)] - **Misc**: make error messages consistent: sentence case and no period (aj-dev)
* [[`b9da3fc3e0`](https://github.com/jscs-dev/jscs-jsdoc/commit/b9da3fc3e0)] - **Misc**: fix codestyle error (Alexej Yaroshevich)
* [[`8ba3eaf748`](https://github.com/jscs-dev/jscs-jsdoc/commit/8ba3eaf748)] - **Misc**: update jscs and fix tests (Alexej Yaroshevich)
* [[`43bfdeb48c`](https://github.com/jscs-dev/jscs-jsdoc/commit/43bfdeb48c)] - **Misc**: skip checking for incorrectly formatted jsdoc blocks (Alexej Yaroshevich)
* [[`50411e0b61`](https://github.com/jscs-dev/jscs-jsdoc/commit/50411e0b61)] - **Misc**: pass context of jsdoc to sub-rule configurate (Alexej Yaroshevich)
* [[`96e976539f`](https://github.com/jscs-dev/jscs-jsdoc/commit/96e976539f)] - **checkAnnotations**: store rule configuration locally (Alexej Yaroshevich)

### Docs
* [[`37e3f44b8d`](https://github.com/jscs-dev/jscs-jsdoc/commit/37e3f44b8d)] - **Docs**: fix markup (Alexej Yaroshevich)
* [[`e8a73ccb2e`](https://github.com/jscs-dev/jscs-jsdoc/commit/e8a73ccb2e)] - **Docs**: fix code highlight in README.md (Felquis Gimenes)


## [v1.1.0] - 2015-06-24

### New rules
* [[`152ab67a91`](https://github.com/jscs-dev/jscs-jsdoc/commit/152ab67a91)] - New rule: requireDescriptionCompleteSentence (dtracers)
* [[`bf19a6c34c`](https://github.com/jscs-dev/jscs-jsdoc/commit/bf19a6c34c)] - New rule: requireParamDescription (dtracers)

### Bug fixes
* [[`79e316c2f2`](https://github.com/jscs-dev/jscs-jsdoc/commit/79e316c2f2)] - **leadingUnderscoreAccess**: skip checking for overriden methods #114 (Alexej Yaroshevich)

### Docs
* [[`9e56f72b88`](https://github.com/jscs-dev/jscs-jsdoc/commit/9e56f72b88)] - **Docs**: Add requireDescriptionCompleteSentence to readme. (dtracers)
* [[`a34608a22b`](https://github.com/jscs-dev/jscs-jsdoc/commit/a34608a22b)] - **Docs**: update changelog, fix broken link (Alexej Yaroshevich)
* [[`abce52aea2`](https://github.com/jscs-dev/jscs-jsdoc/commit/abce52aea2)] - **Docs**: update changelog and fix url (Alexej Yaroshevich)
* [[`262ce3f3c5`](https://github.com/jscs-dev/jscs-jsdoc/commit/262ce3f3c5)] - **Docs**: add rule requireParamDescription (Alexej Yaroshevich)

### Misc
* [[`cf2aff91c2`](https://github.com/jscs-dev/jscs-jsdoc/commit/cf2aff91c2)] - **Misc**: bump jsdoctypeparser to use new PEG parser (Alexej Yaroshevich)
* [[`544cf7d7cb`](https://github.com/jscs-dev/jscs-jsdoc/commit/544cf7d7cb)] - **Misc**: add changelog npm command (Alexej Yaroshevich)
* [[`85fba47e7f`](https://github.com/jscs-dev/jscs-jsdoc/commit/85fba47e7f)] - **requireParamTypes**: Change if to early return format (dtracers)


## [v1.0.1] - 2015-05-11

Fixing version for jsdoctypeparser to prevent unexpected reports for some non-standard declarations.

### Misc

* [[`7d1e3c9711`](https://github.com/jscs-dev/jscs-jsdoc/commit/7d1e3c9711)] - **pkg**: fixup version to prevent unexpected reports (Alexej Yaroshevich)


## [v1.0.0] - 2015-05-04

Great patch for `checkParamNames` rule and params destructuring by [Alexander Zeilmann](//github.com/alawatthe), thanks!

Also added rules for controlling newline at the end of description, couple of bug fixes, coveralls, and docs update.

### New rules
* [[`3e86bd40f4`](https://github.com/jscs-dev/jscs-jsdoc/commit/3e86bd40f4)] - **disallowNewlineAfterDescription**: mirror for require, #85 (Alexej Yaroshevich)
* [[`ca972d4621`](https://github.com/jscs-dev/jscs-jsdoc/commit/ca972d4621)] - **requireNewlineAfterDescription**: rule to enforce newline after doc description, #85 (Alexej Yaroshevich)

### Bug fixes
* [[`e754b468b8`](https://github.com/jscs-dev/jscs-jsdoc/commit/e754b468b8)] - **checkParamNames**: prevent failing on destructuring, and allow fake arguments, #90 (Alexander Zeilmann)
* [[`231b3594aa`](https://github.com/jscs-dev/jscs-jsdoc/commit/231b3594aa)] - **checkRedundantReturns**: skip reporting for abstract declarations, #93 (Alexej Yaroshevich)
* [[`d6068f48cc`](https://github.com/jscs-dev/jscs-jsdoc/commit/d6068f48cc)] - **core**: parsing whitespaces in description correctly (Alexej Yaroshevich)

### Misc
* [[`2598d6d059`](https://github.com/jscs-dev/jscs-jsdoc/commit/2598d6d059)] - **Coverage**: add coveralls to travis, #102 (Alexej Yaroshevich)
* [[`0f3a308a5c`](https://github.com/jscs-dev/jscs-jsdoc/commit/0f3a308a5c)] - **jscsrc**: add requireNewlineAfterDescription rule (Alexej Yaroshevich)
* [[`3b1ed481ab`](https://github.com/jscs-dev/jscs-jsdoc/commit/3b1ed481ab)] - **pkg**: update deps (Alexej Yaroshevich)

### Docs
* [[`3bb3c225e2`](https://github.com/jscs-dev/jscs-jsdoc/commit/3bb3c225e2)] - **Docs**: add requireNewlineAfterDescription, disallowNewlineAfterDescription, #85 (Alexej Yaroshevich)
* [[`fd317b7fde`](https://github.com/jscs-dev/jscs-jsdoc/commit/fd317b7fde)] - **Docs**: Fixed broken link in README.md (Alexander Zeilmann)
* [[`72f5a17f06`](https://github.com/jscs-dev/jscs-jsdoc/commit/72f5a17f06)] - **badges**: use shields.io for badges, add download and license, #95 (Alexej Yaroshevich)
* [[`a3accde842`](https://github.com/jscs-dev/jscs-jsdoc/commit/a3accde842)] - **badges**: fixup (Alexej Yaroshevich)


## [v0.4.6] - 2015-04-07

### Bug fixes
* [[`c56322a501`](https://github.com/jscs-dev/jscs-jsdoc/commit/c56322a501)] - fixed possible throw with invalid tag location (Alexej Yaroshevich)
* [[`4768a12976`](https://github.com/jscs-dev/jscs-jsdoc/commit/4768a12976)] - **checkTypes**: fixup indent (Alexej Yaroshevich)
* [[`ca527cb739`](https://github.com/jscs-dev/jscs-jsdoc/commit/ca527cb739)] - **validate-jsdoc**: fix dirty line modification ;-( (Alexej Yaroshevich)

### Misc
* [[`f203c18e1a`](https://github.com/jscs-dev/jscs-jsdoc/commit/f203c18e1a)] - codestyle fixes (Alexej Yaroshevich)
* [[`688c8eab5f`](https://github.com/jscs-dev/jscs-jsdoc/commit/688c8eab5f)] - **travis**: add 0.12, iojs, sudo false (Alexej Yaroshevich)
* [[`55b463e709`](https://github.com/jscs-dev/jscs-jsdoc/commit/55b463e709)] - disable peerDeps (Alexej Yaroshevich)
* [[`e734bb6e8a`](https://github.com/jscs-dev/jscs-jsdoc/commit/e734bb6e8a)] - **pkg**: update dev dependencies (Alexej Yaroshevich)
* [[`f4f7bdbc15`](https://github.com/jscs-dev/jscs-jsdoc/commit/f4f7bdbc15)] - **tests**: add fixed field to location tests (ouch.) (Alexej Yaroshevich)


## [v0.4.5] - 2015-02-17

### Bug fixes
* [[`0b8f5a7ad9`](https://github.com/jscs-dev/jscs-jsdoc/commit/0b8f5a7ad9)] - **checkRedundantAccess**: fixed false-positive reporting for unknown access (Alexej Yaroshevich)


## [v0.4.4] - 2015-01-25

### New rule values
* [[`7f7b6e4cc3`](https://github.com/jscs-dev/jscs-jsdoc/commit/7f7b6e4cc3)] - **checkRedundantReturns**: dropped return type checking (Alexej Yaroshevich)

### Misc
* [[`24089d640c`](https://github.com/jscs-dev/jscs-jsdoc/commit/24089d640c)] - bump dependencies (Alexej Yaroshevich)


## [v0.4.3] - 2015-01-23

### New rule values
* [[`203521de02`](https://github.com/jscs-dev/jscs-jsdoc/commit/203521de02)] - **checkRedundantAccess**: added rule to enforcing dangling underscores (Alexej Yaroshevich)


## [v0.4.2] - 2015-01-23

### Bug fixes
* [[`1a999e742e`](https://github.com/jscs-dev/jscs-jsdoc/commit/1a999e742e)] - **leadingUnderscoreAccess**: added exception list, fixed location bug (Alexej Yaroshevich)


## [v0.4.1] - 2015-01-22

### Bug fixes
* [[`05c17e071b`](https://github.com/jscs-dev/jscs-jsdoc/commit/05c17e071b)] - **checkParamNames**: added test for optional params (Alexej Yaroshevich)
* [[`b88ad6b7fa`](https://github.com/jscs-dev/jscs-jsdoc/commit/b88ad6b7fa)] - **checkRedundantParams**: fixed error with dotted params (Alexej Yaroshevich)


## [v0.4.0] - 2014-12-28

### Overview
More accurate tag presets, and a couple of fixes.

### Bug fixes
* [[`c93d4d90bd`](https://github.com/jscs-dev/jscs-jsdoc/commit/c93d4d90bd)] - **checkAnnotations**: rework (Alexej Yaroshevich)
* [[`4ec300ade6`](https://github.com/jscs-dev/jscs-jsdoc/commit/4ec300ade6)] - **checkParamNames**: fixup buggy behaviour (Alexej Yaroshevich)
* [[`cd94799960`](https://github.com/jscs-dev/jscs-jsdoc/commit/cd94799960)] - **checkTypes**: Drop null from natives list (Alexej Yaroshevich)
* [[`aafb312893`](https://github.com/jscs-dev/jscs-jsdoc/commit/aafb312893)] - check dotted names consistency (Alexej Yaroshevich)

### Misc
* [[`fbf8ac8360`](https://github.com/jscs-dev/jscs-jsdoc/commit/fbf8ac8360)] - Set bigger timeout for mocha (Alexej Yaroshevich)
* [[`cd04f56f49`](https://github.com/jscs-dev/jscs-jsdoc/commit/cd04f56f49)] - Fixed closurecompiler tag preset according to docs (Alexej Yaroshevich)
* [[`c8caa2e572`](https://github.com/jscs-dev/jscs-jsdoc/commit/c8caa2e572)] - Temporary switch comment-parser to patched (Alexej Yaroshevich)

### Docs
* [[`73a1b5a52c`](https://github.com/jscs-dev/jscs-jsdoc/commit/73a1b5a52c)] - **Docs**: update tag values section (Alexej Yaroshevich)


## [v0.3.2] - 2014-12-01

### Overview
Gitter is here. Welcome!

### Bug fixes
* [[`b311704c3c`](https://github.com/jscs-dev/jscs-jsdoc/commit/b311704c3c)] - **checkParamNames**: skip dotted params (as it was initially) (Alexej Yaroshevich)

### Misc
* [[`5d2428641a`](https://github.com/jscs-dev/jscs-jsdoc/commit/5d2428641a)] - **travis**: add notif trigger for gitter (Alexej Yaroshevich)

### Docs
* [[`2e223d939d`](https://github.com/jscs-dev/jscs-jsdoc/commit/2e223d939d)] - Added Gitter badge (The Gitter Badger)


## [v0.3.0] - 2014-12-01

### New rule values
* [[`26a6dcfa91`](https://github.com/jscs-dev/jscs-jsdoc/commit/26a6dcfa91)] - **enforceExistence**: add exceptExports value (Alexej Yaroshevich)

### Bug fixes
* [[`6901883f9f`](https://github.com/jscs-dev/jscs-jsdoc/commit/6901883f9f)] - **checkRedundantParams**: qualify variable type as optional (Alexej Yaroshevich)

### Misc
* [[`a4e4f3ca60`](https://github.com/jscs-dev/jscs-jsdoc/commit/a4e4f3ca60)] - zimbabwe (Alexej Yaroshevich)
* [[`f7ce7340df`](https://github.com/jscs-dev/jscs-jsdoc/commit/f7ce7340df)] - **jscsrc**: add jsdoc rules, fixup code (Alexej Yaroshevich)
* [[`5c83490abe`](https://github.com/jscs-dev/jscs-jsdoc/commit/5c83490abe)] - **pkgs**: cleanup deps (drop esprima, update mocha, etc) (Alexej Yaroshevich)

### Docs
* [[`425e2920f4`](https://github.com/jscs-dev/jscs-jsdoc/commit/425e2920f4)] - **readme**: correct capitalizedNativeCase description (Alex Yaroshevich)


## [v0.2.0] - 2014-11-27

### Misc
* [[`4e747957d4`](https://github.com/jscs-dev/jscs-jsdoc/commit/4e747957d4)] - drop esprima tree direct requirement (Alexej Yaroshevich)
* [[`badd42fac9`](https://github.com/jscs-dev/jscs-jsdoc/commit/badd42fac9)] - **jsdoc**: simplify type iteration logic (Alexej Yaroshevich)
* [[`426c9a28c1`](https://github.com/jscs-dev/jscs-jsdoc/commit/426c9a28c1)] - **pkg**: upd comment-parser (Alexej Yaroshevich)
* [[`cf82c9b14f`](https://github.com/jscs-dev/jscs-jsdoc/commit/cf82c9b14f)] - **travis**: fast finish (Alexej Yaroshevich)


## [v0.1.1] - 2014-11-27

### New rule values
* [[`4f980de86b`](https://github.com/jscs-dev/jscs-jsdoc/commit/4f980de86b)] - **checkTypes**: add capitalizedNativeCase mode (Alexej Yaroshevich)

### Misc
* [[`328235dd67`](https://github.com/jscs-dev/jscs-jsdoc/commit/328235dd67)] - Fix tests with new plugin support (Marat Dulin)
* [[`ae34c69cc8`](https://github.com/jscs-dev/jscs-jsdoc/commit/ae34c69cc8)] - fixup jscs version to support plugins (Alexej Yaroshevich)
* [[`97540ece19`](https://github.com/jscs-dev/jscs-jsdoc/commit/97540ece19)] - force tests to load jscs-jsdoc as plugin (Alexej Yaroshevich)
* [[`5ed495d519`](https://github.com/jscs-dev/jscs-jsdoc/commit/5ed495d519)] - Pluginization (Marat Dulin)


## [v0.1.0] - 2014-11-26

### Overview
Introduced tag presets feature — Thanks [Raphael Pigulla](//github.com/pigulla) for making this and forcing me!

### New rules
* [[`41f1dbbebb`](https://github.com/jscs-dev/jscs-jsdoc/commit/41f1dbbebb)] - **checkAnnotations**: add tag checking by presets (Alexej Yaroshevich)

### New rule values
* [[`864a6498b5`](https://github.com/jscs-dev/jscs-jsdoc/commit/864a6498b5)] - **checkTypes**: add strictNativeCase rule (Alexej Yaroshevich)

### Bug fixes
* [[`ee6f8971e1`](https://github.com/jscs-dev/jscs-jsdoc/commit/ee6f8971e1)] - **core**: strip ticks in names (Alexej Yaroshevich)
* [[`74a08e91bf`](https://github.com/jscs-dev/jscs-jsdoc/commit/74a08e91bf)] - **jsdoc**: fixup one liners parsing bug (Alexej Yaroshevich)

### Misc
* [[`f454c983cf`](https://github.com/jscs-dev/jscs-jsdoc/commit/f454c983cf)] - tag presets (Raphael Pigulla)
* [[`cc0add681f`](https://github.com/jscs-dev/jscs-jsdoc/commit/cc0add681f)] - final steps (Alexej Yaroshevich)
* [[`79a4953ed1`](https://github.com/jscs-dev/jscs-jsdoc/commit/79a4953ed1)] - escape param/tag names before check (Charlike Mike Reagent)

### Docs
* [[`dc6bf05a9f`](https://github.com/jscs-dev/jscs-jsdoc/commit/dc6bf05a9f)] - add dev docs with internal api for happy contributing (Alexej Yaroshevich)
* [[`4ba96480c4`](https://github.com/jscs-dev/jscs-jsdoc/commit/4ba96480c4)] - add contributors (Alexej Yaroshevich)
* [[`1bcdd0e896`](https://github.com/jscs-dev/jscs-jsdoc/commit/1bcdd0e896)] - **pkg**: add pigulla (Alexej Yaroshevich)
* [[`13ed645c6a`](https://github.com/jscs-dev/jscs-jsdoc/commit/13ed645c6a)] - **readme**: add additional info about checkAnnotation values (Alexej Yaroshevich)
* [[`072737e55c`](https://github.com/jscs-dev/jscs-jsdoc/commit/072737e55c)] - **readme**: checkAnnotation rule section (Alexej Yaroshevich)
* [[`a18685a4c5`](https://github.com/jscs-dev/jscs-jsdoc/commit/a18685a4c5)] - **readme**: add checkTypes: strictNativeCase description (Alexej Yaroshevich)


## [v0.0.24] - 2014-11-18

### New rules
* [[`b7dd13ef3b`](https://github.com/jscs-dev/jscs-jsdoc/commit/b7dd13ef3b)] - new rule: requireHyphenBeforeDescription (Henry Zhu)

### Bug fixes
* [[`bf7b174091`](https://github.com/jscs-dev/jscs-jsdoc/commit/bf7b174091)] - checkRedundantParams: fixup invalid example in readme (Alexej Yaroshevich)

### Misc
* [[`e317b03511`](https://github.com/jscs-dev/jscs-jsdoc/commit/e317b03511)] - rules: change test case wording to be consistent (Henry Zhu)

### Docs
* [[`78ceb47cec`](https://github.com/jscs-dev/jscs-jsdoc/commit/78ceb47cec)] - requireHyphenBeforeDescription: add rule to readme (Henry Zhu)


## [v0.0.23] - 2014-11-11

### Bug fixes
* [[`51d5cbb5eb`](https://github.com/jscs-dev/jscs-jsdoc/commit/51d5cbb5eb)] - fixup bug with constructor key in validators (Alexej Yaroshevich)


## [v0.0.22] - 2014-11-11

### Overview
Added out of order func-ty for checkParamNames rule

### Bug fixes
* [[`1ed53d8694`](https://github.com/jscs-dev/jscs-jsdoc/commit/1ed53d8694)] - add test case and fix error message (Alexej Yaroshevich)
* [[`ef018b99c3`](https://github.com/jscs-dev/jscs-jsdoc/commit/ef018b99c3)] - fixup rule configuration asserts and add tests (Alexej Yaroshevich)
* [[`ed2f0f1c3d`](https://github.com/jscs-dev/jscs-jsdoc/commit/ed2f0f1c3d)] - checkParamNames: out of order case and tests (Alexej Yaroshevich)

### Docs
* [[`71aaf10b66`](https://github.com/jscs-dev/jscs-jsdoc/commit/71aaf10b66)] - readme: describe all rules and add examples (Alexej Yaroshevich)


## [v0.0.21] - 2014-11-11

### Bug fixes
* [[`8cfebde194`](https://github.com/jscs-dev/jscs-jsdoc/commit/8cfebde194)] - fixup bug in matching logic for custom classes (Alexej Yaroshevich)


## [v0.0.20] - 2014-11-10

### Bug fixes
* [[`342249621e`](https://github.com/jscs-dev/jscs-jsdoc/commit/342249621e)] - fixup critical bug with filtering tags (Alexej Yaroshevich)


## [v0.0.19] - 2014-11-10

### Bug fixes
* [[`ee83271ac6`](https://github.com/jscs-dev/jscs-jsdoc/commit/ee83271ac6)] - checkParamName: fixup throw on declared but unexistent params (Alexej Yaroshevich)

### Misc
* [[`02301008e4`](https://github.com/jscs-dev/jscs-jsdoc/commit/02301008e4)] - add tests with throwing cage for missing jsdoc scopes (Alexej Yaroshevich)


## [v0.0.18] - 2014-11-10

### Bug fixes
* [[`792be3db0c`](https://github.com/jscs-dev/jscs-jsdoc/commit/792be3db0c)] - checkRedundantParams, checkParamNames: add jsdoc check, etc (Christopher Hiller)

### Misc
* [[`5cf667cb3d`](https://github.com/jscs-dev/jscs-jsdoc/commit/5cf667cb3d)] - add tests for this case (Alexej Yaroshevich)


## [v0.0.17] - 2014-11-10

### Bug fixes
* [[`5c963e0142`](https://github.com/jscs-dev/jscs-jsdoc/commit/5c963e0142)] - checkRedundantReturns: add test for issue #34 (Alexej Yaroshevich)
* [[`e794e86a31`](https://github.com/jscs-dev/jscs-jsdoc/commit/e794e86a31)] - checkReturnTypes: add 'class' as valid custom object (Alexej Yaroshevich)
* [[`f74570c608`](https://github.com/jscs-dev/jscs-jsdoc/commit/f74570c608)] - checkTypes: split rule logic and add checkin for other typed tags (Alexej Yaroshevich)
* [[`593053c50d`](https://github.com/jscs-dev/jscs-jsdoc/commit/593053c50d)] - split returns to separated rules (Alexej Yaroshevich)
* [[`a3ecd830b7`](https://github.com/jscs-dev/jscs-jsdoc/commit/a3ecd830b7)] - fix location issues in jsdoc and split param rules (Alexej Yaroshevich)

### Misc
* [[`9ef4bcbf37`](https://github.com/jscs-dev/jscs-jsdoc/commit/9ef4bcbf37)] - split param tests to separated files (for simplicity) (Alexej Yaroshevich)
* [[`db9c731a8a`](https://github.com/jscs-dev/jscs-jsdoc/commit/db9c731a8a)] - reworking jsdoc-helpers, introducing jsdoctypeparser (Alexej Yaroshevich)
* [[`d360309965`](https://github.com/jscs-dev/jscs-jsdoc/commit/d360309965)] - rules api refactoring (Alexej Yaroshevich)
* [[`165ed20dc4`](https://github.com/jscs-dev/jscs-jsdoc/commit/165ed20dc4)] - basic return rules: refactor tests (Alexej Yaroshevich)
* [[`d846a5b1da`](https://github.com/jscs-dev/jscs-jsdoc/commit/d846a5b1da)] - tests: fix linting directories to lib and test (Alexej Yaroshevich)


## [v0.0.16] - 2014-11-04

### Bug fixes
* [[`6091e3eb0f`](https://github.com/jscs-dev/jscs-jsdoc/commit/6091e3eb0f)] - errors: fixup buggy line counting (Alexej Yaroshevich)

### Misc
* [[`76b2c46a42`](https://github.com/jscs-dev/jscs-jsdoc/commit/76b2c46a42)] - travis.yml: move out nodejs v0.8 from matrix (Alexej Yaroshevich)


## [v0.0.15] - 2014-11-02

### Bug fixes
* [[`c84668fe3d`](https://github.com/jscs-dev/jscs-jsdoc/commit/c84668fe3d)] - checkTypes: fixup parsing error (Alexej Yaroshevich)
* [[`298dd2edc0`](https://github.com/jscs-dev/jscs-jsdoc/commit/298dd2edc0)] - enforceExistence: fixup enforce existence checking (Alexej Yaroshevich)


## [v0.0.14] - 2014-10-29

### Bug fixes
* [[`136e2bebd0`](https://github.com/jscs-dev/jscs-jsdoc/commit/136e2bebd0)] - Fix type parsing bug (Alexej Yaroshevich)
* [[`d83bf93418`](https://github.com/jscs-dev/jscs-jsdoc/commit/d83bf93418)] - Fixes #16 (Alexej Yaroshevich)
* [[`bbf05ffb30`](https://github.com/jscs-dev/jscs-jsdoc/commit/bbf05ffb30)] - add test for #16 (Alexej Yaroshevich)
* [[`3d090346ea`](https://github.com/jscs-dev/jscs-jsdoc/commit/3d090346ea)] - update comment-parser and fix option names (Alexej Yaroshevich)


## [v0.0.12] - 2014-09-08

### Bug fixes
* [[`dd0873eba1`](https://github.com/jscs-dev/jscs-jsdoc/commit/dd0873eba1)] - enforce rule should ignore anonymous functions (Alexej Yaroshevich)


## [v0.0.11] - 2014-09-08

### Misc
* [[`202cf14e02`](https://github.com/jscs-dev/jscs-jsdoc/commit/202cf14e02)] - fixup enforce-jsdoc location (Alexej Yaroshevich)


## [v0.0.10] - 2014-09-03

### Overview
Project moved to jscs-dev group

### Misc
* [[`e2f70350d5`](https://github.com/jscs-dev/jscs-jsdoc/commit/e2f70350d5)] - sync code style rules with main repo and correct sources (Alexej Yaroshevich)

### Docs
* [[`f483fc8d8f`](https://github.com/jscs-dev/jscs-jsdoc/commit/f483fc8d8f)] - Update URLs to new location (Mike Sherov)


## [v0.0.9] - 2014-08-25

### New rules
* [[`9acd8388a8`](https://github.com/jscs-dev/jscs-jsdoc/commit/9acd8388a8)] - enforceExistence, trailingUndersoreAccess (Alexej Yaroshevich)

### Bug fixes
* [[`5fb9088e7f`](https://github.com/jscs-dev/jscs-jsdoc/commit/5fb9088e7f)] - fixing location determination, more tests (Alexej Yaroshevich)
* [[`ecefdc6821`](https://github.com/jscs-dev/jscs-jsdoc/commit/ecefdc6821)] - fixup bug in .jscsrc, clean up codestyle errors, fixup versions (Alexej Yaroshevich)
* [[`487eccd43c`](https://github.com/jscs-dev/jscs-jsdoc/commit/487eccd43c)] - fixup tests error, update version (Alexej Yaroshevich)

### Misc
* [[`aee2805538`](https://github.com/jscs-dev/jscs-jsdoc/commit/aee2805538)] - some renames, readme update, remove trailingUnderscore, fixes (Alexej Yaroshevich)


## [v0.0.7] - 2014-08-21

### Misc
* [[`6b499e32f4`](https://github.com/jscs-dev/jscs-jsdoc/commit/6b499e32f4)] - rework jsdoc rules validators, implement comment-parser (Alexej Yaroshevich)
* [[`4b2dfadc4a`](https://github.com/jscs-dev/jscs-jsdoc/commit/4b2dfadc4a)] - little refactoring of jsdoc validators (Alexej Yaroshevich)
* [[`c0924b6d72`](https://github.com/jscs-dev/jscs-jsdoc/commit/c0924b6d72)] - update jscsrc according to last changes in google preset (Alexej Yaroshevich)


## [v0.0.6] - 2014-05-27

### Bug fixes
* [[`80f7584711`](https://github.com/jscs-dev/jscs-jsdoc/commit/80f7584711)] - predrop node 0.8 support (Alexej Yaroshevich)
* [[`9c170c0838`](https://github.com/jscs-dev/jscs-jsdoc/commit/9c170c0838)] - fixes #8 fixup nullable types support (Alexej Yaroshevich)
* [[`f709d6ce0b`](https://github.com/jscs-dev/jscs-jsdoc/commit/f709d6ce0b)] - fixes #7 add support of null and undefined return types (Alexej Yaroshevich)
* [[`57cebbf915`](https://github.com/jscs-dev/jscs-jsdoc/commit/57cebbf915)] - fixup jscs errors in helpers and tests. #6 (Alexej Yaroshevich)
* [[`caaecbe94f`](https://github.com/jscs-dev/jscs-jsdoc/commit/caaecbe94f)] - closes #6 change jscs supported version to 1.3-2.0 (Alexej Yaroshevich)
* [[`db6e668f62`](https://github.com/jscs-dev/jscs-jsdoc/commit/db6e668f62)] - fixup npm module bagde (Alexej Yaroshevich)
* [[`25d0adcad6`](https://github.com/jscs-dev/jscs-jsdoc/commit/25d0adcad6)] - mark browserify isn't tested ;-( (Alexej Yaroshevich)


## [v0.0.2] - 2014-04-05

### Misc
* [[`7ea9cbc58d`](https://github.com/jscs-dev/jscs-jsdoc/commit/7ea9cbc58d)] - fixup npm module babge image url (Alexej Yaroshevich)


## [v0.0.1] - 2014-04-05

### Overview
Initial functionality imported from JSCS

### New rules
* checkParamNames
* checkRedundantParams
* requireParamTypes
* checkReturnTypes
* checkRedundantReturns
* checkTypes
* requireReturnTypes

### Misc
* [[`49fc5825d7`](https://github.com/jscs-dev/jscs-jsdoc/commit/49fc5825d7)] - initial functionality (Alexej Yaroshevich)


[unreleased]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.3.2...HEAD
[v1.3.2]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.3.1...v1.3.2
[v1.3.1]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.3.0...v1.3.1
[v1.3.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.2.0...v1.3.0
[v1.2.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.1.0...v1.2.0
[v1.1.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.0.1...v1.1.0
[v1.0.1]: https://github.com/jscs-dev/jscs-jsdoc/compare/v1.0.0...v1.0.1
[v1.0.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.6...v1.0.0
[v0.4.6]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.5...v0.4.6
[v0.4.5]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.4...v0.4.5
[v0.4.4]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.3...v0.4.4
[v0.4.3]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.2...v0.4.3
[v0.4.2]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.1...v0.4.2
[v0.4.1]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.3.2...v0.4.0
[v0.3.2]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.1.1...v0.2.0
[v0.1.1]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.24...v0.1.0
[v0.0.24]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.23...v0.0.24
[v0.0.23]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.22...v0.0.23
[v0.0.22]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.21...v0.0.22
[v0.0.21]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.20...v0.0.21
[v0.0.20]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.19...v0.0.20
[v0.0.19]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.18...v0.0.19
[v0.0.18]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.17...v0.0.18
[v0.0.17]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.16...v0.0.17
[v0.0.16]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.15...v0.0.16
[v0.0.15]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.14...v0.0.15
[v0.0.14]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.12...v0.0.14
[v0.0.12]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.11...v0.0.12
[v0.0.11]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.10...v0.0.11
[v0.0.10]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.9...v0.0.10
[v0.0.9]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.7...v0.0.9
[v0.0.7]: https://github.com/jscs-dev/jscs-jsdoc/compare/v0.0.6...v0.0.7
[v0.0.6]: https://github.com/jscs-dev/jscs-jsdoc/compare/89325196ff...v0.0.6
[v0.0.2]: https://github.com/jscs-dev/jscs-jsdoc/compare/49fc5825d7...89325196ff
[v0.0.1]: https://github.com/jscs-dev/jscs-jsdoc/commit/49fc5825d7
