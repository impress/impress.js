# XMLDOM [![Build Status](https://secure.travis-ci.org/bigeasy/xmldom.png?branch=master)](http://travis-ci.org/bigeasy/xmldom) [![Coverage Status](https://coveralls.io/repos/bigeasy/xmldom/badge.png?branch=master)](https://coveralls.io/r/bigeasy/xmldom) [![NPM version](https://badge.fury.io/js/xmldom.png)](http://badge.fury.io/js/xmldom)

A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully
compatible with `W3C DOM level2`; and some compatible with `level3`. Supports
`DOMParser` and `XMLSerializer` interface such as in browser.

Install:
-------
>npm install xmldom

Example:
====
```javascript
var DOMParser = require('xmldom').DOMParser;
var doc = new DOMParser().parseFromString(
    '<xml xmlns="a" xmlns:c="./lite">\n'+
        '\t<child>test</child>\n'+
        '\t<child></child>\n'+
        '\t<child/>\n'+
    '</xml>'
    ,'text/xml');
doc.documentElement.setAttribute('x','y');
doc.documentElement.setAttributeNS('./lite','c:x','y2');
var nsAttr = doc.documentElement.getAttributeNS('./lite','x')
console.info(nsAttr)
console.info(doc)
```
API Reference
=====

 * [DOMParser](https://developer.mozilla.org/en/DOMParser):

	```javascript
	parseFromString(xmlsource,mimeType)
	```
	* **options extension** _by xmldom_(not BOM standard!!)

	```javascript
	//added the options argument
	new DOMParser(options)
	
	//errorHandler is supported
	new DOMParser({
		/**
		 * locator is always need for error position info
		 */
		locator:{},
		/**
		 * you can override the errorHandler for xml parser
		 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
		 */
		errorHandler:{warning:function(w){console.warn(w)},error:callback,fatalError:callback}
		//only callback model
		//errorHandler:function(level,msg){console.log(level,msg)}
	})
		
	```

 * [XMLSerializer](https://developer.mozilla.org/en/XMLSerializer)
 
	```javascript
	serializeToString(node)
	```
DOM level2 method and attribute:
------

 * [Node](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247)
	
		attribute:
			nodeValue|prefix
		readonly attribute:
			nodeName|nodeType|parentNode|childNodes|firstChild|lastChild|previousSibling|nextSibling|attributes|ownerDocument|namespaceURI|localName
		method:	
			insertBefore(newChild, refChild)
			replaceChild(newChild, oldChild)
			removeChild(oldChild)
			appendChild(newChild)
			hasChildNodes()
			cloneNode(deep)
			normalize()
			isSupported(feature, version)
			hasAttributes()

 * [DOMImplementation](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-102161490)
		
		method:
			hasFeature(feature, version)
			createDocumentType(qualifiedName, publicId, systemId)
			createDocument(namespaceURI, qualifiedName, doctype)

 * [Document](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#i-Document) : Node
		
		readonly attribute:
			doctype|implementation|documentElement
		method:
			createElement(tagName)
			createDocumentFragment()
			createTextNode(data)
			createComment(data)
			createCDATASection(data)
			createProcessingInstruction(target, data)
			createAttribute(name)
			createEntityReference(name)
			getElementsByTagName(tagname)
			importNode(importedNode, deep)
			createElementNS(namespaceURI, qualifiedName)
			createAttributeNS(namespaceURI, qualifiedName)
			getElementsByTagNameNS(namespaceURI, localName)
			getElementById(elementId)

 * [DocumentFragment](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-B63ED1A3) : Node
 * [Element](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-745549614) : Node
		
		readonly attribute:
			tagName
		method:
			getAttribute(name)
			setAttribute(name, value)
			removeAttribute(name)
			getAttributeNode(name)
			setAttributeNode(newAttr)
			removeAttributeNode(oldAttr)
			getElementsByTagName(name)
			getAttributeNS(namespaceURI, localName)
			setAttributeNS(namespaceURI, qualifiedName, value)
			removeAttributeNS(namespaceURI, localName)
			getAttributeNodeNS(namespaceURI, localName)
			setAttributeNodeNS(newAttr)
			getElementsByTagNameNS(namespaceURI, localName)
			hasAttribute(name)
			hasAttributeNS(namespaceURI, localName)

 * [Attr](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-637646024) : Node
	
		attribute:
			value
		readonly attribute:
			name|specified|ownerElement

 * [NodeList](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177)
		
		readonly attribute:
			length
		method:
			item(index)
	
 * [NamedNodeMap](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1780488922)

		readonly attribute:
			length
		method:
			getNamedItem(name)
			setNamedItem(arg)
			removeNamedItem(name)
			item(index)
			getNamedItemNS(namespaceURI, localName)
			setNamedItemNS(arg)
			removeNamedItemNS(namespaceURI, localName)
		
 * [CharacterData](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-FF21A306) : Node
	
		method:
			substringData(offset, count)
			appendData(arg)
			insertData(offset, arg)
			deleteData(offset, count)
			replaceData(offset, count, arg)
		
 * [Text](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1312295772) : CharacterData
	
		method:
			splitText(offset)
			
 * [CDATASection](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-667469212)
 * [Comment](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1728279322) : CharacterData
	
 * [DocumentType](http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-412266927)
	
		readonly attribute:
			name|entities|notations|publicId|systemId|internalSubset
			
 * Notation : Node
	
		readonly attribute:
			publicId|systemId
			
 * Entity : Node
	
		readonly attribute:
			publicId|systemId|notationName
			
 * EntityReference : Node 
 * ProcessingInstruction : Node 
	
		attribute:
			data
		readonly attribute:
			target
		
DOM level 3 support:
-----

 * [Node](http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-textContent)
		
		attribute:
			textContent
		method:
			isDefaultNamespace(namespaceURI){
			lookupNamespaceURI(prefix)

DOM extension by xmldom
---
 * [Node] Source position extension; 
		
		attribute:
			//Numbered starting from '1'
			lineNumber
			//Numbered starting from '1'
			columnNumber
