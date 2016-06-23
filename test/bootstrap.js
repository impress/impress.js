/*jshint browser:true */

var root = document.createElement( "div" );
root.innerHTML = [
  "<div id='impress'>",
  "  <div class='step' data-x='-1000' data-y='0'>First slide</div>",
  "  <div class='step' data-x='-800' data-y='0'>Second slide</div>",
  "  <div class='step' data-x='-600' data-y='0'>Third slide</div>",
  "  <div class='step' data-x='-400' data-y='0'>Fourth slide</div>",
  "</div>"
].join( "" );
document.body.appendChild( root );
