// try: java -jar ../../jsrun.jar runner.js

load("TestDoc.js");

TestDoc.prove("../frame/Opt.js");
TestDoc.prove("../lib/JSDOC.js");
TestDoc.prove("../frame/String.js");
TestDoc.prove("../lib/JSDOC/DocTag.js");
TestDoc.prove("../lib/JSDOC/DocComment.js");
TestDoc.prove("../lib/JSDOC/TokenReader.js");
TestDoc.prove("../lib/JSDOC/Symbol.js");

TestDoc.report();
