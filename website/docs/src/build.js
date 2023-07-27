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
const ls = require( 'ls' );
const prompt = require( 'prompt-sync' )( {
    sigint: true
} );

const pluginsPath = path.join( __dirname + '/../../../src/plugins' );

let plugins = fs.readdirSync( pluginsPath );
delete plugins[0];

if ( prompt( 'Do you want to regenerate the API reference? (y/N) ' ).toLowerCase() == 'y' ) {
    console.log( 'Regenerating API reference' );
    parseDocumentationMD();
}

if ( prompt( 'Do you want to regenerate the getting started guide? (y/N) ' ).toLowerCase() == 'y' ) {
    console.log( 'Regenerating Getting Started Guide' );
    storeHTML( generateGettingStarted( md2html.render( '' + fs.readFileSync( path.join( __dirname + '/../../../GettingStarted.md' ) ) ) ), 'gettingStarted', '' );
}

let docPages = fs.readdirSync( __dirname + '/../../../website/docs/reference' );

if ( prompt( 'Do you want to regenerate the plugins documentation? (y/N) ' ).toLowerCase() == 'y' ) {
    console.log( 'regenerating plugins documentation' );
    let pluginsHome = md2html.render( fs.readFileSync( path.join( pluginsPath + '/README.md' ) ).toString() );
    
    /* 
        Generate the plugins index.html from README.md
    */
    for ( let letter in pluginsHome ) {
        if ( pluginsHome[ letter ] === '<' ) {
            if ( pluginsHome.slice( parseInt( letter ), parseInt( letter ) + 9 ) === '<a href="' ) {
                let newLink = '';
                let i = 9;
                while ( pluginsHome.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '"' ) {
                    i += 1;
                };
                let link = pluginsHome.slice( parseInt( letter ) + 9, parseInt( letter ) + i  );
                // console.log( link );
                let pos = 0;
                if ( link.slice( 0, 1 ) === '/' && link.slice( 1, 3 ) !== '..' ) {
                    console.log( 'root' );
                    newLink = '<a href="https://github.com/impress/impress.js">';
                } else if ( link.slice( 0, 3 ) === '../' || link.slice( 0, 4 ) === '/../' ) {
                    if ( link.slice( 4, 6 ) === '../' ) {
                        newLink = '<a href="https://github.com/impress/impress.js/tree/master/' + link.slice( 7, parseInt( link.length ) ) + '">';
                    } else if ( link.slice( 5, 7 ) === '../' ) {
                        newLink = '<a href="https://github.com/impress/impress.js/tree/master/' + link.slice( 8, parseInt( link.length ) ) + '">';
                    } else if ( link.slice( 0, 3 ) === '../' ) {
                        newLink = '<a href="https://github.com/impress/impress.js/tree/master/' + link.slice( 4, parseInt( link.length ) ) + '">';
                    } else {
                        newLink = '<a href="https://github.com/impress/impress.js/tree/master/' + link.slice( 5, parseInt( link.length ) ) + '">';
                    }
                } else if ( link.slice( 0, 8 ) === 'https://' || link.slice( 0, 7 ) === 'http://' ) {
                    newLink = '<a href="' + link + '">';
                } else if ( link.slice( 0, 2 ) === './' || link.slice( 0, 1 ) !== '/' || link.slice( 0, 1 ) !== '.' ) {
                    if ( link.slice( parseInt( link.length ) - 9, parseInt( link.length ) ) === 'README.md' ) {
                        newLink = '<a href="/docs/plugins/' + link.slice( 0, parseInt( link.length ) - 10 ) + '">';
                    } else {
                        newLink = '<a href="https://github.com/impress/impress.js/tree/master/src/plugins/' + link + '">';
                    };
                } else {
                    throw 'INVALID LINK FOUND IN PLUGINS README! Please fix and rerun the script';
                }
                pluginsHome = pluginsHome.slice( 0, parseInt( letter ) ) + newLink + pluginsHome.slice( parseInt( letter) + i + 2, parseInt( pluginsHome.length ) );
            };
        };
    };

    storeHTML( pluginsHome, 'index', 'plugins' );

    /* 
        Generate the rest of the plugins documentation from their READMEs and warn if no README was found
    */
    for ( let item in plugins ) {
        fs.readFile( path.join( pluginsPath + '/' + plugins[item] + '/README.md' ), ( error, data ) => {
            if ( error ) {
                console.log( 'NO README found for ' + path.join( pluginsPath + '/' + plugins[item] ) + ' PLEASE MAKE SURE YOU HAVE CREATED A README!' );
            } else {
                ( async () => {
                    let html = md2html.render( '' + data );
                    storeHTML( await findLinks( html, path.join( pluginsPath + '/' + plugins[item] ) ), plugins[item], 'plugins' );
                } ) ();
            };
        } );
    };
    for ( let obj in docPages ) {
        if ( docPages[obj] == 'index.html' ) {
            delete docPages[obj];
        };
    }
}

console.log( 'regenerating Nav' );
generateNav ();

buildExamplesPage();

/*
    This function finds links. The reason for this is possible incompatibilities with links on the website
*/
async function findLinks ( html, path ) {
    let returnHTML = html;
    for ( let letter in returnHTML ) {
        if ( returnHTML[letter] === '<' ) {
            if ( returnHTML.slice( parseInt( letter ), parseInt( letter ) + 9 ) === '<a href="' ) {
                let i = 9;
                while ( returnHTML.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '"' ) {
                    i += 1;
                };
                returnHTML = returnHTML.slice( 0, parseInt( letter ) ) + await checkLinks( returnHTML.slice( parseInt( letter ) + 9, parseInt( letter ) + i  ), path ) + returnHTML.slice( parseInt( letter ) + i + 2, parseInt( returnHTML.length ) );
            };
        };
    };
    return returnHTML;
};

/*
    This function takes care of checking links. This is necessary, as documentation may contain links that will
    not work on the website, as it has relative paths.
*/
async function checkLinks ( link, fpath ) {
    let filepath = fpath;
    let pos = 0;
    if ( link.slice( parseInt( link.length ) - 9, parseInt( link.length ) ) === 'README.md' ) {
        while ( link.slice( parseInt( link.length ) - pos - 11, parseInt( link.length ) - pos - 10 ) !== '/' ) {
            pos += 1;
        };
        return '<a href="/docs/plugins/' + link.slice( parseInt( link.length ) - pos - 10, parseInt( link.length ) - 10 ) + '">';
    } else if ( link.slice( 0, 2 ) === '..' ) {
        // here we map the relative path to an absolute path that can be used with the GitHub repo.
        while ( link.slice( pos, pos + 3 ) === '../' ) {
            pos += 3;
            let pathPos = 1;
            while ( filepath.slice( parseInt( filepath.length ) - pathPos, parseInt( filepath.length ) - pathPos + 1 ) !== '/' ) {
                pathPos += 1;
            };
            filepath = filepath.slice( 0, parseInt( filepath.length ) - pathPos + 1 );
        };

        // Here we find the impress.js root in the filepath to remove it and finish the link generation
        let fsPos = 0;
        while ( filepath.slice( parseInt( filepath.length ) - fsPos - 10, parseInt( filepath.length ) - fsPos ) !== 'impress.js' ) {
            fsPos += 1;
        };
        let fpSlice = filepath.slice( parseInt( filepath.length ) - fsPos + 1, parseInt( filepath.length ) );
        let linkSlice = link.slice( pos, link.length );

        // now let's assemble a link and add it back into the html
        if ( link.slice( link.length - 3, link.length ).includes( '.' ) ) {
            return '<a href="https://github.com/impress/impress.js/blob/master/' + fpSlice + linkSlice + '">';
        } else {
            return '<a href="https://github.com/impress/impress.js/tree/master/' + fpSlice + linkSlice + '">';
        };
    } else if ( link.slice( 0, 1 ) !== '.' && link.slice( 0, 1 ) !== '/' ) {
        let fsPos = 0;
        while ( filepath.slice( parseInt( filepath.length ) - fsPos - 10, parseInt( filepath.length ) - fsPos ) !== 'impress.js' ) {
            fsPos += 1;
        };
        let fpSlice = filepath.slice( parseInt( filepath.length ) - fsPos + 1, parseInt( filepath.length ) ) + '/';
        if ( link.slice( link.length - 3, link.length ).includes( '.' ) ) {
            return '<a href="https://github.com/impress/impress.js/blob/master/' + fpSlice + link + '">';
        } else {
            return '<a href="https://github.com/impress/impress.js/tree/master/' + fpSlice + link + '">';
        };
    } else if ( link.slice( 0, 7 ) === 'http://' || link.slice( 0, 8 ) === 'https://' ) {
        return '<a href="' + link + '">';
    } else if ( link.slice( 0, 1 ) === '/' && link.slice( 1, 2 ) !== '.' ) {
        if ( link.slice( link.length - 3, link.length ).includes( '.' ) ) {
            if ( link === '/GettingStarted.md' ) {
                return '<a href="/docs/gettingStarted.html">';
            } else if ( link === '/DOCUMENTATION.md' ) {
                return '<a href="/docs/reference">';
            } else {
                return '<a href="https://github.com/impress/impress.js/blob/master' + link + '">';
            }
        } else {
            return '<a href="https://github.com/impress/impress.js/tree/master' + link + '">';
        };
    } else {
        throw Error( 'Invalid link found! Link is: "' + link + '" in file: ' + filepath + '/README.md' );
    };
};

/* 
    This function generates & stores the HTML in the correct directory
*/

function storeHTML ( html, path, type ) {
    let fileOut = `<!DOCTYPE html>
    <html>
        <head>
        <title>${path} :: ${type} | DOCS - impress.js</title>
        <!--I am using jquery for button animations.-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/dark.min.css">
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
        <script>hljs.highlightAll();</script>
        <script src="/js/docs/loader.js"></script>
        <link rel="stylesheet" href="/css/docs/style.css">
        </head>
        <body>
            <div class="content">
                <div id="nav"></div>
                <div id="top"></div>
                    <div id="docPage">
                        <div id="doc-container">
                        ` + html 
                        + `</div>
                    </div>
                <div id="footer"></div>
            </div>
        </body>
    </html>`;
    fs.writeFileSync( docRoot + '/' + type + '/' + path + '.html', fileOut );
};

/*
    This function, as the name implies, generates the navbar on the side in the docs.
*/
function generateNav () {
    let fileStruct = `<!DOCTYPE html>
    <html>
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <link rel="stylesheet" href="/css/docs/navstyle.css">
        </head>
        <body>
            <div class="nav-container">
                <a class="logo-container" href="/"><img class="logo" src="/assets/apple-touch-icon.png" alt="impress-logo"></a>
                <div class="nav-wrapper">
                    <div class="nav-list">
                    <a class="navitem" id="home" href="/docs">Home</a>
                    <a class="navitem" id="gettingStarted" href="/docs/gettingStarted.html">Getting Started</a>
                    <a class="navitem" id="referenceNav" onclick="toggleList( 'reference' );">API reference</a>
                    <div class="dropdown" id="reference">
                        <a class="nav-subitem" id="reference-home" href="/docs/reference">Home</a>`
    for ( let item in docPages ) {
        if ( docPages[ item ] === 'index' ) {} else {
            fileStruct += `<a class="nav-subitem" id="${ docPages[ item ].slice( 0, docPages[ item ].length - 5 ) }" href="/docs/reference/${ docPages[ item ] }">${ docPages[ item ].slice( 0, docPages[ item ].length - 5 ) }</a>`;
        };
    };
    fileStruct += `</div>
                    <a class="navitem" id="pluginsNav" onclick="toggleList( 'plugins' );">Plugins</a>
                    <div class="dropdown" id="plugins">
                        <a class="nav-subitem" id="plugins-home" href="/docs/plugins">Home</a>
                    `;
    for ( let item in plugins ) {
        fileStruct += `<a class="nav-subitem" id="${ plugins[ item ] }" href="/docs/plugins/${ plugins[ item ] }.html">${ plugins[ item ] }</a>`;
    };
    fileStruct += `</div>
                    <a class="navitem" id="contributingNav" onclick="toggleList( 'contributing' );">Contributing</a>
                    <div class="dropdown" id="contributing">
                        <a class="nav-subitem" id="contributing-gettingStarted" href="/docs/contributing">Getting Started</a>
                        <a class="nav-subitem" id="website" href="/docs/contributing/website.html">Website</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script src="/js/docs/nav.js"></script>
</html>`;
    fs.writeFileSync( docRoot + '/nav.html', fileStruct );
};


function parseDocumentationMD () {
    let doc = '' + fs.readFileSync( path.join( __dirname + '/../../../DOCUMENTATION.md' ) );
    let lastHashtagPos = 0;
    let posArray = [];
    for ( let letter in doc ) {
        if ( doc[letter] == '#' ) {
            if ( doc.slice( parseInt( letter ), parseInt( letter ) + 3 ) === '###' || doc.slice( parseInt( letter ), parseInt( letter ) + 4 ) === '####'  ) {
            } else if ( doc.slice( parseInt( letter ), parseInt( letter ) + 2 ) === '##' && lastHashtagPos + 1 < parseInt( letter ) ) {
                posArray.push(letter);
            };
            lastHashtagPos = parseInt( letter );
        };
    };

    let titles = {};

    for ( let item in posArray ) {
        let titleArea = doc.slice( parseInt( posArray[item] ), parseInt( posArray[item] + 20 ) );
        let title = '';
        for ( let pos in titleArea ) {
            if ( titleArea[pos] === '\n' ) {
                title = titleArea.slice( 3, pos );
                break;
            };
        };

        let page = md2html.render( doc.slice( parseInt( posArray[parseInt( item )] ), parseInt( posArray[parseInt( item ) + 1] ) || parseInt( doc.length ) ) );

        for ( let letter in page ) {
            let titleTag = page.slice( parseInt( letter ), parseInt( letter ) + 4 );
            if ( titleTag === '<h1>' || titleTag === '<h2>' || titleTag === '<h3>' || titleTag === '<h4>' ) {
                let i = 4;
                while ( page.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '<' ) {
                    i += 1;
                };
                let heading = '' + page.slice( parseInt( letter ) + 4, parseInt( letter ) + i  );
                let output = '';
                for ( let pos in heading ) {
                    let letter = heading[ pos ];
                    if ( letter === ' ' || letter === '.' || letter === ',' ) {
                        output += '-';
                    } else if ( letter === '(' || letter === ')' || letter === '[' || letter === ']' || letter === '|' ) {

                    } else {
                        output += letter;
                    };
                };
                titles[ output.toLowerCase() ] = title;
            };
        };
    } 

    for ( let item in posArray ) {
        let titleArea = doc.slice( parseInt( posArray[item] ), parseInt( posArray[item] + 20 ) );
        let title = '';
        for ( let pos in titleArea ) {
            if ( titleArea[pos] === '\n' ) {
                title = titleArea.slice( 3, pos );
                break;
            };
        };

        let page = md2html.render( doc.slice( parseInt( posArray[parseInt( item )] ), parseInt( posArray[parseInt( item ) + 1] ) || parseInt( doc.length ) ) );

        for ( let letter in page ) {
            let titleTag = page.slice( parseInt( letter ), parseInt( letter ) + 4 );
            if ( page[letter] === '<' ) {
                if ( page.slice( parseInt( letter ), parseInt( letter ) + 9 ) === '<a href="' ) {
                    let i = 9;
                    while ( page.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '"' ) {
                        i += 1;
                    };
                    let link = '' + page.slice( parseInt( letter ) + 9, parseInt( letter ) + i  );
                    let updatedLink = '';
                    if ( link.slice( 0, 8 ) === 'https://' || link.slice( 0, 7 ) === 'http://' || link.slice( 0, 1 ) === '#' ) {
                        if ( link.slice( 0, 1 ) === '#' ) {
                            if ( titles[ link.slice( 1, parseInt( link.length ) ) ] !== undefined ) {
                                updatedLink = '/docs/reference/' + titles[ link.slice( 1, parseInt( link.length ) ) ] + '.html' + link;
                            } else {
                                console.log( 'unable to map link ' + link );
                            }
                        } else {
                            updatedLink = link;
                        }
                    } else {
                        if ( link.slice( 0, 12 ) === 'src/plugins/' ) {
                            if ( link.slice( link.length - 9, link.length ) === 'README.md' ) {
                                updatedLink = '/docs/' + link.slice( 4, link.length - 9 );
                            } else {
                                updatedLink = 'https://github.com/impress/impress.js/' + link;
                            };
                        } else if ( link.slice( 0, 9 ) === 'examples/' ) {
                            updatedLink = '/demo/' + link;
                        } else {
                            updatedLink = 'https://github.com/impress/impress.js/' + link;
                        };
                    }
                    page = page.slice( 0, parseInt( letter ) + 9 ) + updatedLink + page.slice( parseInt( letter ) + i, parseInt( page.length ) );
                } else if ( titleTag === '<h1>' || titleTag === '<h2>' || titleTag === '<h3>' || titleTag === '<h4>' ) {
                    let i = 4;
                    while ( page.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '<' ) {
                        i += 1;
                    };
                    let heading = '' + page.slice( parseInt( letter ) + 4, parseInt( letter ) + i  );
                    let output = '';
                    for ( let pos in heading ) {
                        let letter = heading[ pos ];
                        if ( letter === ' ' || letter === '.' || letter === ',' ) {
                            output += '-';
                        } else if ( letter === '(' || letter === ')' || letter === '[' || letter === ']' || letter === '|' ) {

                        } else {
                            output += letter;
                        };
                    };
                    page = page.slice( 0, parseInt( letter ) + 3 ) + ' id="' + output.toLowerCase() + '">' + page.slice( parseInt( letter ) + 4, parseInt( page.length ) );
                };
            };
            storeHTML( page, title, 'reference' );
        };
    };
}

function generateGettingStarted ( inputHTML ) {
    let html = inputHTML;
    for ( let letter in html ) {
        if ( html[letter] === '<' ) {
            if ( html.slice( parseInt( letter ), parseInt( letter ) + 9 ) === '<a href="' ) {
                let i = 9;
                while ( html.slice( parseInt( letter ) + i, parseInt( letter ) + i + 1 ) !== '"' ) {
                    i += 1;
                };
                let link = html.slice( parseInt( letter ) + 9, parseInt( letter ) + i  )
                let checkedLink = '';
                if ( link === 'DOCUMENTATION.md' ) {
                    checkedLink = '/docs/reference';
                } else if ( link.slice( 0, 13 ) === './src/plugins' ) {
                    if ( link.slice( link.length - 9, link.length ) === 'README.md' ) {
                        checkedLink = '/docs/plugins' + link.slice( 13, link.length - 10 ) + '.html';
                    } else {
                        checkedLink = '/docs/plugins' + link.slice( 13, link.length ) + '.html';
                    };
                } else if ( link.slice( 0, 12 ) === '/src/plugins' ) {
                    if ( link.slice( link.length - 9, link.length ) === 'README.md' ) {
                        checkedLink = '/docs/plugins' + link.slice( 12, link.length - 10 ) + '.html';
                    } else {
                        checkedLink = '/docs/plugins' + link.slice( 12, link.length ) + '.html';
                    };
                } else if ( link.slice( 0, 7 ) === 'http://' || link.slice( 0, 8 ) === 'https://' ) {
                    checkedLink = link;
                }
                html = html.slice( 0, parseInt( letter ) + 9 ) + checkedLink + html.slice( parseInt( letter ) + i, parseInt( html.length ) );
            };
        };
    };
    return html;
}

function buildExamplesPage () {
    /* Auto generate an index.html that lists all the directories under examples/
    * This is useful for gh-pages, so you can link to http://impress.github.io/impress.js/examples
    */
    console.log( 'building examples page' );
    let html_list = '<ul class="list"><br>\n';
    let dirList = fs.readdirSync( path.join( __dirname + '/../../demo/examples' ) );
    dirList.forEach( function( dir ) {
        if ( dir === 'index.html' ) {} else {
            html_list += '                  <li class="button"><a class="list-element" href="' + dir + '/">' + dir + '</a></li>\n';
        };
    });
    let html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/style.css">
        <title>Example presentations</title>
        <script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script defer src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script defer src="/js/index.js"></script>
        <style>
            .list {
                margin-top: 10%;
                font-size: 1.5rem;
                list-style: none;
            }
            .list-element {
                text-decoration: none;
                color: white;
            }
        </style>
    </head>
    <body>
        <div id="navbar"></div>
        <div class="title">
            <div class="title-content">
                <h1 class="heading">Exam&shy;ples</h1>
            </div>
                ${ html_list }
                </ul>
            </div>
        <div id="footer"></div>
    </body>
</html>`;

    fs.writeFileSync( path.join( __dirname + '/../../demo/examples/index.html' ), html );
}