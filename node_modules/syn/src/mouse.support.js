var syn = require('./synthetic');
require('./mouse');


(function checkSupport() {
	if (!document.body) {
		return syn.schedule(checkSupport, 1);
	}
	window.__synthTest = function () {
		syn.support.linkHrefJS = true;
	};
	
	var div = document.createElement("div"),
		checkbox, submit, form, select;
	
	div.innerHTML = "<form id='outer'>" + "<input name='checkbox' type='checkbox'/>" + "<input name='radio' type='radio' />" + "<input type='submit' name='submitter'/>" + "<input type='input' name='inputter'/>" + "<input name='one'>" + "<input name='two'/>" + "<a href='javascript:__synthTest()' id='synlink'></a>" + "<select><option></option></select>" + "</form>";
	document.documentElement.appendChild(div);
	form = div.firstChild;
	checkbox = form.childNodes[0];
	submit = form.childNodes[2];
	select = form.getElementsByTagName('select')[0];
	
	//trigger click for linkHrefJS support, childNodes[6] === anchor
	syn.trigger(form.childNodes[6], 'click', {});
	
	checkbox.checked = false;
	checkbox.onchange = function () {
		syn.support.clickChanges = true;
	};
	
	syn.trigger(checkbox, "click", {});
	syn.support.clickChecks = checkbox.checked;
	
	checkbox.checked = false;
	
	syn.trigger(checkbox, "change", {});
	
	syn.support.changeChecks = checkbox.checked;
	
	form.onsubmit = function (ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		syn.support.clickSubmits = true;
		return false;
	};
	syn.trigger(submit, "click", {});
	
	form.childNodes[1].onchange = function () {
		syn.support.radioClickChanges = true;
	};
	syn.trigger(form.childNodes[1], "click", {});
	
	syn.bind(div, 'click', function onclick() {
		syn.support.optionClickBubbles = true;
		syn.unbind(div, 'click', onclick);
	});
	syn.trigger(select.firstChild, "click", {});
	
	syn.support.changeBubbles = syn.eventSupported('change');
	
	//test if mousedown followed by mouseup causes click (opera), make sure there are no clicks after this
	div.onclick = function () {
		syn.support.mouseDownUpClicks = true;
	};
	syn.trigger(div, "mousedown", {});
	syn.trigger(div, "mouseup", {});
	
	document.documentElement.removeChild(div);
	
	// register whether or not the current browser supports either pointer or touch events
	syn.support.pointerEvents = (syn.eventSupported('pointerdown'));
	syn.support.touchEvents = (syn.eventSupported('touchstart'));	
	
	//check stuff
	syn.support.ready++;
}());



