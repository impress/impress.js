// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A class for Jsdoc type object builders.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


var util = require('./util.js');
var TypeLexer = require('./TypeLexer.js');
var TypeDictionary = require('./TypeDictionary.js');
var dict = TypeDictionary.getInstance();



/**
 * A class for Jsdoc type object builders.
 * @constructor
 * @exports lib/TypeBuilder
 */
var TypeBuilder = function() {
  this.lexer_ = this.getTypeLexer();
};


/**
 * Whether syntax error exceptions are enabled.
 * @const
 * @type {boolean}
 */
TypeBuilder.ENABLE_EXCEPTIONS = false;


/**
 * Returns an unknown type.
 * @return {module:lib/TypeBuilder.TypeUnion} Unknown union.
 */
TypeBuilder.getUnknownType = function() {
  var unknown = new TypeBuilder.TypeUnion();
  unknown.setUnknownType(true);

  return unknown;
};


/**
 * Sets a type string to parse.
 * @param {string} type Type string.
 */
TypeBuilder.prototype.setTypeString = function(type) {
  this.type_ = type;
};


/**
 * Builds a type objects.
 * @return {module:lib/TypeBuilder.TypeUnion} Builded objects.
 */
TypeBuilder.prototype.build = function() {
  var base = new TypeBuilder.BaseMode();
  this.setMode(base);

  try {
    this.lexer_.analyze(this.type_);
  }
  catch (e) {
    if (!TypeBuilder.ENABLE_EXCEPTIONS && e instanceof TypeLexer.SyntaxError) {
      // Should return an unknown type if a syntax error was found.
      util.warn(e.message);
      return TypeBuilder.getUnknownType();
    }
    else {
      throw e;
    }
  }
  return base.getTypeUnionToken();
};


/**
 * Returns a type lexer.  Override this method if you want to use the custom
 * type lexer.
 * @return {module:lib/TypeLexer} Type lexer.
 * @protected
 */
TypeBuilder.prototype.getTypeLexer = function() {
  return new TypeLexer();
};


/**
 * Sets a mode.
 * @param {module:lib/TypeBuilder.Mode} mode Mode of the type builder.
 */
TypeBuilder.prototype.setMode = function(mode) {
  mode.setBuilder(this);
  this.mode_ = mode;
  this.lexer_.setTokenHandlers(mode);
};



/**
 * A base class for modes of type builder.  The mode is changed when a opening
 * token such as: {@code '.&lt;'} (generic type), {@code 'function'} (function
 * type), {@code '{'} (record type), was found.
 * Create a child of the class if you want to add a new type expression.
 * @constructor
 * @alias module:lib/TypeBuilder.Mode
 */
TypeBuilder.Mode = function() {};


/**
 * Next mode.
 * @type {?module:lib/TypeBuilder.Mode}
 * @private
 */
TypeBuilder.Mode.prototype.next_ = null;


/**
 * Builder has the mode.
 * @type {?module:lib/TypeBuilder}
 * @private
 */
TypeBuilder.Mode.prototype.builder_ = null;


/**
 * Sets a builder has the mode.
 * @param {module:lib/TypeBuilder} builder Builder has the mode.
 */
TypeBuilder.Mode.prototype.setBuilder = function(builder) {
  this.builder_ = builder;
};


/**
 * Returns a builder has the mode.
 * @return {module:lib/TypeBuilder} Builder has the mode.
 */
TypeBuilder.Mode.prototype.getBuilder = function() {
  return this.builder_;
};


/**
 * Sets a mode next to the mode.
 * @param {module:lib/TypeBuilder.Mode} next Next mode.
 */
TypeBuilder.Mode.prototype.setNext = function(next) {
  this.next_ = next;
};


/**
 * Returns a mode next to the mode.
 * @return {module:lib/TypeBuilder.Mode} Next mode.
 */
TypeBuilder.Mode.prototype.getNext = function() {
  return this.next_;
};


/**
 * Change a mode to the next mode.
 */
TypeBuilder.Mode.prototype.next = function() {
  this.builder_.setMode(this.next_);
};


/**
 * Handles an opening type union token.
 */
TypeBuilder.Mode.prototype.handleOpenTypeUnionToken = function() {
  var newMode = new TypeBuilder.TypeUnionMode();
  newMode.setNext(this);
  this.builder_.setMode(newMode);
};


/**
 * Handles a closing type union token.
 */
TypeBuilder.Mode.prototype.handleCloseTypeUnionToken = function() {
  this.next();
};


/**
 * Handles an opening function type token.
 */
TypeBuilder.Mode.prototype.handleOpenFunctionTypeToken = function() {
  var newMode = new TypeBuilder.FunctionTypeMode();
  newMode.setNext(this);
  this.builder_.setMode(newMode);
};


/**
 * Handles a closing function type token.
 */
TypeBuilder.Mode.prototype.handleCloseFunctionTypeToken = function() {
  this.next();
};


/**
 * Handles an opening generic type token.
 */
TypeBuilder.Mode.prototype.handleOpenGenericTypeToken = function() {
  var newMode = new TypeBuilder.GenericTypeMode();
  newMode.setNext(this);
  this.builder_.setMode(newMode);
};


/**
 * Handles a closing generic type token.
 */
TypeBuilder.Mode.prototype.handleCloseGenericTypeToken = function() {
  this.next();
};


/**
 * Handles an opening record type token.
 */
TypeBuilder.Mode.prototype.handleOpenRecordTypeToken = function() {
  var newMode = new TypeBuilder.RecordTypeMode();
  newMode.setNext(this);
  this.builder_.setMode(newMode);
};


/**
 * Handles a closing record type token.
 */
TypeBuilder.Mode.prototype.handleCloseRecordTypeToken = function() {
  this.next();
};



/**
 * A class for base modes.  The base mode is set when start to build type
 * objects, and the base mode have a root type union.
 * @constructor
 * @extends {module:lib/TypeBuilder.Mode}
 * @alias module:lib/TypeBuilder.BaseMode
 */
TypeBuilder.BaseMode = function() {
  TypeBuilder.Mode.call(this);
};
util.inherits(TypeBuilder.BaseMode, TypeBuilder.Mode);


/**
 * Base type union.
 * @type {?module:lib/TypeBuilder.TypeUnion}
 * @private
 */
TypeBuilder.BaseMode.prototype.baseUnion_ = null;


/**
 * Sets a type union at the root.
 * @param {module:lib/TypeBuilder.TypeUnion} union Type union to set.
 */
TypeBuilder.BaseMode.prototype.setTypeUnionToken = function(union) {
  this.baseUnion_ = union;
};


/**
 * Returns a type union at the root.
 * @return {module:lib/TypeBuilder.TypeUnion} Type union to set.
 */
TypeBuilder.BaseMode.prototype.getTypeUnionToken = function() {
  return this.baseUnion_;
};



/**
 * A class for type union modes of a type builder.
 * @constructor
 * @extends {module:lib/TypeBuilder.Mode}
 * @alias module:lib/TypeBuilder.TypeUnionMode
 */
TypeBuilder.TypeUnionMode = function() {
  TypeBuilder.Mode.call(this);
  this.union_ = new TypeBuilder.TypeUnion();
};
util.inherits(TypeBuilder.TypeUnionMode, TypeBuilder.Mode);


/**
 * Target type union.
 * @type {module:lib/TypeBuilder.TypeUnion}
 * @private
 */
TypeBuilder.TypeUnionMode.prototype.union_ = null;


/** @override */
TypeBuilder.TypeUnionMode.prototype.next = function() {
  var nextMode = this.getNext();
  if (nextMode) {
    nextMode.setTypeUnionToken(this.union_);
  }
  TypeBuilder.Mode.prototype.next.call(this);
};


/**
 * Handles an all type operator token.
 */
TypeBuilder.TypeUnionMode.prototype.handleAllTypeOperatorToken = function() {
  this.union_.setAllType(true);
};


/**
 * Handles an unknown type operator token.
 */
TypeBuilder.TypeUnionMode.prototype.handleUnknownTypeOperatorToken =
    function() {
  this.union_.setUnknownType(true);
};


/**
 * Handles a variable type operator token.
 */
TypeBuilder.TypeUnionMode.prototype.handleVariableTypeOperatorToken =
    function() {
  this.union_.setVariableType(true);
};


/**
 * Handles an optional type operator token.
 */
TypeBuilder.TypeUnionMode.prototype.handleOptionalTypeOperatorToken =
    function() {
  this.union_.setOptionalType(true);
};


/**
 * Handles a nullable type operator token.
 */
TypeBuilder.TypeUnionMode.prototype.handleNullableTypeOperatorToken =
    function() {
  this.union_.setNullableType(true);
};


/**
 * Handles a non-nullable type operator token.
 */
TypeBuilder.TypeUnionMode.prototype.handleNonNullableTypeOperatorToken =
    function() {
  this.union_.setNonNullableType(true);
};


/**
 * Handles a type name token.
 * @param {module:lib/TypeBuilder.TypeName} typeName Type name.
 */
TypeBuilder.TypeUnionMode.prototype.handleTypeNameToken = function(typeName) {
  var typeNameObj = new TypeBuilder.TypeName();
  typeNameObj.setTypeName(typeName);
  this.union_.addTypeName(typeNameObj);
};


/**
 * Handles a module name token.
 * @param {module:lib/TypeBuilder.ModuleName} moduleName Module name.
 */
TypeBuilder.TypeUnionMode.prototype.handleModuleNameToken = function(
    moduleName) {
  var moduleNameObj = new TypeBuilder.ModuleName();
  moduleNameObj.setModuleName(moduleName);
  this.union_.addModuleName(moduleNameObj);
};


/**
 * Handles a type name token.
 * @param {module:lib/TypeBuilder.TypeName} typeName Type name.
 */
TypeBuilder.TypeUnionMode.prototype.setTypeNameToken = function(typeName) {
  this.union_.addTypeName(typeName);
};


/**
 * Handles a module name token.
 * @param {module:lib/TypeBuilder.ModuleName} moduleName Module name.
 */
TypeBuilder.TypeUnionMode.prototype.setModuleNameToken = function(
    moduleName) {
  this.union_.addModuleName(moduleName);
};


/**
 * Sets a generic type token.
 * @param {module:lib/TypeBuilder.GenericType} generic Generic type token to
 *     set.
 */
TypeBuilder.TypeUnionMode.prototype.setGenericTypeToken = function(generic) {
  this.union_.addGenericType(generic);
};


/**
 * Handles a function type token.
 * @param {module:lib/TypeBuilder.FunctionType} func Function type token to
 *     set.
 */
TypeBuilder.TypeUnionMode.prototype.setFunctionTypeToken = function(func) {
  this.union_.addFunctionType(func);
};


/**
 * Handles a record type token.
 * @param {module:lib/TypeBuilder.RecordType} record Record type token to
 *     set.
 */
TypeBuilder.TypeUnionMode.prototype.setRecordTypeToken = function(record) {
  this.union_.addRecordType(record);
};



/**
 * A class for generic type mode of a type builder.
 * @constructor
 * @extends {module:lib/TypeBuilder.Mode}
 * @alias module:lib/TypeBuilder.GenericTypeMode
 */
TypeBuilder.GenericTypeMode = function() {
  TypeBuilder.Mode.call(this);
  this.generic_ = new TypeBuilder.GenericType();
};
util.inherits(TypeBuilder.GenericTypeMode, TypeBuilder.Mode);


/**
 * Target generic type.
 * @type {module:lib/TypeBuilder.GenericType}
 * @private
 */
TypeBuilder.GenericTypeMode.prototype.generic_ = null;


/**
 * Handles a type name token.
 * @param {module:lib/TypeBuilder.TypeName} typeName Type name.
 */
TypeBuilder.GenericTypeMode.prototype.handleTypeNameToken = function(typeName) {
  var typeNameObj = new TypeBuilder.TypeName();
  typeNameObj.setTypeName(typeName);
  this.generic_.setTypeName(typeNameObj);
};


/**
 * Handles a module name token.
 * @param {module:lib/TypeBuilder.ModuleName} moduleName Module name.
 */
TypeBuilder.GenericTypeMode.prototype.handleModuleNameToken = function(
    moduleName) {
  var moduleNameObj = new TypeBuilder.ModuleName();
  moduleNameObj.setModuleName(moduleName);
  this.generic_.setModuleName(moduleNameObj);
};


/**
 * Sets a type union at the root.
 * @param {module:lib/TypeBuilder.TypeUnion} union Type union to set.
 */
TypeBuilder.GenericTypeMode.prototype.setTypeUnionToken = function(union) {
  this.generic_.addParameterTypeUnion(union);
};


/** @override */
TypeBuilder.GenericTypeMode.prototype.next = function() {
  var nextMode = this.getNext();
  if (nextMode) {
    nextMode.setGenericTypeToken(this.generic_);
  }
  TypeBuilder.Mode.prototype.next.call(this);
};



/**
 * A class for function type modes of a type builder.
 * @constructor
 * @extends {module:lib/TypeBuilder.Mode}
 * @alias module:lib/TypeBuilder.FunctionTypeMode
 */
TypeBuilder.FunctionTypeMode = function() {
  TypeBuilder.Mode.call(this);
  this.state_ = TypeBuilder.FunctionTypeMode.State.INITIAL;
  this.function_ = new TypeBuilder.FunctionType();
};
util.inherits(TypeBuilder.FunctionTypeMode, TypeBuilder.Mode);


/**
 * States for a function tyoe mode.
 * @enum {number}
 */
TypeBuilder.FunctionTypeMode.State = {
  /** Initial state.  This state should not allow to set any type. */
  INITIAL: 0,
  /**
   * Context state.  This state should allow to set a type union as a function
   * context type union.
   */
  CONTEXT: 1,
  /**
   * Parameters state.  This state should allow to set a type union as a
   * function parameter type union.
   */
  PARAMETERS: 2,
  /**
   * Return state.  This state should allow to set a type union as a function
   * return type union.
   */
  RETURN: 3
};


/**
 * State of the function type mode.
 * @type {module:lib/TypeBuilder.FunctionTypeMode.State}
 * @private:
 */
TypeBuilder.FunctionTypeMode.prototype.state_ = null;


/**
 * Handles an opening function type parameters token.
 */
TypeBuilder.FunctionTypeMode.prototype.handleOpenFunctionTypeParametersToken =
    function() {
  this.state_ = TypeBuilder.FunctionTypeMode.State.PARAMETERS;
};


/**
 * Handles a closing function type parameters token.
 * @type {?Function}
 */
TypeBuilder.FunctionTypeMode.prototype.handleCloseFunctionTypeParametersToken =
    null;


/**
 * Handles a function return type union token.
 */
TypeBuilder.FunctionTypeMode.prototype.handleFunctionTypeReturnTypeUnionToken =
    function() {
  this.state_ = TypeBuilder.FunctionTypeMode.State.RETURN;
};


/**
 * Handles a constructor type union token.
 */
TypeBuilder.FunctionTypeMode.prototype.handleConstructorTypeUnionToken =
    function() {
  this.function_.setConstructor(true);
  this.state_ = TypeBuilder.FunctionTypeMode.State.CONTEXT;
};


/**
 * Handles a function type context type union token.
 */
TypeBuilder.FunctionTypeMode.prototype.handleFunctionTypeContextTypeUnionToken =
    function() {
  this.function_.setConstructor(false);
  this.state_ = TypeBuilder.FunctionTypeMode.State.CONTEXT;
};


/**
 * Sets a type union to a context type or a parameter type or a return type by
 * the state.
 * @param {module:lib/TypeBuilder.TypeUnion} union Type union to set.
 */
TypeBuilder.FunctionTypeMode.prototype.setTypeUnionToken = function(union) {
  var State = TypeBuilder.FunctionTypeMode.State;
  switch (this.state_) {
    case State.INITIAL:
      throw Error('Cannot set the type union to the mode on an initial state.');
    case State.CONTEXT:
      this.function_.setContextTypeUnion(union);
      this.state_ = TypeBuilder.FunctionTypeMode.State.PARAMETERS;
      break;
    case State.PARAMETERS:
      this.function_.addParameterTypeUnion(union);
      break;
    case State.RETURN:
      this.function_.setReturnTypeUnion(union);
      break;
    default:
      throw Error('Unknown state on function type mode: ' + this.state_);
  }
};


/** @override */
TypeBuilder.FunctionTypeMode.prototype.next = function() {
  var nextMode = this.getNext();
  if (nextMode) {
    nextMode.setFunctionTypeToken(this.function_);
  }
  TypeBuilder.Mode.prototype.next.call(this);
};



/**
 * A class for record type modes of a type builder.
 * @constructor
 * @extends {module:lib/TypeBuilder.Mode}
 * @alias module:lib/TypeBuilder.RecordTypeMode
 */
TypeBuilder.RecordTypeMode = function() {
  TypeBuilder.Mode.call(this);
  this.record_ = new TypeBuilder.RecordType();
};
util.inherits(TypeBuilder.RecordTypeMode, TypeBuilder.Mode);


/**
 * Target record type.
 * @type {module:lib/TypeBuilder.RecordType}
 * @private
 */
TypeBuilder.RecordTypeMode.prototype.record_ = null;


/**
 * Target entry.
 * @type {?module:lib/TypeBuilder.RecordType.Entry}
 * @private
 */
TypeBuilder.RecordTypeMode.prototype.entry_ = null;


/**
 * Handles an entry value type union token.  In default, do nothing.
 * @type {?Function}
 */
TypeBuilder.RecordTypeMode.prototype.handleEntryValueTypeUnionToken = null;


/**
 * Handles an entry key name token.
 * @param {string} keyName Entry key name.
 */
TypeBuilder.RecordTypeMode.prototype.handleEntryKeyNameToken = function(
    keyName) {
  this.entry_ = new TypeBuilder.RecordType.Entry();
  this.entry_.setKeyName(keyName);
};


/**
 * Sets a type union at the root.
 * @param {module:lib/TypeBuilder.TypeUnion} union Type union to set.
 */
TypeBuilder.RecordTypeMode.prototype.setTypeUnionToken = function(union) {
  this.entry_.setValueTypeUnion(union);
  this.record_.addEntry(this.entry_);
  this.entry_ = null;
};


/** @override */
TypeBuilder.RecordTypeMode.prototype.next = function() {
  var nextMode = this.getNext();
  if (nextMode) {
    nextMode.setRecordTypeToken(this.record_);
  }
  TypeBuilder.Mode.prototype.next.call(this);
};



/**
 * A class for type names.
 * @constructor
 * @alias module:lib/TypeBuilder.TypeName
 */
TypeBuilder.TypeName = function() {};


/**
 * Type name publisher.  Set a publisher object if you want to get a link from
 * a type name when {@code #toString} is called.
 *
 * This example is a simple HTML anchor publisher.
 * <pre>
 * MyPublisher = {
 *   publish: function(typeNameObj) {
 *     return '&lt;a href=&quot;' + typeNameObj.name + '.html&quot;&gt;' +
 *         typeNameObj.name + '&lt;/a&gt;';
 *   }
 * };
 * </pre>
 * @type {?{publish: function(module:lib/TypeBuilder.TypeName): string}}
 */
TypeBuilder.TypeName.publisher = null;


/**
 * Returns an encoded file url by a type name.
 * For example, {@code foo.bar} ⇒ {@code foo.bar.html}.
 * @param {string} typeName Type name string.
 * @return {string} URL string.
 */
TypeBuilder.TypeName.getUrlByTypeName = function(typeName) {
  return encodeURIComponent(typeName) + '.html';
};


/**
 * Type name string.
 * @type {?string}
 */
TypeBuilder.TypeName.prototype.name = null;


/**
 * Sets a type name string.
 * @param {string} name Type name string.
 */
TypeBuilder.TypeName.prototype.setTypeName = function(name) {
  this.name = name;
};


/**
 * Returns a type name string.  Set {@code TypeBuilder.TypeName.publisher} if
 * you want to convert to a link from the type name.  In default, returns a
 * raw type name.
 * @override
 * @see module:lib/TypeBuilder.TypeName.publisher
 */
TypeBuilder.TypeName.prototype.toString = function() {
  if (TypeBuilder.TypeName.publisher) {
    return TypeBuilder.TypeName.publisher.publish(this);
  }
  else {
    return this.name;
  }
};


/**
 * Returns a html string.  A type name is wrapped in an anchor tag, if the type
 * dictionary does not have the type name. Otherwise, a type name is wrapped in
 * a code tag.  For example:
 * <ul>
 * <li>string, Array, window are wrapped in a code tag
 * <li>foo.bar is wrapped in an anchor tag
 * </ul>
 * @return {string} HTML string.
 */
TypeBuilder.TypeName.prototype.toHtml = function() {
  // Check the type is user define object.
  if (dict.has(this.name)) {
    return '<code>' + this.name + '</code>';
  }
  else {
    return '<a href="' + TypeBuilder.TypeName.getUrlByTypeName(this.name) +
        '">' + this.name + '</a>';
  }
};



/**
 * A class for type union objects.
 * @constructor
 * @alias module:lib/TypeBuilder.TypeUnion
 */
TypeBuilder.TypeUnion = function() {
  this.types = [];
};


/**
 * Type objects.
 * @type {Array.<module:lib/TypeBuilder.TypeName|
 *     module:lib/TypeBuilder.GenericType|module:lib/TypeBuilder.RecordType|
 *     module:lib/TypeBuilder.FunctionType>}
 */
TypeBuilder.TypeUnion.prototype.types = null;


/**
 * Optional type flag.
 * @type {boolean}
 */
TypeBuilder.TypeUnion.prototype.optional = false;


/**
 * Variable type flag.
 * @type {boolean}
 */
TypeBuilder.TypeUnion.prototype.variable = false;


/**
 * Nullable type flag.
 * @type {boolean}
 */
TypeBuilder.TypeUnion.prototype.nullable = false;


/**
 * Non nullable type flag.
 * @type {boolean}
 */
TypeBuilder.TypeUnion.prototype.nonNullable = false;


/**
 * All type flag.
 * @type {boolean}
 */
TypeBuilder.TypeUnion.prototype.all = false;


/**
 * Unknown type flag.
 * @type {boolean}
 */
TypeBuilder.TypeUnion.prototype.unknown = false;


/**
 * Adds a type name string to the union.
 * @param {module:lib/TypeBuilder.TypeName} type Type name to add.
 */
TypeBuilder.TypeUnion.prototype.addTypeName = function(type) {
  this.types.push(type);
};


/**
 * Adds a module name string to the union.
 * @param {module:lib/TypeBuilder.ModuleName} type Type name to add.
 */
TypeBuilder.TypeUnion.prototype.addModuleName = function(type) {
  this.types.push(type);
};


/**
 * Adds a generic type to the union.
 * @param {module:lib/TypeBuilder.GenericType} generic Generic type to add.
 */
TypeBuilder.TypeUnion.prototype.addGenericType = function(generic) {
  this.types.push(generic);
};


/**
 * Adds a record type to the union.
 * @param {module:lib/TypeBuilder.RecordType} record Record type to add.
 */
TypeBuilder.TypeUnion.prototype.addRecordType = function(record) {
  this.types.push(record);
};


/**
 * Adds a function type to the union.
 * @param {module:lib/TypeBuilder.FunctionType} func Function type to add.
 */
TypeBuilder.TypeUnion.prototype.addFunctionType = function(func) {
  this.types.push(func);
};


/**
 * Sets an optional type flag.
 * @param {boolean} enable Whether the type can be undefined.
 */
TypeBuilder.TypeUnion.prototype.setOptionalType = function(enable) {
  this.optional = enable;
};


/**
 * Sets a variable type flag.
 * @param {boolean} enable Whether the type can be variable.
 */
TypeBuilder.TypeUnion.prototype.setVariableType = function(enable) {
  this.variable = enable;
};


/**
 * Sets a nullable type flag.
 * @param {boolean} enable Whether the type can be null.
 */
TypeBuilder.TypeUnion.prototype.setNullableType = function(enable) {
  this.nullable = enable;
  if (enable) {
    this.nonNullable = false;
  }
};


/**
 * Sets a non-nullable type flag.
 * @param {boolean} enable Whether the type can be not null.
 */
TypeBuilder.TypeUnion.prototype.setNonNullableType = function(enable) {
  this.nonNullable = enable;
  if (enable) {
    this.nullable = false;
  }
};


/**
 * Sets an all type flag.
 * @param {boolean} enable Whether the type can be any type.
 */
TypeBuilder.TypeUnion.prototype.setAllType = function(enable) {
  this.all = enable;
};


/**
 * Sets an unknown type flag.
 * @param {boolean} enable Whether the type is unknown.
 */
TypeBuilder.TypeUnion.prototype.setUnknownType = function(enable) {
  this.unknown = enable;
};


/**
 * Returns a type union string.
 * @param {boolean} isHtml Whether the output string is html.
 * @return {string} Type union string.
 * @private
 */
TypeBuilder.TypeUnion.prototype.toStringInternal_ = function(isHtml) {
  if (this.all) {
    var typeName = new TypeBuilder.TypeName();
    typeName.setTypeName('*');
    return isHtml ? typeName.toHtml() : typeName.toString();
  }
  else if (this.unknown) {
    var typeName = new TypeBuilder.TypeName();
    typeName.setTypeName('?');
    return isHtml ? typeName.toHtml() : typeName.toString();
  }
  else {
    var str;
    var types = [].concat(this.types);

    if (this.variable) {
      str = '...';
    }
    else {
      str = '';
    }

    if (this.optional) {
      var typeName = new TypeBuilder.TypeName();
      typeName.setTypeName('undefined');
      types.push(typeName);
    }

    if (this.nullable) {
      var typeName = new TypeBuilder.TypeName();
      typeName.setTypeName('null');
      types.push(typeName);
    }

    if (this.nonNullable) {
      str += '!';
    }

    return str + (isHtml ?
        types.map(function(type) { return type.toHtml(); }) :
        types).join('|');
  }
};


/** @override */
TypeBuilder.TypeUnion.prototype.toString = function() {
  return this.toStringInternal_(false);
};


/**
 * Returns a html string.
 * @return {string} HTML string.
 */
TypeBuilder.TypeUnion.prototype.toHtml = function() {
  return this.toStringInternal_(true);
};



/**
 * A class for generic types.
 * @constructor
 * @alias module:lib/TypeBuilder.GenericType
 */
TypeBuilder.GenericType = function() {
  this.parameterTypeUnions = [];
};


/**
 * Generic type name (or module name).
 * @type {?module:lib/TypeBuilder.TypeName|module:lib/TypeBuilder.ModuleName}
 */
TypeBuilder.GenericType.prototype.genericTypeName = null;


/**
 * Generic parameter type unions.
 * @type {Array.<module:lib/TypeBuilder.TypeUnion>}
 */
TypeBuilder.GenericType.prototype.parameterTypeUnions = null;


/**
 * Sets a generic type name.
 * @param {module:lib/TypeBuilder.TypeName} name Generic type name.
 */
TypeBuilder.GenericType.prototype.setTypeName = function(name) {
  this.genericTypeName = name;
};


/**
 * Sets a generic module name.
 * @param {module:lib/TypeBuilder.ModuleName} name Generic module name.
 */
TypeBuilder.GenericType.prototype.setModuleName = function(name) {
  this.genericTypeName = name;
};


/**
 * Adds a generic parameter type union.
 * @param {module:lib/TypeBuilder.TypeUnion} type Parameter type union to
 *     add.
 */
TypeBuilder.GenericType.prototype.addParameterTypeUnion = function(type) {
  this.parameterTypeUnions.push(type);
};


/** @override */
TypeBuilder.GenericType.prototype.toString = function() {
  return this.genericTypeName + '.<' + this.parameterTypeUnions.join(', ') +
      '>';
};


/**
 * Returns a html string.
 * @return {string} HTML string.
 */
TypeBuilder.GenericType.prototype.toHtml = function() {
  var params = this.parameterTypeUnions.map(function(param) {
    return param.toHtml();
  });
  return this.genericTypeName.toHtml() + '.&lt;' + params.join(', ') + '&gt;';
};



/**
 * A class for function types.
 * @constructor
 * @alias module:lib/TypeBuilder.FunctionType
 */
TypeBuilder.FunctionType = function() {
  this.parameterTypeUnions = [];
};


/**
 * Constructor function flag.  The function has to be a constructor if this flag
 * is true.
 *@type {boolean}
 */
TypeBuilder.FunctionType.prototype.isConstructor = false;


/**
 * Function parameter type unions.
 * @type {Array.<module:lib/TypeBuilder.TypeUnion>}
 */
TypeBuilder.FunctionType.prototype.parameterTypeUnions = null;


/**
 * Fuction return type union.  Null if a function has nothing to return.
 * @type {?module:lib/TypeBuilder.TypeUnion}
 */
TypeBuilder.FunctionType.prototype.returnTypeUnion = null;


/**
 * Fuction context type union.  Null if a context where a function run on is
 * not specified.
 * @type {?module:lib/TypeBuilder.TypeUnion}
 */
TypeBuilder.FunctionType.prototype.contextTypeUnion = null;


/**
 * Sets a constructor flag.
 * @param {boolean} enable Whether a function is a constructor.
 */
TypeBuilder.FunctionType.prototype.setConstructor = function(enable) {
  this.isConstructor = enable;
};


/**
 * Sets a context type union.
 * @param {module:lib/TypeBuilder.TypeUnion} union Context type union.
 */
TypeBuilder.FunctionType.prototype.setContextTypeUnion = function(union) {
  this.contextTypeUnion = union;
};


/**
 * Adds a parameter type union.
 * @param {module:lib/TypeBuilder.TypeUnion} param Parameter type union to
 *     add.
 */
TypeBuilder.FunctionType.prototype.addParameterTypeUnion = function(param) {
  this.parameterTypeUnions.push(param);
};


/**
 * Sets a return type union.
 * @param {module:lib/TypeBuilder.TypeUnion} ret Return type union.
 */
TypeBuilder.FunctionType.prototype.setReturnTypeUnion = function(ret) {
  this.returnTypeUnion = ret;
};


/**
 * Returns a function type expression string.
 * @param {boolean} isHtml Whether the output string is HTML.
 * @return {string} Function type expression string.
 * @private
 */
TypeBuilder.FunctionType.prototype.toStringInternal_ = function(isHtml) {
  var str = 'function(';

  var arr;
  if (isHtml) {
    arr = this.parameterTypeUnions.map(function(param) {
      return param.toHtml();
    });
  }
  else {
    arr = [].concat(this.parameterTypeUnions);
  }

  if (this.contextTypeUnion) {
    if (this.isConstructor) {
      arr.unshift('new:' + (isHtml ? this.contextTypeUnion.toHtml() :
                                      this.contextTypeUnion));
    }
    else {
      arr.unshift('this:' + (isHtml ? this.contextTypeUnion.toHtml() :
                                       this.contextTypeUnion));
    }
  }

  str += arr.join(', ') + ')';

  if (this.returnTypeUnion) {
    str += ': ' + (isHtml ? this.returnTypeUnion.toHtml() :
                            this.returnTypeUnion);
  }

  return str;
};


/** @override */
TypeBuilder.FunctionType.prototype.toString = function() {
  return this.toStringInternal_(false);
};


/**
 * Returns a html string.
 * @return {string} HTML string.
 */
TypeBuilder.FunctionType.prototype.toHtml = function() {
  return this.toStringInternal_(true);
};



/**
 * A class for record types.
 * @constructor
 * @alias module:lib/TypeBuilder.RecordType
 */
TypeBuilder.RecordType = function() {
  this.entries = [];
};


/**
 * An array of entries.
 * @type {Array.<module:lib/TypeBuilder.RecordType.Entry>}
 */
TypeBuilder.RecordType.prototype.entries = null;


/**
 * Adds an entry to the target record.
 * @param {TypeBuilder.RecordType.Entry} entry Entry to add.
 */
TypeBuilder.RecordType.prototype.addEntry = function(entry) {
  this.entries.push(entry);
};


/** @override */
TypeBuilder.RecordType.prototype.toString = function() {
  return '{ ' + this.entries.join(', ') + ' }';
};


/**
 * Returns a html string.
 * @return {string} HTML string.
 */
TypeBuilder.RecordType.prototype.toHtml = function() {
  return '{ ' + this.entries.map(function(entry) {
    return entry.toHtml();
  }).join(', ') + ' }';
};



/**
 * A class for entries.
 * @constructor
 * @alias module:lib/TypeBuilder.RecordType.Entry
 */
TypeBuilder.RecordType.Entry = function() {};


/**
 * Entry key name.
 * @type {string}
 */
TypeBuilder.RecordType.Entry.prototype.name = null;


/**
 * Entry value type union.
 * @type {?module:lib/TypeBuilder.TypeUnion}
 */
TypeBuilder.RecordType.Entry.prototype.typeUnion = null;


/**
 * Sets an entry key name.
 * @param {string} keyName Entry key name to set.
 */
TypeBuilder.RecordType.Entry.prototype.setKeyName = function(keyName) {
  this.name = keyName;
};


/**
 * Sets a value type union.
 * @param {module:lib/TypeBuilder.TypeUnion} type Value type union to set.
 */
TypeBuilder.RecordType.Entry.prototype.setValueTypeUnion = function(type) {
  this.typeUnion = type;
};


/** @override */
TypeBuilder.RecordType.Entry.prototype.toString = function() {
  return this.name + ': ' + this.typeUnion;
};


/** @override */
TypeBuilder.RecordType.Entry.prototype.toHtml = function() {
  return this.name + ': ' + this.typeUnion.toHtml();
};



/**
 * A class for module names.
 * @constructor
 * @alias module:lib/TypeBuilder.ModuleName
 */
TypeBuilder.ModuleName = function() {};


/**
 * Module name publisher.  Set a publisher object if you want to get a link from
 * a module name when {@code #toString} is called.
 *
 * This example is a simple HTML anchor publisher.
 * <pre>
 * MyPublisher = {
 *   publish: function(moduleNameObj) {
 *     return '&lt;a href=&quot;' + moduleNameObj.name + '.html&quot;&gt;' +
 *         moduleNameObj.name + '&lt;/a&gt;';
 *   }
 * };
 * </pre>
 * @type {?{publish: function(module:lib/TypeBuilder.ModuleName): string}}
 */
TypeBuilder.ModuleName.publisher = null;


/**
 * Returns an encoded file url by a module name.
 * For example, {@code module:foo/bar} ⇒ {@code module%3Afoo%2Fbar.html}.
 * @param {string} moduleName Module name string.
 * @return {string} URL string.
 */
TypeBuilder.ModuleName.getUrlByModuleName = function(moduleName) {
  return encodeURIComponent('module:' + moduleName) + '.html';
};


/**
 * Type name string.
 * @type {?string}
 */
TypeBuilder.ModuleName.prototype.name = null;


/**
 * Sets a type name string.
 * @param {string} name Type name string.
 */
TypeBuilder.ModuleName.prototype.setModuleName = function(name) {
  this.name = name;
};


/**
 * Returns a type name string.  Set {@code TypeBuilder.ModuleName.publisher} if
 * you want to convert to a link from the type name.  In default, returns a
 * raw type name.
 * @override
 * @see module:lib/TypeBuilder.ModuleName.publisher
 */
TypeBuilder.ModuleName.prototype.toString = function() {
  if (TypeBuilder.ModuleName.publisher) {
    return TypeBuilder.ModuleName.publisher.publish(this);
  }
  else {
    return 'module:' + this.name;
  }
};


/**
 * Returns a html.
 * @return {string} HTML string.
 */
TypeBuilder.ModuleName.prototype.toHtml = function() {
  return 'module:<a href="' + TypeBuilder.ModuleName.getUrlByModuleName(
      this.name) + '">' + this.name + '</a>';
};


// Exports the constructor.
module.exports = TypeBuilder;
