/**
 * JSV: JSON Schema Validator
 * 
 * @fileOverview A JavaScript implementation of a extendable, fully compliant JSON Schema validator.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 4.0.2
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */

var exports = exports || this,
	require = require || function () {
		return exports;
	};

(function () {
	
	var URI = require("./uri/uri").URI,
		O = {},
		I2H = "0123456789abcdef".split(""),
		mapArray, filterArray, searchArray,
		
		JSV;
	
	//
	// Utility functions
	//
	
	function typeOf(o) {
		return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
	}
	
	/** @inner */
	function F() {}
	
	function createObject(proto) {
		F.prototype = proto || {};
		return new F();
	}
	
	function mapObject(obj, func, scope) {
		var newObj = {}, key;
		for (key in obj) {
			if (obj[key] !== O[key]) {
				newObj[key] = func.call(scope, obj[key], key, obj);
			}
		}
		return newObj;
	}
	
	/** @ignore */
	mapArray = function (arr, func, scope) {
		var x = 0, xl = arr.length, newArr = new Array(xl);
		for (; x < xl; ++x) {
			newArr[x] = func.call(scope, arr[x], x, arr);
		}
		return newArr;
	};
		
	if (Array.prototype.map) {
		/** @ignore */
		mapArray = function (arr, func, scope) {
			return Array.prototype.map.call(arr, func, scope);
		};
	}
	
	/** @ignore */
	filterArray = function (arr, func, scope) {
		var x = 0, xl = arr.length, newArr = [];
		for (; x < xl; ++x) {
			if (func.call(scope, arr[x], x, arr)) {
				newArr[newArr.length] = arr[x];
			}
		}
		return newArr;
	};
	
	if (Array.prototype.filter) {
		/** @ignore */
		filterArray = function (arr, func, scope) {
			return Array.prototype.filter.call(arr, func, scope);
		};
	}
	
	/** @ignore */
	searchArray = function (arr, o) {
		var x = 0, xl = arr.length;
		for (; x < xl; ++x) {
			if (arr[x] === o) {
				return x;
			}
		}
		return -1;
	};
	
	if (Array.prototype.indexOf) {
		/** @ignore */
		searchArray = function (arr, o) {
			return Array.prototype.indexOf.call(arr, o);
		};
	}
	
	function toArray(o) {
		return o !== undefined && o !== null ? (o instanceof Array && !o.callee ? o : (typeof o.length !== "number" || o.split || o.setInterval || o.call ? [ o ] : Array.prototype.slice.call(o))) : [];
	}
	
	function keys(o) {
		var result = [], key;
		
		switch (typeOf(o)) {
		case "object":
			for (key in o) {
				if (o[key] !== O[key]) {
					result[result.length] = key;
				}
			}
			break;
		case "array":
			for (key = o.length - 1; key >= 0; --key) {
				result[key] = key;
			}
			break;
		}
		
		return result;
	}
	
	function pushUnique(arr, o) {
		if (searchArray(arr, o) === -1) {
			arr.push(o);
		}
		return arr;
	}
	
	function popFirst(arr, o) {
		var index = searchArray(arr, o);
		if (index > -1) {
			arr.splice(index, 1);
		}
		return arr;
	}
	
	function randomUUID() {
		return [
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-4",  //set 4 high bits of time_high field to version
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[(Math.floor(Math.random() * 0x10) & 0x3) | 0x8],  //specify 2 high bits of clock sequence
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)]
		].join("");
	}
	
	function escapeURIComponent(str) {
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
	}
	
	function formatURI(uri) {
		if (typeof uri === "string" && uri.indexOf("#") === -1) {
			uri += "#";
		}
		return uri;
	}
	
	function stripInstances(o) {
		if (o instanceof JSONInstance) {
			return o.getURI();
		}
		
		switch (typeOf(o)) {
		case "undefined":
		case "null":
		case "boolean":
		case "number":
		case "string":
			return o;  //do nothing
		
		case "object":
			return mapObject(o, stripInstances);
		
		case "array":
			return mapArray(o, stripInstances);
		
		default:
			return o.toString();
		}
	}
	
	/**
	 * The exception that is thrown when a schema fails to be created.
	 * 
	 * @name InitializationError
	 * @class
	 * @param {JSONInstance|String} instance The instance (or instance URI) that is invalid
	 * @param {JSONSchema|String} schema The schema (or schema URI) that was validating the instance
	 * @param {String} attr The attribute that failed to validated
	 * @param {String} message A user-friendly message on why the schema attribute failed to validate the instance
	 * @param {Any} details The value of the schema attribute
	 */
	
	function InitializationError(instance, schema, attr, message, details) {
		Error.call(this, message);
		
		this.uri = instance instanceof JSONInstance ? instance.getURI() : instance;
		this.schemaUri = schema instanceof JSONInstance ? schema.getURI() : schema;
		this.attribute = attr;
		this.message = message;
		this.description = message;  //IE
		this.details = details;
	}
	
	InitializationError.prototype = new Error();
	InitializationError.prototype.constructor = InitializationError;
	InitializationError.prototype.name = "InitializationError";
	
	/**
	 * Defines an error, found by a schema, with an instance.
	 * This class can only be instantiated by {@link Report#addError}. 
	 * 
	 * @name ValidationError
	 * @class
	 * @see Report#addError
	 */
	
	/**
	 * The URI of the instance that has the error.
	 * 
	 * @name ValidationError.prototype.uri
	 * @type String
	 */
	
	/**
	 * The URI of the schema that generated the error.
	 * 
	 * @name ValidationError.prototype.schemaUri
	 * @type String
	 */
	
	/**
	 * The name of the schema attribute that generated the error.
	 * 
	 * @name ValidationError.prototype.attribute
	 * @type String
	 */
	
	/**
	 * An user-friendly (English) message about what failed to validate.
	 * 
	 * @name ValidationError.prototype.message
	 * @type String
	 */
	
	/**
	 * The value of the schema attribute that generated the error.
	 * 
	 * @name ValidationError.prototype.details
	 * @type Any
	 */
	
	/**
	 * Reports are returned from validation methods to describe the result of a validation.
	 * 
	 * @name Report
	 * @class
	 * @see JSONSchema#validate
	 * @see Environment#validate
	 */
	
	function Report() {
		/**
		 * An array of {@link ValidationError} objects that define all the errors generated by the schema against the instance.
		 * 
		 * @name Report.prototype.errors
		 * @type Array
		 * @see Report#addError
		 */
		this.errors = [];
		
		/**
		 * A hash table of every instance and what schemas were validated against it.
		 * <p>
		 * The key of each item in the table is the URI of the instance that was validated.
		 * The value of this key is an array of strings of URIs of the schema that validated it.
		 * </p>
		 * 
		 * @name Report.prototype.validated
		 * @type Object
		 * @see Report#registerValidation
		 * @see Report#isValidatedBy
		 */
		this.validated = {};
		
		/**
		 * If the report is generated by {@link Environment#validate}, this field is the generated instance.
		 * 
		 * @name Report.prototype.instance
		 * @type JSONInstance
		 * @see Environment#validate
		 */
		
		/**
		 * If the report is generated by {@link Environment#validate}, this field is the generated schema.
		 * 
		 * @name Report.prototype.schema
		 * @type JSONSchema
		 * @see Environment#validate
		 */
		 
		/**
		 * If the report is generated by {@link Environment#validate}, this field is the schema's schema.
		 * This value is the same as calling <code>schema.getSchema()</code>.
		 * 
		 * @name Report.prototype.schemaSchema
		 * @type JSONSchema
		 * @see Environment#validate
		 * @see JSONSchema#getSchema
		 */
	}
	
	/**
	 * Adds a {@link ValidationError} object to the <a href="#errors"><code>errors</code></a> field.
	 * 
	 * @param {JSONInstance|String} instance The instance (or instance URI) that is invalid
	 * @param {JSONSchema|String} schema The schema (or schema URI) that was validating the instance
	 * @param {String} attr The attribute that failed to validated
	 * @param {String} message A user-friendly message on why the schema attribute failed to validate the instance
	 * @param {Any} details The value of the schema attribute
	 */
	
	Report.prototype.addError = function (instance, schema, attr, message, details) {
		this.errors.push({
			uri : instance instanceof JSONInstance ? instance.getURI() : instance,
			schemaUri : schema instanceof JSONInstance ? schema.getURI() : schema,
			attribute : attr,
			message : message,
			details : stripInstances(details)
		});
	};
	
	/**
	 * Registers that the provided instance URI has been validated by the provided schema URI. 
	 * This is recorded in the <a href="#validated"><code>validated</code></a> field.
	 * 
	 * @param {String} uri The URI of the instance that was validated
	 * @param {String} schemaUri The URI of the schema that validated the instance
	 */
	
	Report.prototype.registerValidation = function (uri, schemaUri) {
		if (!this.validated[uri]) {
			this.validated[uri] = [ schemaUri ];
		} else {
			this.validated[uri].push(schemaUri);
		}
	};
	
	/**
	 * Returns if an instance with the provided URI has been validated by the schema with the provided URI. 
	 * 
	 * @param {String} uri The URI of the instance
	 * @param {String} schemaUri The URI of a schema
	 * @returns {Boolean} If the instance has been validated by the schema.
	 */
	
	Report.prototype.isValidatedBy = function (uri, schemaUri) {
		return !!this.validated[uri] && searchArray(this.validated[uri], schemaUri) !== -1;
	};
	
	/**
	 * A wrapper class for binding an Environment, URI and helper methods to an instance. 
	 * This class is most commonly instantiated with {@link Environment#createInstance}.
	 * 
	 * @name JSONInstance
	 * @class
	 * @param {Environment} env The environment this instance belongs to
	 * @param {JSONInstance|Any} json The value of the instance
	 * @param {String} [uri] The URI of the instance. If undefined, the URI will be a randomly generated UUID. 
	 * @param {String} [fd] The fragment delimiter for properties. If undefined, uses the environment default.
	 */
	
	function JSONInstance(env, json, uri, fd) {
		if (json instanceof JSONInstance) {
			if (typeof fd !== "string") {
				fd = json._fd;
			}
			if (typeof uri !== "string") {
				uri = json._uri;
			}
			json = json._value;
		}
		
		if (typeof uri !== "string") {
			uri = "urn:uuid:" + randomUUID() + "#";
		} else if (uri.indexOf(":") === -1) {
			uri = formatURI(URI.resolve("urn:uuid:" + randomUUID() + "#", uri));
		}
		
		this._env = env;
		this._value = json;
		this._uri = uri;
		this._fd = fd || this._env._options["defaultFragmentDelimiter"];
	}
	
	/**
	 * Returns the environment the instance is bound to.
	 * 
	 * @returns {Environment} The environment of the instance
	 */
	
	JSONInstance.prototype.getEnvironment = function () {
		return this._env;
	};
	
	/**
	 * Returns the name of the type of the instance.
	 * 
	 * @returns {String} The name of the type of the instance
	 */
	
	JSONInstance.prototype.getType = function () {
		return typeOf(this._value);
	};
	
	/**
	 * Returns the JSON value of the instance.
	 * 
	 * @returns {Any} The actual JavaScript value of the instance
	 */
	
	JSONInstance.prototype.getValue = function () {
		return this._value;
	};
	
	/**
	 * Returns the URI of the instance.
	 * 
	 * @returns {String} The URI of the instance
	 */
	
	JSONInstance.prototype.getURI = function () {
		return this._uri;
	};
	
	/**
	 * Returns a resolved URI of a provided relative URI against the URI of the instance.
	 * 
	 * @param {String} uri The relative URI to resolve
	 * @returns {String} The resolved URI
	 */
	
	JSONInstance.prototype.resolveURI = function (uri) {
		return formatURI(URI.resolve(this._uri, uri));
	};
	
	/**
	 * Returns an array of the names of all the properties.
	 * 
	 * @returns {Array} An array of strings which are the names of all the properties
	 */
	
	JSONInstance.prototype.getPropertyNames = function () {
		return keys(this._value);
	};
	
	/**
	 * Returns a {@link JSONInstance} of the value of the provided property name. 
	 * 
	 * @param {String} key The name of the property to fetch
	 * @returns {JSONInstance} The instance of the property value
	 */
	
	JSONInstance.prototype.getProperty = function (key) {
		var value = this._value ? this._value[key] : undefined;
		if (value instanceof JSONInstance) {
			return value;
		}
		//else
		return new JSONInstance(this._env, value, this._uri + this._fd + escapeURIComponent(key), this._fd);
	};
	
	/**
	 * Returns all the property instances of the target instance.
	 * <p>
	 * If the target instance is an Object, then the method will return a hash table of {@link JSONInstance}s of all the properties. 
	 * If the target instance is an Array, then the method will return an array of {@link JSONInstance}s of all the items.
	 * </p> 
	 * 
	 * @returns {Object|Array|undefined} The list of instances for all the properties
	 */
	
	JSONInstance.prototype.getProperties = function () {
		var type = typeOf(this._value),
			self = this;
		
		if (type === "object") {
			return mapObject(this._value, function (value, key) {
				if (value instanceof JSONInstance) {
					return value;
				}
				return new JSONInstance(self._env, value, self._uri + self._fd + escapeURIComponent(key), self._fd);
			});
		} else if (type === "array") {
			return mapArray(this._value, function (value, key) {
				if (value instanceof JSONInstance) {
					return value;
				}
				return new JSONInstance(self._env, value, self._uri + self._fd + escapeURIComponent(key), self._fd);
			});
		}
	};
	
	/**
	 * Returns the JSON value of the provided property name. 
	 * This method is a faster version of calling <code>instance.getProperty(key).getValue()</code>.
	 * 
	 * @param {String} key The name of the property
	 * @returns {Any} The JavaScript value of the instance
	 * @see JSONInstance#getProperty
	 * @see JSONInstance#getValue
	 */
	
	JSONInstance.prototype.getValueOfProperty = function (key) {
		if (this._value) {
			if (this._value[key] instanceof JSONInstance) {
				return this._value[key]._value;
			}
			return this._value[key];
		}
	};
	
	/**
	 * Return if the provided value is the same as the value of the instance.
	 * 
	 * @param {JSONInstance|Any} instance The value to compare
	 * @returns {Boolean} If both the instance and the value match
	 */
	
	JSONInstance.prototype.equals = function (instance) {
		if (instance instanceof JSONInstance) {
			return this._value === instance._value;
		}
		//else
		return this._value === instance;
	};
	
	/**
	 * Warning: Not a generic clone function
	 * Produces a JSV acceptable clone
	 */
	
	function clone(obj, deep) {
		var newObj, x;
		
		if (obj instanceof JSONInstance) {
			obj = obj.getValue();
		}
		
		switch (typeOf(obj)) {
		case "object":
			if (deep) {
				newObj = {};
				for (x in obj) {
					if (obj[x] !== O[x]) {
						newObj[x] = clone(obj[x], deep);
					}
				}
				return newObj;
			} else {
				return createObject(obj);
			}
			break;
		case "array":
			if (deep) {
				newObj = new Array(obj.length);
				x = obj.length;
				while (--x >= 0) {
					newObj[x] = clone(obj[x], deep);
				}
				return newObj;
			} else {
				return Array.prototype.slice.call(obj);
			}
			break;
		default:
			return obj;
		}
	}
	
	/**
	 * This class binds a {@link JSONInstance} with a {@link JSONSchema} to provided context aware methods. 
	 * 
	 * @name JSONSchema
	 * @class
	 * @param {Environment} env The environment this schema belongs to
	 * @param {JSONInstance|Any} json The value of the schema
	 * @param {String} [uri] The URI of the schema. If undefined, the URI will be a randomly generated UUID. 
	 * @param {JSONSchema|Boolean} [schema] The schema to bind to the instance. If <code>undefined</code>, the environment's default schema will be used. If <code>true</code>, the instance's schema will be itself.
	 * @extends JSONInstance
	 */
	
	function JSONSchema(env, json, uri, schema) {
		var fr;
		JSONInstance.call(this, env, json, uri);
		
		if (schema === true) {
			this._schema = this;
		} else if (json instanceof JSONSchema && !(schema instanceof JSONSchema)) {
			this._schema = json._schema;  //TODO: Make sure cross environments don't mess everything up
		} else {
			this._schema = schema instanceof JSONSchema ? schema : this._env.getDefaultSchema() || this._env.createEmptySchema();
		}
		
		//determine fragment delimiter from schema
		fr = this._schema.getValueOfProperty("fragmentResolution");
		if (fr === "dot-delimited") {
			this._fd = ".";
		} else if (fr === "slash-delimited") {
			this._fd = "/";
		}
		
		return this.rebuild();  //this works even when called with "new"
	}
	
	JSONSchema.prototype = createObject(JSONInstance.prototype);
	
	/**
	 * Returns the schema of the schema.
	 * 
	 * @returns {JSONSchema} The schema of the schema
	 */
	
	JSONSchema.prototype.getSchema = function () {
		var uri = this._refs && this._refs["describedby"],
			newSchema;
		
		if (uri) {
			newSchema = uri && this._env.findSchema(uri);
			
			if (newSchema) {
				if (!newSchema.equals(this._schema)) {
					this._schema = newSchema;
					this.rebuild();  //if the schema has changed, the context has changed - so everything must be rebuilt
				}
			} else if (this._env._options["enforceReferences"]) {
				throw new InitializationError(this, this._schema, "{describedby}", "Unknown schema reference", uri);
			}
		}
		
		return this._schema;
	};
	
	/**
	 * Returns the value of the provided attribute name.
	 * <p>
	 * This method is different from {@link JSONInstance#getProperty} as the named property 
	 * is converted using a parser defined by the schema's schema before being returned. This
	 * makes the return value of this method attribute dependent.
	 * </p>
	 * 
	 * @param {String} key The name of the attribute
	 * @param {Any} [arg] Some attribute parsers accept special arguments for returning resolved values. This is attribute dependent.
	 * @returns {JSONSchema|Any} The value of the attribute
	 */
	
	JSONSchema.prototype.getAttribute = function (key, arg) {
		var schemaProperty, parser, property, result,
			schema = this.getSchema();  //we do this here to make sure the "describedby" reference has not changed, and that the attribute cache is up-to-date
		
		if (!arg && this._attributes && this._attributes.hasOwnProperty(key)) {
			return this._attributes[key];
		}
		
		schemaProperty = schema.getProperty("properties").getProperty(key);
		parser = schemaProperty.getValueOfProperty("parser");
		property = this.getProperty(key);
		if (typeof parser === "function") {
			result = parser(property, schemaProperty, arg);
			if (!arg && this._attributes) {
				this._attributes[key] = result;
			}
			return result;
		}
		//else
		return property.getValue();
	};
	
	/**
	 * Returns all the attributes of the schema.
	 * 
	 * @returns {Object} A map of all parsed attribute values
	 */
	
	JSONSchema.prototype.getAttributes = function () {
		var properties, schemaProperties, key, schemaProperty, parser,
			schema = this.getSchema();  //we do this here to make sure the "describedby" reference has not changed, and that the attribute cache is up-to-date
		
		if (!this._attributes && this.getType() === "object") {
			properties = this.getProperties();
			schemaProperties = schema.getProperty("properties");
			this._attributes = {};
			for (key in properties) {
				if (properties[key] !== O[key]) {
					schemaProperty = schemaProperties && schemaProperties.getProperty(key);
					parser = schemaProperty && schemaProperty.getValueOfProperty("parser");
					if (typeof parser === "function") {
						this._attributes[key] = parser(properties[key], schemaProperty);
					} else {
						this._attributes[key] = properties[key].getValue();
					}
				}
			}
		}
		
		return clone(this._attributes, false);
	};
	
	/**
	 * Convenience method for retrieving a link or link object from a schema. 
	 * This method is the same as calling <code>schema.getAttribute("links", [rel, instance])[0];</code>.
	 * 
	 * @param {String} rel The link relationship
	 * @param {JSONInstance} [instance] The instance to resolve any URIs from
	 * @returns {String|Object|undefined} If <code>instance</code> is provided, a string containing the resolve URI of the link is returned.
	 *   If <code>instance</code> is not provided, a link object is returned with details of the link.
	 *   If no link with the provided relationship exists, <code>undefined</code> is returned.
	 * @see JSONSchema#getAttribute
	 */
	
	JSONSchema.prototype.getLink = function (rel, instance) {
		var schemaLinks = this.getAttribute("links", [rel, instance]);
		if (schemaLinks && schemaLinks.length && schemaLinks[schemaLinks.length - 1]) {
			return schemaLinks[schemaLinks.length - 1];
		}
	};
	
	/**
	 * Validates the provided instance against the target schema and returns a {@link Report}.
	 * 
	 * @param {JSONInstance|Any} instance The instance to validate; may be a {@link JSONInstance} or any JavaScript value
	 * @param {Report} [report] A {@link Report} to concatenate the result of the validation to. If <code>undefined</code>, a new {@link Report} is created. 
	 * @param {JSONInstance} [parent] The parent/containing instance of the provided instance
	 * @param {JSONSchema} [parentSchema] The schema of the parent/containing instance
	 * @param {String} [name] The name of the parent object's property that references the instance
	 * @returns {Report} The result of the validation
	 */
	
	JSONSchema.prototype.validate = function (instance, report, parent, parentSchema, name) {
		var schemaSchema = this.getSchema(),
			validator = schemaSchema.getValueOfProperty("validator");
		
		if (!(instance instanceof JSONInstance)) {
			instance = this.getEnvironment().createInstance(instance);
		}
		
		if (!(report instanceof Report)) {
			report = new Report();
		}
		
		if (this._env._options["validateReferences"] && this._refs) {
			if (this._refs["describedby"] && !this._env.findSchema(this._refs["describedby"])) {
				report.addError(this, this._schema, "{describedby}", "Unknown schema reference", this._refs["describedby"]);
			}
			if (this._refs["full"] && !this._env.findSchema(this._refs["full"])) {
				report.addError(this, this._schema, "{full}", "Unknown schema reference", this._refs["full"]);
			}
		}
		
		if (typeof validator === "function" && !report.isValidatedBy(instance.getURI(), this.getURI())) {
			report.registerValidation(instance.getURI(), this.getURI());
			validator(instance, this, schemaSchema, report, parent, parentSchema, name);
		}
		
		return report;
	};
	
	/** @inner */
	function createFullLookupWrapper(func) {
		return /** @inner */ function fullLookupWrapper() {
			var scope = this,
				stack = [],
				uri = scope._refs && scope._refs["full"],
				schema;
			
			while (uri) {
				schema = scope._env.findSchema(uri);
				if (schema) {
					if (schema._value === scope._value) {
						break;
					}
					scope = schema;
					stack.push(uri);
					uri = scope._refs && scope._refs["full"];
					if (stack.indexOf(uri) > -1) {
						break;  //stop infinite loop
					}
				} else if (scope._env._options["enforceReferences"]) {
					throw new InitializationError(scope, scope._schema, "{full}", "Unknown schema reference", uri);
				} else {
					uri = null;
				}
			}
			return func.apply(scope, arguments);
		};
	}
	
	/**
	 * Wraps all JSONInstance methods with a function that resolves the "full" reference.
	 * 
	 * @inner
	 */
	
	(function () {
		var key;
		for (key in JSONSchema.prototype) {
			if (JSONSchema.prototype[key] !== O[key] && typeOf(JSONSchema.prototype[key]) === "function") {
				JSONSchema.prototype[key] = createFullLookupWrapper(JSONSchema.prototype[key]);
			}
		}
	}());
	
	/**
	 * Reinitializes/re-registers/rebuilds the schema.
	 * <br/>
	 * This is used internally, and should only be called when a schema's private variables are modified directly.
	 * 
	 * @private
	 * @return {JSONSchema} The newly rebuilt schema
	 */
	
	JSONSchema.prototype.rebuild = function () {
		var instance = this,
			initializer = instance.getSchema().getValueOfProperty("initializer");
		
		//clear previous built values
		instance._refs = null;
		instance._attributes = null;
		
		if (typeof initializer === "function") {
			instance = initializer(instance);
		}
		
		//register schema
		instance._env._schemas[instance._uri] = instance;
		
		//build & cache the rest of the schema
		instance.getAttributes();
		
		return instance;
	};
	
	/**
	 * Set the provided reference to the given value.
	 * <br/>
	 * References are used for establishing soft-links to other {@link JSONSchema}s.
	 * Currently, the following references are natively supported:
	 * <dl>
	 *   <dt><code>full</code></dt>
	 *   <dd>The value is the URI to the full instance of this instance.</dd>
	 *   <dt><code>describedby</code></dt>
	 *   <dd>The value is the URI to the schema of this instance.</dd>
	 * </dl>
	 * 
	 * @param {String} name The name of the reference
	 * @param {String} uri The URI of the schema to refer to
	 */
	
	JSONSchema.prototype.setReference = function (name, uri) {
		if (!this._refs) {
			this._refs = {};
		}
		this._refs[name] = this.resolveURI(uri);
	};
	
	/**
	 * Returns the value of the provided reference name.
	 * 
	 * @param {String} name The name of the reference
	 * @return {String} The value of the provided reference name
	 */
	
	JSONSchema.prototype.getReference = function (name) {
		return this._refs && this._refs[name];
	};
	
	/**
	 * Merges two schemas/instances together.
	 */
	
	function inherits(base, extra, extension) {
		var baseType = typeOf(base),
			extraType = typeOf(extra),
			child, x;
		
		if (extraType === "undefined") {
			return clone(base, true);
		} else if (baseType === "undefined" || extraType !== baseType) {
			return clone(extra, true);
		} else if (extraType === "object") {
			if (base instanceof JSONSchema) {
				base = base.getAttributes();
			}
			if (extra instanceof JSONSchema) {
				extra = extra.getAttributes();
				if (extra["extends"] && extension && extra["extends"] instanceof JSONSchema) {
					extra["extends"] = [ extra["extends"] ];
				}
			}
			child = clone(base, true);  //this could be optimized as some properties get overwritten
			for (x in extra) {
				if (extra[x] !== O[x]) {
					child[x] = inherits(base[x], extra[x], extension);
				}
			}
			return child;
		} else {
			return clone(extra, true);
		}
	}
	
	/**
	 * An Environment is a sandbox of schemas thats behavior is different from other environments.
	 * 
	 * @name Environment
	 * @class
	 */
	
	function Environment() {
		this._id = randomUUID();
		this._schemas = {};
		this._options = {};
		
		this.createSchema({}, true, "urn:jsv:empty-schema#");
	}
	
	/**
	 * Returns a clone of the target environment.
	 * 
	 * @returns {Environment} A new {@link Environment} that is a exact copy of the target environment 
	 */
	
	Environment.prototype.clone = function () {
		var env = new Environment();
		env._schemas = createObject(this._schemas);
		env._options = createObject(this._options);
		
		return env;
	};
	
	/**
	 * Returns a new {@link JSONInstance} of the provided data.
	 * 
	 * @param {JSONInstance|Any} data The value of the instance
	 * @param {String} [uri] The URI of the instance. If undefined, the URI will be a randomly generated UUID. 
	 * @returns {JSONInstance} A new {@link JSONInstance} from the provided data
	 */
	
	Environment.prototype.createInstance = function (data, uri) {
		uri = formatURI(uri);
		
		if (data instanceof JSONInstance && (!uri || data.getURI() === uri)) {
			return data;
		}

		return new JSONInstance(this, data, uri);
	};
	
	/**
	 * Creates a new {@link JSONSchema} from the provided data, and registers it with the environment. 
	 * 
	 * @param {JSONInstance|Any} data The value of the schema
	 * @param {JSONSchema|Boolean} [schema] The schema to bind to the instance. If <code>undefined</code>, the environment's default schema will be used. If <code>true</code>, the instance's schema will be itself.
	 * @param {String} [uri] The URI of the schema. If undefined, the URI will be a randomly generated UUID. 
	 * @returns {JSONSchema} A new {@link JSONSchema} from the provided data
	 * @throws {InitializationError} If a schema that is not registered with the environment is referenced 
	 */
	
	Environment.prototype.createSchema = function (data, schema, uri) {
		uri = formatURI(uri);
		
		if (data instanceof JSONSchema && (!uri || data._uri === uri) && (!schema || data.getSchema().equals(schema))) {
			return data;
		}
		
		return new JSONSchema(this, data, uri, schema);
	};
	
	/**
	 * Creates an empty schema.
	 * 
	 * @returns {JSONSchema} The empty schema, who's schema is itself.
	 */
	
	Environment.prototype.createEmptySchema = function () {
		return this._schemas["urn:jsv:empty-schema#"];
	};
	
	/**
	 * Returns the schema registered with the provided URI.
	 * 
	 * @param {String} uri The absolute URI of the required schema
	 * @returns {JSONSchema|undefined} The request schema, or <code>undefined</code> if not found
	 */
	
	Environment.prototype.findSchema = function (uri) {
		return this._schemas[formatURI(uri)];
	};
	
	/**
	 * Sets the specified environment option to the specified value.
	 * 
	 * @param {String} name The name of the environment option to set
	 * @param {Any} value The new value of the environment option
	 */
	
	Environment.prototype.setOption = function (name, value) {
		this._options[name] = value;
	};
	
	/**
	 * Returns the specified environment option.
	 * 
	 * @param {String} name The name of the environment option to set
	 * @returns {Any} The value of the environment option
	 */
	
	Environment.prototype.getOption = function (name) {
		return this._options[name];
	};
	
	/**
	 * Sets the default fragment delimiter of the environment.
	 * 
	 * @deprecated Use {@link Environment#setOption} with option "defaultFragmentDelimiter"
	 * @param {String} fd The fragment delimiter character
	 */
	
	Environment.prototype.setDefaultFragmentDelimiter = function (fd) {
		if (typeof fd === "string" && fd.length > 0) {
			this._options["defaultFragmentDelimiter"] = fd;
		}
	};
	
	/**
	 * Returns the default fragment delimiter of the environment.
	 * 
	 * @deprecated Use {@link Environment#getOption} with option "defaultFragmentDelimiter"
	 * @returns {String} The fragment delimiter character
	 */
	
	Environment.prototype.getDefaultFragmentDelimiter = function () {
		return this._options["defaultFragmentDelimiter"];
	};
	
	/**
	 * Sets the URI of the default schema for the environment.
	 * 
	 * @deprecated Use {@link Environment#setOption} with option "defaultSchemaURI"
	 * @param {String} uri The default schema URI
	 */
	
	Environment.prototype.setDefaultSchemaURI = function (uri) {
		if (typeof uri === "string") {
			this._options["defaultSchemaURI"] = formatURI(uri);
		}
	};
	
	/**
	 * Returns the default schema of the environment.
	 * 
	 * @returns {JSONSchema} The default schema
	 */
	
	Environment.prototype.getDefaultSchema = function () {
		return this.findSchema(this._options["defaultSchemaURI"]);
	};
	
	/**
	 * Validates both the provided schema and the provided instance, and returns a {@link Report}. 
	 * If the schema fails to validate, the instance will not be validated.
	 * 
	 * @param {JSONInstance|Any} instanceJSON The {@link JSONInstance} or JavaScript value to validate.
	 * @param {JSONSchema|Any} schemaJSON The {@link JSONSchema} or JavaScript value to use in the validation. This will also be validated againt the schema's schema.
	 * @returns {Report} The result of the validation
	 */
	
	Environment.prototype.validate = function (instanceJSON, schemaJSON) {
		var instance,
			schema,
			schemaSchema,
			report = new Report();
		
		try {
			instance = this.createInstance(instanceJSON);
			report.instance = instance;
		} catch (e) {
			report.addError(e.uri, e.schemaUri, e.attribute, e.message, e.details);
		}
		
		try {
			schema = this.createSchema(schemaJSON);
			report.schema = schema;
			
			schemaSchema = schema.getSchema();
			report.schemaSchema = schemaSchema;
		} catch (f) {
			report.addError(f.uri, f.schemaUri, f.attribute, f.message, f.details);
		}
		
		if (schemaSchema) {
			schemaSchema.validate(schema, report);
		}
			
		if (report.errors.length) {
			return report;
		}
		
		return schema.validate(instance, report);
	};
	
	/**
	 * @private
	 */
	
	Environment.prototype._checkForInvalidInstances = function (stackSize, schemaURI) {
		var result = [],
			stack = [
				[schemaURI, this._schemas[schemaURI]]
			], 
			counter = 0,
			item, uri, instance, properties, key;
		
		while (counter++ < stackSize && stack.length) {
			item = stack.shift();
			uri = item[0];
			instance = item[1];
			
			if (instance instanceof JSONSchema) {
				if (this._schemas[instance._uri] !== instance) {
					result.push("Instance " + uri + " does not match " + instance._uri);
				} else {
					//schema = instance.getSchema();
					//stack.push([uri + "/{schema}", schema]);
					
					properties = instance.getAttributes();
					for (key in properties) {
						if (properties[key] !== O[key]) {
							stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
						}
					}
				}
			} else if (typeOf(instance) === "object") {
				properties = instance;
				for (key in properties) {
					if (properties.hasOwnProperty(key)) {
						stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
					}
				}
			} else if (typeOf(instance) === "array") {
				properties = instance;
				for (key = 0; key < properties.length; ++key) {
					stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
				}
			}
		}
		
		return result.length ? result : counter;
	};
	
	/**
	 * A globaly accessible object that provides the ability to create and manage {@link Environments},
	 * as well as providing utility methods.
	 * 
	 * @namespace
	 */
	
	JSV = {
		_environments : {},
		_defaultEnvironmentID : "",
		
		/**
		 * Returns if the provide value is an instance of {@link JSONInstance}.
		 * 
		 * @param o The value to test
		 * @returns {Boolean} If the provide value is an instance of {@link JSONInstance}
		 */
		
		isJSONInstance : function (o) {
			return o instanceof JSONInstance;
		},
		
		/**
		 * Returns if the provide value is an instance of {@link JSONSchema}.
		 * 
		 * @param o The value to test
		 * @returns {Boolean} If the provide value is an instance of {@link JSONSchema}
		 */
		
		isJSONSchema : function (o) {
			return o instanceof JSONSchema;
		},
		
		/**
		 * Creates and returns a new {@link Environment} that is a clone of the environment registered with the provided ID.
		 * If no environment ID is provided, the default environment is cloned.
		 * 
		 * @param {String} [id] The ID of the environment to clone. If <code>undefined</code>, the default environment ID is used.
		 * @returns {Environment} A newly cloned {@link Environment}
		 * @throws {Error} If there is no environment registered with the provided ID
		 */
		
		createEnvironment : function (id) {
			id = id || this._defaultEnvironmentID;
			
			if (!this._environments[id]) {
				throw new Error("Unknown Environment ID");
			}
			//else
			return this._environments[id].clone();
		},
		
		Environment : Environment,
		
		/**
		 * Registers the provided {@link Environment} with the provided ID.
		 * 
		 * @param {String} id The ID of the environment
		 * @param {Environment} env The environment to register
		 */
		
		registerEnvironment : function (id, env) {
			id = id || (env || 0)._id;
			if (id && !this._environments[id] && env instanceof Environment) {
				env._id = id;
				this._environments[id] = env;
			}
		},
		
		/**
		 * Sets which registered ID is the default environment.
		 * 
		 * @param {String} id The ID of the registered environment that is default
		 * @throws {Error} If there is no registered environment with the provided ID
		 */
		
		setDefaultEnvironmentID : function (id) {
			if (typeof id === "string") {
				if (!this._environments[id]) {
					throw new Error("Unknown Environment ID");
				}
				
				this._defaultEnvironmentID = id;
			}
		},
		
		/**
		 * Returns the ID of the default environment.
		 * 
		 * @returns {String} The ID of the default environment
		 */
		
		getDefaultEnvironmentID : function () {
			return this._defaultEnvironmentID;
		},
		
		//
		// Utility Functions
		//
		
		/**
		 * Returns the name of the type of the provided value.
		 *
		 * @event //utility
		 * @param {Any} o The value to determine the type of
		 * @returns {String} The name of the type of the value
		 */
		typeOf : typeOf,
		
		/**
		 * Return a new object that inherits all of the properties of the provided object.
		 *
		 * @event //utility
		 * @param {Object} proto The prototype of the new object
		 * @returns {Object} A new object that inherits all of the properties of the provided object
		 */
		createObject : createObject,
		
		/**
		 * Returns a new object with each property transformed by the iterator.
		 *
		 * @event //utility
		 * @param {Object} obj The object to transform
		 * @param {Function} iterator A function that returns the new value of the provided property
		 * @param {Object} [scope] The value of <code>this</code> in the iterator
		 * @returns {Object} A new object with each property transformed
		 */
		mapObject : mapObject,
		
		/**
		 * Returns a new array with each item transformed by the iterator.
		 * 
		 * @event //utility
		 * @param {Array} arr The array to transform
		 * @param {Function} iterator A function that returns the new value of the provided item
		 * @param {Object} scope The value of <code>this</code> in the iterator
		 * @returns {Array} A new array with each item transformed
		 */
		mapArray : mapArray,
		
		/**
		 * Returns a new array that only contains the items allowed by the iterator.
		 *
		 * @event //utility
		 * @param {Array} arr The array to filter
		 * @param {Function} iterator The function that returns true if the provided property should be added to the array
		 * @param {Object} scope The value of <code>this</code> within the iterator
		 * @returns {Array} A new array that contains the items allowed by the iterator
		 */
		filterArray : filterArray,
		
		/**
		 * Returns the first index in the array that the provided item is located at.
		 *
		 * @event //utility
		 * @param {Array} arr The array to search
		 * @param {Any} o The item being searched for
		 * @returns {Number} The index of the item in the array, or <code>-1</code> if not found
		 */
		searchArray : searchArray,
			
		/**
		 * Returns an array representation of a value.
		 * <ul>
		 * <li>For array-like objects, the value will be casted as an Array type.</li>
		 * <li>If an array is provided, the function will simply return the same array.</li>
		 * <li>For a null or undefined value, the result will be an empty Array.</li>
		 * <li>For all other values, the value will be the first element in a new Array. </li>
		 * </ul>
		 *
		 * @event //utility
		 * @param {Any} o The value to convert into an array
		 * @returns {Array} The value as an array
		 */
		toArray : toArray,
		
		/**
		 * Returns an array of the names of all properties of an object.
		 * 
		 * @event //utility
		 * @param {Object|Array} o The object in question
		 * @returns {Array} The names of all properties
		 */
		keys : keys,
		
		/**
		 * Mutates the array by pushing the provided value onto the array only if it is not already there.
		 *
		 * @event //utility
		 * @param {Array} arr The array to modify
		 * @param {Any} o The object to add to the array if it is not already there
		 * @returns {Array} The provided array for chaining
		 */
		pushUnique : pushUnique,
		
		/**
		 * Mutates the array by removing the first item that matches the provided value in the array.
		 *
		 * @event //utility
		 * @param {Array} arr The array to modify
		 * @param {Any} o The object to remove from the array
		 * @returns {Array} The provided array for chaining
		 */
		popFirst : popFirst,
		
		/**
		 * Creates a copy of the target object.
		 * <p>
		 * This method will create a new instance of the target, and then mixin the properties of the target.
		 * If <code>deep</code> is <code>true</code>, then each property will be cloned before mixin.
		 * </p>
		 * <p><b>Warning</b>: This is not a generic clone function, as it will only properly clone objects and arrays.</p>
		 * 
		 * @event //utility
		 * @param {Any} o The value to clone 
		 * @param {Boolean} [deep=false] If each property should be recursively cloned
		 * @returns A cloned copy of the provided value
		 */
		clone : clone,
		
		/**
		 * Generates a pseudo-random UUID.
		 * 
		 * @event //utility
		 * @returns {String} A new universally unique ID
		 */
		randomUUID : randomUUID,
		
		/**
		 * Properly escapes a URI component for embedding into a URI string.
		 * 
		 * @event //utility
		 * @param {String} str The URI component to escape
		 * @returns {String} The escaped URI component
		 */
		escapeURIComponent : escapeURIComponent,
		
		/**
		 * Returns a URI that is formated for JSV. Currently, this only ensures that the URI ends with a hash tag (<code>#</code>).
		 * 
		 * @event //utility
		 * @param {String} uri The URI to format
		 * @returns {String} The URI formatted for JSV
		 */
		formatURI : formatURI,
		
		/**
		 * Merges two schemas/instance together.
		 * 
		 * @event //utility
		 * @param {JSONSchema|Any} base The old value to merge
		 * @param {JSONSchema|Any} extra The new value to merge
		 * @param {Boolean} extension If the merge is a JSON Schema extension
		 * @return {Any} The modified base value
		 */
		 
		inherits : inherits,
		
		/**
		 * @private
		 * @event //utility
		 */
		
		InitializationError : InitializationError
	};
	
	this.JSV = JSV;  //set global object
	exports.JSV = JSV;  //export to CommonJS
	
	require("./environments");  //load default environments
	
}());