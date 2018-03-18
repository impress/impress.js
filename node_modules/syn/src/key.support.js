var syn = require('./synthetic');
require('./key');


if (!syn.config.support) {
	//do support code
	(function checkForSupport() {
		if (!document.body) {
			return syn.schedule(checkForSupport, 1);
		}

		var div = document.createElement("div"),
			checkbox, submit, form, anchor, textarea, inputter, one, doc;

		doc = document.documentElement;

		div.innerHTML = "<form id='outer'>" +
			"<input name='checkbox' type='checkbox'/>" +
			"<input name='radio' type='radio' />" +
			"<input type='submit' name='submitter'/>" +
			"<input type='input' name='inputter'/>" +
			"<input name='one'>" +
			"<input name='two'/>" +
			"<a href='#abc'></a>" +
			"<textarea>1\n2</textarea>" +
			"</form>";

		doc.insertBefore(div, doc.firstElementChild || doc.children[0]);
		form = div.firstChild;
		checkbox = form.childNodes[0];
		submit = form.childNodes[2];
		anchor = form.getElementsByTagName("a")[0];
		textarea = form.getElementsByTagName("textarea")[0];
		inputter = form.childNodes[3];
		one = form.childNodes[4];

		form.onsubmit = function (ev) {
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			syn.support.keypressSubmits = true;
			ev.returnValue = false;
			return false;
		};
		// Firefox 4 won't write key events if the element isn't focused
		syn.__tryFocus(inputter);
		syn.trigger(inputter, "keypress", "\r");

		syn.trigger(inputter, "keypress", "a");
		syn.support.keyCharacters = inputter.value === "a";

		inputter.value = "a";
		syn.trigger(inputter, "keypress", "\b");
		syn.support.backspaceWorks = inputter.value === "";

		inputter.onchange = function () {
			syn.support.focusChanges = true;
		};
		syn.__tryFocus(inputter);
		syn.trigger(inputter, "keypress", "a");
		syn.__tryFocus(form.childNodes[5]); // this will throw a change event
		syn.trigger(inputter, "keypress", "b");
		syn.support.keysOnNotFocused = inputter.value === "ab";

		//test keypress \r on anchor submits
		syn.bind(anchor, "click", function (ev) {
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			syn.support.keypressOnAnchorClicks = true;
			ev.returnValue = false;
			return false;
		});
		syn.trigger(anchor, "keypress", "\r");

		syn.support.textareaCarriage = textarea.value.length === 4;

		// IE only, oninput event.
		syn.support.oninput = 'oninput' in one;

		doc.removeChild(div);

		syn.support.ready++;
	})();
} else {
	syn.helpers.extend(syn.support, syn.config.support);
}


