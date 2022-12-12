Progress plugin
===============

Progressbar and pagexounter for impress.js presentations

Usage
-----

Add a div for progressbar and/or progress as you can see it here:

### HTML

	  <div class="impress-progressbar"><div></div></div>
	  <div class="impress-progress"></div>

### Sample CSS

    .impress-progressbar {
      position: absolute;
      right: 318px;
      bottom: 1px;
      left: 118px;
      border-radius: 7px;
      border: 2px solid rgba(100, 100, 100, 0.2);
    }
    .impress-progressbar DIV {
      width: 0;
      height: 2px;
      border-radius: 5px;
      background: rgba(75, 75, 75, 0.4);
      transition: width 1s linear;
    }
    .impress-progress {
      position: absolute;
      left: 59px;
      bottom: 1px;
      text-align: left;
      opacity: 0.6;
    }

Feel free to change the style of your progressbar as you like by editing the CSS file.

Author
------

Copyright 2014: Matthias Bilger (@m42e)
