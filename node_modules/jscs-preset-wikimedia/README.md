[![Build Status](https://travis-ci.org/wikimedia/jscs-preset-wikimedia.svg)](https://travis-ci.org/wikimedia/jscs-preset-wikimedia) [![npm](https://img.shields.io/npm/v/jscs-preset-wikimedia.svg?style=flat)](https://www.npmjs.com/package/jscs-preset-wikimedia)

# JSCS preset for Wikimedia

## Usage

<pre>
npm install --save-dev jscs-preset-wikimedia
</pre>

Configure JSCS with a `.jscsrc` file using the following contents:
<pre lang="json">
{
	"preset": "wikimedia"
}
</pre>

## Proposing changes

Over time, JSCS implements new rules, alter existing ones, and retire old ones. Changes to the Wikimedia preset should be made as pull requests to this repo, with issues raised [on Phabricator](https://phabricator.wikimedia.org/maniphest/task/create/?projects=javascript).

Major changes should be discussed [on mediawiki.org](https://www.mediawiki.org/wiki/Manual talk:Coding_conventions/JavaScript) or on the [Wikitech mailing list](https://lists.wikimedia.org/mailman/listinfo/wikitech-l) beforehand.

## Licence

MIT. See [LICENSE](LICENSE).
