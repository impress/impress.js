(function markdown(){
  
  if (!window.marked){
    var scr = document.createElement('script');
    scr.src = 'https://raw.github.com/chjj/marked/master/lib/marked.js';
    scr.onload = markdown;
    document.body.appendChild(scr);
    return;
  }

  [].forEach.call( document.querySelectorAll('.slide'), function  fn(elem){
      
    // strip leading whitespace so it isn't evaluated as code
    var text      = elem.innerHTML.replace(/\n\s*\n/g,'\n'),
        // set indentation level so your markdown can be indented within your HTML
        leadingws = text.match(/^\n?(\s*)/)[1].length,
        regex     = new RegExp('\\n?\\s{' + leadingws + '}','g'),
        md        = text.replace(regex,'\n'),
        html      = marked(md);

    // here, have sum HTML
    elem.innerHTML = html;

  });

}());