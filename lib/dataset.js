(function () {  
  var forEach = [].forEach, 
      regex = /^data-(.+)/,
      dashChar = /\-([a-z])/ig,
      el = document.createElement('div'),
      mutationSupported = false,
      match
  ;

  function detectMutation() {
    mutationSupported = true;
    this.removeEventListener('DOMAttrModified', detectMutation, false);
  }
  
  function toCamelCase(s) {
    return s.replace(dashChar, function (m,l) { return l.toUpperCase(); });
  }
  
  function updateDataset() {
    var dataset = {};
    forEach.call(this.attributes, function(attr) {
      if (match = attr.name.match(regex))
        dataset[toCamelCase(match[1])] = attr.value;
    });
    return dataset;    
  }

  // only add support if the browser doesn't support data-* natively
  if (el.dataset != undefined) return;

  el.addEventListener('DOMAttrModified', detectMutation, false);
  el.setAttribute('foo', 'bar');

  Element.prototype.__defineGetter__('dataset', mutationSupported
    ? function () {
      if (!this._datasetCache) {
        this._datasetCache = updateDataset.call(this);
      }
      return this._datasetCache;
    }
    : updateDataset
  );

  document.addEventListener('DOMAttrModified', function (event) {
    delete event.target._datasetCache;
  }, false);
})();
