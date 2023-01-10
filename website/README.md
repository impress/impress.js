# impress.js.org website
This folder contains all the code for the [impress.js.org](https://impress.js.org) website. You can find the source code for the demo presentation and the other examples in the folder *demo*.

## Structure
The also contains a folder for the docs (Documentation) for the project.

## Roadmap
What needs to be done:
- Finish styling of main page
- Add code samples to main page
- Find good font
- Create good background image for main page
- use jQuery and maybe some other tools to do crazy CSS scroll animations

## Docs
If you want to contribute more documentation, then you may create a new MarkDown file in the docs/md folder, where all markdown files for the documentation reside. After you have written your documentation, you should run ```node build-docs.js``` to create the navigation menu entries. The title specified in the md file will be set as the navigation name. You may then change the navigation items in /docs/modules/nav.html