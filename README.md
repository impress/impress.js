impress.js
============

[![CircleCI](https://circleci.com/gh/impress/impress.js.svg?style=svg)](https://circleci.com/gh/impress/impress.js)

It's a presentation framework based on the power of CSS3 transforms and
transitions in modern browsers and inspired by the idea behind prezi.com.

**WARNING**

impress.js may not help you if you have nothing interesting to say ;)


HOW TO USE IT
---------------
### Getting Started Guide
Check out our new [Getting Started](GettingStarted.md) guide if you want a quick introduction to the project!

### Direct download link to only impress.js
You can include this link directly inside of your HTML file in its header. If you want to learn how to do this, you can find a how-to in the [Getting Started](GettingStarted.md) guide.
- V2.0.0: https://cdn.jsdelivr.net/gh/impress/impress.js@2.0.0/js/impress.js
- V1.1.0: https://cdn.jsdelivr.net/gh/impress/impress.js@1.1.0/js/impress.js
- Source: https://cdn.jsdelivr.net/gh/impress/impress.js/js/impress.js

### Getting Started Guide
Check out our new [Getting Started](GettingStarted.md) guide if you want a quick introduction to the project!

### Checking out and initializing the git repository

    git clone --recursive https://github.com/impress/impress.js.git
    cd impress.js

Note: For a minimal checkout, omit the `--recursive` option. This will leave out extra plugins.

**Stable releases**

New features and fixes are continuously merged into the master branch, which is what the above command will check out. For the latest stable release, see the [Github Releases page](https://github.com/impress/impress.js/releases).


### Documentation


Reference documentation of core impress.js features and API you can find it in [DOCUMENTATION.md](DOCUMENTATION.md).

The [HTML source code](index.html) of the official [impress.js demo](http://impress.github.io/impress.js/) serves as a good example usage and contains comments explaining various features of impress.js. For more information about styling you can look into [CSS code](css/impress-demo.css) which shows how classes provided by impress.js can be used. Last but not least [JavaScript code of impress.js](js/impress.js) has some useful comments if you are interested in how everything works. Feel free to explore!

### Official demo

[impress.js demo](http://impress.github.io/impress.js/) by [@bartaz](http://twitter.com/bartaz)

### Examples and demos

The [Classic Slides](http://impress.github.io/impress.js/examples/classic-slides/) demo is targeted towards beginners, or can be used as a template for presentations that look like the traditional PowerPoint slide deck. Over time, it also grew into the example presentation that uses most of the features and addons available.

More examples and demos can be found on [Examples and demos wiki page](http://github.com/impress/impress.js/wiki/Examples-and-demos).

Feel free to add your own example presentations (or websites) there.

### Other tutorials and learning resources

If you want to learn even more there is a [list of tutorials and other learning resources](https://github.com/impress/impress.js/wiki/impress.js-tutorials-and-other-learning-resources)
on the wiki, too.

There is also a book available about [Building impressive presentations with impress.js](http://www.packtpub.com/building-impressive-presentations-with-impressjs/book) by Rakhitha Nimesh Ratnayake.

You may want to check out the sibling project [Impressionist](https://github.com/henrikingo/impressionist): a 3D GUI editor that can help you in creating impress.js presentations.

### Mailing list

You're welcome to ask impress.js related questions on the [impressionist-presentations](https://groups.google.com/forum/#!forum/impressionist-presentations) mailing list.


REPOSITORY STRUCTURE
--------------------

* [index.html](index.html): This is the official impress.js demo, showcasing all of the features of the original impress.js, as well as some new plugins as we add them.
  * As already mentioned, this file is well commented and acts as the official tutorial.
* [examples/](examples/): Contains several demos showcasing additional features available.
  * [Classic Slides](examples/classic-slides/index.html) is a simple demo that you can use as template if you want to create very simple, rectangular, PowerPoint-like presentations.
* [src/](src/): The main file is [src/impress.js](src/impress.js). Additional functionality is implemented as plugins in [src/plugins/](src/plugins/).
  * See [src/plugins/README.md](src/plugins/README.md) for information about the plugin API and how to write plugins.
* [test/](test/): Contains QUnit and Syn libraries that we use for writing tests, as well as some test coverage for core functionality. (Yes, more tests are much welcome.) Tests for plugins are in the directory of each plugin.
* [js/](js/): Contains [js/impress.js](js/impress.js), which contains a concatenation of the core `src/impress.js` and all the plugins. Traditionally this is the file that you'll link to in a browser. In fact both the demo and test files do exactly that.
* [css/](css/): Contains a CSS file used by the demo. This file is **not required for using impress.js** in your own presentations. Impress.js creates the CSS it needs dynamically.
* [extras/](extras/) contains plugins that for various reasons aren't enabled by default. You have to explicitly add them with their own `script` element to use them.
* [build.js](build.js): Simple build file that creates `js/impress.js`. It also creates a minified version `impress.min.js`, but that one is not included in the github repository.
* [package.json](build.js): An NPM package specification. This was mainly added so you can easily install [buildify](https://www.npmjs.com/package/buildify) and run `node build.js`. Other than the build process, which is really just doing roughly `cat src/impress.js src/plugins/*/*.js > js/impress.js`, and testing, `impress.js` itself doesn't depend on Node or any NPM modules.

WANT TO CONTRIBUTE?
---------------------

For developers, once you've made changes to the code, you should run these commands for testing:

    npm install
    npm run all

Note that running `firefox qunit_test_runner.html` is usually more informative than running `karma` with `npm run test`. They both run the same tests.

More info about the [src/](src/) directory can be found in [src/plugins/README.md](src/plugins/README.md).

### Requirements

* &gt;= node 7.6
* npm


ABOUT THE NAME
----------------

impress.js name is [courtesy of @skuzniak](http://twitter.com/skuzniak/status/143627215165333504).

It's an (un)fortunate coincidence that an Open/LibreOffice presentation tool is called Impress ;)

Reference API
--------------

See the [Reference API](DOCUMENTATION.md)

BROWSER SUPPORT
-----------------

The design goal for impress.js has been to showcase awesome CSS3 features as found in modern browser versions. We also use some new DOM functionality, and specifically do not use jQuery or any other JavaScript libraries, nor our own functions, to support older browsers. In general, recent versions of Firefox and Chrome are known to work well. Reportedly IE now works too.

The typical use case for impress.js is to create presentations that you present from your own laptop, with a browser version you know works well. Some people also use impress.js successfully to embed animations or presentations in a web page, however, be aware that in this some of your visitors may not see the presentation correctly, or at all.

In particular, impress.js makes use of the following JS and CSS features:

* [DataSet API](http://caniuse.com/#search=dataset)
* [ClassList API](http://caniuse.com/#search=classlist)
* [CSS 3D Transforms](http://caniuse.com/#search=css%203d)
* [CSS Transitions](http://caniuse.com/#search=css%20transition)

COPYRIGHT AND LICENSE
---------------------

Copyright 2011-2012 Bartek Szopka (@bartaz), 2016-2023 Henrik Ingo (@henrikingo) and [70+ other contributors](https://github.com/impress/impress.js/graphs/contributors)

Released under the MIT [License](LICENSE)


## 🌐 Web Resources & Interactive Index
- [MAKE AMERICA GREAT AGAIN](https://skillplay.github.io/make-america-great-again.html)
- [GET TO THE CHOPPER](https://theskillquest.pages.dev/get-to-the-chopper.html)
- [BATTLE TANKS FIRESTORM](https://thelearnquesters.pages.dev/battle-tanks-firestorm.html)
- [MEGA LAMBA RAMP](https://quizverses-9d2f2.web.app/mega-lamba-ramp.html)
- [CUPHEAD](https://thelearnquesters.pages.dev/cuphead.html)
- [CATEGORY JUMP SCARE21](https://studyquesthub.web.app/category-jump-scare21.html)
- [MOTO STUNT BIKER](https://thelearnquesters.pages.dev/moto-stunt-biker.html)
- [HAWAII MATCH 6](https://learnquesters.pages.dev/hawaii-match-6.html)
- [THEO MORINIS MAGICAL RESORT](https://learnquesters.pages.dev/theo-morinis-magical-resort.html)
- [KOMPOTS KITCHEN](https://studyquests.github.io/kompots-kitchen.html)
- [ONE HERO](https://thelearnquesters.pages.dev/one-hero.html)
- [MERGE FRUIT TIME](https://thelearnquesters.pages.dev/merge-fruit-time.html)
- [BLOCK CRAFT 3D](https://quizverses-9d2f2.web.app/block-craft-3d.html)
- [STRYKON](https://thelearnquesters.pages.dev/strykon.html)
- [CHAIN CUBE 2048 3D MERGE GAME](https://learnquesters.pages.dev/chain-cube-2048-3d-merge-game.html)
- [CATEGORY MOUSE1 707 2](https://thelearnquesters.pages.dev/category-mouse1-707-2.html)
- [TYPE SPRINT](https://studyquests.github.io/type-sprint.html)
- [BRAINROT CLICKER](https://studyplaying.github.io/brainrot-clicker.html)
- [RADIANT RUSH](https://thelearnquesters.pages.dev/radiant-rush.html)
- [PIRATE ISLAND](https://thelearnquesters.pages.dev/pirate-island.html)
- [BLOCKY ARCHER RUN](https://learnquesters.pages.dev/blocky-archer-run.html)
- [SHIP FACTORY TYCOON](https://quizverses-9d2f2.web.app/ship-factory-tycoon.html)
- [INDEX10](https://thequizzone.pages.dev/index10.html)
- [GIANT RUN 3D](https://studyquests.pages.dev/giant-run-3d.html)
- [CANDY SMASH](https://quizverses-9d2f2.web.app/candy-smash.html)
- [CATEGORY AGILITY](https://thelearnquesters.pages.dev/category-agility.html)
- [CITYIDLE](https://thelearnquesters.pages.dev/cityidle.html)
- [TRICKY CHALLENGES MINI GAMES](https://thelearnquesters.pages.dev/tricky-challenges-mini-games.html)
- [OBBY TOWER](https://thelearnquesters.pages.dev/obby-tower.html)
- [BUTTERFLY TRIPLE](https://quizverses-9d2f2.web.app/butterfly-triple.html)
- [PUZZLE LUB](https://thelearnquesters.pages.dev/puzzle-lub.html)
- [CONTACT](https://thelearnquesters.pages.dev/contact.html)
- [INDEX19](https://thelearnquesters.pages.dev/index19.html)
- [PAW CLASH](https://studyplaying.github.io/paw-clash.html)
- [HIDDEN OBJECT FARM ADVENTURE](https://thelearnquesters.pages.dev/hidden-object-farm-adventure.html)
- [CATEGORY ROGUELIKE38](https://studyquests.github.io/category-roguelike38.html)
- [STRIKE BREAKOUT](https://thelearnquesters.pages.dev/strike-breakout.html)
- [INDEX35](https://thelearnquesters.pages.dev/index35.html)
- [SCREW NUTS BOLTS WOOD SOLVE](https://thelearnquesters.pages.dev/screw-nuts-bolts-wood-solve.html)
- [CATEGORY UNBLOCKED WEBSITES](https://studyquests.github.io/category-unblocked-websites.html)
- [CATEGORY MEME BLOXY24](https://studyquests.pages.dev/category-meme-bloxy24.html)
- [SEA MATCH](https://thelearnquesters.pages.dev/sea-match.html)
- [TILES MATCHING](https://learnquesters.pages.dev/tiles-matching.html)
- [BUBBLE FEVER BLAST](https://thelearnquesters.pages.dev/bubble-fever-blast.html)
- [CATEGORY GOGUARDIANBYPASS](https://studyquests.github.io/category-goguardianbypass.html)
- [CATEGORY ALIEN34](https://thelearnquesters.pages.dev/category-alien34.html)
- [GEOMETRY VIBES X ARROW](https://learnquesters.pages.dev/geometry-vibes-x-arrow.html)
- [CATEGORY ANIMAL215](https://studyquests.pages.dev/category-animal215.html)
- [SUDOKU MASTER](https://learnquester.github.io/sudoku-master.html)
- [KING KONG KART RACING](https://thelearnquesters.pages.dev/king-kong-kart-racing.html)
- [TREASURE CHAMPION CHEST CAPTURE](https://learnquester.github.io/treasure-champion-chest-capture.html)
- [CATEGORY ART](https://studyplayings.web.app/category-art.html)
- [PATTERNS](https://quizverses-9d2f2.web.app/patterns.html)
- [BINGO HALLOWEEN](https://studyquests.pages.dev/bingo-halloween.html)
- [PLANETARIUM 2](https://thelearnquesters.pages.dev/planetarium-2.html)
- [DONT PANIC DUDE](https://thelearnquesters.pages.dev/dont-panic-dude.html)
- [CATEGORY 2D1 175](https://thelearnquesters.pages.dev/category-2d1-175.html)
- [CATEGORY CAR 2](https://quizverses.pages.dev/category-car-2.html)
- [RIDDLEMATH](https://studyplaying.github.io/riddlemath.html)
- [CATEGORY POOL](https://learnquester.pages.dev/category-pool.html)
- [PANDA ADVENTURE](https://thelearnquesters.pages.dev/panda-adventure.html)
- [CATEGORY POOL 3](https://thelearnquesters.pages.dev/category-pool-3.html)
- [IDLE TRADE ISLE](https://learnquester.pages.dev/idle-trade-isle.html)
- [ABOUT A FROG](https://studyplayings.pages.dev/about-a-frog.html)
- [MINICRAFT WINTERBLOCK](https://quizverses.pages.dev/minicraft-winterblock.html)
- [FASHION PRINCESS DRESS UP FOR GIRLS](https://thelearnquesters.pages.dev/fashion-princess-dress-up-for-girls.html)
- [BARBEE BLACK FRIDAY FASHION](https://quizverses-9d2f2.web.app/barbee-black-friday-fashion.html)
- [POLICE CHASE DRIFTER](https://studyplaying.github.io/police-chase-drifter.html)
- [VR WORLD](https://quizverses-9d2f2.web.app/vr-world.html)
- [MATCH TILE ROYAL FAMILY](https://thelearnquester.web.app/match-tile-royal-family.html)
- [OIL DIGGING](https://studyplayings.pages.dev/oil-digging.html)
- [BULL RUNNER](https://studyquesthub.web.app/bull-runner.html)
- [CROWD BATTLE GUN RUSH](https://quizverses.pages.dev/crowd-battle-gun-rush.html)
- [INDEX14](https://quizverses.pages.dev/index14.html)
- [TRUCK SIMULATOR ARCADE CHAMPIONSHIP](https://thelearnquesters.pages.dev/truck-simulator-arcade-championship.html)
- [BLOSSOM](https://quizverses.pages.dev/blossom.html)
- [BALL DROP](https://thelearnquesters.pages.dev/ball-drop.html)
- [DINO SHOOTER PRO](https://learnquester.github.io/dino-shooter-pro.html)
- [CATEGORY FASHION105](https://quizverses.pages.dev/category-fashion105.html)
- [MATH STARS](https://quizverses.pages.dev/math-stars.html)
- [IDLE MONEY FACTORY](https://studyplaying.github.io/idle-money-factory.html)
- [CATEGORY THIRD PERSON SHOOTER80](https://studyquests.pages.dev/category-third-person-shooter80.html)
- [AIDAN IN DANGER](https://thelearnquesters.pages.dev/aidan-in-danger.html)
- [HEXA PUZZLE MASTER](https://learnquester.pages.dev/hexa-puzzle-master.html)
- [CATEGORY SOLDIER11](https://quizverses.pages.dev/category-soldier11.html)
- [MAZE HIDE OR SEEK](https://learnquester.pages.dev/maze-hide-or-seek.html)
- [PRINXY WINTERELLA](https://thelearnquesters.pages.dev/prinxy-winterella.html)
- [CATEGORY QUIZ](https://learnquesters.pages.dev/category-quiz.html)
- [SAND BLAST](https://studyplayings.pages.dev/sand-blast.html)
- [CITYQUEST](https://studyquesthub.web.app/cityquest.html)
- [CATEGORY DESTROY](https://quizverses.pages.dev/category-destroy.html)
- [MAGIC AND WIZARDS MATCH](https://studyplaying.github.io/magic-and-wizards-match.html)
- [UNCLE BULLET 007](https://thelearnquesters.pages.dev/uncle-bullet-007.html)
- [ONLINE PORTAL](https://thequizzone.pages.dev/)
- [CATEGORY SOCCER](https://studyquests.pages.dev/category-soccer.html)
- [CATEGORY 2D1 060](https://studyquests.pages.dev/category-2d1-060.html)
- [INDEX8](https://quizverses.pages.dev/index8.html)
- [FOOD CARD SORT](https://thelearnquester.web.app/food-card-sort.html)
- [CATEGORY EDUCATIONAL](https://quizverses.pages.dev/category-educational.html)
- [WORD STARS](https://learnquester.github.io/word-stars.html)
- [SHOP SORTING 2](https://quizverses.pages.dev/shop-sorting-2.html)
- [PET DOCTOR BUSINESS TYCOON PET CARE GAME](https://thelearnquester.web.app/pet-doctor-business-tycoon-pet-care-game.html)
- [SOCCER TOURNAMENT](https://thelearnquesters.pages.dev/soccer-tournament.html)
- [CONSTRUCTION TRUCK BUILDING GAMES FOR KIDS](https://studyplayings.pages.dev/construction-truck-building-games-for-kids.html)
- [CATEGORY SIMULATION 2](https://quizverses.pages.dev/category-simulation-2.html)
- [POTTERY MASTER](https://quizverses-9d2f2.web.app/pottery-master.html)
- [HUNGRY CORGI CUTE MUSIC GAME](https://learnquester.github.io/hungry-corgi-cute-music-game.html)
- [CATEGORY RPG](https://thelearnquesters.pages.dev/category-rpg.html)
- [OBBY GYM SIMULATOR ESCAPE](https://learnquester.github.io/obby-gym-simulator-escape.html)
- [BRAINROT MOB CLASH 3D](https://studyquests.github.io/brainrot-mob-clash-3d.html)
- [CATEGORY PUZZLE 2](https://thelearnquesters.pages.dev/category-puzzle-2.html)
- [INDEX18](https://studyquests.pages.dev/index18.html)
- [CATEGORY DESTROY256](https://thelearnquester.web.app/category-destroy256.html)
- [INDEX11](https://quizverses.pages.dev/index11.html)
- [ROCKET FEST](https://thelearnquester.web.app/rocket-fest.html)
- [STICKMAN ARCHER SHOOTING ARROWS AT REDS](https://thelearnquesters.pages.dev/stickman-archer-shooting-arrows-at-reds.html)
- [SQUID CHALLENGE PLAY TO SURVIVE](https://learnquesters.pages.dev/squid-challenge-play-to-survive.html)
- [MOTORCYCLE RACER ROAD MAYHEM](https://thelearnquesters.pages.dev/motorcycle-racer-road-mayhem.html)
- [MR BEAN JUMP](https://studyplayings.web.app/mr-bean-jump.html)
- [INDEX4](https://quizverses.pages.dev/index4.html)
- [MAHJONG LINES](https://studyquesthub.web.app/mahjong-lines.html)
- [SPRUNKI CHARACTER MAKER OC](https://thelearnquesters.pages.dev/sprunki-character-maker-oc.html)
- [ANIMATION COLORING ALPHABET LORE](https://thelearnquesters.pages.dev/animation-coloring-alphabet-lore.html)
- [FLOAT FOR BRAINROTS](https://studyplayings.pages.dev/float-for-brainrots.html)
- [TRICKY LIFE](https://studyquesthub.web.app/tricky-life.html)
- [CATEGORY BATTLESHIP](https://studyquests.pages.dev/category-battleship.html)
- [BIMKA DRIVE SMASH CARS INTO SPLINTERS](https://learnquester.github.io/bimka-drive-smash-cars-into-splinters.html)
- [STOP THE BULLET](https://learnquesters.pages.dev/stop-the-bullet.html)
- [CUBE TO HOLE PUZZLE](https://studyplayings.web.app/cube-to-hole-puzzle.html)
- [BRAINROT ICE TRUCK](https://thelearnquester.web.app/brainrot-ice-truck.html)
