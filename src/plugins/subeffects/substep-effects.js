/**
 * Substep effects Plugin
 *
 * The plugin adds the effects for the substeps, this plugin will do the following things:
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

 // L'idea nuova è fare 6 classi
 // data-addonly-CLASS = "TOCLASS" applica la classe CLASS agli oggetti di classe TOCLASS solo per quel substep
 // data-removeonly-CLASS = "TOCLASS" applica la classe CLASS agli oggetti di classe TOCLASS solo per quel substep
 // data-addfrom-CLASS = "TOCLASS" e data-addto-CLASS = "TOCLASS" aggiungi la class CLASS all'oggetto TOCLASS dal substep from a al to

( function( document ) {
    "use strict";
    const stringAddClassOnlyNow = "data-addonly";
    const stringRemoveClassOnlyNow = "data-removeonly";
    const stringAddClassFromNow = "data-addfrom";
    const stringAddClassToNow = "data-addto";
    const stringRemoveClassFromNow = "data-removefrom";
    const stringRemoveClassToNow = "data-removeto";
    var slideFrom = null;
    /* Function for resetting the css attributes ????? */
    function resetClasses( subElem ) {
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ ) {
            let lenStr = stringAddClassOnlyNow.length;
            if ( stringAddClassOnlyNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1 ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Remove classes that will be addad at some point*/
                    obj.classList.remove( toClass );
                    obj.classList.add( toClass + "-base" );
                } );
            }
            lenStr = stringRemoveClassOnlyNow.length;
            if ( stringRemoveClassOnlyNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Add classes that will be addad at some point */
                    obj.classList.add(toClass);
                } );
            }
            lenStr = stringAddClassFromNow.length;
            if ( stringAddClassFromNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Remove classes that will be addad at some point*/
                    obj.classList.remove(toClass);
                } );
            }
            lenStr = stringRemoveClassFromNow.length;
            if ( stringRemoveClassFromNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Add classes that will be addad at some point */
                    obj.classList.add(toClass);
                } );
            }
        }
    }

    function applyOnlyClass( subElem ){
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
            let lenStr = stringAddClassOnlyNow.length;
            if ( stringAddClassOnlyNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Remove classes that will be addad at some point*/
                    obj.classList.add(toClass);
                } );
            }
            lenStr = stringRemoveClassOnlyNow.length;
            if ( stringRemoveClassOnlyNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Add classes that will be addad at some point */
                    obj.classList.remove(toClass);
                } );
            }
        }
    }

    function applyFromClass( subElem ){
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
            let lenStr = stringAddClassFromNow.length;
            if ( stringAddClassFromNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Remove classes that will be addad at some point*/
                    obj.classList.add(toClass);
                } );
            }
            lenStr = stringRemoveClassFromNow.length;
            if ( stringRemoveClassFromNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Add classes that will be addad at some point */
                    obj.classList.remove(toClass);
                } );
            }
        }
    }

    function applyToClass( subElem ){
        for ( var i = 0, atts = subElem.attributes, n = atts.length; i < n; i++ )  {
            let lenStr = stringAddClassToNow.length;
            if ( stringAddClassToNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Remove classes that will be addad at some point*/
                    obj.classList.remove(toClass);
                } );
            }
            lenStr = stringRemoveClassToNow.length;
            if ( stringRemoveClassToNow + "-" === atts[ i ].nodeName.substring( 0, lenStr + 1  ) ) {
                const toClass = atts[ i ].value;
                document.querySelectorAll(
                    "." + atts[ i ].nodeName.substring( lenStr + 1 )
                ).forEach( obj => {
                    /* Add classes that will be addad at some point */
                    obj.classList.add(toClass);
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
                /* Set the base css attribute to the objects */
                resetClasses( subElem );
            } );
        }
    }, false );

    function subEffects( event ) {
        /* Reset all classes at each substep */
        event.target.querySelectorAll( ".substep:not(.substep-active)" ).forEach( subElem => {
            /* Set the base css attribute to the objects */
            if ( event.type === "impress:substep:stepleaveaborted" ) {
                resetClasses( subElem );
            }
        } );
        /* Active the condition of the each visible substep */
        event.target.querySelectorAll( ".substep.substep-visible" ).forEach( subElem => {
            /* Apply the classes to the objects referred by "data-style-from" */
            applyFromClass( subElem );
            applyToClass( subElem );
        } );
        /* Active the condition of the active substep */
        event.target.querySelectorAll( ".substep.substep-active" ).forEach( subElem => {
            applyOnlyClass ( subElem );
            applyFromClass( subElem );
            applyToClass( subElem );
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
            resetClasses( subElem );
        } );
    }, false );
} )( document );
