/**
 * json-schema-draft-03 Environment
 * 
 * @fileOverview Implementation of the third revision of the JSON Schema specification draft.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.5.1
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
/*global require */

(function () {
	var O = {},
		JSV = require('./jsv').JSV,
		TYPE_VALIDATORS,
		ENVIRONMENT,
		SCHEMA_00_JSON,
		HYPERSCHEMA_00_JSON,
		LINKS_00_JSON, 
		SCHEMA_00,
		HYPERSCHEMA_00,
		LINKS_00, 
		SCHEMA_01_JSON,
		HYPERSCHEMA_01_JSON,
		LINKS_01_JSON, 
		SCHEMA_01,
		HYPERSCHEMA_01,
		LINKS_01, 
		SCHEMA_02_JSON,
		HYPERSCHEMA_02_JSON,
		LINKS_02_JSON,
		SCHEMA_02,
		HYPERSCHEMA_02,
		LINKS_02, 
		SCHEMA_03_JSON,
		HYPERSCHEMA_03_JSON,
		LINKS_03_JSON,
		SCHEMA_03,
		HYPERSCHEMA_03,
		LINKS_03;
	
	TYPE_VALIDATORS = {
		"string" : function (instance, report) {
			return instance.getType() === "string";
		},
		
		"number" : function (instance, report) {
			return instance.getType() === "number";
		},
		
		"integer" : function (instance, report) {
			return instance.getType() === "number" && instance.getValue() % 1 === 0;
		},
		
		"boolean" : function (instance, report) {
			return instance.getType() === "boolean";
		},
		
		"object" : function (instance, report) {
			return instance.getType() === "object";
		},
		
		"array" : function (instance, report) {
			return instance.getType() === "array";
		},
		
		"null" : function (instance, report) {
			return instance.getType() === "null";
		},
		
		"any" : function (instance, report) {
			return true;
		}
	};
	
	ENVIRONMENT = new JSV.Environment();
	ENVIRONMENT.setOption("validateReferences", true);
	ENVIRONMENT.setOption("enforceReferences", false);
	ENVIRONMENT.setOption("strict", false);
	
	//
	// draft-00
	//
	
	SCHEMA_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/schema#",
		"type" : "object",
		
		"properties" : {
			"type" : {
				"type" : ["string", "array"],
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				"optional" : true,
				"uniqueItems" : true,
				"default" : "any",
				
				"parser" : function (instance, self) {
					var parser;
					
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(
							instance, 
							self.getEnvironment().findSchema(self.resolveURI("#"))
						);
					} else if (instance.getType() === "array") {
						parser = self.getValueOfProperty("parser");
						return JSV.mapArray(instance.getProperties(), function (prop) {
							return parser(prop, self);
						});
					}
					//else
					return "any";
				},
			
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requiredTypes = JSV.toArray(schema.getAttribute("type")),
						x, xl, type, subreport, typeValidators;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && requiredTypes && requiredTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = requiredTypes.length; x < xl; ++x) {
							type = requiredTypes[x];
							if (JSV.isJSONSchema(type)) {
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (type.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									return true;  //instance matches this schema
								}
							} else {
								if (typeValidators[type] !== O[type] && typeof typeValidators[type] === "function") {
									if (typeValidators[type](instance, report)) {
										return true;  //type is valid
									}
								} else {
									return true;  //unknown types are assumed valid
								}
							}
						}
						
						//if we get to this point, type is invalid
						report.addError(instance, schema, "type", "Instance is not a required type", requiredTypes);
						return false;
					}
					//else, anything is allowed if no type is specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment();
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI("#")));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI("#")));
							});
						}
					}
					//else
					return {};
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var propertySchemas, key;
					//this attribute is for object type instances only
					if (instance.getType() === "object") {
						//for each property defined in the schema
						propertySchemas = schema.getAttribute("properties");
						for (key in propertySchemas) {
							if (propertySchemas[key] !== O[key] && propertySchemas[key]) {
								//ensure that instance property is valid
								propertySchemas[key].validate(instance.getProperty(key), report, instance, schema, key);
							}
						}
					}
				}
			},
			
			"items" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalProperties;
					
					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalProperties = schema.getAttribute("additionalProperties");
						
						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalProperties;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalProperties", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalProperties;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},
			
			"optional" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && !schema.getAttribute("optional")) {
						report.addError(instance, schema, "optional", "Property is required", false);
					}
				},
				
				"validationRequired" : true
			},
			
			"additionalProperties" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "boolean" && instance.getValue() === false) {
						return false;
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, key;
					//we only need to check against object types as arrays do their own checking on this property
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && propertySchemas[key] === O[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},
			
			"requires" : {
				"type" : ["string", {"$ref" : "#"}],
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requires;
					if (instance.getType() !== "undefined" && parent && parent.getType() !== "undefined") {
						requires = schema.getAttribute("requires");
						if (typeof requires === "string") {
							if (parent.getProperty(requires).getType() === "undefined") {
								report.addError(instance, schema, "requires", 'Property requires sibling property "' + requires + '"', requires);
							}
						} else if (JSV.isJSONSchema(requires)) {
							requires.validate(parent, report);  //WATCH: A "requires" schema does not support the "requires" attribute
						}
					}
				}
			},
			
			"minimum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, minimumCanEqual;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						minimumCanEqual = schema.getAttribute("minimumCanEqual");
						if (typeof minimum === "number" && (instance.getValue() < minimum || (minimumCanEqual === false && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less than the required minimum value", minimum);
						}
					}
				}
			},
			
			"maximum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, maximumCanEqual;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						maximumCanEqual = schema.getAttribute("maximumCanEqual");
						if (typeof maximum === "number" && (instance.getValue() > maximum || (maximumCanEqual === false && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater than the required maximum value", maximum);
						}
					}
				}
			},
			
			"minimumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "minimum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"maximumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "maximum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"minItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minItems;
					if (instance.getType() === "array") {
						minItems = schema.getAttribute("minItems");
						if (typeof minItems === "number" && instance.getProperties().length < minItems) {
							report.addError(instance, schema, "minItems", "The number of items is less than the required minimum", minItems);
						}
					}
				}
			},
			
			"maxItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxItems;
					if (instance.getType() === "array") {
						maxItems = schema.getAttribute("maxItems");
						if (typeof maxItems === "number" && instance.getProperties().length > maxItems) {
							report.addError(instance, schema, "maxItems", "The number of items is greater than the required maximum", maxItems);
						}
					}
				}
			},
			
			"pattern" : {
				"type" : "string",
				"optional" : true,
				"format" : "regex",
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pattern;
					try {
						pattern = new RegExp(schema.getAttribute("pattern"));
						if (instance.getType() === "string" && pattern && !pattern.test(instance.getValue())) {
							report.addError(instance, schema, "pattern", "String does not match pattern", pattern.toString());
						}
					} catch (e) {
						report.addError(schema, self, "pattern", "Invalid pattern", schema.getValueOfProperty("pattern"));
					}
				}
			},
			
			"minLength" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minLength;
					if (instance.getType() === "string") {
						minLength = schema.getAttribute("minLength");
						if (typeof minLength === "number" && instance.getValue().length < minLength) {
							report.addError(instance, schema, "minLength", "String is less than the required minimum length", minLength);
						}
					}
				}
			},
			
			"maxLength" : {
				"type" : "integer",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxLength;
					if (instance.getType() === "string") {
						maxLength = schema.getAttribute("maxLength");
						if (typeof maxLength === "number" && instance.getValue().length > maxLength) {
							report.addError(instance, schema, "maxLength", "String is greater than the required maximum length", maxLength);
						}
					}
				}
			},
			
			"enum" : {
				"type" : "array",
				"optional" : true,
				"minItems" : 1,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var enums, x, xl;
					if (instance.getType() !== "undefined") {
						enums = schema.getAttribute("enum");
						if (enums) {
							for (x = 0, xl = enums.length; x < xl; ++x) {
								if (instance.equals(enums[x])) {
									return true;
								}
							}
							report.addError(instance, schema, "enum", "Instance is not one of the possible values", enums);
						}
					}
				}
			},
			
			"title" : {
				"type" : "string",
				"optional" : true
			},
			
			"description" : {
				"type" : "string",
				"optional" : true
			},
			
			"format" : {
				"type" : "string",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var format, formatValidators;
					if (instance.getType() === "string") {
						format = schema.getAttribute("format");
						formatValidators = self.getValueOfProperty("formatValidators");
						if (typeof format === "string" && formatValidators[format] !== O[format] && typeof formatValidators[format] === "function" && !formatValidators[format].call(this, instance, report)) {
							report.addError(instance, schema, "format", "String is not in the required format", format);
						}
					}
				},
				
				"formatValidators" : {}
			},
			
			"contentEncoding" : {
				"type" : "string",
				"optional" : true
			},
			
			"default" : {
				"type" : "any",
				"optional" : true
			},
			
			"maxDecimal" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
								
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxDecimal, decimals;
					if (instance.getType() === "number") {
						maxDecimal = schema.getAttribute("maxDecimal");
						if (typeof maxDecimal === "number") {
							decimals = instance.getValue().toString(10).split('.')[1];
							if (decimals && decimals.length > maxDecimal) {
								report.addError(instance, schema, "maxDecimal", "The number of decimal places is greater than the allowed maximum", maxDecimal);
							}
						}
					}
				}
			},
			
			"disallow" : {
				"type" : ["string", "array"],
				"items" : {"type" : "string"},
				"optional" : true,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string" || instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var disallowedTypes = JSV.toArray(schema.getAttribute("disallow")),
						x, xl, key, typeValidators, subreport;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && disallowedTypes && disallowedTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = disallowedTypes.length; x < xl; ++x) {
							key = disallowedTypes[x];
							if (JSV.isJSONSchema(key)) {  //this is supported draft-03 and on
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (key.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									//instance matches this schema
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;  
								}
							} else if (typeValidators[key] !== O[key] && typeof typeValidators[key] === "function") {
								if (typeValidators[key](instance, report)) {
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;
								}
							} 
							/*
							else {
								report.addError(instance, schema, "disallow", "Instance may be a disallowed type", disallowedTypes);
								return false;
							}
							*/
						}
						
						//if we get to this point, type is valid
						return true;
					}
					//else, everything is allowed if no disallowed types are specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
		
			"extends" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var extensions = schema.getAttribute("extends"), x, xl;
					if (extensions) {
						if (JSV.isJSONSchema(extensions)) {
							extensions.validate(instance, report, parent, parentSchema, name);
						} else if (JSV.typeOf(extensions) === "array") {
							for (x = 0, xl = extensions.length; x < xl; ++x) {
								extensions[x].validate(instance, report, parent, parentSchema, name);
							}
						}
					}
				}
			}
		},
		
		"optional" : true,
		"default" : {},
		"fragmentResolution" : "dot-delimited",
		
		"parser" : function (instance, self) {
			if (instance.getType() === "object") {
				return instance.getEnvironment().createSchema(instance, self);
			}
		},
		
		"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
			var propNames = schema.getPropertyNames(), 
				x, xl,
				attributeSchemas = self.getAttribute("properties"),
				strict = instance.getEnvironment().getOption("strict"),
				validator;
			
			for (x in attributeSchemas) {
				if (attributeSchemas[x] !== O[x]) {
					if (attributeSchemas[x].getValueOfProperty("validationRequired")) {
						JSV.pushUnique(propNames, x);
					}
					if (strict && attributeSchemas[x].getValueOfProperty("deprecated")) {
						JSV.popFirst(propNames, x);
					}
				}
			}
			
			for (x = 0, xl = propNames.length; x < xl; ++x) {
				if (attributeSchemas[propNames[x]] !== O[propNames[x]]) {
					validator = attributeSchemas[propNames[x]].getValueOfProperty("validator");
					if (typeof validator === "function") {
						validator(instance, schema, attributeSchemas[propNames[x]], report, parent, parentSchema, name);
					}
				}
			}
		}
	};
	
	HYPERSCHEMA_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/hyper-schema#",
	
		"properties" : {
			"links" : {
				"type" : "array",
				"items" : {"$ref" : "links#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var links,
						linkSchemaURI = self.getValueOfProperty("items")["$ref"],
						linkSchema = self.getEnvironment().findSchema(linkSchemaURI),
						linkParser = linkSchema && linkSchema.getValueOfProperty("parser"),
						selfReferenceVariable;
					arg = JSV.toArray(arg);
					
					if (typeof linkParser === "function") {
						links = JSV.mapArray(instance.getProperties(), function (link) {
							return linkParser(link, linkSchema);
						});
					} else {
						links = JSV.toArray(instance.getValue());
					}
					
					if (arg[0]) {
						links = JSV.filterArray(links, function (link) {
							return link["rel"] === arg[0];
						});
					}
					
					if (arg[1]) {
						selfReferenceVariable = self.getValueOfProperty("selfReferenceVariable");
						links = JSV.mapArray(links, function (link) {
							var instance = arg[1],
								href = link["href"];
							href = href.replace(/\{(.+)\}/g, function (str, p1, offset, s) {
								var value; 
								if (p1 === selfReferenceVariable) {
									value = instance.getValue();
								} else {
									value = instance.getValueOfProperty(p1);
								}
								return value !== undefined ? String(value) : "";
							});
							return href ? JSV.formatURI(instance.resolveURI(href)) : href;
						});
					}
					
					return links;
				},
				
				"selfReferenceVariable" : "-this"
			},
			
			"fragmentResolution" : {
				"type" : "string",
				"optional" : true,
				"default" : "dot-delimited"
			},
			
			"root" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"readonly" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"pathStart" : {
				"type" : "string",
				"optional" : true,
				"format" : "uri",
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pathStart;
					if (instance.getType() !== "undefined") {
						pathStart = schema.getAttribute("pathStart");
						if (typeof pathStart === "string") {
							//TODO: Find out what pathStart is relative to
							if (instance.getURI().indexOf(pathStart) !== 0) {
								report.addError(instance, schema, "pathStart", "Instance's URI does not start with " + pathStart, pathStart);
							}
						}
					}
				}
			},
			
			"mediaType" : {
				"type" : "string",
				"optional" : true,
				"format" : "media-type"
			},
			
			"alternate" : {
				"type" : "array",
				"items" : {"$ref" : "#"},
				"optional" : true
			}
		},
		
		"links" : [
			{
				"href" : "{$ref}",
				"rel" : "full"
			},
			
			{
				"href" : "{$schema}",
				"rel" : "describedby"
			},
			
			{
				"href" : "{id}",
				"rel" : "self"
			}
		],
				
		"initializer" : function (instance) {
			var link, extension, extended;
			
			//if there is a link to a different schema, set reference
			link = instance._schema.getLink("describedby", instance);
			if (link && instance._schema._uri !== link) {
				instance.setReference("describedby", link);
			}
			
			//if instance has a URI link to itself, update it's own URI
			link = instance._schema.getLink("self", instance);
			if (JSV.typeOf(link) === "string") {
				instance._uri = JSV.formatURI(link);
			}
			
			//if there is a link to the full representation, set reference
			link = instance._schema.getLink("full", instance);
			if (link && instance._uri !== link) {
				instance.setReference("full", link);
			}
			
			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}
			
			return instance;
		}
		
		//not needed as JSV.inherits does the job for us
		//"extends" : {"$ref" : "http://json-schema.org/schema#"}
	};
	
	LINKS_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/links#",
		"type" : "object",
		
		"properties" : {
			"href" : {
				"type" : "string"
			},
			
			"rel" : {
				"type" : "string"
			},
			
			"method" : {
				"type" : "string",
				"default" : "GET",
				"optional" : true
			},
			
			"enctype" : {
				"type" : "string",
				"requires" : "method",
				"optional" : true
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "hyper-schema#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment(),
						additionalPropertiesSchemaURI = self.getValueOfProperty("additionalProperties")["$ref"];
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
							});
						}
					}
				}
			}
		},
		
		"parser" : function (instance, self) {
			var selfProperties = self.getProperty("properties");
			if (instance.getType() === "object") {
				return JSV.mapObject(instance.getProperties(), function (property, key) {
					var propertySchema = selfProperties.getProperty(key),
						parser = propertySchema && propertySchema.getValueOfProperty("parser");
					if (typeof parser === "function") {
						return parser(property, propertySchema);
					}
					//else
					return property.getValue();
				});
			}
			return instance.getValue();
		}
	};
	
	ENVIRONMENT.setOption("defaultFragmentDelimiter", ".");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-00/schema#");  //updated later
	
	SCHEMA_00 = ENVIRONMENT.createSchema(SCHEMA_00_JSON, true, "http://json-schema.org/draft-00/schema#");
	HYPERSCHEMA_00 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_00, ENVIRONMENT.createSchema(HYPERSCHEMA_00_JSON, true, "http://json-schema.org/draft-00/hyper-schema#"), true), true, "http://json-schema.org/draft-00/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-00/hyper-schema#");
	
	LINKS_00 = ENVIRONMENT.createSchema(LINKS_00_JSON, HYPERSCHEMA_00, "http://json-schema.org/draft-00/links#");
	
	//
	// draft-01
	//
		
	SCHEMA_01_JSON = JSV.inherits(SCHEMA_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/schema#"
	});
	
	HYPERSCHEMA_01_JSON = JSV.inherits(HYPERSCHEMA_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/hyper-schema#"
	});
	
	LINKS_01_JSON = JSV.inherits(LINKS_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/links#"
	});
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-01/schema#");  //update later
	
	SCHEMA_01 = ENVIRONMENT.createSchema(SCHEMA_01_JSON, true, "http://json-schema.org/draft-01/schema#");
	HYPERSCHEMA_01 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_01, ENVIRONMENT.createSchema(HYPERSCHEMA_01_JSON, true, "http://json-schema.org/draft-01/hyper-schema#"), true), true, "http://json-schema.org/draft-01/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-01/hyper-schema#");
	
	LINKS_01 = ENVIRONMENT.createSchema(LINKS_01_JSON, HYPERSCHEMA_01, "http://json-schema.org/draft-01/links#");
	
	//
	// draft-02
	//
	
	SCHEMA_02_JSON = JSV.inherits(SCHEMA_01_JSON, {
		"$schema" : "http://json-schema.org/draft-02/hyper-schema#",
		"id" : "http://json-schema.org/draft-02/schema#",
		
		"properties" : {
			"uniqueItems" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var value, x, xl, y, yl;
					if (instance.getType() === "array" && schema.getAttribute("uniqueItems")) {
						value = instance.getProperties();
						for (x = 0, xl = value.length - 1; x < xl; ++x) {
							for (y = x + 1, yl = value.length; y < yl; ++y) {
								if (value[x].equals(value[y])) {
									report.addError(instance, schema, "uniqueItems", "Array can only contain unique items", { x : x, y : y });
								}
							}
						}
					}
				}
			},
			
			"maxDecimal" : {
				"deprecated" : true
			},
			
			"divisibleBy" : {
				"type" : "number",
				"minimum" : 0,
				"minimumCanEqual" : false,
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var divisor, value, digits;
					if (instance.getType() === "number") {
						divisor = schema.getAttribute("divisibleBy");
						if (divisor === 0) {
							report.addError(instance, schema, "divisibleBy", "Nothing is divisible by 0", divisor);
						} else if (divisor !== 1) {
							value = instance.getValue();
							digits = Math.max((value.toString().split(".")[1] || " ").length, (divisor.toString().split(".")[1] || " ").length);
							digits = parseFloat(((value / divisor) % 1).toFixed(digits));  //cut out floating point errors
							if (0 < digits && digits < 1) {
								report.addError(instance, schema, "divisibleBy", "Number is not divisible by " + divisor, divisor);
							}
						}
					}
				}
			}
		},
		
		"fragmentResolution" : "slash-delimited"
	});
	
	HYPERSCHEMA_02_JSON = JSV.inherits(HYPERSCHEMA_01_JSON, {
		"id" : "http://json-schema.org/draft-02/hyper-schema#",
		
		"properties" : {
			"fragmentResolution" : {
				"default" : "slash-delimited"
			}
		}
	});
	
	LINKS_02_JSON = JSV.inherits(LINKS_01_JSON, {
		"$schema" : "http://json-schema.org/draft-02/hyper-schema#",
		"id" : "http://json-schema.org/draft-02/links#",
		
		"properties" : {
			"targetSchema" : {
				"$ref" : "hyper-schema#",
				
				//need this here because parsers are run before links are resolved
				"parser" : HYPERSCHEMA_01.getAttribute("parser")
			}
		}
	});
	
	ENVIRONMENT.setOption("defaultFragmentDelimiter", "/");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-02/schema#");  //update later
	
	SCHEMA_02 = ENVIRONMENT.createSchema(SCHEMA_02_JSON, true, "http://json-schema.org/draft-02/schema#");
	HYPERSCHEMA_02 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_02, ENVIRONMENT.createSchema(HYPERSCHEMA_02_JSON, true, "http://json-schema.org/draft-02/hyper-schema#"), true), true, "http://json-schema.org/draft-02/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-02/hyper-schema#");
	
	LINKS_02 = ENVIRONMENT.createSchema(LINKS_02_JSON, HYPERSCHEMA_02, "http://json-schema.org/draft-02/links#");
	
	//
	// draft-03
	//
	
	function getMatchedPatternProperties(instance, schema, report, self) {
		var matchedProperties = {}, patternProperties, pattern, regexp, properties, key;
		
		if (instance.getType() === "object") {
			patternProperties = schema.getAttribute("patternProperties");
			properties = instance.getProperties();
			for (pattern in patternProperties) {
				if (patternProperties[pattern] !== O[pattern]) {
					regexp = null;
					try {
						regexp = new RegExp(pattern);
					} catch (e) {
						if (report) {
							report.addError(schema, self, "patternProperties", "Invalid pattern", pattern);
						}
					}
					
					if (regexp) {
						for (key in properties) {
							if (properties[key] !== O[key]  && regexp.test(key)) {
								matchedProperties[key] = matchedProperties[key] ? JSV.pushUnique(matchedProperties[key], patternProperties[pattern]) : [ patternProperties[pattern] ];
							}
						}
					}
				}
			}
		}
		
		return matchedProperties;
	}
	
	SCHEMA_03_JSON = JSV.inherits(SCHEMA_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/schema#",
		"id" : "http://json-schema.org/draft-03/schema#",
		
		"properties" : {
			"patternProperties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"default" : {},
				
				"parser" : SCHEMA_02.getValueOfProperty("properties")["properties"]["parser"],
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var matchedProperties, key, x;
					if (instance.getType() === "object") {
						matchedProperties = getMatchedPatternProperties(instance, schema, report, self);
						for (key in matchedProperties) {
							if (matchedProperties[key] !== O[key]) {
								x = matchedProperties[key].length;
								while (x--) {
									matchedProperties[key][x].validate(instance.getProperty(key), report, instance, schema, key);
								}
							}
						}
					}
				}
			},
			
			"additionalProperties" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, matchedProperties, key;
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						matchedProperties = getMatchedPatternProperties(instance, schema);
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && propertySchemas[key] === O[key] && matchedProperties[key] === O[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},
			
			"items" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalItems;
					
					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalItems = schema.getAttribute("additionalItems");
						
						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalItems;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalItems", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalItems;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},
			
			"additionalItems" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"default" : {},
				
				"parser" : SCHEMA_02.getValueOfProperty("properties")["additionalProperties"]["parser"],
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalItems, properties, x, xl;
					//only validate if the "items" attribute is undefined
					if (instance.getType() === "array" && schema.getProperty("items").getType() === "undefined") {
						additionalItems = schema.getAttribute("additionalItems");
						properties = instance.getProperties();
						
						if (additionalItems !== false) {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								additionalItems.validate(properties[x], report, instance, schema, x);
							}
						} else if (properties.length) {
							report.addError(instance, schema, "additionalItems", "Additional items are not allowed", additionalItems);
						}
					}
				}
			},
			
			"optional" : {
				"validationRequired" : false,
				"deprecated" : true
			},
			
			"required" : {
				"type" : "boolean",
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && schema.getAttribute("required")) {
						report.addError(instance, schema, "required", "Property is required", true);
					}
				}
			},
			
			"requires" : {
				"deprecated" : true
			},
			
			"dependencies" : {
				"type" : "object",
				"additionalProperties" : {
					"type" : ["string", "array", {"$ref" : "#"}],
					"items" : {
						"type" : "string"
					}
				},
				"default" : {},
				
				"parser" : function (instance, self, arg) {
					function parseProperty(property) {
						var type = property.getType();
						if (type === "string" || type === "array") {
							return property.getValue();
						} else if (type === "object") {
							return property.getEnvironment().createSchema(property, self.getEnvironment().findSchema(self.resolveURI("#")));
						}
					}
					
					if (instance.getType() === "object") {
						if (arg) {
							return parseProperty(instance.getProperty(arg));
						} else {
							return JSV.mapObject(instance.getProperties(), parseProperty);
						}
					}
					//else
					return {};
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var dependencies, key, dependency, type, x, xl;
					if (instance.getType() === "object") {
						dependencies = schema.getAttribute("dependencies");
						for (key in dependencies) {
							if (dependencies[key] !== O[key] && instance.getProperty(key).getType() !== "undefined") {
								dependency = dependencies[key];
								type = JSV.typeOf(dependency);
								if (type === "string") {
									if (instance.getProperty(dependency).getType() === "undefined") {
										report.addError(instance, schema, "dependencies", 'Property "' + key + '" requires sibling property "' + dependency + '"', dependencies);
									}
								} else if (type === "array") {
									for (x = 0, xl = dependency.length; x < xl; ++x) {
										if (instance.getProperty(dependency[x]).getType() === "undefined") {
											report.addError(instance, schema, "dependencies", 'Property "' + key + '" requires sibling property "' + dependency[x] + '"', dependencies);
										}
									}
								} else if (JSV.isJSONSchema(dependency)) {
									dependency.validate(instance, report);
								}
							}
						}
					}
				}
			},
			
			"minimumCanEqual" : {
				"deprecated" : true
			},
			
			"maximumCanEqual" : {
				"deprecated" : true
			},
			
			"exclusiveMinimum" : {
				"type" : "boolean",
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				}
			},
			
			"exclusiveMaximum" : {
				"type" : "boolean",
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				}
			},
			
			"minimum" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, exclusiveMinimum;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						exclusiveMinimum = schema.getAttribute("exclusiveMinimum") || (!instance.getEnvironment().getOption("strict") && !schema.getAttribute("minimumCanEqual"));
						if (typeof minimum === "number" && (instance.getValue() < minimum || (exclusiveMinimum === true && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less than the required minimum value", minimum);
						}
					}
				}
			},
			
			"maximum" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, exclusiveMaximum;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						exclusiveMaximum = schema.getAttribute("exclusiveMaximum") || (!instance.getEnvironment().getOption("strict") && !schema.getAttribute("maximumCanEqual"));
						if (typeof maximum === "number" && (instance.getValue() > maximum || (exclusiveMaximum === true && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater than the required maximum value", maximum);
						}
					}
				}
			},
			
			"contentEncoding" : {
				"deprecated" : true
			},
			
			"divisibleBy" : {
				"exclusiveMinimum" : true
			},
			
			"disallow" : {
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				
				"parser" : SCHEMA_02_JSON["properties"]["type"]["parser"]
			},
			
			"id" : {
				"type" : "string",
				"format" : "uri"
			},
			
			"$ref" : {
				"type" : "string",
				"format" : "uri"
			},
			
			"$schema" : {
				"type" : "string",
				"format" : "uri"
			}
		},
		
		"dependencies" : {
			"exclusiveMinimum" : "minimum",
			"exclusiveMaximum" : "maximum"
		},
		
		"initializer" : function (instance) {
			var link, extension, extended,
				schemaLink = instance.getValueOfProperty("$schema"),
				refLink = instance.getValueOfProperty("$ref"),
				idLink = instance.getValueOfProperty("id");
			
			//if there is a link to a different schema, set reference
			if (schemaLink) {
				link = instance.resolveURI(schemaLink);
				instance.setReference("describedby", link);
			}
			
			//if instance has a URI link to itself, update it's own URI
			if (idLink) {
				link = instance.resolveURI(idLink);
				if (JSV.typeOf(link) === "string") {
					instance._uri = JSV.formatURI(link);
				}
			}
			
			//if there is a link to the full representation, set reference
			if (refLink) {
				link = instance.resolveURI(refLink);
				instance.setReference("full", link);
			}
			
			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}
			
			return instance;
		}
	});
	
	HYPERSCHEMA_03_JSON = JSV.inherits(HYPERSCHEMA_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
		"id" : "http://json-schema.org/draft-03/hyper-schema#",
		
		"properties" : {
			"links" : {
				"selfReferenceVariable" : "@"
			},
			
			"root" : {
				"deprecated" : true
			},
			
			"contentEncoding" : {
				"deprecated" : false  //moved from core to hyper
			},
			
			"alternate" : {
				"deprecated" : true
			}
		}
	});
	
	LINKS_03_JSON = JSV.inherits(LINKS_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
		"id" : "http://json-schema.org/draft-03/links#",
		
		"properties" : {
			"href" : {
				"required" : true,
				"format" : "link-description-object-template"
			},
			
			"rel" : {
				"required" : true
			},
			
			"properties" : {
				"deprecated" : true
			},
			
			"schema" : {"$ref" : "http://json-schema.org/draft-03/hyper-schema#"}
		}
	});
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-03/schema#");  //update later
	
	SCHEMA_03 = ENVIRONMENT.createSchema(SCHEMA_03_JSON, true, "http://json-schema.org/draft-03/schema#");
	HYPERSCHEMA_03 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_03, ENVIRONMENT.createSchema(HYPERSCHEMA_03_JSON, true, "http://json-schema.org/draft-03/hyper-schema#"), true), true, "http://json-schema.org/draft-03/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-03/hyper-schema#");
	
	LINKS_03 = ENVIRONMENT.createSchema(LINKS_03_JSON, true, "http://json-schema.org/draft-03/links#");
	
	ENVIRONMENT.setOption("latestJSONSchemaSchemaURI", "http://json-schema.org/draft-03/schema#");
	ENVIRONMENT.setOption("latestJSONSchemaHyperSchemaURI", "http://json-schema.org/draft-03/hyper-schema#");
	ENVIRONMENT.setOption("latestJSONSchemaLinksURI", "http://json-schema.org/draft-03/links#");
	
	//
	//Latest JSON Schema
	//
	
	//Hack, but WAY faster than instantiating a new schema
	ENVIRONMENT._schemas["http://json-schema.org/schema#"] = SCHEMA_03;
	ENVIRONMENT._schemas["http://json-schema.org/hyper-schema#"] = HYPERSCHEMA_03;
	ENVIRONMENT._schemas["http://json-schema.org/links#"] = LINKS_03;
	
	//
	//register environment
	//
	
	JSV.registerEnvironment("json-schema-draft-03", ENVIRONMENT);
	if (!JSV.getDefaultEnvironmentID() || JSV.getDefaultEnvironmentID() === "json-schema-draft-01" || JSV.getDefaultEnvironmentID() === "json-schema-draft-02") {
		JSV.setDefaultEnvironmentID("json-schema-draft-03");
	}
	
}());