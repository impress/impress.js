<table class="wikitable">
<tbody>
<tr>
<td width="50%" style="border: 1px solid #ccc; padding: 5px;">
<strong>category / JsonWireProtocol method</strong>
</td>
<td width="50%" style="border: 1px solid #ccc; padding: 5px;">
<strong>wd methods</strong>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/status">/status</a><br>
Query the server's current status.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
status(cb) -&gt; cb(err, status)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session">/session</a><br>
Create a new session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
init(desired, cb) -&gt; cb(err, sessionID, capabilities)<br>
Initialize the browser. capabilities return may be<br>
absent, depending on driver.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/sessions">/sessions</a><br>
Returns a list of the currently active sessions.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
sessions(cb) -&gt; cb(err, sessions)<br>
</p>
<p>
Alternate strategy to get session capabilities from server session list:<br>
altSessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId">/session/:sessionId</a><br>
Retrieve the capabilities of the specified session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
sessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId">/session/:sessionId</a><br>
Delete the session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
quit(cb) -&gt; cb(err)<br>
Destroy the browser.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts">/session/:sessionId/timeouts</a><br>
Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
setPageLoadTimeout(ms, cb) -&gt; cb(err)<br>
(use setImplicitWaitTimeout and setAsyncScriptTimeout to set the other timeouts)<br>
</p>
<p>
setCommandTimeout(ms, cb) -&gt; cb(err)<br>
(this is for Appium only)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script">/session/:sessionId/timeouts/async_script</a><br>
Set the amount of time, in milliseconds, that asynchronous scripts executed by /session/:sessionId/execute_async are permitted to run before they are aborted and a |Timeout| error is returned to the client.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setAsyncScriptTimeout(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait">/session/:sessionId/timeouts/implicit_wait</a><br>
Set the amount of time the driver should wait when searching for elements.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setImplicitWaitTimeout(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handle">/session/:sessionId/window_handle</a><br>
Retrieve the current window handle.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowHandle(cb) -&gt; cb(err, handle)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handles">/session/:sessionId/window_handles</a><br>
Retrieve the list of all window handles available to the session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowHandles(cb) -&gt; cb(err, arrayOfHandles)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url">/session/:sessionId/url</a><br>
Retrieve the URL of the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
url(cb) -&gt; cb(err, url)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url">/session/:sessionId/url</a><br>
Navigate to a new URL.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
get(url,cb) -&gt; cb(err)<br>
Get a new url.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/forward">/session/:sessionId/forward</a><br>
Navigate forwards in the browser history, if possible.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
forward(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/back">/session/:sessionId/back</a><br>
Navigate backwards in the browser history, if possible.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
back(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/refresh">/session/:sessionId/refresh</a><br>
Refresh the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
refresh(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute">/session/:sessionId/execute</a><br>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
execute(code, args, cb) -&gt; cb(err, result)<br>
execute(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Safely execute script within an eval block, always returning:<br>
safeExecute(code, args, cb) -&gt; cb(err, result)<br>
safeExecute(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Evaluate expression (using execute):<br>
eval(code, cb) -&gt; cb(err, value)<br>
</p>
<p>
Safely evaluate expression, always returning  (using safeExecute):<br>
safeEval(code, cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute_async">/session/:sessionId/execute_async</a><br>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
executeAsync(code, args, cb) -&gt; cb(err, result)<br>
executeAsync(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Safely execute async script within an eval block, always returning:<br>
safeExecuteAsync(code, args, cb) -&gt; cb(err, result)<br>
safeExecuteAsync(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/screenshot">/session/:sessionId/screenshot</a><br>
Take a screenshot of the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
takeScreenshot(cb) -&gt; cb(err, screenshot)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/ime/available_engines">/session/:sessionId/ime/available_engines</a><br>
List all available engines on the machine.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
availableIMEEngines(cb) -&gt; cb(err, engines)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/ime/active_engine">/session/:sessionId/ime/active_engine</a><br>
Get the name of the active IME engine.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
activeIMEEngine(cb) -&gt; cb(err, activeEngine)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/ime/activated">/session/:sessionId/ime/activated</a><br>
Indicates whether IME input is active at the moment (not if it's available).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
activatedIMEEngine(cb) -&gt; cb(err, active)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/ime/deactivate">/session/:sessionId/ime/deactivate</a><br>
De-activates the currently-active IME engine.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deactivateIMEEngine(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/ime/activate">/session/:sessionId/ime/activate</a><br>
Make an engines that is available (appears on the listreturned by getAvailableEngines) active.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
activateIMEEngine(cb, engine) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/frame">/session/:sessionId/frame</a><br>
Change focus to another frame on the page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
frame(frameRef, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window">/session/:sessionId/window</a><br>
Change focus to another window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
window(name, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window">/session/:sessionId/window</a><br>
Close the current window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
close(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/size">/session/:sessionId/window/:windowHandle/size</a><br>
Change the size of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
windowSize(handle, width, height, cb) -&gt; cb(err)<br>
</p>
<p>
setWindowSize(width, height, handle, cb) -&gt; cb(err)<br>
setWindowSize(width, height, cb) -&gt; cb(err)<br>
width: width in pixels to set size to<br>
height: height in pixels to set size to<br>
handle: window handle to set size for (optional, default: 'current')<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/size">/session/:sessionId/window/:windowHandle/size</a><br>
Get the size of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getWindowSize(handle, cb) -&gt; cb(err, size)<br>
getWindowSize(cb) -&gt; cb(err, size)<br>
handle: window handle to get size (optional, default: 'current')<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/position">/session/:sessionId/window/:windowHandle/position</a><br>
Change the position of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setWindowPosition(x, y, handle, cb) -&gt; cb(err)<br>
setWindowPosition(x, y, cb) -&gt; cb(err)<br>
x: the x-coordinate in pixels to set the window position<br>
y: the y-coordinate in pixels to set the window position<br>
handle: window handle to set position for (optional, default: 'current')<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/position">/session/:sessionId/window/:windowHandle/position</a><br>
Get the position of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getWindowPosition(handle, cb) -&gt; cb(err, position)<br>
getWindowPosition(cb) -&gt; cb(err, position)<br>
handle: window handle to get position (optional, default: 'current')<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/maximize">/session/:sessionId/window/:windowHandle/maximize</a><br>
Maximize the specified window if not already maximized.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
maximize(handle, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Retrieve all cookies visible to the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
allCookies() -&gt; cb(err, cookies)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Set a cookie.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setCookie(cookie, cb) -&gt; cb(err)<br>
cookie example:<br>
{name:'fruit', value:'apple'}<br>
Optional cookie fields:<br>
path, domain, secure, expiry<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Delete all cookies visible to the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deleteAllCookies(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie/:name">/session/:sessionId/cookie/:name</a><br>
Delete the cookie with the given name.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deleteCookie(name, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/source">/session/:sessionId/source</a><br>
Get the current page source.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
source(cb) -&gt; cb(err, source)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/title">/session/:sessionId/title</a><br>
Get the current page title.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
title(cb) -&gt; cb(err, title)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element">/session/:sessionId/element</a><br>
Search for an element on the page, starting from the document root.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassName(value, cb) -&gt; cb(err, element)<br>
elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
elementById(value, cb) -&gt; cb(err, element)<br>
elementByName(value, cb) -&gt; cb(err, element)<br>
elementByLinkText(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
elementByTagName(value, cb) -&gt; cb(err, element)<br>
elementByXPath(value, cb) -&gt; cb(err, element)<br>
elementByCss(value, cb) -&gt; cb(err, element)<br>
elementByIosUIAutomation(value, cb) -&gt; cb(err, element)<br>
elementByAndroidUIAutomator(value, cb) -&gt; cb(err, element)<br>
elementByAccessibilityId(value, cb) -&gt; cb(err, element)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/elements">/session/:sessionId/elements</a><br>
Search for multiple elements on the page, starting from the document root.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
elements(using, value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
elementsByClassName(value, cb) -&gt; cb(err, elements)<br>
elementsByCssSelector(value, cb) -&gt; cb(err, elements)<br>
elementsById(value, cb) -&gt; cb(err, elements)<br>
elementsByName(value, cb) -&gt; cb(err, elements)<br>
elementsByLinkText(value, cb) -&gt; cb(err, elements)<br>
elementsByPartialLinkText(value, cb) -&gt; cb(err, elements)<br>
elementsByTagName(value, cb) -&gt; cb(err, elements)<br>
elementsByXPath(value, cb) -&gt; cb(err, elements)<br>
elementsByCss(value, cb) -&gt; cb(err, elements)<br>
elementsByIosUIAutomation(value, cb) -&gt; cb(err, elements)<br>
elementsByAndroidUIAutomator(value, cb) -&gt; cb(err, elements)<br>
elementsByAccessibilityId(value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
Retrieve an element avoiding not found exception and returning null instead:<br>
elementOrNull(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByCssSelectorOrNull(value, cb) -&gt; cb(err, element)<br>
elementByIdOrNull(value, cb) -&gt; cb(err, element)<br>
elementByNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByLinkTextOrNull(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkTextOrNull(value, cb) -&gt; cb(err, element)<br>
elementByTagNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByXPathOrNull(value, cb) -&gt; cb(err, element)<br>
elementByCssOrNull(value, cb) -&gt; cb(err, element)<br>
elementByIosUIAutomationOrNull(value, cb) -&gt; cb(err, element)<br>
elementByAndroidUIAutomatorOrNull(value, cb) -&gt; cb(err, element)<br>
elementByAccessibilityIdOrNull(value, cb) -&gt; cb(err, element)<br>
</p>
<p>
Retrieve an element avoiding not found exception and returning undefined instead:<br>
elementIfExists(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByCssSelectorIfExists(value, cb) -&gt; cb(err, element)<br>
elementByIdIfExists(value, cb) -&gt; cb(err, element)<br>
elementByNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByLinkTextIfExists(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkTextIfExists(value, cb) -&gt; cb(err, element)<br>
elementByTagNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByXPathIfExists(value, cb) -&gt; cb(err, element)<br>
elementByCssIfExists(value, cb) -&gt; cb(err, element)<br>
elementByIosUIAutomationIfExists(value, cb) -&gt; cb(err, element)<br>
elementByAndroidUIAutomatorIfExists(value, cb) -&gt; cb(err, element)<br>
elementByAccessibilityIdIfExists(value, cb) -&gt; cb(err, element)<br>
</p>
<p>
Check if element exists:<br>
hasElement(using, value, cb) -&gt; cb(err, boolean)<br>
</p>
<p>
hasElementByClassName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByCssSelector(value, cb) -&gt; cb(err, boolean)<br>
hasElementById(value, cb) -&gt; cb(err, boolean)<br>
hasElementByName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByLinkText(value, cb) -&gt; cb(err, boolean)<br>
hasElementByPartialLinkText(value, cb) -&gt; cb(err, boolean)<br>
hasElementByTagName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByXPath(value, cb) -&gt; cb(err, boolean)<br>
hasElementByCss(value, cb) -&gt; cb(err, boolean)<br>
hasElementByIosUIAutomation(value, cb) -&gt; cb(err, boolean)<br>
hasElementByAndroidUIAutomator(value, cb) -&gt; cb(err, boolean)<br>
hasElementByAccessibilityId(value, cb) -&gt; cb(err, boolean)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/active">/session/:sessionId/element/active</a><br>
Get the element on the page that currently has focus.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
active(cb) -&gt; cb(err, element)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/element">/session/:sessionId/element/:id/element</a><br>
Search for an element on the page, starting from the identified element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element.element(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
element.elementByClassName(value, cb) -&gt; cb(err, element)<br>
element.elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
element.elementById(value, cb) -&gt; cb(err, element)<br>
element.elementByName(value, cb) -&gt; cb(err, element)<br>
element.elementByLinkText(value, cb) -&gt; cb(err, element)<br>
element.elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
element.elementByTagName(value, cb) -&gt; cb(err, element)<br>
element.elementByXPath(value, cb) -&gt; cb(err, element)<br>
element.elementByCss(value, cb) -&gt; cb(err, element)<br>
element.elementByIosUIAutomation(value, cb) -&gt; cb(err, element)<br>
element.elementByAndroidUIAutomator(value, cb) -&gt; cb(err, element)<br>
element.elementByAccessibilityId(value, cb) -&gt; cb(err, element)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/elements">/session/:sessionId/element/:id/elements</a><br>
Search for multiple elements on the page, starting from the identified element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element.elements(using, value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
element.elementsByClassName(value, cb) -&gt; cb(err, elements)<br>
element.elementsByCssSelector(value, cb) -&gt; cb(err, elements)<br>
element.elementsById(value, cb) -&gt; cb(err, elements)<br>
element.elementsByName(value, cb) -&gt; cb(err, elements)<br>
element.elementsByLinkText(value, cb) -&gt; cb(err, elements)<br>
element.elementsByPartialLinkText(value, cb) -&gt; cb(err, elements)<br>
element.elementsByTagName(value, cb) -&gt; cb(err, elements)<br>
element.elementsByXPath(value, cb) -&gt; cb(err, elements)<br>
element.elementsByCss(value, cb) -&gt; cb(err, elements)<br>
element.elementsByIosUIAUtomation(value, cb) -&gt; cb(err, elements)<br>
element.elementsByAndroidUIAutomator(value, cb) -&gt; cb(err, elements)<br>
element.elementsByAccessibilityId(value, cb) -&gt; cb(err, elements)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/click">/session/:sessionId/element/:id/click</a><br>
Click on an element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
clickElement(element, cb) -&gt; cb(err)<br>
</p>
<p>
element.click(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/submit">/session/:sessionId/element/:id/submit</a><br>
Submit a FORM element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
submit(element, cb) -&gt; cb(err)<br>
Submit a `FORM` element.<br>
</p>
<p>
element.submit(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/text">/session/:sessionId/element/:id/text</a><br>
Returns the visible text for the element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
text(element, cb) -&gt; cb(err, text)<br>
element: specific element, 'body', or undefined<br>
</p>
<p>
element.text(cb) -&gt; cb(err, text)<br>
</p>
<p>
Check if text is present:<br>
textPresent(searchText, element, cb) -&gt; cb(err, boolean)<br>
element: specific element, 'body', or undefined<br>
</p>
<p>
element.textPresent(searchText, cb) -&gt; cb(err, boolean)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/value">/session/:sessionId/element/:id/value</a><br>
Send a sequence of key strokes to an element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
type(element, keys, cb) -&gt; cb(err)<br>
Type keys (all keys are up at the end of command).<br>
special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
</p>
<p>
element.type(keys, cb) -&gt; cb(err)<br>
</p>
<p>
element.keys(keys, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/keys">/session/:sessionId/keys</a><br>
Send a sequence of key strokes to the active element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
keys(keys, cb) -&gt; cb(err)<br>
Press keys (keys may still be down at the end of command).<br>
special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/name">/session/:sessionId/element/:id/name</a><br>
Query for an element's tag name.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getTagName(element, cb) -&gt; cb(err, name)<br>
</p>
<p>
element.getTagName(cb) -&gt; cb(err, name)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/clear">/session/:sessionId/element/:id/clear</a><br>
Clear a TEXTAREA or text INPUT element's value.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
clear(element, cb) -&gt; cb(err)<br>
</p>
<p>
element.clear(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/selected">/session/:sessionId/element/:id/selected</a><br>
Determine if an OPTION element, or an INPUT element of type checkbox or radiobutton is currently selected.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isSelected(element, cb) -&gt; cb(err, selected)<br>
</p>
<p>
element.isSelected(cb) -&gt; cb(err, selected)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/enabled">/session/:sessionId/element/:id/enabled</a><br>
Determine if an element is currently enabled.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isEnabled(element, cb) -&gt; cb(err, enabled)<br>
</p>
<p>
element.isEnabled(cb) -&gt; cb(err, enabled)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/attribute/:name">/session/:sessionId/element/:id/attribute/:name</a><br>
Get the value of an element's attribute.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getAttribute(element, attrName, cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getAttribute(attrName, cb) -&gt; cb(err, value)<br>
</p>
<p>
Get element value (in value attribute):<br>
getValue(element, cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getValue(cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/equals/:other">/session/:sessionId/element/:id/equals/:other</a><br>
Test if two element IDs refer to the same DOM element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element.equals(other, cb) -&gt; cb(err, value)<br>
</p>
<p>
equalsElement(element, other , cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/displayed">/session/:sessionId/element/:id/displayed</a><br>
Determine if an element is currently displayed.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isDisplayed(element, cb) -&gt; cb(err, displayed)<br>
</p>
<p>
element.isDisplayed(cb) -&gt; cb(err, displayed)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/location">/session/:sessionId/element/:id/location</a><br>
Determine an element's location on the page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getLocation(element, cb) -&gt; cb(err, location)<br>
</p>
<p>
element.getLocation(cb) -&gt; cb(err, location)<br>
</p>
<p>
element.getLocationInView(cb) -&gt; cb(err, location)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/location_in_view">/session/:sessionId/element/:id/location_in_view</a><br>
Determine an element's location on the screen once it has been scrolled into view.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getLocationInView(element, cb) -&gt; cb(err, location)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/size">/session/:sessionId/element/:id/size</a><br>
Determine an element's size in pixels.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getSize(element, cb) -&gt; cb(err, size)<br>
</p>
<p>
element.getSize(cb) -&gt; cb(err, size)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/css/:propertyName">/session/:sessionId/element/:id/css/:propertyName</a><br>
Query the value of an element's computed CSS property.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getComputedCss(element, cssProperty , cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getComputedCss(cssProperty , cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/orientation">/session/:sessionId/orientation</a><br>
Get the current browser orientation.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getOrientation(cb) -&gt; cb(err, orientation)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/orientation">/session/:sessionId/orientation</a><br>
Set the browser orientation.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setOrientation(cb) -&gt; cb(err, orientation)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/alert_text">/session/:sessionId/alert_text</a><br>
Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
alertText(cb) -&gt; cb(err, text)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/alert_text">/session/:sessionId/alert_text</a><br>
Sends keystrokes to a JavaScript prompt() dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
alertKeys(keys, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/accept_alert">/session/:sessionId/accept_alert</a><br>
Accepts the currently displayed alert dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
acceptAlert(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/dismiss_alert">/session/:sessionId/dismiss_alert</a><br>
Dismisses the currently displayed alert dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
dismissAlert(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/moveto">/session/:sessionId/moveto</a><br>
Move the mouse by an offset of the specificed element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
moveTo(element, xoffset, yoffset, cb) -&gt; cb(err)<br>
Move to element, element may be null, xoffset and y offset<br>
are optional.<br>
</p>
<p>
element.moveTo(xoffset, yoffset, cb) -&gt; cb(err)<br>
xoffset and y offset are optional.<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/click">/session/:sessionId/click</a><br>
Click any mouse button (at the coordinates set by the last moveto command).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
click(button, cb) -&gt; cb(err)<br>
Click on current element.<br>
Buttons: {left: 0, middle: 1 , right: 2}<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttondown">/session/:sessionId/buttondown</a><br>
Click and hold the left mouse button (at the coordinates set by the last moveto command).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
buttonDown(button ,cb) -&gt; cb(err)<br>
button is optional.<br>
{LEFT = 0, MIDDLE = 1 , RIGHT = 2}.<br>
LEFT if not specified.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttonup">/session/:sessionId/buttonup</a><br>
Releases the mouse button previously held (where the mouse is currently at).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
buttonUp(button, cb) -&gt; cb(err)<br>
button is optional.<br>
{LEFT = 0, MIDDLE = 1 , RIGHT = 2}.<br>
LEFT if not specified.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/doubleclick">/session/:sessionId/doubleclick</a><br>
Double-clicks at the current mouse coordinates (set by moveto).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
doubleclick(cb) -&gt; cb(err)<br>
</p>
<p>
element.doubleClick(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/click">/session/:sessionId/touch/click</a><br>
Single tap on the touch enabled device.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
tap(element) -&gt; cb(err)<br>
Taps element<br>
</p>
<p>
element.tap(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/flick">/session/:sessionId/touch/flick</a><br>
Flick on the touch screen using finger motion events.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
flick(xSpeed, ySpeed, swipe, cb) -&gt; cb(err)<br>
Flicks, starting anywhere on the screen.<br>
flick(element, xoffset, yoffset, speed, cb) -&gt; cb(err)<br>
Flicks, starting at element center.<br>
</p>
<p>
element.flick(xoffset, yoffset, speed, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/location">/session/:sessionId/location</a><br>
Get the current geo location.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getGeoLocation(cb) -&gt; cb(err, geoLocationObj)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/location">/session/:sessionId/location</a><br>
Set the current geo location.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setGeoLocation(lat, lon, alt, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/local_storage">/session/:sessionId/local_storage</a><br>
Set the storage item for the given key.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setLocalStorageKey(key, value, cb) -&gt; cb(err)<br>
# uses safeExecute() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/local_storage">/session/:sessionId/local_storage</a><br>
Clear the storage.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
clearLocalStorage(cb) -&gt; cb(err)<br>
# uses safeExecute() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/local_storage/key/:key">/session/:sessionId/local_storage/key/:key</a><br>
Get the storage item for the given key.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getLocalStorageKey(key, cb) -&gt; cb(err)<br>
# uses safeEval() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/local_storage/key/:key">/session/:sessionId/local_storage/key/:key</a><br>
Remove the storage item for the given key.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
removeLocalStorageKey(key, cb) -&gt; cb(err)<br>
# uses safeExecute() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/log">/session/:sessionId/log</a><br>
Get the log for a given log type.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
scroll(xOffset, yOffset, cb) -&gt; cb(err)<br>
</p>
<p>
log(logType, cb) -&gt; cb(err, arrayOfLogs)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/log/types">/session/:sessionId/log/types</a><br>
Get available log types.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
logTypes(cb) -&gt; cb(err, arrayOfLogTypes)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/context">/session/:sessionId/context</a><br>
Get the current context (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
currentContext(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/context">/session/:sessionId/context</a><br>
Set the current context (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
context(contextRef, cb) -&gt; cb(err, context)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/contexts">/session/:sessionId/contexts</a><br>
Get a list of the available contexts (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
contexts(cb) -&gt; cb(err, handle)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/perform">/session/:sessionId/touch/perform</a><br>
Perform touch action (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
performTouchAction(touchAction) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/multi/perform">/session/:sessionId/touch/multi/perform</a><br>
Perform multitouch action (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
performMultiAction(element, multiAction) -&gt; cb(err, touchStateObjects)<br>
performMultiAction(multiAction) -&gt; cb(err, touchStateObjects)<br>
</p>
<p>
element.performMultiAction(actions) -&gt; cb(err, touchStateObjects)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/shake">/session/:sessionId/appium/device/shake</a><br>
Shake device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
shakeDevice(cb) -&gt; cb(err)<br>
</p>
<p>
shake(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/lock">/session/:sessionId/appium/device/lock</a><br>
Lock device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
lockDevice(seconds, cb) -&gt; cb(err)<br>
</p>
<p>
lock(seconds, cb) -&gt; cb(err)<br>
</p>
<p>
unlockDevice(cb) -&gt; cb(err)<br>
</p>
<p>
unlock(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/keyevent">/session/:sessionId/appium/device/keyevent</a><br>
Send key event to device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
deviceKeyEvent(keycode, metastate, cb) -&gt; cb(err)<br>
metastate is optional<br>
</p>
<p>
pressDeviceKey(keycode, metastate, cb) -&gt; cb(err)<br>
metastate is optional<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/rotate">/session/:sessionId/appium/device/rotate</a><br>
Rotate device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
rotateDevice(element, opts, cb) -&gt; cb(err)<br>
rotateDevice(opts, cb) -&gt; cb(err)<br>
opts is like the following:<br>
{x: 114, y: 198, duration: 5, radius: 3, rotation: 220, touchCount: 2}<br>
</p>
<p>
rotate(element, opts, cb) -&gt; cb(err)<br>
rotate(opts, cb) -&gt; cb(err)<br>
opts is like the following:<br>
{x: 114, y: 198, duration: 5, radius: 3, rotation: 220, touchCount: 2}<br>
</p>
<p>
element.rotate(opts, cb) -&gt; cb(err)<br>
opts is like the following:<br>
{x: 114, y: 198, duration: 5, radius: 3, rotation: 220, touchCount: 2}<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/appium/device/current_activity">/session/:sessionId/appium/device/current_activity</a><br>
Get current activity (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getCurrentDeviceActivity(cb) -&gt; cb(err)<br>
</p>
<p>
getCurrentActivity(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/install_app">/session/:sessionId/appium/device/install_app</a><br>
Install app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
installAppOnDevice(appPath, cb) -&gt; cb(err)<br>
</p>
<p>
installApp(appPath, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/remove_app">/session/:sessionId/appium/device/remove_app</a><br>
Remove app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
removeAppFromDevice(appId, cb) -&gt; cb(err)<br>
</p>
<p>
removeApp(appId, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/app_installed">/session/:sessionId/appium/device/app_installed</a><br>
Check if the app is installed (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isAppInstalledOnDevice(bundleId, cb) -&gt; cb(isInstalled, err)<br>
</p>
<p>
isAppInstalled(bundleId, cb) -&gt; cb(isInstalled, err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/push_file">/session/:sessionId/appium/device/push_file</a><br>
Push file to device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
pushFileToDevice(pathOnDevice, base64Data, cb) -&gt; cb(err)<br>
</p>
<p>
pushFile(pathOnDevice, base64Data, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/pull_file">/session/:sessionId/appium/device/pull_file</a><br>
Pull file from device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
pullFileFromDevice(pathOnDevice, cb) -&gt; cb(base64EncodedData, err)<br>
</p>
<p>
pullFile(pathOnDevice, cb) -&gt; cb(base64EncodedData, err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/pull_folder">/session/:sessionId/appium/device/pull_folder</a><br>
Pull folder from device (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
pullFolderFromDevice(pathOnDevice, cb) -&gt; cb(base64EncodedData, err)<br>
</p>
<p>
pullFolder(pathOnDevice, cb) -&gt; cb(base64EncodedData, err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/toggle_airplane_mode">/session/:sessionId/appium/device/toggle_airplane_mode</a><br>
Toggle airplane mode (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
toggleAirplaneModeOnDevice(cb) -&gt; cb(err)<br>
</p>
<p>
toggleAirplaneMode(cb) -&gt; cb(err)<br>
</p>
<p>
toggleFlightMode(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/toggle_wifi">/session/:sessionId/appium/device/toggle_wifi</a><br>
Toggle wifi (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
toggleWiFiOnDevice(cb) -&gt; cb(err)<br>
</p>
<p>
toggleWiFi(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/toggle_location_services">/session/:sessionId/appium/device/toggle_location_services</a><br>
Toggle location services (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
toggleLocationServicesOnDevice(cb) -&gt; cb(err)<br>
</p>
<p>
toggleLocationServices(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/toggle_data">/session/:sessionId/appium/device/toggle_data</a><br>
Toggle data (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
toggleDataOnDevice(cb) -&gt; cb(err)<br>
</p>
<p>
toggleData(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/start_activity">/session/:sessionId/appium/device/start_activity</a><br>
Start an Android activity (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
startActivity(options, cb) -&gt; cb(err)<br>
Start an arbitrary Android activity during a session. The 'options' parameter should<br>
implement the interface {appPackage, appActivity, [appWaitPackage], [appWaitActivity]}.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/launch">/session/:sessionId/appium/app/launch</a><br>
Launch app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
launchApp(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/close">/session/:sessionId/appium/app/close</a><br>
Close app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
closeApp(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/reset">/session/:sessionId/appium/app/reset</a><br>
Reset app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
resetApp(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/background">/session/:sessionId/appium/app/background</a><br>
Background app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
backgroundApp(seconds, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/end_test_coverage">/session/:sessionId/appium/app/end_test_coverage</a><br>
End test coverage (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
endTestCoverageForApp(intentToBroadcast, pathOnDevice) -&gt; cb(base64Data,err)<br>
</p>
<p>
endTestCoverage(intentToBroadcast, pathOnDevice) -&gt; cb(base64Data,err)<br>
</p>
<p>
endCoverage(intentToBroadcast, pathOnDevice) -&gt; cb(base64Data,err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/complex_find">/session/:sessionId/appium/app/complex_find</a><br>
Find within app (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
complexFindInApp(selector) -&gt; cb(element(s))<br>
Return a single element or an elements array depending on<br>
selector<br>
</p>
<p>
complexFind(selector) -&gt; cb(element(s))<br>
Return a single element or an elements array depending on<br>
selector<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/app/strings">/session/:sessionId/appium/app/strings</a><br>
Retrieve app strings (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getAppStrings(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/element/:elementId?/value">/session/:sessionId/appium/element/:elementId?/value</a><br>
Set element immediate value (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
setImmediateValueInApp(element, value, cb) -&gt; cb(err)<br>
</p>
<p>
setImmediateValue(element, value, cb) -&gt; cb(err)<br>
</p>
<p>
element.setImmediateValueInApp(value, cb) -&gt; cb(err)<br>
</p>
<p>
element.setImmediateValue(value, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/network_connection">/session/:sessionId/network_connection</a><br>
Get appium selendroid network connection type (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getNetworkConnection(cb) -&gt; cb(err, networkConnectionInfo)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/network_connection">/session/:sessionId/network_connection</a><br>
Set appium selendroid network connection type (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setNetworkConnection(type, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/hide_keyboard">/session/:sessionId/appium/device/hide_keyboard</a><br>
Hide keyboard (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
hideKeyboard() -&gt; cb(err)<br>
hideKeyboard(keyName, cb) -&gt; cb(err)<br>
hideKeyboard({strategy: 'pressKey', key:'&lt;key&gt;'}) -&gt; cb(err)<br>
hideKeyboard({strategy: 'tapOutside'}) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/appium/device/open_notifications">/session/:sessionId/appium/device/open_notifications</a><br>
Open Notifications (mjsonWire).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
openNotifications(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
attach(sessionID, cb) -&gt; cb(err)<br>
Connect to an already-active session.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
detach(cb) -&gt; cb(err)<br>
Detach from the current session.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Retrieves the current session id.<br>
getSessionId(cb) -&gt; cb(err, sessionId)<br>
getSessionId()<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Opens a new window (using Javascript window.open):<br>
newWindow(url, name, cb) -&gt; cb(err)<br>
newWindow(url, cb) -&gt; cb(err)<br>
name: optional window name<br>
Window can later be accessed by name with the window method,<br>
or by getting the last handle returned by the windowHandles method.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowName(cb) -&gt; cb(err, name)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
configureHttp(opts)<br>
opts example:<br>
{timeout:60000, retries: 3, 'retryDelay': 15, baseUrl='http://example.com/'}<br>
more info in README.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitFor(asserter, timeout, pollFreq, cb) -&gt; cb(err, return_value)<br>
timeout and pollFreq are optional (default 1000ms/200ms)<br>
waitFor(opts, cb) -&gt; cb(err)<br>
opts with the following fields: timeout, pollFreq, asserter.<br>
asserter like: function(browser , cb) -&gt; cb(err, satisfied, return_value)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElement(using, value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElement(using, value, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
timeout and pollFreq are optional (default 1000ms/200ms)<br>
waitForElement(using, value, opts, cb) -&gt; cb(err, el)<br>
opts with the following fields: timeout, pollFreq, asserter.<br>
asserter like: function(element , cb) -&gt; cb(err, satisfied, el)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElements(using, value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElements(using, value, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
timeout and pollFreq are optional (default 1000ms/200ms)<br>
waitForElements(using, value, opts, cb) -&gt; cb(err, els)<br>
opts with the following fields: timeout, pollFreq, asserter.<br>
asserter like: function(element , cb) -&gt; cb(err, satisfied, el)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
saveScreenshot(path, cb) -&gt; cb(err, filePath)<br>
path maybe a full file path, a directory path (finishing with /),<br>
the screenshot name, or left blank (will create a file in the system temp dir).<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElementByClassName(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByCssSelector(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementById(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByName(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByLinkText(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByPartialLinkText(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByTagName(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByXPath(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByCss(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByIosUIAutomation(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByAndroidUIAutomator(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementByAccessibilityId(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
asserter, timeout, pollFreq are optional, opts may be passed instead,<br>
as in waitForElement.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElementsByClassName(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByCssSelector(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsById(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByName(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByLinkText(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByPartialLinkText(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByTagName(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByXPath(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByCss(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, els)<br>
waitForElementsByIosUIAutomation(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementsByAndroidUIAutomator(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
waitForElementsByAccessibilityId(value, asserter, timeout, pollFreq, cb) -&gt; cb(err, el)<br>
asserter, timeout, pollFreq are optional, opts may be passed instead,<br>
as in waitForElements.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Retrieves the pageIndex element (added for Appium):<br>
getPageIndex(element, cb) -&gt; cb(err, pageIndex)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Uploads a local file using undocumented<br>
POST /session/:sessionId/file<br>
uploadFile(filepath, cb) -&gt; cb(err, filepath)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Waits for JavaScript condition to be true (async script polling within browser):<br>
waitForConditionInBrowser(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
conditionExpr: condition expression, should return a boolean<br>
timeout and  pollFreq are optional, default: 1000/100.<br>
return true if condition satisfied, error otherwise.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
sauceJobUpdate(jsonData, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
sauceJobStatus(hasPassed, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
sleep(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
noop(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Equivalent to the python sendKeys binding. Upload file if<br>
a local file is detected, otherwise behaves like type.<br>
element.sendKeys(keys, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Equivalent to the python sendKeys binding, but replaces texts instead of keeping original. Upload file if<br>
a local file is detected, otherwise behaves like type.<br>
element.setText(keys, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isVisible(cb) -&gt; cb(err, boolean)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
element.sleep(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
extra
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
element.noop(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
asserter
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
asserters.nonEmptyText<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
asserter
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
asserters.textInclude(content) -&gt; Asserter<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
asserter
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
asserters.isVisible<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
asserter
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
asserters.isHidden<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
asserter
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
asserters.jsCondition(jsConditionExpr) -&gt; Asserter<br>
jsConditionExpr: js script expression, should evaluate as boolean.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.configureHttp(opts)<br>
opts example:<br>
{timeout:60000, retries: 3, 'retryDelay': 15, baseUrl='http://example.com/'}<br>
more info in README.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.showHideDeprecation(boolean)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.addAsyncMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.addElementAsyncMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.addPromiseMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.addElementPromiseMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.addPromiseChainMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.addElementPromiseChainMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
wd
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
wd.removeMethod(name, func)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
MISSING: POST /session/:sessionId/appium/device/is_locked
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isLocked(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
MISSING: GET /session/:sessionId/appium/settings
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
settings(cb) -&gt; cb(err, settingsObject)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
MISSING: POST /session/:sessionId/appium/settings
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
updateSettings(settingsObject, cb) -&gt; cb(err)<br>
</td>
</tr>
</tbody>
</table>
