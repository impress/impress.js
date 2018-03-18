// This script licensed under the MIT.
// http://orgachem.mit-license.org


var util = require('./util.js');



/**
 * A singleton class for type dictionaries.  This dictionaty is useful to check
 * an user define type name.  Maybe, a type name publisher needs the check to
 * determine whether should convert a type name to a link.
 *
 * Use {@code getInstance()} to get the instance.
 *
 * For example:
 * <pre>
 * var dict = TypeDictionary.getInstance();
 *
 * // Browser objects
 * dict.has('string'); // ⇒ true
 * dict.has('Element'); // ⇒ true
 *
 * // User define objects
 * dict.has('FooBar'); // ⇒ false
 * dict.has('foo.Bar'); // ⇒ false
 * </pre>
 * @constructor
 * @exports lib/TypeDictionary
 */
var TypeDictionary = function() {
  var dict = [].concat(TypeDictionary.GENERALS);

  if (TypeDictionary.ERROR_TYPES_ENABLED) {
    dict.push.apply(dict, TypeDictionary.ERRORS);
  }

  if (TypeDictionary.HTML_TYPES_ENABLED) {
    dict.push.apply(dict, TypeDictionary.HTMLS);
  }

  if (TypeDictionary.DOM_TYPES_ENABLED) {
    dict.push.apply(dict, TypeDictionary.DOMS);
  }

  if (TypeDictionary.SVGS_TYPES_ENABLED) {
    dict.push.apply(dict, TypeDictionary.SVGS);
  }

  dict = dict.map(function(word) {
    return word.toLowerCase();
  });

  dict.sort();

  this.dict_ = dict;
  this.dictLen_ = dict.length;
};
util.addSingletonGetter(TypeDictionary);


/**
 * Whether error object types are enabled.  Default is true.
 * @const
 * @type {boolean}
 */
TypeDictionary.ERROR_TYPES_ENABLED = true;


/**
 * Whether DOM interface types are enabled.  Default is true.
 * @const
 * @type {boolean}
 */
TypeDictionary.DOM_TYPES_ENABLED = true;


/**
 * Whether HTML interface types are enabled.  Default is true.
 * @const
 * @type {boolean}
 */
TypeDictionary.HTML_TYPES_ENABLED = true;


/**
 * Whether SVG interface types are enabled.  Default is true.
 * @const
 * @type {boolean}
 */
TypeDictionary.SVGS_TYPES_ENABLED = true;


/**
 * Type word array.  The array has to be sorted.
 * @type {Array.<string>}
 * @private
 */
TypeDictionary.prototype.dict_ = null;


/**
 * Type word array length.
 * @type {number}
 * @private
 */
TypeDictionary.prototype.dictLen_ = null;


/**
 * Whether the specified type is in the dictionary.
 * @param {string} target Type to check.
 * @return {boolean} Whether the specified type is in the dictionary.
 */
TypeDictionary.prototype.has = function(target) {
  var a = target.toLowerCase();
  var arr = this.dict_;
  var left = 0;  // inclusive
  var right = this.dictLen_;  // exclusive
  var found;
  while (left < right) {
    var middle = (left + right) >> 1;
    var b = arr[middle];
    var compareResult = a > b ? 1 : a < b ? -1 : 0;
    if (compareResult > 0) {
      left = middle + 1;
    } else if (compareResult === 0) {
      return true;
    } else {
      right = middle;
    }
  }
  return false;
};


/**
 * General purpose object names.
 * @const
 * @type {Array.<string>}
 */
TypeDictionary.GENERALS = [
  'Array',
  'Boolean',
  'Date',
  'Document',
  'Element',
  'Error',
  'Function',
  'Image',
  'Infinity',
  'Iterator',
  'NaN',
  'Null',
  'Number',
  'Object',
  'Option',
  'RegExp',
  'String',
  'Undefined',
  'Window',
  '*', // All type
  '?' // Unkown type
];


/**
 * Error object names.
 * @const
 * @type {Array.<string>}
 */
TypeDictionary.ERRORS = [
  'EvalError',
  'InternalError',
  'RangeError',
  'ReferenceError',
  'StopIteration',
  'SyntaxError',
  'TypeError',
  'UriError'
];


/**
 * DOM object names.
 * @const
 * @type {Array.<string>}
 */
TypeDictionary.DOMS = [
  'Attr',
  'CDATASection',
  'CharacterData',
  'Comment',
  'console',
  'DocumentFragment',
  'DocumentType',
  'DomConfiguration',
  'DOMError',
  'DOMErrorHandler',
  'DOMException',
  'DOMImplementation',
  'DOMImplementationList',
  'DOMImplementationRegistry',
  'DOMImplementationSource',
  'DOMLocator',
  'DOMObject',
  'DOMRequest',
  'DOMString',
  'DOMStringList',
  'DOMTimeStamp',
  'DOMUserData',
  'Entity',
  'EntityReference',
  'MediaQueryList',
  'MediaQueryListListener',
  'NameList',
  'NamedNodeMap',
  'Node',
  'NodeFilter',
  'NodeIterator',
  'NodeList',
  'Notation',
  'Plugin',
  'PluginArray',
  'ProcessingInstruction',
  'SharedWorker',
  'Text',
  'TimeRanges',
  'Treewalker',
  'TypeInfo',
  'UserDataHandler',
  'Worker',
  'WorkerGlobalScope'
];


/**
 * HTML interface names.
 * @const
 * @type {Array.<string>}
 */
TypeDictionary.HTMLS = [
  'HTMLDocument',
  'HTMLElement',
  'HTMLAnchorElement',
  'HTMLAppletElement',
  'HTMLAudioElement',
  'HTMLAreaElement',
  'HTMLBaseElement',
  'HTMLBaseFontElement',
  'HTMLBodyElement',
  'HTMLBRElement',
  'HTMLButtonElement',
  'HTMLCanvasElement',
  'HTMLDataListElement',
  'HTMLDirectoryElement',
  'HTMLDivElement',
  'HTMLDListElement',
  'HTMLEmbedElement',
  'HTMLFieldSetElement',
  'HTMLFontElement',
  'HTMLFormElement',
  'HTMLFrameElement',
  'HTMLFrameSetElement',
  'HTMLHeadElement',
  'HTMLHeadingElement',
  'HTMLHtmlElement',
  'HTMLHRElement',
  'HTMLIFrameElement',
  'HTMLImageElement',
  'HTMLInputElement',
  'HTMLKeygenElement',
  'HTMLLabelElement',
  'HTMLLIElement',
  'HTMLLinkElement',
  'HTMLMapElement',
  'HTMLMenuElement',
  'HTMLMetaElement',
  'HTMLMeterElement',
  'HTMLModElement',
  'HTMLObjectElement',
  'HTMLOListElement',
  'HTMLOptGroupElement',
  'HTMLOptionElement',
  'HTMLOutputElement',
  'HTMLParagraphElement',
  'HTMLParamElement',
  'HTMLPreElement',
  'HTMLProgressElement',
  'HTMLQuoteElement',
  'HTMLScriptElement',
  'HTMLSelectElement',
  'HTMLSourceElement',
  'HTMLSpanElement',
  'HTMLStyleElement',
  'HTMLTableElement',
  'HTMLTableCaptionElement',
  'HTMLTableCellElement,',
  'HTMLTableDataCellElement',
  'HTMLTableHeaderCellElement',
  'HTMLTableColElement',
  'HTMLTableRowElement',
  'HTMLTableSectionElement',
  'HTMLTextAreaElement',
  'HTMLTimeElement',
  'HTMLTitleElement',
  'HTMLTrackElement',
  'HTMLUListElement',
  'HTMLUnknownElement',
  'HTMLVideoElement',
  'CanvasRenderingContext2D',
  'CanvasGradient',
  'CanvasPattern',
  'TextMetrics',
  'ImageData',
  'CanvasPixelArray'
];


/**
 * SVG interface names.
 * @const
 * @type {Array.<string>}
 */
TypeDictionary.SVGS = [
  'SVGElement',
  'SVGAElement',
  'SVGAltGlyphElement',
  'SVGAltGlyphDefElement',
  'SVGAltGlyphItemElement',
  'SVGAnimationElement',
  'SVGAnimateElement',
  'SVGAnimateColorElement',
  'SVGAnimateMotionElement',
  'SVGAnimateTransformElement',
  'SVGSetElement',
  'SVGCircleElement',
  'SVGClipPathElement',
  'SVGColorProfileElement',
  'SVGCursorElement',
  'SVGDefsElement',
  'SVGDescElement',
  'SVGEllipseElement',
  'SVGFilterElement',
  'SVGFilterPrimitiveStandardAttributes',
  'SVGFEBlendElement',
  'SVGFEColorMatrixElement',
  'SVGFEComponentTransferElement',
  'SVGFECompositeElement',
  'SVGFEConvolveMatrixElement',
  'SVGFEDiffuseLightingElement',
  'SVGFEDisplacementMapElement',
  'SVGFEDistantLightElement',
  'SVGFEFloodElement',
  'SVGFEGaussianBlurElement',
  'SVGFEImageElement',
  'SVGFEMergeElement',
  'SVGFEMergeNodeElement',
  'SVGFEMorphologyElement',
  'SVGFEOffsetElement',
  'SVGFEPointLightElement',
  'SVGFESpecularLightingElement',
  'SVGFESpotLightElement',
  'SVGFETileElement',
  'SVGFETurbulenceElement',
  'SVGComponentTransferFunctionElement',
  'SVGFEFuncRElement',
  'SVGFEFuncGElement',
  'SVGFEFuncBElement',
  'SVGFEFuncAElement',
  'SVGFontElement',
  'SVGFontFaceElement',
  'SVGFontFaceFormatElement',
  'SVGFontFaceNameElement',
  'SVGFontFaceSrcElement',
  'SVGFontFaceUriElement',
  'SVGForeignObjectElement',
  'SVGGElement',
  'SVGGlyphElement',
  'SVGGlyphRefElement',
  'SVGGradientElement',
  'SVGLinearGradientElement',
  'SVGRadialGradientElement',
  'SVGHKernElement',
  'SVGImageElement',
  'SVGLineElement',
  'SVGMarkerElement',
  'SVGMaskElement',
  'SVGMetadataElement',
  'SVGMissingGlyphElement',
  'SVGMPathElement',
  'SVGPathElement',
  'SVGPatternElement',
  'SVGPolylineElement',
  'SVGPolygonElement',
  'SVGRectElement',
  'SVGScriptElement',
  'SVGStopElement',
  'SVGStyleElement',
  'SVGSVGElement',
  'SVGSwitchElement',
  'SVGSymbolElement',
  'SVGTextElement',
  'SVGTextPathElement',
  'SVGTitleElement',
  'SVGTRefElement',
  'SVGTSpanElement',
  'SVGUseElement',
  'SVGViewElement',
  'SVGVKernElement'
];


// Exports the constructor.
module.exports = TypeDictionary;
