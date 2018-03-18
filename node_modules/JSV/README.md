JSV: JSON Schema Validator
==========================

JSV is a JavaScript implementation of a extendable, fully compliant JSON Schema validator with the following features:

*	The fastest extendable JSON validator available!
*	Complete implementation of all current JSON Schema draft revisions.
*	Supports creating individual environments (sandboxes) that validate using a particular schema specification.
*	Provides an intuitive API for creating new validating schema attributes, or whole new custom schema schemas.
*	Supports `self`, `full` and `describedby` hyper links.
*	Validates itself, and is bootstrapped from the JSON Schema schemas.
*	Includes over 1100 unit tests for testing all parts of the specifications.
*	Works in all ECMAScript 3 environments, including all web browsers and Node.js.
*	Licensed under the FreeBSD License, a very open license.

## It's a what?

**JSON** (an acronym for **JavaScript Object Notation**) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate. It is based on a subset of JavaScript/ECMA-262 3rd Edition. JSON is a text format that is completely language independent but uses conventions that are familiar to programmers of the C-family of languages. (C, C++, C#, Java, JavaScript, Perl, Python, ...) These properties make JSON an ideal data-interchange language. \[[json.org](http://json.org)\]

**JSON Schema** is a JSON media type for defining the structure of JSON data.  JSON Schema provides a contract for what JSON data is required for a given application and how to interact with it.  JSON Schema is intended to define validation, documentation, hyperlink navigation, and interaction control of JSON data. \[[draft-zyp-json-schema-02](http://tools.ietf.org/html/draft-zyp-json-schema-02)\]

A **JSON validator** is a program that takes JSON data and, with a provided schema, will ensure that the provided JSON is structured in the way defined by the schema. This ensures that if validation has passed, the JSON instance is guaranteed to be in the expected format. It will also provide an explanation on why a particular instance failed validation.

## Example

Here's an example on how to validate some JSON with JSV:

	var JSV = require("./jsv").JSV;
	var json = {};
	var schema = {"type" : "object"};
	var env = JSV.createEnvironment();
	var report = env.validate(json, schema);
	
	if (report.errors.length === 0) {
		//JSON is valid against the schema
	}

Another example; for the following test:

	env.validate({ a : 1 }, { type : 'object', properties : { a : { type : 'string' }} });

The generated report would look like:

	{
		errors : [
			{
				message : "Instance is not a required type",
				uri : "urn:uuid:74b843b5-3aa4-44e9-b7bc-f555936fa823#/a",
				schemaUri : "urn:uuid:837fdefe-3bd4-4993-9a20-38a6a0624d5a#/properties/a",
				attribute : "type",
				details : ["string"]
			}
		],
		validated : {
			"urn:uuid:74b843b5-3aa4-44e9-b7bc-f555936fa823#" : ["urn:uuid:837fdefe-3bd4-4993-9a20-38a6a0624d5a#"],
			"urn:uuid:74b843b5-3aa4-44e9-b7bc-f555936fa823#/a" : ["urn:uuid:837fdefe-3bd4-4993-9a20-38a6a0624d5a#/properties/a"],
			//...
		},
		instance : [JSONInstance object],
		schema : [JSONSchema object],
		schemaSchema : [JSONSchema object]
	}

## Environments & JSON Schema support

There is no one way to validate JSON, just like there is no one way to validate XML. Even the JSON Schema specification has gone through several revisions which are not 100% backwards compatible with each other. To solve the issue of using numerous schemas already written to older specifications, JSV provides customizable environments to validate your JSON within. 

When creating an environment, you can optionally specify how you want that environment to behave. For example, this allows you to specify which version of the JSON Schema you would like the environment to behave like. JSV already provides the following environments:

*	`json-schema-draft-03`

	A complete implementation of the [third revision](http://tools.ietf.org/html/draft-zyp-json-schema-03) of the JSON Schema specification. This is the same as the second revision, except:
	
	*	"optional" has been replaced by "required"
	*	"requires" has been replaced by "dependencies"
	*	"minimumCanEqual"/"maximumCanEqual" has been replaced by "exclusiveMinimum"/"exclusiveMaximum"
	*	"self"/"full"/"describedby" links have been moved to the core schema, and are provided by "id"/"$ref"/"$schema"
	*	Adds the attributes "patternSchema" and "additionalItems"
	*	Deprecates the attributes "root" and "alternate"
	*	Schemas are now versioned under the URIs "http://json-schema.org/draft-XX/", where XX is the draft number
	
	In addition to this, all schemas from the previous versions of the JSON Schema draft are included in this environment, and are backwards compatible (where possible) with it's previous version.
	This backwards compatibility can be disabled with the environment option `strict` is set to `true`.
	
	This is currently the default environment.

*	`json-schema-draft-02`

	A complete implementation of the [second revision](http://tools.ietf.org/html/draft-zyp-json-schema-02) of the JSON Schema specification. This is the same as the first revision, except adds:
	
	*	"targetSchema" attribute
	*	slash-delimited fragment identifiers, which is now the default behavior
	
*	`json-schema-draft-01`

	A complete implementation of the [first revision](http://tools.ietf.org/html/draft-zyp-json-schema-01) of the JSON Schema specification, which is exactly the same as the [original draft](http://tools.ietf.org/html/draft-zyp-json-schema-00).
	
	Users with JSON Schemas written for JSV < v2.1 should use this environment for it's dot-delimited fragment identifiers.

Environments can also be customized and registered for multiple reuse. (See the section on *Extending Environments* below)

## Validation API

The following methods are used to validate JSON data:

### JSV.createEnvironment(*environmentID?*) *->* *&lt;Environment&gt;*

*	*environmentID* *&lt;String&gt;* *(optional)* The ID of the environment to clone a new Environment from

Creates an new environment that is a copy of the Environment registered with the provided `environmentID`. If no ID is provided, the latest registered JSON Schema is used as the template.

See the above section on *Environments* for the default available Environment IDs.

### *&lt;Environment&gt;*.validate(*json*, *schema*) *->* *&lt;Report&gt;*

*	*json* *&lt;Any|JSONInstance&gt;* The JSON data to validate
*	*schema* *&lt;Object|JSONInstance|JSONSchema&gt;* The schema to validate the JSON with

Validates both the schema and the JSON, and returns a report of the validation.

### *&lt;Report&gt;*.errors *&lt;Array&gt;*

An array of error objects from the validation process; each object represents a restriction check that failed. If the array is empty, the validation passed.

The error objects have the following schema:

	{
		"type" : "object",
		"properties" : {
			"message" : {
				"description" : "A user-friendly error message about what failed to validate.",
				"type" : "string"
			},
			"uri" : {
				"description" : "URI of the instance that failed to validate.",
				"type" : "string",
				"format" : "uri"
			},
			"schemaUri" : {
				"description" : "URI of the schema instance that reported the error.",
				"type" : "string",
				"format" : "uri"
			},
			"attribute" : {
				"description" : "The attribute of the schema instance that failed to validate.",
				"type" : "string"
			},
			"details" : {
				"description" : "The value of the schema attribute that failed to validate.",
				"type" : "any"
			}
		}
	}

## API Documentation

There are many more APIs available for JSV, too many to detail here. The complete API and documentation can be found in the `docs` directory.

## Extending Environments

JSV provides an API for extending available schemas, adding new attributes and validation to currently existing schemas, and creating whole new Environments with unique behaviors. 
In fact, in the [eat-your-own-dog-food](http://en.wikipedia.org/wiki/Eating_your_own_dog_food) approach, all the default JSON Schema environments available are implemented using this API. 
Details and instruction on this feature will be provided at a later date.

## Installation

The preferred method of installation is to download the latest copy from GitHub:

	git clone git://github.com/garycourt/JSV.git

If you are using JSV within Node.js, you can quickly install it using:

	npm install JSV

Then you can reference it within your application using:

	var JSV = require("JSV").JSV;

## Unit Tests

Open `tests/index.html` and `tests/index3.html` in your web browser to run the unit tests.

Currently, the unit tests can not be run in Node.js.

## License

	Copyright 2010 Gary Court. All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification, are
	permitted provided that the following conditions are met:
	
	   1. Redistributions of source code must retain the above copyright notice, this list of
	      conditions and the following disclaimer.
	
	   2. Redistributions in binary form must reproduce the above copyright notice, this list
	      of conditions and the following disclaimer in the documentation and/or other materials
	      provided with the distribution.
	
	THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
	WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
	CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
	ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
	ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	The views and conclusions contained in the software and documentation are those of the
	authors and should not be interpreted as representing official policies, either expressed
	or implied, of Gary Court or the JSON Schema specification.