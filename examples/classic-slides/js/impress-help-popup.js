// Set up the help-box
var helpdiv = window.document.getElementById('impress-help');

if (window.top!=window.self) {
    // This is inside an iframe, so don't show the help.
    helpdiv.style.display = "none";    
} else {
    // Install a funtion to toggle help on and off.
    var toggleHelp = function() {
        if(helpdiv.className == 'hide')
            helpdiv.className = 'show';
        else
            helpdiv.className = 'hide';    
    };
    document.addEventListener("keyup", function ( event ) {
            if ( event.keyCode == 72 ) {
                event.preventDefault();
                toggleHelp();
            }
        }, false);
    
    // The help is by default shown. Hide it after five seconds.
    setTimeout(function () {
        var helpdiv = window.document.getElementById('impress-help');
        if(helpdiv.className != 'show')
            helpdiv.className = 'hide';
    }, 5000);
}


if ( window.impressConsole ) {
    impressConsole().init(cssFile='css/impressConsole.css');
    
    var impressattrs = document.getElementById('impress').attributes;
    if (impressattrs.hasOwnProperty('auto-console') && impressattrs['auto-console'].value.toLowerCase() === 'true') {
        consoleWindow = impressConsole().open();
    }
    
}
else {
    // If impressConsole.js is not initialized, don't show it in the help popup either
    var pRow = window.document.getElementById('impress-help-p');
    pRow.style.display = "none";    
}