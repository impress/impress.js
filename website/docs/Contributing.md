# DOCS
## Introduction
The impress.js docs include all the documentation that is relevant to the user. If you have just created a MD file for documentation and don't want to also write an HTML file, you may use the script, as described below. You may obviously write the HTML yourself by using the Template, which gives you more control. You may always after the HTML has been generated change things about it.

## Using the script
You may convert the MD file to HTML by running 
```
npm install
npm run build-webpage [Filename here]
```
After that you should add the link to your page in the documentation to the navigation bar by adding a new entry in nav.html.

*Note*: The html page is generated in the same directory the md file resides in. 

## Creating from scratch using the template
Copy the file ```template.html``` to the location of the documentation page and rename it to something descriptive. Inside, you may find some basic HTML skeleton laid out, which you should NOT modify, as this creates all the necessary elements to make all doc pages look the same. You should avoid to add CSS whenever possible, use the already provided classes so the page turns out the way it should. 

**The following CSS classes are provided:**
(You may look at the CSS source if you want to)

Element     | Function
------------|------------
.text       | normal text, required for scaling on mobile devices
.heading1   | equal to the # in MD
.heading2   | equal to the ## in MD
.heading3   | equal to the ### in MD
.code       | display code block. Follow instructions below for code blocks
 
