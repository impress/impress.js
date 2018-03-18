Thanks for wanting to contribute!

- See if the issue is a duplicate: [babel-jscs issues](https://github.com/jscs-dev/babel-jscs/issues), [jscs issues](https://github.com/jscs-dev/node-jscs/issues).
- Check if the issue is reproducible with regular jscs.
- Run jscs in --verbose mode to get the rule name(s) that have issues.

If there's an issue, first check if you can reproduce your issue with the regular parser (esprima, without esnext)
and with the latest version of jscs and babel-jscs.

You might need to clear your npm cache, or make your you understand if the package is installed globally/locally.

If so include in your issue: `jscs`/`babel-jscs`/`babel` version, code snippet/screenshot, stack trace.
