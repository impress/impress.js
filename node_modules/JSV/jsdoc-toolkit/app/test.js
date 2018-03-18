load("app/frame/Dumper.js");
function symbolize(opt) {
	symbols = null;
	JSDOC.JsDoc(opt);
	symbols = JSDOC.JsDoc.symbolSet;
}

var testCases = [
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/overview.js"]});
		//print(Dumper.dump(symbols));	
		is('symbols.getSymbolByName("My Cool Library").name', 'My Cool Library', 'File overview can be found by alias.');		
	}
	,
	function() {
		symbolize({_: [SYS.pwd+"test/name.js"]});

		is('symbols.getSymbol("Response").name', "Response", 'Virtual class name is found.');
		is('symbols.getSymbol("Response#text").alias', "Response#text", 'Virtual method name is found.');
		is('symbols.getSymbol("Response#text").memberOf', "Response", 'Virtual method parent name is found.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/prototype.js"]});

		is('symbols.getSymbol("Article").name', "Article", 'Function set to constructor prototype with inner constructor name is found.');
		is('symbols.getSymbol("Article").hasMethod("init")', true, 'The initializer method name of prototype function is correct.');
		is('symbols.getSymbol("Article").hasMember("counter")', true, 'A static property set in the prototype definition is found.');
		is('symbols.getSymbol("Article").hasMember("title")', true, 'An instance property set in the prototype is found.');
		is('symbols.getSymbol("Article#title").isStatic', false, 'An instance property has isStatic set to false.');
		is('symbols.getSymbol("Article.counter").name', "counter", 'A static property set in the initializer has the name set correctly.');
		is('symbols.getSymbol("Article.counter").memberOf', "Article", 'A static property set in the initializer has the memberOf set correctly.');
		is('symbols.getSymbol("Article.counter").isStatic', true, 'A static property set in the initializer has isStatic set to true.');
	}
	,
	function() {
		symbolize({a:true, _: [SYS.pwd+"test/prototype_oblit.js"]});
		
		is('symbols.getSymbol("Article").name', "Article", 'Oblit set to constructor prototype name is found.');
		is('typeof symbols.getSymbol("Article.prototype")', "undefined", 'The prototype oblit is not a symbol.');
		is('symbols.getSymbol("Article#getTitle").name', "getTitle", 'The nonstatic method name of prototype oblit is correct.');
		is('symbols.getSymbol("Article#getTitle").alias', "Article#getTitle", 'The alias of non-static method of prototype oblit is correct.');
		is('symbols.getSymbol("Article#getTitle").isStatic', false, 'The isStatic of a nonstatic method of prototype oblit is correct.');
		is('symbols.getSymbol("Article.getTitle").name', "getTitle", 'The static method name of prototype oblit is correct.');
		is('symbols.getSymbol("Article.getTitle").isStatic', true, 'The isStatic of a static method of prototype oblit is correct.');
		is('symbols.getSymbol("Article#getTitle").isa', "FUNCTION", 'The isa of non-static method of prototype oblit is correct.');
		is('symbols.getSymbol("Article.getTitle").alias', "Article.getTitle", 'The alias of a static method of prototype oblit is correct.');
		is('symbols.getSymbol("Article.getTitle").isa', "FUNCTION", 'The isa of static method of prototype oblit is correct.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/prototype_oblit_constructor.js"]});
		
		is('symbols.getSymbol("Article").name', "Article", 'Oblit set to constructor prototype with inner constructor name is found.');
		is('symbols.getSymbol("Article#init").name', "init", 'The initializer method name of prototype oblit is correct.');
		is('symbols.getSymbol("Article").hasMember("pages")', true, 'Property set by initializer method "this" is on the outer constructor.');
		is('symbols.getSymbol("Article#Title").name', "Title", 'Name of the inner constructor name is found.');
		is('symbols.getSymbol("Article#Title").memberOf', "Article", 'The memberOf of the inner constructor name is found.');
		is('symbols.getSymbol("Article#Title").isa', "CONSTRUCTOR", 'The isa of the inner constructor name is constructor.');
		is('symbols.getSymbol("Article#Title").hasMember("title")', true, 'A property set on the inner constructor "this"  is on the inner constructor.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/inner.js"]});
		
		is('symbols.getSymbol("Outer").name', "Outer", 'Outer constructor prototype name is found.');
		is('symbols.getSymbol("Outer").methods.length', 1, 'Inner function doesnt appear as a method of the outer.');
		is('symbols.getSymbol("Outer").hasMethod("open")', true, 'Outer constructors methods arent affected by inner function.');
		is('symbols.getSymbol("Outer-Inner").alias', "Outer-Inner", 'Alias of inner function is found.');
		is('symbols.getSymbol("Outer-Inner").isa', "CONSTRUCTOR", 'isa of inner function constructor is found.');
		is('symbols.getSymbol("Outer-Inner").memberOf', "Outer", 'The memberOf of inner function is found.');
		is('symbols.getSymbol("Outer-Inner").name', "Inner", 'The name of inner function is found.');
		is('symbols.getSymbol("Outer-Inner#name").name', "name", 'A member of the inner function constructor, attached to "this" is found on inner.');
		is('symbols.getSymbol("Outer-Inner#name").memberOf', "Outer-Inner", 'The memberOf of an inner function member is found.');		
	}
	,
	function() {
		symbolize({a:true, _: [SYS.pwd+"test/prototype_nested.js"]});
		
		is('symbols.getSymbol("Word").name', "Word", 'Base constructor name is found.');
		is('symbols.getSymbol("Word").hasMethod("reverse")', true, 'Base constructor method is found.');
		is('symbols.getSymbol("Word").methods.length', 1, 'Base constructor has only one method.');
		is('symbols.getSymbol("Word").memberOf', "", 'Base constructor memberOf is empty.');
		is('symbols.getSymbol("Word#reverse").name', "reverse", 'Member of constructor prototype name is found.');
		is('symbols.getSymbol("Word#reverse").memberOf', "Word", 'Member of constructor prototype memberOf is found.');
		is('symbols.getSymbol("Word#reverse.utf8").name', "utf8", 'Member of constructor prototype method name is found.');
		is('symbols.getSymbol("Word#reverse.utf8").memberOf', "Word#reverse", 'Static nested member memberOf is found.');
	}
	,
	function() {
		symbolize({a:true, _: [SYS.pwd+"test/namespace_nested.js"]});
		
		is('symbols.getSymbol("ns1").name', "ns1", 'Base namespace name is found.');
		is('symbols.getSymbol("ns1").memberOf', "", 'Base namespace memberOf is empty (its a constructor).');
		is('symbols.getSymbol("ns1.ns2").name', "ns2", 'Nested namespace name is found.');
 		is('symbols.getSymbol("ns1.ns2").alias', "ns1.ns2", 'Nested namespace alias is found.');
 		is('symbols.getSymbol("ns1.ns2").memberOf', "ns1", 'Nested namespace memberOf is found.');
 		is('symbols.getSymbol("ns1.ns2.Function1").name', "Function1", 'Method of nested namespace name is found.');
 		is('symbols.getSymbol("ns1.ns2.Function1").memberOf', "ns1.ns2", 'Constructor of nested namespace memberOf is found.');			
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/functions_nested.js"]});
		
		is('symbols.getSymbol("Zop").name', "Zop", 'Any constructor name is found.');
		is('symbols.getSymbol("Zop").isa', "CONSTRUCTOR", 'It isa constructor.');
		is('symbols.getSymbol("Zop").hasMethod("zap")', true, 'Its method name, set later, is in methods array.');
		is('symbols.getSymbol("Foo").name', "Foo", 'The containing constructor name is found.');
		is('symbols.getSymbol("Foo").hasMethod("methodOne")', true, 'Its method name is found.');
		is('symbols.getSymbol("Foo").hasMethod("methodTwo")', true, 'Its second method name is found.');
		is('symbols.getSymbol("Foo#methodOne").alias', "Foo#methodOne", 'A methods alias is found.');
		is('symbols.getSymbol("Foo#methodOne").isStatic', false, 'A methods is not static.');
		is('symbols.getSymbol("Bar").name', "Bar", 'A global function declared inside another function is found.');
		is('symbols.getSymbol("Bar").isa', "FUNCTION", 'It isa function.');
		is('symbols.getSymbol("Bar").memberOf', "_global_", 'It is global.');
		is('symbols.getSymbol("Foo-inner").name', "inner", 'An inner functions name is found.');
		is('symbols.getSymbol("Foo-inner").memberOf', "Foo", 'It is member of the outer function.');
		is('symbols.getSymbol("Foo-inner").isInner', true, 'It is an inner function.');
	}
	,
	function() {
		symbolize({a:true, _: [SYS.pwd+"test/memberof_constructor.js"]});
		
		is('symbols.getSymbol("Circle#Tangent").name', "Tangent", 'Constructor set on prototype using @member has correct name.');
 		is('symbols.getSymbol("Circle#Tangent").memberOf', "Circle", 'Constructor set on prototype using @member has correct memberOf.');
 		is('symbols.getSymbol("Circle#Tangent").alias', "Circle#Tangent", 'Constructor set on prototype using @member has correct alias.');
 		is('symbols.getSymbol("Circle#Tangent").isa', "CONSTRUCTOR", 'Constructor set on prototype using @member has correct isa.');
		is('symbols.getSymbol("Circle#Tangent").isStatic', false, 'Constructor set on prototype using @member is not static.');
		is('symbols.getSymbol("Circle#Tangent#getDiameter").name', "getDiameter", 'Method set on prototype using @member has correct name.');
		is('symbols.getSymbol("Circle#Tangent#getDiameter").memberOf', "Circle#Tangent", 'Method set on prototype using @member has correct memberOf.');
		is('symbols.getSymbol("Circle#Tangent#getDiameter").alias', "Circle#Tangent#getDiameter", 'Method set on prototype using @member has correct alias.');
		is('symbols.getSymbol("Circle#Tangent#getDiameter").isa', "FUNCTION", 'Method set on prototype using @member has correct isa.');
		is('symbols.getSymbol("Circle#Tangent#getDiameter").isStatic', false, 'Method set on prototype using @member is not static.');
	}
	,
	function() {
		symbolize({a:true, p: true,  _: [SYS.pwd+"test/memberof.js"]});
		
		is('symbols.getSymbol("pack.install").alias', "pack.install", 'Using @memberOf sets alias, when parent name is in memberOf tag.');
		is('symbols.getSymbol("pack.install.overwrite").name', "install.overwrite", 'Using @memberOf sets name, even if the name is dotted.');
		is('symbols.getSymbol("pack.install.overwrite").memberOf', "pack", 'Using @memberOf sets memberOf.');
 		is('symbols.getSymbol("pack.install.overwrite").isStatic', true, 'Using @memberOf with value not ending in octothorp sets isStatic to true.');
	}
	,
	function() {
		symbolize({a:true, p: true,  _: [SYS.pwd+"test/memberof2.js"]});
		
		is('symbols.getSymbol("Foo#bar").alias', "Foo#bar", 'An inner function can be documented as an instance method.');
		is('symbols.getSymbol("Foo.zip").alias', "Foo.zip", 'An inner function can be documented as a static method.');
		is('symbols.getSymbol("Foo.Fiz").alias', "Foo.Fiz", 'An inner function can be documented as a static constructor.');
		is('symbols.getSymbol("Foo.Fiz#fipple").alias', "Foo.Fiz#fipple", 'An inner function can be documented as a static constructor with a method.');
		is('symbols.getSymbol("Foo#blat").alias', "Foo#blat", 'An global function can be documented as an instance method.');
	}
	,
	function() {
		symbolize({a:true, p: true,  _: [SYS.pwd+"test/memberof3.js"]});
		
		is('symbols.getSymbol("Foo#bar").alias', "Foo#bar", 'A virtual field can be documented as an instance method.');
		is('symbols.getSymbol("Foo2#bar").alias', "Foo2#bar", 'A virtual field with the same name can be documented as an instance method.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/borrows.js"]});

		is('symbols.getSymbol("Layout").name', "Layout", 'Constructor can be found.');
		is('symbols.getSymbol("Layout").hasMethod("init")', true, 'Constructor method name can be found.');
		is('symbols.getSymbol("Layout").hasMember("orientation")', true, 'Constructor property name can be found.');
		
		is('symbols.getSymbol("Page").hasMethod("reset")', true, 'Second constructor method name can be found.');
		is('symbols.getSymbol("Page").hasMember("orientation")', true, 'Second constructor borrowed property name can be found in properties.');
		is('symbols.getSymbol("Page#orientation").memberOf', "Page", 'Second constructor borrowed property memberOf can be found.');
		is('symbols.getSymbol("Page-getInnerElements").alias', "Page-getInnerElements", 'Can borrow an inner function and it is still inner.');
		is('symbols.getSymbol("Page.units").alias', "Page.units", 'Can borrow a static function and it is still static.');
		
		is('symbols.getSymbol("ThreeColumnPage#init").alias', "ThreeColumnPage#init", 'Third constructor method can be found even though method with same name is borrowed.');
		is('symbols.getSymbol("ThreeColumnPage#reset").alias', "ThreeColumnPage#reset", 'Borrowed method can be found.');
		is('symbols.getSymbol("ThreeColumnPage#orientation").alias', "ThreeColumnPage#orientation", 'Twice borrowed method can be found.');
	
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/borrows2.js"]});

		is('symbols.getSymbol("Foo").hasMethod("my_zop")', true, 'Borrowed method can be found.');		
		is('symbols.getSymbol("Bar").hasMethod("my_zip")', true, 'Second borrowed method can be found.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/constructs.js"]});

		is('symbols.getSymbol("Person").hasMethod("say")', true, 'The constructs tag creates a class that lends can add a method to.');		
	}
	,
	function() {
		symbolize({a: true, _: [SYS.pwd+"test/augments.js", SYS.pwd+"test/augments2.js"]});
		
		is('symbols.getSymbol("Page").augments[0]', "Layout", 'An augmented class can be found.');
		is('symbols.getSymbol("Page#reset").alias', "Page#reset", 'Method of augmenter can be found.');
		is('symbols.getSymbol("Page").hasMethod("Layout#init")', true, 'Method from augmented can be found.');
		is('symbols.getSymbol("Page").hasMember("Layout#orientation")', true, 'Property from augmented can be found.');
		is('symbols.getSymbol("Page").methods.length', 3, 'Methods of augmented class are included in methods array.');
	
		is('symbols.getSymbol("ThreeColumnPage").augments[0]', "Page", 'The extends tag is a synonym for augments.');
		is('symbols.getSymbol("ThreeColumnPage").hasMethod("ThreeColumnPage#init")', true, 'Local method overrides augmented method of same name.');
		is('symbols.getSymbol("ThreeColumnPage").methods.length', 3, 'Local method count is right.');
		
		is('symbols.getSymbol("NewsletterPage").augments[0]', "ThreeColumnPage", 'Can augment across file boundaries.');
		is('symbols.getSymbol("NewsletterPage").augments.length', 2, 'Multiple augments are supported.');
		is('symbols.getSymbol("NewsletterPage").inherits[0].alias', "Junkmail#annoy", 'Inherited method with augments.');
		is('symbols.getSymbol("NewsletterPage").methods.length', 6, 'Methods of augmented class are included in methods array across files.');
		is('symbols.getSymbol("NewsletterPage").properties.length', 1, 'Properties of augmented class are included in properties array across files.');
	}
	,
	function() {
		symbolize({a:true, _: [SYS.pwd+"test/static_this.js"]});
		
		is('symbols.getSymbol("box.holder").name', "holder", 'Static namespace name can be found.');
		is('symbols.getSymbol("box.holder.foo").name', "foo", 'Static namespace method name can be found.');
		is('symbols.getSymbol("box.holder").isStatic', true, 'Static namespace method is static.');
		
		is('symbols.getSymbol("box.holder.counter").name', "counter", 'Instance namespace property name set on "this" can be found.');
		is('symbols.getSymbol("box.holder.counter").alias', "box.holder.counter", 'Instance namespace property alias set on "this" can be found.');
		is('symbols.getSymbol("box.holder.counter").memberOf', "box.holder", 'Static namespace property memberOf set on "this" can be found.');
	}
	,
	function() {
		symbolize({a:true, p: true, _: [SYS.pwd+"test/lend.js"]});

		is('symbols.getSymbol("Person").name', "Person", 'Class defined in lend comment is found.');
		is('symbols.getSymbol("Person").hasMethod("initialize")', true, 'Lent instance method name can be found.');
		is('symbols.getSymbol("Person").hasMethod("say")', true, 'Second instance method can be found.');
		is('symbols.getSymbol("Person#sing").isStatic', false, 'Instance method is known to be not static.');
		
		is('symbols.getSymbol("Person.getCount").name', "getCount", 'Static method name from second lend comment can be found.');
		is('symbols.getSymbol("Person.getCount").isStatic', true, 'Static method from second lend comment is known to be static.');
	
		is('LOG.warnings.filter(function($){if($.indexOf("notok") > -1) return $}).length', 1, 'A warning is emitted when lending to an undocumented parent.');
	}
	,
	function() {
		symbolize({a:true, _: [SYS.pwd+"test/param_inline.js"]});
	
		is('symbols.getSymbol("Layout").params[0].type', "int", 'Inline param name is set.');
		is('symbols.getSymbol("Layout").params[0].desc', "The number of columns.", 'Inline param desc is set from comment.');
		is('symbols.getSymbol("Layout#getElement").params[0].name', "id", 'User defined param documentation takes precedence over parser defined.');
		is('symbols.getSymbol("Layout#getElement").params[0].isOptional', true, 'Default for param is to not be optional.');
		is('symbols.getSymbol("Layout#getElement").params[1].isOptional', false, 'Can mark a param as being optional.');
		is('symbols.getSymbol("Layout#getElement").params[1].type', "number|string", 'Type of inline param doc can have multiple values.');
		is('symbols.getSymbol("Layout#Canvas").params[0].type', "", 'Type can be not defined for some params.');
		is('symbols.getSymbol("Layout#Canvas").params[2].type', "int", 'Type can be defined inline for only some params.');
		is('symbols.getSymbol("Layout#rotate").params.length', 0, 'Docomments inside function sig is ignored without a param.');
		is('symbols.getSymbol("Layout#init").params[2].type', "zoppler", 'Doc comment type overrides inline type for param with same name.');
	}
	,
	function() {
		symbolize({a: true, _: [SYS.pwd+"test/shared.js", SYS.pwd+"test/shared2.js"]});

		is('symbols.getSymbol("Array#some").name', 'some', 'The name of a symbol in a shared section is found.');
		is('symbols.getSymbol("Array#some").alias', 'Array#some', 'The alias of a symbol in a shared section is found.');
		is('symbols.getSymbol("Array#some").desc', "Extension to builtin array.", 'A description can be shared.');
		is('symbols.getSymbol("Array#filter").desc', "Extension to builtin array.\nChange every element of an array.", 'A shared description is appended.');
		is('symbols.getSymbol("Queue").desc', "A first in, first out data structure.", 'A description is not shared when outside a shared section.');
		is('symbols.getSymbol("Queue.rewind").alias', "Queue.rewind", 'Second shared tag can be started.');
		is('symbols.getSymbol("startOver").alias', "startOver", 'Shared tag doesnt cross over files.');
	}
	,
	function() {
		symbolize({a: true, _: [SYS.pwd+"test/config.js"]});
		is('symbols.getSymbol("Contact").params[0].name', 'person', 'The name of a param is found.');
		is('symbols.getSymbol("Contact").params[1].name', 'person.name', 'The name of a param set with a dot name is found.');
		is('symbols.getSymbol("Contact").params[2].name', 'person.age', 'The name of a second param set with a dot name is found.');
		is('symbols.getSymbol("Contact").params[4].name', 'connection', 'The name of a param after config is found.');
		
		is('symbols.getSymbol("Family").params[0].name', 'persons', 'Another name of a param is found.');
		is('symbols.getSymbol("Family").params[1].name', 'persons.Father', 'The name of a param+config is found.');
		is('symbols.getSymbol("Family").params[2].name', 'persons.Mother', 'The name of a second param+config is found.');
		is('symbols.getSymbol("Family").params[3].name', 'persons.Children', 'The name of a third param+config is found.');	
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/ignore.js"]});
		is('LOG.warnings.filter(function($){if($.indexOf("undocumented symbol Ignored") > -1) return $}).length', 1, 'A warning is emitted when documenting members of an ignored parent.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/functions_anon.js"]});
		is('symbols.getSymbol("a.b").alias', 'a.b', 'In anonymous constructor this is found to be the container object.');
		is('symbols.getSymbol("a.f").alias', 'a.f', 'In anonymous constructor this can have a method.');
		is('symbols.getSymbol("a.c").alias', 'a.c', 'In anonymous constructor method this is found to be the container object.');
		is('symbols.getSymbol("g").alias', 'g', 'In anonymous function executed inline this is the global.');
		is('symbols.getSymbol("bar2.p").alias', 'bar2.p', 'In named constructor executed inline this is the container object.');
		is('symbols.getSymbol("module.pub").alias', 'module.pub', 'In parenthesized anonymous function executed inline function scoped variables arent documented.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/oblit_anon.js"]});
		is('symbols.getSymbol("opt").name', 'opt', 'Anonymous object properties are created.');
		is('symbols.getSymbol("opt.conf.keep").alias', 'opt.conf.keep', 'Anonymous object first property is assigned to $anonymous.');
		is('symbols.getSymbol("opt.conf.base").alias', 'opt.conf.base', 'Anonymous object second property is assigned to $anonymous.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/params_optional.js"]});
		is('symbols.getSymbol("Document").params.length', 3, 'Correct number of params are found when optional param syntax is used.');
		is('symbols.getSymbol("Document").params[1].name', "id", 'Name of optional param is found.');
		is('symbols.getSymbol("Document").params[1].isOptional', true, 'Optional param is marked isOptional.');
		is('symbols.getSymbol("Document").params[2].name', "title", 'Name of optional param with default value is found.');
		is('symbols.getSymbol("Document").params[2].isOptional', true, 'Optional param with default value is marked isOptional.');
		is('symbols.getSymbol("Document").params[2].defaultValue', " This is untitled.", 'Optional param default value is found.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/synonyms.js"]});
		is('symbols.getSymbol("myObject.myFunc").type', 'function', 'Type can be set to function.');
	}
	,
	function() {
		symbolize({a:true, p:true, _: [SYS.pwd+"test/event.js"]});
		is('symbols.getSymbol("Kitchen#event:cakeEaten").isEvent', true, 'Function with event prefix is an event.');
		is('symbols.getSymbol("Kitchen#cakeEaten").isa', "FUNCTION", 'Function with same name as event isa function.');
	}
	,
	function() {
		symbolize({x:"js", a:true, _: [SYS.pwd+"test/scripts/"]});
		is('JSDOC.JsDoc.srcFiles.length', 1, 'Only js files are scanned when -x=js.');
	}
	,
	function() {
		symbolize({x:"js", a:true, _: [SYS.pwd+"test/exports.js"]});
		is('symbols.getSymbol("mxn.Map#doThings").name', 'doThings', 'Exports creates a documentation alias that can have methods.');
	}
	,
	function() {
		symbolize({p:true, a:true, _: [SYS.pwd+"test/module.js"]});
		is('symbols.getSymbol("myProject.myModule.myPublicMethod").name', 'myPublicMethod', 'A function wrapped in parens can be recognized.');
		is('symbols.getSymbol("myProject.myModule-myPrivateMethod").name', 'myPrivateMethod', 'A private method in the scope of a function wrapped in parens can be recognized.');
		is('symbols.getSymbol("myProject.myModule-myPrivateVar").name', 'myPrivateVar', 'A private member in the scope of a function wrapped in parens can be recognized.');
	}
];

//// run and print results
print(testrun(testCases));
