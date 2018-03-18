LOG.inform("XMLDOC.Parser loaded");

/**
 * XML Parser object.  Returns an {@link #XMLDOC.Parser.node} which is
 * the root element of the parsed document.
 * <p/>
 * By default, this parser will only handle well formed XML.  To
 * allow the parser to handle HTML, set the <tt>XMLDOC.Parser.strictMode</tt>
 * variable to <tt>false</tt> before calling <tt>XMLDOC.Parser.parse()</tt>.
 * <p/>
 * <i>Note: If you pass poorly formed XML, it will cause the parser to throw
 * an exception.</i>
 *
 * @author Brett Fattori (bfattori@fry.com)
 * @author $Author: micmath $
 * @version $Revision: 497 $
 */
XMLDOC.Parser = {};

/**
 * Strict mode setting.  Setting this to false allows HTML-style source to
 * be parsed.  Normally, well formed XML has defined end tags, or empty tags
 * are properly formed.  Default: <tt>true</tt>
 * @type Boolean
 */
XMLDOC.Parser.strictMode = true;

/**
 * A node in an XML Document.  Node types are ROOT, ELEMENT, COMMENT, PI, and TEXT.
 * @param parent {XMLDOC.Parser.node} The parent node
 * @param name {String} The node name
 * @param type {String} One of the types
 */
XMLDOC.Parser.node = function(parent, name, type)
{
   this.name = name;
   this.type = type || "ELEMENT";
   this.parent = parent;
   this.charData = "";
   this.attrs = {};
   this.nodes = [];
   this.cPtr = 0;

   XMLDOC.Parser.node.prototype.getAttributeNames = function() {
      var a = [];
      for (var o in this.attrs)
      {
         a.push(o);
      }

      return a;
   };

   XMLDOC.Parser.node.prototype.getAttribute = function(attr) {
      return this.attrs[attr];
   };

   XMLDOC.Parser.node.prototype.setAttribute = function(attr, val) {
      this.attrs[attr] = val;
   };

   XMLDOC.Parser.node.prototype.getChild = function(idx) {
      return this.nodes[idx];
   };

   XMLDOC.Parser.node.prototype.parentNode = function() {
      return this.parent;
   };

   XMLDOC.Parser.node.prototype.firstChild = function() {
      return this.nodes[0];
   };

   XMLDOC.Parser.node.prototype.lastChild = function() {
      return this.nodes[this.nodes.length - 1];
   };

   XMLDOC.Parser.node.prototype.nextSibling = function() {
      var p = this.parent;
      if (p && (p.nodes.indexOf(this) + 1 != p.nodes.length))
      {
         return p.getChild(p.nodes.indexOf(this) + 1);
      }
      return null;
   };

   XMLDOC.Parser.node.prototype.prevSibling = function() {
      var p = this.parent;
      if (p && (p.nodes.indexOf(this) - 1 >= 0))
      {
         return p.getChild(p.nodes.indexOf(this) - 1);
      }
      return null;
   };
};

/**
 * Parse an XML Document from the specified source.  The XML should be
 * well formed, unless strict mode is disabled, then the parser will
 * handle HTML-style XML documents.
 * @param src {String} The source to parse
 */
XMLDOC.Parser.parse = function(src)
{
   var A = [];

   // Normailize whitespace
   A = src.split("\r\n");
   src = A.join("\n");
   A = src.split("\r");
   src = A.join("\n");

   // Remove XML and DOCTYPE specifier
   src.replace(/<\?XML .*\?>/i, "");
   src.replace(/<!DOCTYPE .*\>/i, "");

   // The document is the root node and cannot be modified or removed
   var doc = new XMLDOC.Parser.node(null, "ROOT", "DOCUMENT");

   // Let's break it down
   XMLDOC.Parser.eat(doc, src);

   return doc;
};

/**
 * The XML fragment processing routine.  This method is private and should not be called
 * directly.
 * @param parentNode {XMLDOC.Parser.node} The node which is the parent of this fragment
 * @param src {String} The source within the fragment to process
 * @private
 */
XMLDOC.Parser.eat = function(parentNode, src)
{
   // A simple tag def
   var reTag = new RegExp("<(!|)(\\?|--|)((.|\\s)*?)\\2>","g");

   // Special tag types
   var reCommentTag = /<!--((.|\s)*?)-->/;
   var rePITag = /<\?((.|\s)*?)\?>/;

   // A start tag (with potential empty marker)
   var reStartTag = /<(.*?)( +([\w_\-]*)=(\"|')(.*)\4)*(\/)?>/;

   // An empty HTML style tag (not proper XML, but we'll accept it so we can process HTML)
   var reHTMLEmptyTag = /<(.*?)( +([\w_\-]*)=(\"|')(.*)\4)*>/;

   // Fully enclosing tag with nested tags
   var reEnclosingTag = /<(.*?)( +([\w_\-]*)=(\"|')(.*?)\4)*>((.|\s)*?)<\/\1>/;

   // Breaks down attributes
   var reAttributes = new RegExp(" +([\\w_\\-]*)=(\"|')(.*?)\\2","g");

   // Find us a tag
   var tag;
   while ((tag = reTag.exec(src)) != null)
   {
      if (tag.index > 0)
      {
         // The next tag has some text before it
         var text = src.substring(0, tag.index).replace(/^[ \t\n]+((.|\n)*?)[ \t\n]+$/, "$1");

         if (text.length > 0 && (text != "\n"))
         {
            var txtnode = new XMLDOC.Parser.node(parentNode, "", "TEXT");
            txtnode.charData = text;

            // Append the new text node
            parentNode.nodes.push(txtnode);
         }

         // Reset the lastIndex of reTag
         reTag.lastIndex -= src.substring(0, tag.index).length;

         // Eat the text
         src = src.substring(tag.index);
      }

      if (reCommentTag.test(tag[0]))
      {
         // Is this a comment?
         var comment = new XMLDOC.Parser.node(parentNode, "", "COMMENT");
         comment.charData = reCommentTag.exec(tag[0])[1];

         // Append the comment
         parentNode.nodes.push(comment);

         // Move the lastIndex of reTag
         reTag.lastIndex -= tag[0].length;

         // Eat the tag
         src = src.replace(reCommentTag, "");
      }
      else if (rePITag.test(tag[0]))
      {
         // Is this a processing instruction?
         var pi = new XMLDOC.Parser.node(parentNode, "", "PI");
         pi.charData = rePITag.exec(tag[0])[1];

         // Append the processing instruction
         parentNode.nodes.push(pi);

         // Move the lastIndex of reTag
         reTag.lastIndex -= tag[0].length;

         // Eat the tag
         src = src.replace(rePITag, "");
      }
      else if (reStartTag.test(tag[0]))
      {
         // Break it down
         var e = reStartTag.exec(tag[0]);
         var elem = new XMLDOC.Parser.node(parentNode, e[1], "ELEMENT");

         // Get attributes from the tag
         var a;
         while ((a = reAttributes.exec(e[2])) != null )
         {
            elem.attrs[a[1]] = a[3];
         }

         // Is this an empty XML-style tag?
         if (e[6] == "/")
         {
            // Append the empty element
            parentNode.nodes.push(elem);

            // Move the lastIndex of reTag (include the start tag length)
            reTag.lastIndex -= e[0].length;

            // Eat the tag
            src = src.replace(reStartTag, "");
         }
         else
         {
            // Check for malformed XML tags
            var htmlParsed = false;
            var htmlStartTag = reHTMLEmptyTag.exec(src);

            // See if there isn't an end tag within this block
            var reHTMLEndTag = new RegExp("</" + htmlStartTag[1] + ">");
            var htmlEndTag = reHTMLEndTag.exec(src);

            if (XMLDOC.Parser.strictMode && htmlEndTag == null)
            {
               // Poorly formed XML fails in strict mode
               var err = new Error("Malformed XML passed to XMLDOC.Parser... Error contains malformed 'src'");
               err.src = src;
               throw err;
            }
            else if (htmlEndTag == null)
            {
               // This is an HTML-style empty tag, store the element for it in non-strict mode
               parentNode.nodes.push(elem);

               // Eat the tag
               src = src.replace(reHTMLEmptyTag, "");
               htmlParsed = true;
            }

            // If we didn't parse HTML-style, it must be an enclosing tag
            if (!htmlParsed)
            {
               var enc = reEnclosingTag.exec(src);

               // Go deeper into the document
               XMLDOC.Parser.eat(elem, enc[6]);

               // Append the new element node
               parentNode.nodes.push(elem);

               // Eat the tag
               src = src.replace(reEnclosingTag, "");
            }
         }

         // Reset the lastIndex of reTag
         reTag.lastIndex = 0;
      }
   }

   // No tag was found... append the text if there is any
   src = src.replace(/^[ \t\n]+((.|\n)*?)[ \t\n]+$/, "$1");
   if (src.length > 0 && (src != "\n"))
   {
      var txtNode = new XMLDOC.Parser.node(parentNode, "", "TEXT");
      txtNode.charData = src;

      // Append the new text node
      parentNode.nodes.push(txtNode);
   }
};
