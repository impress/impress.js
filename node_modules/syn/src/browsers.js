var syn = require("./synthetic");
require("./mouse");

syn.key.browsers = {
	webkit: {
		'prevent': {
			"keyup": [],
			"keydown": ["char", "keypress"],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [0, "key"],
			"keypress": ["char", "char"],
			"keyup": [0, "key"]
		},
		'specialChars': {
			"keydown": [0, "char"],
			"keyup": [0, "char"]
		},
		'navigation': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'special': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'tab': {
			"keydown": [0, "char"],
			"keyup": [0, "char"]
		},
		'pause-break': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'caps': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'escape': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'num-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'scroll-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'print': {
			"keyup": [0, "key"]
		},
		'function': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'\r': {
			"keydown": [0, "key"],
			"keypress": ["char", "key"],
			"keyup": [0, "key"]
		}
	},
	gecko: {
		'prevent': {
			"keyup": [],
			"keydown": ["char"],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [0, "key"],
			"keypress": ["char", 0],
			"keyup": [0, "key"]
		},
		'specialChars': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'navigation': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'special': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'\t': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'pause-break': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'caps': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'escape': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'num-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'scroll-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'print': {
			"keyup": [0, "key"]
		},
		'function': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'\r': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		}
	},
	msie: {
		'prevent': {
			"keyup": [],
			"keydown": ["char", "keypress"],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [null, "key"],
			"keypress": [null, "char"],
			"keyup": [null, "key"]
		},
		'specialChars': {
			"keydown": [null, "char"],
			"keyup": [null, "char"]
		},
		'navigation': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'special': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'tab': {
			"keydown": [null, "char"],
			"keyup": [null, "char"]
		},
		'pause-break': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'caps': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'escape': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'num-lock': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'scroll-lock': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'print': {
			"keyup": [null, "key"]
		},
		'function': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'\r': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		}
	},
	opera: {
		'prevent': {
			"keyup": [],
			"keydown": [],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [null, "key"],
			"keypress": [null, "char"],
			"keyup": [null, "key"]
		},
		'specialChars': {
			"keydown": [null, "char"],
			"keypress": [null, "char"],
			"keyup": [null, "char"]
		},
		'navigation': {
			"keydown": [null, "key"],
			"keypress": [null, "key"]
		},
		'special': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'tab': {
			"keydown": [null, "char"],
			"keypress": [null, "char"],
			"keyup": [null, "char"]
		},
		'pause-break': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'caps': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'escape': {
			"keydown": [null, "key"],
			"keypress": [null, "key"]
		},
		'num-lock': {
			"keyup": [null, "key"],
			"keydown": [null, "key"],
			"keypress": [null, "key"]
		},
		'scroll-lock': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'print': {},
		'function': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'\r': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		}
	}
};

syn.mouse.browsers = {
	webkit: {
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			},
			"contextmenu": {
				"button": 2,
				"which": 3
			}
		},
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		}
	},
	opera: {
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			}
		},
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		}
	},
	msie: {
		"right": {
			"mousedown": {
				"button": 2
			},
			"mouseup": {
				"button": 2
			},
			"contextmenu": {
				"button": 0
			}
		},
		"left": {
			"mousedown": {
				"button": 1
			},
			"mouseup": {
				"button": 1
			},
			"click": {
				"button": 0
			}
		}
	},
	chrome: {
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			},
			"contextmenu": {
				"button": 2,
				"which": 3
			}
		},
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		}
	},
	gecko: {
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		},
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			},
			"contextmenu": {
				"button": 2,
				"which": 3
			}
		}
	}
};

//set browser
syn.key.browser =
	(function () {
	if (syn.key.browsers[window.navigator.userAgent]) {
		return syn.key.browsers[window.navigator.userAgent];
	}
	for (var browser in syn.browser) {
		if (syn.browser[browser] && syn.key.browsers[browser]) {
			return syn.key.browsers[browser];
		}
	}
	return syn.key.browsers.gecko;
})();

syn.mouse.browser =
	(function () {
	if (syn.mouse.browsers[window.navigator.userAgent]) {
		return syn.mouse.browsers[window.navigator.userAgent];
	}
	for (var browser in syn.browser) {
		if (syn.browser[browser] && syn.mouse.browsers[browser]) {
			return syn.mouse.browsers[browser];
		}
	}
	return syn.mouse.browsers.gecko;
})();

