/**
 * Substep effects Plugin
 *
 *
 * The plugin adds the posibility to add custom classes at each substep to objects:
 *      When an object with class substep uses one of the following attributes,
 *      the following classes are added to certain objects.
 *
 * The attributes are:
 *      - data-addonly-TOCLASS = "CLASS" : This attribute is used to apply certain
 *          classes in particular CLASS, CLASS-base, CLASS-before, CLASS-after,
 *          following the rules explained in section classes.
 *
 *      - data-addfrom-TOCLASS = "CLASS" and data-addto-TOCLASS = "CLASS":
 *          this two attributes are used to apply certain classes from the substep
 *          with the attribute data-addfrom-TOCLASS = "CLASS" to the substep with the attribute
 *          data-addto-TOCLASS = "CLASS" with the rules explained in the following.
 *
 * The classes are:
 *
 *      - CLASS-base: This class is added at step enter to each object reffered by TOCLASS
 *
 *      - CLASS-before: This class is added at step enter to each obbject reffered by TOCLASS
 *          ad removed when the substep with the attribute data-addonly-TOCLASS = "CLASS" or
 *          data-addfrom-TOCLASS = "CLASS" is reached
 *
 *      - CLASS-after: This class is added after the substep with the attribute
 *          data-addonly-TOCLASS = "CLASS" or data-addto-TOCLASS = "CLASS" is reached.
 *
 *      - CLASS: This class is added when the substep with the attribute
 *          data-addonly-TOCLASS = "CLASS" is reached and removed efterwards
 *          or between the substep with the attribute data-addfrom-TOCLASS = "CLASS" and
 *          data-addto-TOCLASS = "CLASS".
 *
 *      Some examples of all these features are presented in the file example.html
 *
 *
 * Copyright 2020 Gastone Pietro Rosati Papini (@tonegas)
 * http://tonegas.com
 * Released under the MIT license.
 */

( function( document ) {
    "use strict";
    const stringAddClassOnlyNow = "data-addonly";
    const stringAddClassFromNow = "data-addfrom";
    const stringAddClassToNow = "data-addto";
    const stringAfterSubstep = "-after";
    const stringBeforeSubstep = "-before";
    const stringBaseClass = "-base";
    var slideFrom = null;

    /* Function for resetting all the classes used */
    function resetClasses( subElem ) {
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ ) {
            let lenStr = stringAddClassOnlyNow.length;
            if ( stringAddClassOnlyNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1 ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    obj.classList.remove( toClass + stringAfterSubstep );
                    obj.classList.remove( toClass );
                    obj.classList.add( toClass + stringBeforeSubstep );
                    obj.classList.add( toClass + stringBaseClass );
                } );
            }
            lenStr = stringAddClassFromNow.length;
            if ( stringAddClassFromNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    obj.classList.remove( toClass + stringAfterSubstep );
                    obj.classList.remove( toClass );
                    obj.classList.add( toClass + stringBeforeSubstep );
                    obj.classList.add( toClass + stringBaseClass );
                } );
            }
        }
    }

    /* Function for appling the classes at certain substep */
    function applyOnlyClass( subElem ) {
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
            let lenStr = stringAddClassOnlyNow.length;
            if ( stringAddClassOnlyNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    obj.classList.add( toClass );
                    obj.classList.add( toClass + stringAfterSubstep );
                    obj.classList.remove( toClass + stringBeforeSubstep );
                } );
            }
        }
    }

    /* Function for appling the classes at from a certain substep */
    function applyFromClass( subElem ) {
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
            let lenStr = stringAddClassFromNow.length;
            if ( stringAddClassFromNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    obj.classList.add( toClass );
                    obj.classList.remove( toClass + stringBeforeSubstep );
                } );
            }
        }
    }

    /* Function for appling the classes at until a certain substep */
    function applyToClass( subElem ) {
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
            let lenStr = stringAddClassToNow.length;
            if ( stringAddClassToNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    obj.classList.remove( toClass );
                    obj.classList.add( toClass + stringAfterSubstep );
                } );
            }
        }
    }

    document.addEventListener( "impress:stepenter", function( event ) {
        /* It is used when I start from a slide (or refesh) */
        event.target.querySelectorAll( ".substep" ).forEach( subElem => {
            /* Set the base classes to the objects */
            resetClasses( subElem );
        } );
        /* Reset the classes of the objects that are modified */
        /* It is useful when I show element of other slide */
        if ( slideFrom !== null ) {
            slideFrom.querySelectorAll( ".substep" ).forEach( subElem => {
                /* Set the base classes to the objects */
                resetClasses( subElem );
            } );
        }
    }, false );

    function subEffects( event ) {
        /* Reset all classes at each substep */
        event.target.querySelectorAll( ".substep:not(.substep-active)" ).forEach( subElem => {
            /* Set the base classas to the objects */
            if ( event.type === "impress:substep:stepleaveaborted" ) {
                resetClasses( subElem );
            }
        } );
        /* Active the condition of the each substep */
        /* Apply the classes to the objects activated */
        event.target.querySelectorAll( ".substep.substep-visible" ).forEach( subElem => {
            applyFromClass( subElem );
            applyToClass( subElem );
        } );
        /* Active the condition of the active substep */
        event.target.querySelectorAll( ".substep.substep-active" ).forEach( subElem => {
            applyOnlyClass( subElem );
            applyFromClass( subElem );
            applyToClass( subElem );
        } );
    }

    let elementsArray = document.querySelectorAll( ".step" );
    elementsArray.forEach( function( elem ) {
        elem.addEventListener( "impress:substep:enter", subEffects, false );
        elem.addEventListener( "impress:substep:stepleaveaborted", subEffects, false );
    } );

    document.addEventListener( "impress:stepleave", function( event ) {
        /* Save the step has to be reset when I enter in the new step */
        slideFrom = event.target;
        /* Effect to be set-up before entering in the step */
        event.detail.next.querySelectorAll( ".substep" ).forEach( subElem => {
            resetClasses( subElem );
        } );
    }, false );
} )( document );
