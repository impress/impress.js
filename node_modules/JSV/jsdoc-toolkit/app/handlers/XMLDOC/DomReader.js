LOG.inform("XMLDOC.DomReader loaded");

XMLDOC.DomReader = function(root) {

   this.dom = root;

   /**
    * The current node the reader is on
    */
   this.node = root;

   /**
    * Get the current node the reader is on
    * @type XMLDOC.Parser.node
    */
   XMLDOC.DomReader.prototype.getNode = function() {
      return this.node;
   };

   /**
    * Set the node the reader should be positioned on.
    * @param node {XMLDOC.Parser.node}
    */
   XMLDOC.DomReader.prototype.setNode = function(node) {
      this.node = node;
   };

   /**
    * A helper method to make sure the current node will
    * never return null, unless null is passed as the root.
    * @param step {String} An expression to evaluate - should return a node or null
    */
   XMLDOC.DomReader.prototype.navigate = function(step) {
      var n;
      if ((n = step) != null)
      {
         this.node = n;
         return this.node;
      }
      return null;
   };

   /**
    * Get the root node of the current node's document.
    */
   XMLDOC.DomReader.prototype.root = function() {
      this.navigate(this.dom);
   };

   /**
    * Get the parent of the current node.
    */
   XMLDOC.DomReader.prototype.parent = function() {
      return this.navigate(this.node.parentNode());
   };

   /**
    * Get the first child of the current node.
    */
   XMLDOC.DomReader.prototype.firstChild = function() {
      return this.navigate(this.node.firstChild());
   };

   /**
    * Get the last child of the current node.
    */
   XMLDOC.DomReader.prototype.lastChild = function() {
      return this.navigate(this.node.lastChild());
   };

   /**
    * Get the next sibling of the current node.
    */
   XMLDOC.DomReader.prototype.nextSibling = function() {
      return this.navigate(this.node.nextSibling());
   };

   /**
    * Get the previous sibling of the current node.
    */
   XMLDOC.DomReader.prototype.prevSibling = function() {
      return this.navigate(this.node.prevSibling());
   };

   //===============================================================================================
   // Support methods

   /**
    * Walk the tree starting with the current node, calling the plug-in for
    * each node visited.  Each time the plug-in is called, the DomReader
    * is passed as the only parameter.  Use the {@link XMLDOC.DomReader#getNode} method
    * to access the current node.   <i>This method uses a depth first traversal pattern.</i>
    *
    * @param srcFile {String} The source file being evaluated
    */
   XMLDOC.DomReader.prototype.getSymbols = function(srcFile)
   {
      XMLDOC.DomReader.symbols = [];
      XMLDOC.DomReader.currentFile = srcFile;
      JSDOC.Symbol.srcFile = (srcFile || "");

      if (defined(JSDOC.PluginManager)) {
         JSDOC.PluginManager.run("onDomGetSymbols", this);
      }

      return XMLDOC.DomReader.symbols;
   };

   /**
    * Find the node with the given name using a depth first traversal.
    * Does not modify the DomReader's current node.
    *
    * @param name {String} The name of the node to find
    * @return the node that was found, or null if not found
    */
   XMLDOC.DomReader.prototype.findNode = function(name)
   {
      var findNode = null;

      // Start at the current node and move into the subtree,
      // looking for the node with the given name
      function deeper(node, find)
      {
         var look = null;

         if (node) {
            if (node.name == find)
            {
               return node;
            }

            if (node.firstChild())
            {
               look = deeper(node.firstChild(), find);
            }

            if (!look && node.nextSibling())
            {
               look = deeper(node.nextSibling(), find);
            }
         }

         return look;
      }

      return deeper(this.getNode().firstChild(), name);
   };

   /**
    * Find the next node with the given name using a depth first traversal.
    *
    * @param name {String} The name of the node to find
    */
   XMLDOC.DomReader.prototype.findPreviousNode = function(name)
   {
   };

};

