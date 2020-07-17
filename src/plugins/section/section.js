/**
 * Sections Plugin
 *
 * Copyright 2019 Marc Schreiber (@schrieveslaach)
 * Released under the MIT license.
 */
/* global document */

( function( document ) {
    "use strict";
    let root, api, gc;

    let indexedSteps = null;

    const agenda = document.querySelector( "#impress-section-agenda" );
    const currentSection = document.querySelector(
        "#impress-section-overview .impress-current-section" );
    const sectionNumbers = document.querySelector(
        "#impress-section-overview .impress-section-numbers" );

    function findSection( element ) {
        if ( element.parentNode == null ) {
            return null;
        }
        if ( element.parentNode.tagName === "SECTION" ) {
            const sectionElement = element.parentNode;

            let title = "";
            const headingElements = sectionElement.getElementsByTagName( "H1" );
            if ( headingElements.length > 0 ) {
                title = headingElements[ 0 ].textContent;
            }

            return {
                element: element,
                sectionElement: sectionElement,
                sectionTitle: title
            };
        }
        return findSection( element.parentNode );
    }

    function indexSteps() {
        return Array.prototype.slice.call( root.querySelectorAll( ".step" ) )
            .map( function( step ) {
                return findSection( step );
            } )
            .filter( function( section ) {
                return section != null;
            } )
            .map( function( step, index ) {
                step.index = index + 1;
                return step;
            } );
    }

    document.addEventListener( "impress:init", function( event ) {
        root = event.target;
        api = event.detail.api;
        gc = api.lib.gc;

        if ( agenda !== null ) {
            indexedSteps = indexSteps();

            function depth( heading, n = 0 ) {
                const parent = heading.parentElement;
                if ( parent !== null ) {
                    if ( parent.tagName === "SECTION" ) {
                        return depth( parent, n + 1 );
                    }
                    return depth( parent, n );
                }
                return n;
            }

            const headings = [].slice.call( document.querySelectorAll( "section h1" ) ).map( function ( heading ) {
                return { text: heading.innerText, depth: depth( heading ) };
            } );

            headings.reduce( function ( dom, heading, index  ) {
                if ( index === 0 ) {
                    const li = document.createElement( "li" );
                    li.innerText = heading.text;

                    dom.appendChild( li );

                    return {
                        ul: dom,
                        depth: heading.depth
                    };
                }

                if ( dom.depth === heading.depth ) {
                    const li = document.createElement( "li" );
                    li.innerText = heading.text;

                    dom.ul.appendChild( li );
                } else if ( dom.depth < heading.depth ) {
                    const ul = document.createElement( "ul" );
                    const li = document.createElement( "li" );
                    li.innerText = heading.text;
                    ul.appendChild( li );

                    const parentLi = dom.ul.lastChild;
                    parentLi.appendChild( ul );

                    return {
                        ul,
                        depth: heading.depth
                    };
                } else {
                    const ul = dom.ul.parentElement.parentElement;

                    const li = document.createElement( "li" );
                    li.innerText = heading.text;
                    ul.appendChild( li );

                    return {
                        ul,
                        depth: heading.depth
                    };
                }

                return dom;
            }, agenda );
        }
    } );

    document.addEventListener( "impress:steprefresh", function( event ) {
        updateSectionOverview( event.target );
    } );

    function updateSectionOverview( targetElement ) {
        if ( indexedSteps === null ) {
            return;
        }

        const indexedStep = indexedSteps.find( function( step ) {
            return step.element.isSameNode( targetElement );
        } );

        if ( sectionNumbers !== null ) {
            if ( indexedStep === undefined ) {
                sectionNumbers.innerText = "";
            } else {
                sectionNumbers.innerText = indexedStep.index + "/" + indexedSteps.length;
            }
        }

        function findSectionTitles( sectionElement, titles = [] ) {
            if ( sectionElement.tagName === "SECTION" ) {
                const headingElements = sectionElement.getElementsByTagName( "H1" );
                if ( headingElements.length > 0 ) {
                    titles = titles.concat( headingElements[ 0 ].textContent );
                }
            }

            if ( sectionElement.parentElement !== null ) {
                return findSectionTitles( sectionElement.parentElement, titles );
            }

            return titles;
        }
        const titles = indexedStep !== undefined ? findSectionTitles( indexedStep.sectionElement ).reverse() : [];

        if ( currentSection !== null ) {
            currentSection.innerHTML = "";

            if ( indexedStep !== undefined ) {
                titles.forEach( function( title, index ) {
                    if ( index > 0 ) {
                        const span = document.createElement( "span" );
                        span.classList.add( "section-spacer" );
                        span.innerText = "❯";
                        currentSection.appendChild( span );
                    }

                    const span = document.createElement( "span" );
                    span.innerText = title;
                    currentSection.appendChild( span );
                } );
            }
        }

        const currentSectionElement = indexedStep !== undefined ? indexedStep.sectionElement : null;
        Array.prototype.slice.call( root.querySelectorAll( ".step" ) ).forEach( function( step ) {
            const sectionOfStep = findSection( step );

            let activeSection = false;
            if ( currentSectionElement === null && sectionOfStep === null ) {
                activeSection = true;
            }
            if ( sectionOfStep !== null && titles.length > 0 ) {
                const titlesOfStep = findSectionTitles( sectionOfStep.sectionElement ).reverse();
                if ( titlesOfStep.length > 0 && titlesOfStep[ 0 ] === titles[ 0 ] ) {
                    activeSection = true;
                }
            }

            if ( activeSection ) {
                step.classList.add( "active-section" );
                step.classList.remove( "hidden-section" );
            } else {
                step.classList.remove( "active-section" );
                step.classList.add( "hidden-section" );
            }
        } );
    }

} )( document );
