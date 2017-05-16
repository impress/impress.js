# An [impress.js](https://github.com/bartaz/impress.js) Editor Tool

## Data structure

* `data-x`, `data-y`, `data-z` -- they define the position of **the center** of step element on the canvas in pixels; their default value is 0;
* `data-rotate-x`, `data-rotate-y`, `data-rotate-z`, `data-rotate` -- they define the rotation of the element around given axis in degrees; their default value is 0; `data-rotate` and `data-rotate-z` are exactly the same;
* `data-scale` -- defines the scale of step element; default value is 1

		presentation = [{
			attribute: {
				id: STRING, [""], // "bored" for first slide
				class: STRING, ["step"], // step, slide

				data-x: INT, [0],
				data-y: INT, [0],
				data-z: INT, [0],

				data-rotate-x: INT, [0],
				data-rotate-y: INT, [0],
				data-rotate-z: INT, [0],
				data-rotate: INT, [0],

				data-scale: INT, [1]
			},
			content: STRING, [""]
		}, {
			...
		}]


## Generate Configuration

### File

* configuration.html


## Make a Presentation

### File

* presentation.html


## Demo

1. Convert the current demo to a configuration file using `slides/html2json.html` (cause it uses XSS, so only works on IE), save it to a JSON file (see `slides/demo.json`)
2. Open `presentation.html` (you may need a web server to provide this), drag and drop the configuration to the area to start


## Credits

1. [bartaz/impress.js](https://github.com/bartaz/impress.js)
2. [coreyti/showdown](https://github.com/coreyti/showdown)
3. [phoboslab/json-format](https://github.com/phoboslab/json-format)
