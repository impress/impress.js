{
  var lodash = require('lodash');
  var NodeType = require('../lib/NodeType.js');

  var OperatorType = {
    UNION: 0,
    MEMBER: 1,
    GENERIC: 2,
    ARRAY: 3,
    OPTIONAL: 4,
    NULLABLE: 5,
    NOT_NULLABLE: 6,
    VARIADIC: 7,
    INNER_MEMBER: 8,
    INSTANCE_MEMBER: 9,
  };

  var FunctionModifierType = {
    NONE: 0,
    CONTEXT: 1,
    NEW: 2,
  };

  function reverse(array) {
    var reversed = [].concat(array);
    reversed.reverse();
    return reversed;
  }

  function buildByFirstAndRest(first, restsWithComma, restIndex) {
    if (!first) return [];

    var rests = restsWithComma ? lodash.pluck(restsWithComma, restIndex) : [];
    return [first].concat(rests);
  }

  function reportSemanticIssue(msg) {
    console.warn(msg);
  }
}


// "?" is a ambiguous token. It has 2 meanings. The first meaning is a prefix
// nullable operator. Another meaning is an unknown type keyword.
// If "typeExpr" is equivalent to "notUnknownTypeExpr" and then "?" arrived,
// parsing "prefixModifiers" become successful, but it make a parsing failure
// because parsing "modifiee" is failed.
//
// So, the parser try to parse the assamption that it is a prefix nullable
// operator, if the try is failed the parser try to parse under the assamption
// that it is an unknown type keyword.
typeExpr = notUnknownTypeExpr / unknownTypeExpr

notUnknownTypeExpr = prefixModifiersWithWhiteSpaces:(prefixModifiers _)*
                     modifieeWithWhiteSpaces:modifiee _
                     postfixModifiersWithWhiteSpaces:(postfixModifiers _)* {
    var prefixModifiers = lodash.pluck(prefixModifiersWithWhiteSpaces, 0);
    var modifiee = modifieeWithWhiteSpaces;
    var postfixModifiers = lodash.pluck(postfixModifiersWithWhiteSpaces, 0);

    var modifiersOrderedByPriority = postfixModifiers.concat(reverse(prefixModifiers));
    var rootNode = modifiersOrderedByPriority.reduce(function(prevNode, operator) {
      switch (operator.operatorType) {
        case OperatorType.UNION:
          var unionOperator = operator;
          return {
            type: NodeType.UNION,
            left: prevNode,
            right: unionOperator.right,
          };
        case OperatorType.MEMBER:
          var memberOperator = operator;
          return {
            type: NodeType.MEMBER,
            owner: prevNode,
            name: memberOperator.memberName,
          };
        case OperatorType.INNER_MEMBER:
          var memberOperator = operator;
          return {
            type: NodeType.INNER_MEMBER,
            owner: prevNode,
            name: memberOperator.memberName,
          };
        case OperatorType.INSTANCE_MEMBER:
          var memberOperator = operator;
          return {
            type: NodeType.INSTANCE_MEMBER,
            owner: prevNode,
            name: memberOperator.memberName,
          };
        case OperatorType.GENERIC:
          var genericOperator = operator;
          return {
            type: NodeType.GENERIC,
            subject: prevNode,
            objects: genericOperator.objects,
          }
        case OperatorType.ARRAY:
          var arrayOperator = operator;
          return {
            type: NodeType.GENERIC,
            subject: {
              type: NodeType.NAME,
              name: 'Array'
            },
            objects: [ prevNode ],
          };
        case OperatorType.OPTIONAL:
          return {
            type: NodeType.OPTIONAL,
            value: prevNode,
          };
        case OperatorType.NULLABLE:
          return {
            type: NodeType.NULLABLE,
            value: prevNode,
          };
        case OperatorType.NOT_NULLABLE:
          return {
            type: NodeType.NOT_NULLABLE,
            value: prevNode,
          };
        case OperatorType.VARIADIC:
          return {
            type: NodeType.VARIADIC,
            value: prevNode,
          };
        default:
          throw Error('Unexpected token: ' + token);
      }
    }, modifiee);


    return rootNode;
  }

prefixModifiers =
    nullableTypeOperator
    / notNullableTypeOperator
    / variadicTypeOperator
    / deprecatedOptionalTypeOperator

modifiee =
    funcTypeExpr
    / recordTypeExpr
    / parenthesisTypeExpr
    / anyTypeExpr
    / unknownTypeExpr
    / moduleNameExpr
    / typeNameExpr

postfixModifiers =
    optionalTypeOperator
    / arrayOfGenericTypeOperatorJsDocFlavored
    / genericTypeExpr
    / memberTypeExpr
    / innerMemberTypeExpr
    / instanceMemberTypeExpr
    / unionTypeExpr
    / deprecatedNullableTypeOperator
    / deprecatedNotNullableTypeOperator


/*
 * Parenthesis expressions.
 *
 * Examples:
 *   - (Foo|Bar)
 *   - (module: path/to/file).Module
 */
parenthesisTypeExpr = "(" _ wrapped:typeExpr _ ")" {
    return wrapped;
  }


/*
 * Type name expressions.
 *
 * Examples:
 *   - string
 *   - null
 *   - Error
 *   - $
 *   - _
 */
typeNameExpr = name:$(jsIdentifier) {
    return {
      type: NodeType.NAME,
      name: name
    };
  }
jsIdentifier = [a-zA-Z_$][a-zA-Z0-9_$]*


/*
 * Module name expressions.
 *
 * Examples:
 *   - module:path/to/file
 *   - module:path/to/file.js
 */
moduleNameExpr = "module" _ ":" _ filePath:$(moduleNameFilePathPart) {
    return {
      type: NodeType.MODULE,
      path: filePath
    };
  }

moduleNameFilePathPart = [a-zA-Z_0-9_$./-]+


/*
 * Any type expressions.
 *
 * Examples:
 *   - *
 */
anyTypeExpr = "*" {
    return { type: NodeType.ANY };
  }


/*
 * Unknown type expressions.
 *
 * Examples:
 *   - ?
 */
unknownTypeExpr = "?" {
    return { type: NodeType.UNKNOWN };
  }


/*
 * Function type expressions.
 *
 * Examples:
 *   - function(string)
 *   - function(string, ...string)
 *   - function():number
 *   - function(this:jQuery):jQuery
 *   - function(new:Error)
 */
funcTypeExpr = "function" _ "(" _ paramParts:funcTypeExprParamsPart _ ")" _
               returnedTypePart:(_ ":" _ typeExpr)? {
    var modifierGroups = lodash.groupBy(paramParts, lodash.property('modifierType'));

    var params = [];
    var noModifiers = modifierGroups[FunctionModifierType.NONE];
    if (noModifiers) {
      params = noModifiers.map(function(paramPartWithNoModifier) {
        return paramPartWithNoModifier.value;
      });
    }


    var thisValue = null;
    var thisValueModifiers = modifierGroups[FunctionModifierType.THIS];
    if (thisValueModifiers) {
      if (thisValueModifiers.length > 1) {
        reportSemanticIssue('"this" keyword should be declared only once');
      }

      // Enable the only first thisValue modifier.
      thisValue = thisValueModifiers[0].value;
    }


    var newValue = null;
    var newModifiers = modifierGroups[FunctionModifierType.NEW];
    if (newModifiers) {
      if (newModifiers.length > 1) {
        reportSemanticIssue('"new" keyword should be declared only once');
      }

      // Enable the only first new instance modifier.
      newValue = newModifiers[0].value;
    }

    var returnedTypeNode = returnedTypePart ? returnedTypePart[3] : null;

    return {
      type: NodeType.FUNCTION,
      params: params,
      returns: returnedTypeNode,
      thisValue: thisValue,
      newValue: newValue,
    };
  }

funcTypeExprParamsPart = firstParam:funcTypeExprParam? restParamsWithComma:(_ "," _ funcTypeExprParam)* {
    var params = buildByFirstAndRest(firstParam, restParamsWithComma, 3);
    return params;
  }

funcTypeExprParam = thisValueTypeModifier / newTypeModifier / noModifier

thisValueTypeModifier = "this" _ ":" _ value:typeExpr {
    return {
      modifierType: FunctionModifierType.THIS,
      value: value
    };
  }

newTypeModifier = "new" _ ":" _ value:typeExpr {
    return {
      modifierType: FunctionModifierType.NEW,
      value: value
    };
  }

noModifier = value:typeExpr {
    return {
      modifierType: FunctionModifierType.NONE,
      value: value
    };
  }


/*
 * Record type expressions.
 *
 * Examples:
 *   - {}
 *   - {length}
 *   - {length:number}
 *   - {toString:Function,valueOf:Function}
 */
recordTypeExpr = "{" _ firstEntry:recordEntry? restEntriesWithComma:(_ "," _ recordEntry)* _ "}" {
    var entries = buildByFirstAndRest(firstEntry, restEntriesWithComma, 3);

    return {
      type: NodeType.RECORD,
      entries: entries
    };
  }

recordEntry = key:$(jsIdentifier) valueWithColon:(_ ":" _ typeExpr)? {
    var hasValue = Boolean(valueWithColon);
    var value = hasValue ? valueWithColon[3] : null;

    return {
      type: NodeType.RECORD_ENTRY,
      key: key,
      value: value,
      hasValue: hasValue,
    };
  }


/*
 * Nullable type expressions.
 *
 * Examples:
 *   - ?string
 *   - string? (deprecated)
 */
nullableTypeOperator = "?" {
    return { operatorType: OperatorType.NULLABLE };
  }

deprecatedNullableTypeOperator = nullableTypeOperator


/*
 * Nullable type expressions.
 *
 * Examples:
 *   - !Object
 *   - Object! (deprecated)
 */
notNullableTypeOperator = "!" {
    return { operatorType: OperatorType.NOT_NULLABLE };
  }

deprecatedNotNullableTypeOperator = notNullableTypeOperator


/*
 * Optional type expressions.
 *
 * Examples:
 *   - string=
 *   - =string (deprecated)
 */
optionalTypeOperator = "=" {
    return { operatorType: OperatorType.OPTIONAL };
  }

deprecatedOptionalTypeOperator = optionalTypeOperator


/*
 * Variadic type expressions.
 *
 * Examples:
 *   - ...string
 */
variadicTypeOperator = "..." {
    return { operatorType: OperatorType.VARIADIC };
  }


/*
 * Union type expressions.
 *
 * Examples:
 *   - number|undefined
 *   - Foo|Bar|Baz
 */
unionTypeExpr = unionTypeOperator _ right:typeExpr {
    return {
      operatorType: OperatorType.UNION,
      right: right,
    };
  }

unionTypeOperator = "|"


/*
 * Member type expressions.
 *
 * Examples:
 *   - owner.member
 *   - superOwner.owner.member
 */
memberTypeExpr = memberTypeOperator _ memberName:memberName {
    return {
      operatorType: OperatorType.MEMBER,
      memberName: memberName,
    };
  }

memberTypeOperator = "."

memberName = name:$(jsIdentifier) {
    return name;
  }


/*
 * Inner member type expressions.
 *
 * Examples:
 *   - owner~innerMember
 *   - superOwner~owner~innerMember
 */
innerMemberTypeExpr = innerMemberTypeOperator _ memberName:memberName {
    return {
      operatorType: OperatorType.INNER_MEMBER,
      memberName: memberName,
    };
  }

innerMemberTypeOperator = "~"


/*
 * Instance member type expressions.
 *
 * Examples:
 *   - owner#instanceMember
 *   - superOwner#owner#instanceMember
 */
instanceMemberTypeExpr = instanceMemberTypeOperator _ memberName:memberName {
    return {
      operatorType: OperatorType.INSTANCE_MEMBER,
      memberName: memberName,
    };
  }

instanceMemberTypeOperator = "#"


/*
 * Generic type expressions.
 *
 * Examples:
 *   - Function<T>
 *   - Array.<string>
 */
genericTypeExpr =
  genericTypeStartToken _
  objects:genericTypeExprObjectivePart _
  genericTypeEndToken {
    return {
      operatorType: OperatorType.GENERIC,
      objects: objects,
    };
  }

genericTypeStartToken =
  genericTypeEcmaScriptFlavoredStartToken /
  genericTypeTypeScriptFlavoredStartToken

genericTypeEcmaScriptFlavoredStartToken = ".<"

genericTypeTypeScriptFlavoredStartToken = "<"

genericTypeEndToken = ">"

genericTypeExprObjectivePart = first:typeExpr restsWithComma:(_ "," _ typeExpr)* {
    var objects = buildByFirstAndRest(first, restsWithComma, 3);
    return objects;
  }


/*
 * JSDoc style array of a generic type expressions.
 *
 * Examples:
 *   - string[]
 *   - number[][]
 */
arrayOfGenericTypeOperatorJsDocFlavored = "[]" {
    return { operatorType: OperatorType.ARRAY };
  }


/*
 * White spaces.
 */
_  = [ \t\r\n ]*
