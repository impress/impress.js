# Introduction
Welcome to impress.js! This presentation framework allows you to create stunning presentations with the power of CSS3 transformations.
**NOTE:** This Guide is not made for you, if you have never written HTML and/or CSS before. Knowing your way around in JavaScript certainly helps, but is not a necessity. You may still continue this tutorial and try to understand what we do as you go. 

For more advanced and complete documentation, you might prefer the [DOCUMENTATION](DOCUMENTATION.md).

# Getting started with impress.js
## Installation / acquiring the framework
First of all, you need to know, if you are going to have WiFi connection when you hold your presentation. If you are not sure, please use the method where you download the file instead of the cdn.

### Including from cdn
Loading the script from the cdn is quite straight forward. If you copy the below example code, you need to do nothing else, impress will be loaded automatically.

**Direct links to different versions of the impress.js file**
- V2.0.0: https://cdn.jsdelivr.net/gh/impress/impress.js@2.0.0/js/impress.js
- V1.1.0: https://cdn.jsdelivr.net/gh/impress/impress.js@1.1.0/js/impress.js
- Source: https://cdn.jsdelivr.net/gh/impress/impress.js/js/impress.js

### Download the file to your PC
Head to the releases tab and download the source code as zip or as a tarball. Go ahead and unzip / untar it. You need to copy the folder */js/* into the folder you are working in. Optionally, if you want to make your life a bit easier, you can copy also copy the folder */css/* in there.


## Setting up the project
Open up your favorite text-editor / IDE, for example Visual Studio Code, Atom, Notepad ++, ...
Now, create a new file called *index.html* and create the basic HTML structure:

```
<!DOCTYPE html>
<html>
    <head>
        <title>My first presentation</title>
        <link rel="stylesheet" href="./css/impress-common.css"><!--Leave out, if you don't use impress-common.css-->
    </head>
    <body class="impress-not-supported">
        <div class="fallback-message">
            <p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>
            <p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>
        </div>

        <div id="impress">
            <div id="myFirstSlide" class="step">
                <h1>My first Slide</h1>
            </div>
        </div>

        <script src="js/impress.js"></script>
        <script>window.impress || document.write('<script src="https://cdn.jsdelivr.net/gh/impress/impress.js@2.0.0/js/impress.js">\x3C/script>');</script>
        <script>impress().init()</script>
    </body>
</html>
```

Now, head into a file-manager, navigate to the file you just created (*index.html*) and open it. You should end up in a browser where you should see "My first Slide" displayed. As this is not really exciting, we are not gonna change anything about that and are gonna look at what you just typed. What do these lines mean?

Well, first things first, you should probably give your presentation a title. You may do this in normal HTML fashion by changing the *title* HTML tag.

So now, we reached the HTML body. You can see that it already belongs to a class. This class just tells impress.js that this is the body where the "fallback-message" should be displayed when it detects, that your browser does not support CSS3 and therefore impress.js won't work. You can easily omit that class though, including the "fallback-message" div with its content, if you only intend to use the presentation for yourself and you know about the fact that some browsers might not work.

Now, probably the most important part of all is the *div* that belongs to the ```impress``` class. This *div* should contain all the HTML code you write, as everything outside that class will not be animated by impress.js. 

Finally, we load the ```impress.js``` script from your local copy (if you have one) or from the cdn, if you do not have a local copy and execute 
```
impress().init()
```
to initialize impress.js. Now, let's continue on to explore more and more features of this amazing tool!

## Creating slides
Creating slides is fairly easy. You create a *div* that belongs to the class ```step``` and you are off to the races! Let me give you an example:
```
<div class="step">
Hello World
</div>
```

Now, if you reload the presentation, you start to see a \*slight\* problem. All your text is stacked... How do we work around that?

Obviously, impress.js has an answer to it. You can add the following additional attributes to your div, to make it work:

Attribute       | Explanation
----------------|------------
data-x          | Position the element along the x-axis (from left to right)
data-y          | Position the element along the y-axis (from top to bottom)
data-z          | Position the element along the z-axis (3D-Effect, move the element behind another one)
data-rotate     | Rotate the element (if not using data-z!)
data-rotate-x   | Rotate the element along the x-axis
data-rotate-y   | Rotate the element along the y-axis
data-rotate-z   | Rotate the element along the z-axis
data-scale      | Scale the element. 

These are the basic positioning options in impress.js. All of the attributes take Strings as arguments, so be aware of the fact, that you need to put quotation marks around the numbers! The *data-rotate* attributes take an angle in form of a String as argument.

Now, that you have created the slides, you might want to style them. This is where CSS comes into play. Add another file to your project called, e.g., ```style.css```. 

**NOTE:** Whatever you do, do not mess with positioning and rotation of the div that belongs to the class *step*, but add a div inside of it, if you really have to mess with these properties. See the example below. Always position *steps* with the *data-* attribute!

```
<div class="step yourClassNameHere" data-x="1000" data-y="1000" data-z="-1000" data-scale="2" data-rotate-z="90">
    <div class="yourSubClassNameHere">
        <h1>Powerful, yet still simple</h1>
    </div>
</div>
```
**NOTE:** You may also use negative numbers for all these properties!

## More advanced features
You might want to change some default settings, like the transition speed, the width & height of the target screen, etc. This table is from the [DOCUMENTATION](DOCUMENTATION.md) and was slightly adapted.

Attribute                | Default   | Explanation
-------------------------|-----------|------------
data-transition-duration | 1000 (ms) | Speed of transition between steps.
data-width               | 1920 (px) | Width of target screen size. When presentation is viewed on a larger or smaller screen, impress.js will scale all content automatically.
data-height              | 1080 (px) | Height of target screen size.
data-max-scale           | 3         | Maximum scale factor. (Note that the default 1 will not increase content size on larger screens!)
data-min-scale           | 0         | Minimum scale factor.
data-perspective         | 1000      | Perspective for 3D rendering. See https://developer.mozilla.org/en/CSS/perspective

### **Renaming Steps**
You can give each step an ID. The name of the ID will be displayed in the browsers navigation bar instead of the default *step-x* whereas x is replaced by the current step number. This can be especially helpful, when trying to jump between steps and go back to a previous one. If you want to know how to move to a specific slide, you should take a look at the [README](./src/plugins/goto/README.md) of the "Goto" plugin. 

# Using PLUGINS
Impress.js is limited to everything that we have discussed so far and some other details, we won't go over here. Check the [DOCUMENTATION](DOCUMENTATION.md) for that.

impress.js has accumulated a lot of very useful plugins. You may find all of them [here](./src/plugins/)!

Each Plugin has a README.md file which you may read to get an idea on how to use them. Some of the plugins run unnoticed in the background, like the *resize* plugin, which automatically resizes the presentation whenever the browser window changed in size. Here, I will give you an overview of some of the plugins that impress.js includes by default. 

**NOTE:** As previously mentioned, if you'd like to get more info about how it works, take a look at the [DOCUMENTATION](DOCUMENTATION.md) or the README.md files of the plugins.

## [impressConsole](/src/plugins/impressConsole/README.md)
This plugin opens up and additional browser tab which contains a speaker console. There you can see the current slide, the past slide and your notes. You add notes to your presentation by adding a *div* that belongs to the class "notes" to your *div* that belongs to the class "step". 

### **adding notes to your presentation**
You may add notes to your presentation by adding a div of class *notes* into the div of class *step*, like so:

```
    <div class="step">
        Some text that is being displayed on your slides
        <div class="notes">
            this won't be displayed in your presentation
        </div>
    </div>
```
Now that you have added the notes to your HTML, it is time to hide them. You need to add the following code to your CSS file (or in the style tag in the header):

```
    .notes {
        display: none;
    }
```

To enter it, press P.

## [Goto](/src/plugins/goto/README.md)
This plugin allows you to directly go to a certain step, by either passing in a number or the id of the step you'd like to go to.

## [Progress](/src/plugins/progress/README.md)
This plugin, as its name implies, displays the progress in your presentation.

## [Blackout](/src/plugins/blackout/blackout.js)
This plugin hides the screen, if you press B, which is handy in a lot of situations.

## Other plugins
You may find the other plugins [here](/src/plugins/). It certainly helps if you familiarise yourself with the plugins.


# Thank you for reading this
If you want to know more, you can always ready the [DOCUMENTATION](DOCUMENTATION.md) or, even better, read the Source Code and try to understand how it works!