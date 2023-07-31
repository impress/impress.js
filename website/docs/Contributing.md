# DOCS
## Introduction
The impress.js docs include all the documentation that is relevant to the user. The docs get converted from MD into HTML automatically when running ```npm run build-website```. 

## Using the script
Whenever you update Documentation in this repository, please run the following commands to update the website:
```
npm install
npm run build-website
```
 
## Adding new pages
If you want to add new pages (either generated ones or normal HTML files), you need to adjust some things inside of the build.js file which you can find in [here](src/build.js). Add a new entry that should be added to the nav menu. You should always use the *template.html* file if you create a new page.

## Adding documentation for a new plugin
If you add a new Plugin to impress.js, you do only need to run the build-website script as described above.
