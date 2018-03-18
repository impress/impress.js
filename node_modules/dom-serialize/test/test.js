
var assert = require('assert');
var serialize = require('../');

describe('node-serialize', function () {
  var node;

  afterEach(function () {
    if (node) {
      // clean up...
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      node = null;
    }
  });

  it('should return an empty string on invalid input', function () {
    assert.strictEqual('', serialize(null));
  });

  it('should serialize a SPAN element', function () {
    node = document.createElement('span');
    assert.equal('<span></span>', serialize(node));
  });

  it('should serialize a BR element', function () {
    node = document.createElement('br');
    assert.equal('<br>', serialize(node));
  });

  it('should serialize a text node', function () {
    node = document.createTextNode('test');
    assert.equal('test', serialize(node));
  });

  it('should serialize a text node with special HTML characters', function () {
    node = document.createTextNode('<>\'"&');
    assert.equal('&lt;&gt;\'"&amp;', serialize(node));
  });

  it('should serialize a DIV element with child nodes', function () {
    node = document.createElement('div');
    node.appendChild(document.createTextNode('hello '));
    var b = document.createElement('b');
    b.appendChild(document.createTextNode('world'));
    node.appendChild(b);
    node.appendChild(document.createTextNode('!'));
    node.appendChild(document.createElement('br'));
    assert.equal('<div>hello <b>world</b>!<br></div>', serialize(node));
  });

  it('should serialize a DIV element with attributes', function () {
    node = document.createElement('div');
    node.setAttribute('foo', 'bar');
    node.setAttribute('escape', '<>&"\'');
    assert.equal('<div foo="bar" escape="&lt;&gt;&amp;&quot;&apos;"></div>', serialize(node));
  });

  it('should serialize an Attribute node', function () {
    var div = document.createElement('div');
    div.setAttribute('foo', 'bar');
    node = div.attributes[0];
    assert.equal('foo="bar"', serialize(node));
  });

  it('should serialize a Comment node', function () {
    node = document.createComment('test');
    assert.equal('<!--test-->', serialize(node));
  });

  it('should serialize a Document node', function () {
    node = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    assert.equal('<html></html>', serialize(node));
  });

  it('should serialize a Doctype node', function () {
    node = document.implementation.createDocumentType(
      'html',
      '-//W3C//DTD XHTML 1.0 Strict//EN',
      'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
    );

    // Some older browsers require the DOCTYPE to be within a Document,
    // otherwise the "serialize" custom event is considered "cancelled".
    // See: https://travis-ci.org/webmodules/dom-serialize/builds/47307749
    var doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', node);

    assert.equal('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">', serialize(node));
    assert.equal('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html></html>', serialize(doc));
  });

  it('should serialize a Doctype node with systemId', function () {
    node = document.implementation.createDocumentType(
      'root-element',
      '',
      'http://www.w3.org/1999/xhtml'
    );
    document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'root-element', node);

    assert.equal('<!DOCTYPE root-element SYSTEM "http://www.w3.org/1999/xhtml">', serialize(node));
  });


  it('should serialize an HTML5 Doctype node', function () {
    node = document.implementation.createDocumentType(
      'html',
      '',
      ''
    );
    document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'node', node);

    assert.equal('<!DOCTYPE html>', serialize(node));
  });

  it('should serialize a DocumentFragment node', function () {
    node = document.createDocumentFragment();
    node.appendChild(document.createElement('b'));
    node.appendChild(document.createElement('i'));
    node.lastChild.appendChild(document.createTextNode('foo'));
    assert.equal('<b></b><i>foo</i>', serialize(node));
  });

  it('should serialize an Array of nodes', function () {
    var array = [];
    array.push(document.createTextNode('foo'));
    array.push(document.createElement('div'));
    array[1].appendChild(document.createTextNode('bar'));
    assert.equal('foo<div>bar</div>', serialize(array));
  });

  describe('serializeText()', function () {

    it('should serialize an Attribute node', function () {
      var d = document.createElement('div');
      d.setAttribute('foo', '<>"&');
      assert.equal('foo="&lt;&gt;&quot;&amp;"', serialize.serializeAttribute(d.attributes[0]));
    });

    it('should allow an "options" object to be passed in', function () {
      var d = document.createElement('div');
      d.setAttribute('foo', '<>"&');
      assert.equal('foo="&#60;&#62;&#34;&#38;"', serialize.serializeAttribute(d.attributes[0], { named: false }));
    });

  });

  describe('serializeText()', function () {

    it('should serialize a TextNode instance', function () {
      node = document.createTextNode('<b>&');
      assert.equal('&lt;b&gt;&amp;', serialize.serializeText(node));
    });

    it('should allow an "options" object to be passed in', function () {
      node = document.createTextNode('<b>&');
      assert.equal('&#60;b&#62;&#38;', serialize.serializeText(node, { named: false }));
    });

  });

  describe('"serialize" event', function () {

    it('should emit a "serialize" event on a DIV node', function () {
      node = document.createElement('div');
      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        e.detail.serialize = 'MEOW';
      });
      assert.equal(0, count);
      assert.equal('MEOW', serialize(node));
      assert.equal(1, count);
    });

    it('should emit a "serialize" event on a Text node', function () {
      node = document.createTextNode('whaaaaa!!!!!!');
      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        e.detail.serialize = 'MEOW';
      });
      assert.equal(0, count);
      assert.equal('MEOW', serialize(node));
      assert.equal(1, count);
    });

    it('should output an empty string when event is cancelled', function () {
      node = document.createElement('div');
      node.appendChild(document.createTextNode('!'));
      var count = 0;
      node.firstChild.addEventListener('serialize', function (e) {
        count++;
        e.preventDefault();
      });
      assert.equal(0, count);
      assert.equal('<div></div>', serialize(node));
      assert.equal(1, count);
    });

    it('should render a Number when set as `e.detail.serialize`', function () {
      node = document.createTextNode('whaaaaa!!!!!!');
      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        e.detail.serialize = 123;
      });
      assert.equal(0, count);
      assert.equal('123', serialize(node));
      assert.equal(1, count);
    });

    it('should render a Node when set as `e.detail.serialize`', function () {
      node = document.createTextNode('whaaaaa!!!!!!');
      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        if (count === 1) {
          e.detail.serialize = document.createTextNode('foo');
        }
      });
      assert.equal(0, count);
      assert.equal('foo', serialize(node));
      assert.equal(2, count);
    });

    it('should render a Node when set as `e.detail.serialize` and event is cancelled', function () {
      node = document.createTextNode('whaaaaa!!!!!!');
      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        if (count === 1) {
          e.preventDefault();
          e.detail.serialize = document.createTextNode('foo');
        }
      });
      assert.equal(0, count);
      assert.equal('foo', serialize(node));
      assert.equal(2, count);
    });

    it('should have `context` set on the event', function () {
      node = document.createTextNode('');
      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        e.detail.serialize = e.detail.context;
      });
      assert.equal(0, count);
      assert.equal('foo', serialize(node, 'foo'));
      assert.equal(1, count);
      assert.equal('bar', serialize(node, 'bar'));
      assert.equal(2, count);
      assert.equal('baz', serialize(node, 'baz'));
      assert.equal(3, count);
    });

    it('should bubble', function () {
      node = document.createElement('div');
      node.appendChild(document.createTextNode('foo'));
      node.appendChild(document.createTextNode(' '));
      node.appendChild(document.createTextNode('bar'));

      // `node` must be inside the DOM for the "serialize" event to bubble
      document.body.appendChild(node);

      var count = 0;
      node.addEventListener('serialize', function (e) {
        count++;
        assert.equal('foo', e.detail.context);
        if (e.serializeTarget === node)
          return;
        else if (e.serializeTarget.nodeValue === 'foo')
          e.detail.serialize = '…';
        else
          e.preventDefault();
      }, false);

      assert.equal(0, count);
      assert.equal('<div>…</div>', serialize(node, 'foo'));
      assert.equal(4, count);
    });

    it('should support one-time callback function on Elements', function () {
      node = document.createElement('div');
      var count = 0;

      function callback (e) {
        count++;
        e.detail.serialize = count;
      }

      assert.equal(0, count);
      assert.equal('1', serialize(node, callback));
      assert.equal(1, count);
      assert.equal('<div></div>', serialize(node));
      assert.equal(1, count);
    });

    it('should support one-time callback function on NodeLists', function () {
      node = document.createElement('div');
      node.appendChild(document.createElement('strong'));
      node.appendChild(document.createTextNode('foo'));
      node.appendChild(document.createElement('em'));
      node.appendChild(document.createTextNode('bar'));

      var count = 0;

      function callback (e) {
        count++;
        e.detail.serialize = count;
      }

      assert.equal(0, count);
      assert.equal('1234', serialize(node.childNodes, callback));
      assert.equal(4, count);
      assert.equal('<strong></strong>foo<em></em>bar', serialize(node.childNodes));
      assert.equal(4, count);
    });

    it('should support one-time callback function on Nodes set in `e.detail.serialize`', function () {
      node = document.createElement('div');
      node.appendChild(document.createTextNode('foo'));

      // `node` must be inside the DOM for the "serialize" event to bubble
      document.body.appendChild(node);

      var count = 0;

      function callback (e) {
        count++;

        if (2 === count) {
          assert.equal('foo', e.serializeTarget.nodeValue);
          var text = document.createTextNode('bar');
          e.detail.serialize = text;
        } else if (3 === count) {
          assert.equal('bar', e.serializeTarget.nodeValue);
          var text = document.createTextNode('baz');
          e.detail.serialize = text;
        }
      }

      assert.equal(0, count);
      assert.equal('<div>baz</div>', serialize(node, callback));
      assert.equal(4, count);
    });

    it('should support one-time callback function on complex Nodes set in `e.detail.serialize`', function () {
      node = document.createElement('div');
      node.appendChild(document.createTextNode('foo'));

      // `node` must be inside the DOM for the "serialize" event to bubble
      document.body.appendChild(node);

      var count = 0;

      function callback (e) {
        count++;
        if (e.serializeTarget.nodeValue === 'foo') {
          var el = document.createElement('p');
          el.appendChild(document.createTextNode('x '));
          el.appendChild(document.createElement('i'));
          el.lastChild.appendChild(document.createTextNode('bar'));

          e.detail.serialize = el;
        }
      }

      assert.equal(0, count);
      assert.equal('<div><p>x <i>bar</i></p></div>', serialize(node, callback));
      assert.equal(6, count);
    });

  });

});
