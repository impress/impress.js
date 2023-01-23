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
const mdhtml = require( 'markdown-it' );
const md2html = new mdhtml();
const docRoot = path.join( __dirname + '/../' );

const pluginsPath = path.join( __dirname + '/../../../src/plugins' );

let plugins = fs.readdirSync( pluginsPath );
delete plugins[0];

for ( let item in plugins ) {
    fs.readFile( path.join( pluginsPath + '/' + plugins[item] + '/README.md' ), ( error, data ) => {
        if ( error ) {
            parseJS( path.join( pluginsPath + '/' + plugins[item] ) );
        } else {
            console.log( md2html.render( '' + data ) );
        };
    } );
}


function parseJS ( filepath ) {
    console.log( 'no readme found' );
    let jsFiles = fs.readdirSync( filepath );
}

function checkLinks ( html ) {
    
}

function storeHTML ( html, path ) {
    let fileOut = `<!DOCTYPE html>
    <html>
        <head>
        <title>Docs - impress.js</title>
        <!--I am using jquery for button animations.-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="/js/docs/loader.js"></script>
        <link rel="stylesheet" href="/css/docs/style.css">
    </head>
    <body>
        <div class="content">
            <div id="nav"></div>
            <div id="top"></div>
            <div id="docPage">
                <div id="doc-container">` + html 
                + `</div>
                </div>
                <div id="footer"></div>
            </div>
        </body>
    </html>`;
    fs.writeFileSync( docRoot + '/plugins/' + path + '.html', fileOut );
}