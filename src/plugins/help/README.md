Help screen plugin
===================

Shows a help popup when a presentation is loaded, as well as when 'H' is pressed.

To enable the help popup, add following div to your presentation:

    <div id="impress-help"></div>

Example CSS:

        .impress-enabled #impress-help {
            background: none repeat scroll 0 0 rgba(0, 0, 0, 0.5);
            color: #EEEEEE;
            font-size: 80%;
            position: fixed;
            left: 2em;
            bottom: 2em;
            width: 24em;
            border-radius: 1em;
            padding: 1em;
            text-align: center;
            z-index: 100;
            font-family: Verdana, Arial, Sans;
        }
        .impress-enabled #impress-help td {
            padding-left: 1em;
            padding-right: 1em;
        }



Author
------

Copyright Henrik Ingo (@henrikingo), 2016
MIT License
