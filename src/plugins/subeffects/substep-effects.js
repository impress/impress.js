/**
 * Substep effects Plugin
 *
 * This plugin will do the following things:
 *
 *  - The plugin adds the effects for the substeps.
 *
 *      When an object with class substep uses one of the following attributes, 
 *      the value of these attributes indicate the objects that are subjected to some effectes:
 *
 *      - data-show-only = "CLASS" : The objects with class="CLASS" are shown only
 *          in the corresponding substep.
 *
 *      - data-hide-only = "CLASS" : The objects with class="CLASS" are hidden only
 *          in the corresponding substep.
 *
 *      - data-show-from = "CLASS" : The objects with class="CLASS" are shown from
 *          the corresponding substep until the end or "data-show-to".
 *      - data-show-to = "CLASS" : It is used with "data-show-from", the objects with
 *          class="CLASS" are shown from the substep with "data-show-from" to
 *          the corresponding substep.
 *
 *      - data-hide-from = "CLASS" : The objects with class="CLASS" are hidden from the
 *          corresponding substep until the end or "data-hide-to".
 *      - data-hide-to = "CLASS" : It is used with "data-hide-from", the objects with
 *          class="CLASS" are hidden from the substep with "data-hide-from" to the
 *          corresponding substep.
 *
 *      When an object with class substep uses one of the following attributes,
 *      the value of these attributes indicate the css style to apply to a certain class.
 *      In particular:
 *
 *      - data-style-only-CLASS = "STYLE_LIST" : Apply to objects with class=CLASS the css
 *          style="STYL_LIST" only in the corresponding substep.
 *
 *      - data-style-from-CLASS = "STYLE_LIST" : Apply to objects with class=CLASS the css
 *          style="STYL_LIST" from the corresponding substep until the end or "data-syle-to-CLASS".
 *      - data-style-to-CLASS = "STYLE_LIST" : It is used with "data-syle-from-CLASS",
 *          the objects with class="CLASS" are setted to style="" or if
 *          "data-style-base='LIST_STYLE_BASE'" is configured in the object with class=CLASS
 *          the style is setted to style="LIST_STYLE_BASE".
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
    var slideFrom = null;
    /* Function for resetting the css attributes */
    function resetCss( subElem ) {
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ ) {
            /* Find all objects that are referred by "data-style-only" */
            let lenStr = "data-style-only".length;
            if ( "data-style-only" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Set style to "" or set style to "data-style-base" */
                    obj.setAttribute( "style", "" );
                    if ( obj.getAttribute( "data-style-base" ) ) {
                        obj.setAttribute( "style", obj.getAttribute( "data-style-base" ) );
                    }
                } );
            }
            /* Find all objects that are referred by "data-style-from" */
            lenStr = "data-style-from".length;
            if ( "data-style-from" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Set style to "" or set style to "data-style-base" */
                    obj.setAttribute( "style", "" );
                    if ( obj.getAttribute( "data-style-base" ) ) {
                        obj.setAttribute( "style", obj.getAttribute( "data-style-base" ) );
                    }
                } );
            }
        }
    }

    document.addEventListener( "impress:stepenter", function( event ) {
        /* It is used when I start from a slide (F5 - refesh) */
        event.target.querySelectorAll( ".substep" ).forEach( subElem => {
            /* Hide from the beginning all elements that are referred by "data-show-only"
                and "data-show-from"*/
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-show-only" ) + "," +
                "." + subElem.getAttribute( "data-show-from" )
            ).forEach( obj => {
                obj.style.opacity = 0;
            } );
            /* Show from the beginning all elements that are referred by "data-hide-only"
                and "data-hide-from" */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-hide-only" ) + "," +
                "." + subElem.getAttribute( "data-hide-from" )
            ).forEach( obj => {
                obj.style.opacity = 1;
            } );
            /* Set the base css attribute to the objects */
            resetCss( subElem );
        } );
        /* Reset the of the objects that are modified to the default */
        /* It is useful when I show element of other slide */
        if ( slideFrom !== null ) {
            slideFrom.querySelectorAll( ".substep" ).forEach( subElem => {
                /* Reset opacity */
                document.querySelectorAll(
                    "." + subElem.getAttribute( "data-show-only" ) + "," +
                    "." + subElem.getAttribute( "data-hide-only" ) + "," +
                    "." + subElem.getAttribute( "data-show-from" ) + "," +
                    "." + subElem.getAttribute( "data-hide-from" )
                ).forEach( obj => {
                    obj.style.opacity = "";
                } );
                /* Set the base css attribute to the objects */
                resetCss( subElem );
            } );
        }
    }, false );

    function subEffects( event ) {
        /* Reset all condition at each substep */
        event.target.querySelectorAll( ".substep:not(.substep-active)" ).forEach( subElem => {
            /* Hide all elements are referred by "data-show-only" and "data-show-from"
                in all substeps */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-show-only" ) + "," +
                "." + subElem.getAttribute( "data-show-from" )
            ).forEach( obj => {
                obj.style.opacity = 0;
                obj.style.transition = "opacity 1s";
            } );
            /* Show all elements are referred by "data-hide-only" and "data-hide-from"
                in all substeps */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-hide-only" ) + "," +
                "." + subElem.getAttribute( "data-hide-from" )
            ).forEach( obj => {
                obj.style.opacity = 1;
                obj.style.transition = "opacity 1s";
            } );
            /* Set the base css attribute to the objects */
            if (event.type === "impress:substep:stepleaveaborted") {
                resetCss( subElem );
            }
        } );
        /* Active the condition of the each visible substep */
        event.target.querySelectorAll( ".substep.substep-visible" ).forEach(subElem => {
            /* Show the elements that are referred between "data-show-from" and "data-show-to" */
            /* Hide the elements that are referred between "data-hide-from" and "data-hide-to" */
            /* Show all elements that are referred by "data-show-from" or "data-show-to" in the
                visible substeps */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-show-from" ) + "," +
                "." + subElem.getAttribute( "data-hide-to" )
            ).forEach( obj => {
                obj.style.opacity = 1;
                obj.style.transition = "opacity 1s";
            } );
            /* Hide all elements that are referred by "data-show-to" or "data-hide-from" in the
                visible substeps */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-show-to" ) + "," +
                "." + subElem.getAttribute( "data-hide-from" )
            ).forEach( obj => {
                obj.style.opacity = 0;
                obj.style.transition = "opacity 1s";
            } );
            /* Apply the css attribute to the objects referred by "data-style-from" */
            for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
                /* The css attribute are applied from the substep with "data-style-from" to the
                    substep with "data-style-to" */
                let lenStr = "data-style-from".length;
                if ( "data-style-from" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                    const value = atts[ i ].value;
                    document.querySelectorAll(
                        "." + atts[ i ].nodeName.substring( lenStr + 1 )
                    ).forEach( obj => {
                        obj.setAttribute( "style", value );
                    } );
                }
                lenStr = "data-style-to".length;
                if ( "data-style-to" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                    document.querySelectorAll(
                        "." + atts[ i ].nodeName.substring( lenStr + 1 )
                    ).forEach( obj => {
                        /* Set style to "" or set style to "data-style-base" */
                        obj.setAttribute( "style", "" );
                        if ( obj.getAttribute( "data-style-base" ) ) {
                            obj.setAttribute( "style", obj.getAttribute( "data-style-base" ) );
                        }
                    } );
                }
            }
        } );
        /* Active the condition of the active substep */
        event.target.querySelectorAll( ".substep.substep-active" ).forEach( subElem => {
            /* Show all elements that are referred by "data-show-only", "data-show-from" or
                "data-hide-to" in the active substep */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-show-only" ) + "," +
                "." + subElem.getAttribute( "data-show-from" ) + "," +
                "." + subElem.getAttribute( "data-hide-to" )
            ).forEach( obj => {
                obj.style.opacity = 1;
                obj.style.transition = "opacity 1s";
            } );
            /* Hide all elements that are referred by "data-hide-only", "data-show-to" or
                "data-hide-from" in the active substep */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-hide-only" ) + "," +
                "." + subElem.getAttribute( "data-show-to" ) + "," +
                "." + subElem.getAttribute( "data-hide-from" )
            ).forEach( obj => {
                obj.style.opacity = 0;
                obj.style.transition = "opacity 1s";
            } );
            
            for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ ) {
                /* Apply the css attribute to the objects referred by "data-style-only" */
                let lenStr = "data-style-only".length;
                if ( "data-style-only" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                    const value = atts[ i ].value;
                    document.querySelectorAll(
                        "." + atts[ i ].nodeName.substring( lenStr + 1 )
                    ).forEach( obj => {
                        obj.setAttribute( "style", value );
                    } );
                }
                /* Apply the css attribute to the objects referred  by "data-style-from" */
                lenStr = "data-style-from".length;
                if ( "data-style-from" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                    const value = atts[ i ].value;
                    document.querySelectorAll(
                        "." + atts[ i ].nodeName.substring( lenStr + 1 )
                    ).forEach( obj => {
                        obj.setAttribute( "style", value );
                    } );
                }
                /* Reset the css attribute to the objects referred  by "data-style-to" */
                lenStr = "data-style-to".length;
                if ( "data-style-to" === atts[ i ].nodeName.substring( 0, lenStr ) ) {
                    document.querySelectorAll(
                        "." + atts[ i ].nodeName.substring( lenStr + 1 )
                    ).forEach( obj => {
                        /* Set style to "" or set style to "data-style-base" */
                        obj.setAttribute( "style", "" );
                        if ( obj.getAttribute( "data-style-base" ) ) {
                            obj.setAttribute( "style", obj.getAttribute( "data-style-base" ) );
                        }
                    } );
                }
            }
        } );
    }

    let elementsArray = document.querySelectorAll( ".step" );
    elementsArray.forEach( function( elem ) {
        /* At each substep */
        elem.addEventListener( "impress:substep:enter", subEffects, false );
        elem.addEventListener( "impress:substep:stepleaveaborted", subEffects, false );
    } );

    document.addEventListener( "impress:stepleave", function( event ) {
        /* Save the step has to be reset when I enter in the new step */
        slideFrom = event.target;
        /* Effect to be set-up before entering in the step */
        event.detail.next.querySelectorAll( ".substep" ).forEach( subElem => {
            /* Hide all elements are referred by "data-show-only" and "data-show-from"
                in all substeps */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-show-only" ) + "," +
                "." + subElem.getAttribute( "data-show-from" )
            ).forEach( obj => {
                obj.style.opacity = 0;
                obj.style.transition = "";
            } );

            /* Show all elements are referred by "data-hide-only" or "data-hide-only"
                in all substeps */
            document.querySelectorAll(
                "." + subElem.getAttribute( "data-hide-only" ) + "," +
                "." + subElem.getAttribute( "data-hide-from" )
            ).forEach( obj => {
                obj.style.transition = "";
                obj.style.opacity = 1;
            } );

            // /* Set the base css attribute to the objects */
            // resetCss(subElem);
        } );
    }, false );
} )( document );
