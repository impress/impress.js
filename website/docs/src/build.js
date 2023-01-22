/*
*
*   impress.js website - build.js
*
*   Developed 2023 by Janis Hutz
*
*/

/*
    We will convert certain MD files to html and include them in the documentation. This mostly includes the plugin documentation.
    If there is no MD file in the directory, there will be no documentation. The script will also automatically build the nav menu
    and copy all the necessary files to the correct places.
*/

const fs = require( 'fs' );
const path = require( 'path' );
const md2html = require( 'node-html-markdown' );

const pluginsPath = path.join( __dirname + '/../../../src/plugins' );

let plugins = fs.readdirSync( pluginsPath );
delete plugins[0];

for ( let item in plugins ) {
    fs.readFile( path.join( pluginsPath + '/' + plugins[item] + '/README.md' ), ( error, data ) => {
        if ( error ) {
            parseJS( path.join( pluginsPath + '/' + plugins[item] ) );
        } else {
            console.log( data );
        };
    } );
}


function parseJS ( filepath ) {
    console.log( 'no readme found' );
    let jsFiles = fs.readdirSync( filepath );
}