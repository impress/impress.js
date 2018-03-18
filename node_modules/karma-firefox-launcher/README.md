# karma-firefox-launcher

> Launcher for Mozilla Firefox.

## Installation

The easiest way is to keep `karma-firefox-launcher` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-firefox-launcher": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-firefox-launcher --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['Firefox', 'FirefoxDeveloper', 'FirefoxAurora', 'FirefoxNightly'],
  });
};
```

You can pass list of browsers as a CLI argument too:
```bash
karma start --browsers Firefox,Chrome
```

### Custom Preferences
To configure preferences for the Firefox instance that is loaded, you can specify a custom launcher in your Karma
config with the preferences under the `prefs` key:

```js
browsers: ['FirefoxAutoAllowGUM'],

customLaunchers: {
    FirefoxAutoAllowGUM: {
        base: 'Firefox',
        prefs: {
            'media.navigator.permission.disabled': true
        }
    }
}
```

### Loading Firefox Extensions
If you have extensions that you want loaded into the browser on startup, you can specify the full path to each
extension in the `extensions` key:

```js
browsers: ['FirefoxWithMyExtension'],

customLaunchers: {
    FirefoxWithMyExtension: {
        base: 'Firefox',
        extensions: [
          path.resolve(__dirname, 'helpers/extensions/myCustomExt@suchandsuch.xpi'),
          path.resolve(__dirname, 'helpers/extensions/myOtherExt@soandso.xpi')
        ]
    }
}
```

**Please note**: the extension name must exactly match the 'id' of the extension. You can discover the 'id' of your
extension by extracting the .xpi (i.e. `unzip XXX.xpi`) and opening the install.RDF file with a text editor, then look
for the `em:id` tag under the `Description` tag. If your extension manifest looks something like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
   <RDF xmlns="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:em="http://www.mozilla.org/2004/em-rdf#">
  <Description about="urn:mozilla:install-manifest">
    <em:id>myCustomExt@suchandsuch</em:id>
    <em:version>1.0</em:version>
    <em:type>2</em:type>
    <em:bootstrap>true</em:bootstrap>
    <em:unpack>false</em:unpack>

    [...]
  </Description>
</RDF>
```

Then you should name your extension `myCustomExt@suchandsuch.xpi`.

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
