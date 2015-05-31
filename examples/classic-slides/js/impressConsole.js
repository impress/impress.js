/**
 * impressConsole.js
 *
 * Adds a presenter console to impress.js
 *
 * MIT Licensed, see license.txt.
 *
 * Copyright 2012, 2013, 2015 impress-console contributors (see README.txt)
 *
 * version: 1.3-dev
 *
 */

(function ( document, window ) {
    'use strict';

    // create Language object depending on browsers language setting
    var lang;
    switch (navigator.language) {
    case 'de':
        lang = {
            'noNotes' : '<div class="noNotes">Keine Notizen hierzu</div>',
            'restart' : 'Neustart',
            'clickToOpen' : 'Klicken um Sprecherkonsole zu öffnen',
            'prev' : 'zurück',
            'next' : 'weiter',
            'loading' : 'initalisiere',
            'ready' : 'Bereit',
            'moving' : 'in Bewegung',
            'useAMPM' : false
        };
        break;
    case 'en':
    default :
        lang = {
            'noNotes' : '<div class="noNotes">No notes for this step</div>',
            'restart' : 'Restart',
            'clickToOpen' : 'Click to open speaker console',
            'prev' : 'Prev',
            'next' : 'Next',
            'loading' : 'Loading',
            'ready' : 'Ready',
            'moving' : 'Moving',
            'useAMPM' : false
        };
        break;
    }

    // Settings to set iframe in speaker console
    const preViewDefaultFactor = 0.7;
    const preViewMinimumFactor = 0.5;
    const preViewGap    = 4;

    // This is the default template for the speaker console window
    const consoleTemplate = '<!DOCTYPE html>' +
        '<html id="impressconsole"><head>' +
          '<link rel="stylesheet" type="text/css" media="screen" href="{{cssFile}}">' +
        '</head><body>' +
        '<div id="console">' +
          '<div id="views">' +
            '<iframe id="slideView" scrolling="no"></iframe>' +
            '<iframe id="preView" scrolling="no"></iframe>' +
            '<div id="blocker"></div>' +
          '</div>' +
          '<div id="notes"></div>' +
        '</div>' +
        '<div id="controls"> ' +
          '<div id="prev"><a  href="#" onclick="impress().prev(); return false;" />{{prev}}</a></div>' +
          '<div id="next"><a  href="#" onclick="impress().next(); return false;" />{{next}}</a></div>' +
          '<div id="clock">--:--</div>' +
          '<div id="timer" onclick="timerReset()">00m 00s</div>' +
          '<div id="status">{{loading}}</div>' +
        '</div>' +
        '</body></html>';

    // Default css location
    var cssFile = "css/impressConsole.css";

    // All console windows, so that you can call impressConsole() repeatedly.
    var allConsoles = {};

    // Zero padding helper function:
    var zeroPad = function(i) {
        return (i < 10 ? '0' : '') + i;
    };

    // The console object
    var impressConsole = window.impressConsole = function (rootId) {

        rootId = rootId || 'impress';

        if (allConsoles[rootId]) {
            return allConsoles[rootId];
        }

        // root presentation elements
        var root = document.getElementById( rootId );

        var consoleWindow = null;

        var nextStep = function() {
            var classes = "";
            var nextElement = document.querySelector('.active');
            // return to parents as long as there is no next sibling
            while (!nextElement.nextElementSibling && nextElement.parentNode) {
                nextElement = nextElement.parentNode;
            }
            nextElement = nextElement.nextElementSibling;
            while (nextElement) {
                classes = nextElement.attributes['class'];
                if (classes && classes.value.indexOf('step') !== -1) {
                    consoleWindow.document.getElementById('blocker').innerHTML = lang.next;
                    return nextElement;
                }

                if (nextElement.firstElementChild) { // first go into deep
                    nextElement = nextElement.firstElementChild;
                }
                else {
                    // go to next sibling or through parents until there is a next sibling
                    while (!nextElement.nextElementSibling && nextElement.parentNode) {
                        nextElement = nextElement.parentNode;
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
            // No next element. Pick the first
            consoleWindow.document.getElementById('blocker').innerHTML = lang.restart;
            return document.querySelector('.step');
        };

        // Sync the notes to the step
        var onStepLeave = function(){
            if(consoleWindow) {
                // Set notes to next steps notes.
                var newNotes = document.querySelector('.active').querySelector('.notes');
                if (newNotes) {
                    newNotes = newNotes.innerHTML;
                } else {
                    newNotes = lang.noNotes;
                }
                consoleWindow.document.getElementById('notes').innerHTML = newNotes;

                // Set the views
                var baseURL = document.URL.substring(0, document.URL.search('#/'));
                var slideSrc = baseURL + '#' + document.querySelector('.active').id;
                var preSrc = baseURL + '#' + nextStep().id;
                var slideView = consoleWindow.document.getElementById('slideView');
                // Setting them when they are already set causes glithes in Firefox, so we check first:
                if (slideView.src !== slideSrc) {
                    slideView.src = slideSrc;
                }
                var preView = consoleWindow.document.getElementById('preView');
                if (preView.src !== preSrc) {
                    preView.src = preSrc;
                }

                consoleWindow.document.getElementById('status').innerHTML = '<span class="moving">' + lang.moving + '</span>';
            }
        };

        // Sync the previews to the step
        var onStepEnter = function(){
            if(consoleWindow) {
                // We do everything here again, because if you stopped the previos step to
                // early, the onstepleave trigger is not called for that step, so
                // we need this to sync things.
                var newNotes = document.querySelector('.active').querySelector('.notes');
                if (newNotes) {
                    newNotes = newNotes.innerHTML;
                } else {
                    newNotes = lang.noNotes;
                }
                var notes = consoleWindow.document.getElementById('notes');
                notes.innerHTML = newNotes;
                notes.scrollTop = 0;

                // Set the views
                var baseURL = document.URL.substring(0, document.URL.search('#/'));
                var slideSrc = baseURL + '#' + document.querySelector('.active').id;
                var preSrc = baseURL + '#' + nextStep().id;
                var slideView = consoleWindow.document.getElementById('slideView');
                // Setting them when they are already set causes glithes in Firefox, so we check first:
                if (slideView.src !== slideSrc) {
                    slideView.src = slideSrc;
                }
                var preView = consoleWindow.document.getElementById('preView');
                if (preView.src !== preSrc) {
                    preView.src = preSrc;
                }

                consoleWindow.document.getElementById('status').innerHTML = '<span  class="ready">' + lang.ready + '</span>';
            }
        };

        var spaceHandler = function () {
            var notes = consoleWindow.document.getElementById('notes');
            if (notes.scrollTopMax - notes.scrollTop > 20) {
               notes.scrollTop = notes.scrollTop + notes.clientHeight * 0.8;
            } else {
               impress().next();
            }
        };

        var timerReset = function () {
            consoleWindow.timerStart = new Date();
        };

        // Show a clock
        var clockTick = function () {
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();
            var ampm = '';

            if (lang.useAMPM) {
                ampm = ( hours < 12 ) ? 'AM' : 'PM';
                hours = ( hours > 12 ) ? hours - 12 : hours;
                hours = ( hours === 0 ) ? 12 : hours;
            }

            // Clock
            var clockStr = zeroPad(hours) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds) + ' ' + ampm;
            consoleWindow.document.getElementById('clock').firstChild.nodeValue = clockStr;

            // Timer
            seconds = Math.floor((now - consoleWindow.timerStart) / 1000);
            minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            consoleWindow.document.getElementById('timer').firstChild.nodeValue = zeroPad(minutes) + 'm ' + zeroPad(seconds) + 's';

            if (!consoleWindow.initialized) {
                // Nudge the slide windows after load, or they will scrolled wrong on Firefox.
                consoleWindow.document.getElementById('slideView').contentWindow.scrollTo(0,0);
                consoleWindow.document.getElementById('preView').contentWindow.scrollTo(0,0);
                consoleWindow.initialized = true;
            }
        };

        var registerKeyEvent = function(keyCodes, handler, window) {
            if (window === undefined) {
                window = consoleWindow;
            }

            // prevent default keydown action when one of supported key is pressed
            window.document.addEventListener("keydown", function ( event ) {
                if ( !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && keyCodes.indexOf(event.keyCode) !== -1) {
                    event.preventDefault();
                }
            }, false);

            // trigger impress action on keyup
            window.document.addEventListener("keyup", function ( event ) {
                if ( !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && keyCodes.indexOf(event.keyCode) !== -1) {
                        handler();
                        event.preventDefault();
                }
            }, false);
        };

        var consoleOnLoad = function() {
                var slideView = consoleWindow.document.getElementById('slideView');
                var preView = consoleWindow.document.getElementById('preView');

                // Firefox:
                slideView.contentDocument.body.classList.add('impress-console');
                preView.contentDocument.body.classList.add('impress-console');

                // Chrome:
                slideView.addEventListener('load', function() {
                        slideView.contentDocument.body.classList.add('impress-console');
                });
                preView.addEventListener('load', function() {
                        preView.contentDocument.body.classList.add('impress-console');
                });
        };

        var open = function() {
            if(top.isconsoleWindow){
                return;
            }

            if (consoleWindow && !consoleWindow.closed) {
                consoleWindow.focus();
            } else {
                consoleWindow = window.open();

                // if opening failes this may be because the browser prevents this from
                // not (or less) interactive JavaScript...
                if (consoleWindow == null) {
                    // ... so I add a button to klick.
                    // workaround on firefox
                    var message = document.createElement('div');
                    message.id = 'consoleWindowError';
                    message.style.position = "fixed";
                    message.style.left = 0;
                    message.style.top = 0;
                    message.style.right = 0;
                    message.style.bottom = 0;
                    message.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    message.innerHTML = '<button style="margin: 25vh 25vw;width:50vw;height:50vh;" onclick="var x = document.getElementById(\'consoleWindowError\');x.parentNode.removeChild(x);impressConsole().open();">' + lang.clickToOpen + '</button>';
                    document.body.appendChild(message);
                    return;
                }

                // This sets the window location to the main window location, so css can be loaded:
                consoleWindow.document.open();
                // Write the template:
                consoleWindow.document.write(consoleTemplate.replace("{{cssFile}}", cssFile).replace(/{{.*?}}/gi, function (x){ return lang[x.substring(2, x.length-2)]; }));
                consoleWindow.document.title = 'Speaker Console (' + document.title + ')';
                consoleWindow.impress = window.impress;
                // We set this flag so we can detect it later, to prevent infinite popups.
                consoleWindow.isconsoleWindow = true;
                // Set the onload function:
                consoleWindow.onload = consoleOnLoad;
                // Add clock tick
                consoleWindow.timerStart = new Date();
                consoleWindow.timerReset = timerReset;
                consoleWindow.clockInterval = setInterval('impressConsole("' + rootId + '").clockTick()', 1000 );

                // keyboard navigation handlers
                // 33: pg up, 37: left, 38: up
                registerKeyEvent([33, 37, 38], impress().prev);
                // 34: pg down, 39: right, 40: down
                registerKeyEvent([34, 39, 40], impress().next);
                // 32: space
                registerKeyEvent([32], spaceHandler);
                // 82: R
                registerKeyEvent([82], timerReset);

                // Cleanup
                consoleWindow.onbeforeunload = function() {
                    // I don't know why onunload doesn't work here.
                    clearInterval(consoleWindow.clockInterval);
                };

                // It will need a little nudge on Firefox, but only after loading:
                onStepEnter();
                consoleWindow.initialized = false;
                consoleWindow.document.close();

                //catch any window resize to pass size on
                window.onresize = resize;
                consoleWindow.onresize = resize;

                return consoleWindow;
            }
        };

        var resize = function() {
            var slideView = consoleWindow.document.getElementById('slideView');
            var preView = consoleWindow.document.getElementById('preView');

            // get ratio of presentation
            var ratio = window.innerHeight / window.innerWidth;

            // get size available for views
            var views = consoleWindow.document.getElementById('views');

            // slideView may have a border or some padding:
            // asuming same border width on both direktions
            var delta = slideView.offsetWidth - slideView.clientWidth;

            // set views
            var slideViewWidth = (views.clientWidth - delta);
            var slideViewHeight = Math.floor(slideViewWidth * ratio);

            var preViewTop = slideViewHeight + preViewGap;

            var preViewWidth = Math.floor(slideViewWidth * preViewDefaultFactor);
            var preViewHeight = Math.floor(slideViewHeight * preViewDefaultFactor);


            // shrink preview to fit into space available
            if (views.clientHeight - delta < preViewTop + preViewHeight) {
                preViewHeight = views.clientHeight - delta - preViewTop;
                preViewWidth = Math.floor(preViewHeight / ratio);
            }

            // if preview is not high enough forget ratios!
            if (preViewWidth <= Math.floor(slideViewWidth * preViewMinimumFactor)) {
                slideViewWidth = (views.clientWidth - delta);
                slideViewHeight = Math.floor((views.clientHeight - delta - preViewGap) / (1 + preViewMinimumFactor));

                preViewTop = slideViewHeight + preViewGap;

                preViewWidth = Math.floor(slideViewWidth * preViewMinimumFactor);
                preViewHeight = views.clientHeight - delta - preViewTop;
            }

            // set the calculated into styles
            slideView.style.width = slideViewWidth + "px";
            slideView.style.height = slideViewHeight + "px";

            preView.style.top = preViewTop + "px";

            preView.style.width = preViewWidth + "px";
            preView.style.height = preViewHeight + "px";
        }

        var init = function(css) {
            if (css !== undefined) {
                cssFile = css;
            }

            // Register the event
            root.addEventListener('impress:stepleave', onStepLeave);
            root.addEventListener('impress:stepenter', onStepEnter);

            //When the window closes, clean up after ourselves.
            window.onunload = function(){
                if (consoleWindow && !consoleWindow.closed) {
                    consoleWindow.close();
                }
            };

            //Open speaker console when they press 'p'
            registerKeyEvent([80], open, window);
        };

        // Return the object
        allConsoles[rootId] = {init: init, open: open, clockTick: clockTick, registerKeyEvent: registerKeyEvent};
        return allConsoles[rootId];

    };

})(document, window);
