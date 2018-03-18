var Element = require('../../lib/element');
require('../helpers/setup');

describe("mjson action tests", function() {
  var el5 = new Element(5, {});
  //var el10 = new Element(10, null);

  describe("TouchAction", function() {
    describe("tap", function() {

      it("no params", function() {
        var action = new wd.TouchAction();
        action.tap();
        action.gestures.should.deep.equal([{action: 'tap', options: {}}]);
      });
      it("params: {el: el}", function() {
        var action = new wd.TouchAction();
        action.tap({el: el5});
        action.gestures.should.deep.equal([{action: 'tap', options: {element: 5}}]);
      });
      it("params: {element: el}", function() {
        var action = new wd.TouchAction();
        action.tap({el: el5});
        action.gestures.should.deep.equal([{action: 'tap', options: {element: 5}}]);
      });
      it("params: {element: el, x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.tap({el: el5, x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'tap', options: {element: 5, x:5, y: 10}}]);
      });
      it("params: {element: el, x:x, y:y, count:count}", function() {
        var action = new wd.TouchAction();
        action.tap({el: el5, x: 5, y: 10, count: 2});
        action.gestures.should.deep.equal([{action: 'tap', options: {element: 5, x:5, y: 10, count: 2}}]);
      });
      it("params: {x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.tap({x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'tap', options: {x:5, y: 10}}]);
      });
      it("params: {x:x, y:y, count:count}", function() {
        var action = new wd.TouchAction();
        action.tap({x: 5, y: 10, count: 2});
        action.gestures.should.deep.equal([{action: 'tap', options: {x:5, y: 10, count: 2}}]);
      });
      it("params: {element: el} invalid element", function() {
        function fn() {
          var action = new wd.TouchAction();
          action.tap({el: {value: 5}});  
        }
        fn.should.throw(/Invalid element or el/);
      });        
    });

    describe("longPress", function() {
      it("no params", function() {
        var action = new wd.TouchAction();
        action.longPress();
        action.gestures.should.deep.equal([{action: 'longPress', options: {}}]);
      });
      it("params: {el: el}", function() {
        var action = new wd.TouchAction();
        action.longPress({el: el5});
        action.gestures.should.deep.equal([{action: 'longPress', options: {element: 5}}]);
      });
      it("params: {element: el}", function() {
        var action = new wd.TouchAction();
        action.longPress({el: el5});
        action.gestures.should.deep.equal([{action: 'longPress', options: {element: 5}}]);
      });
      it("params: {element: el, x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.longPress({el: el5, x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'longPress', options: {element: 5, x:5, y: 10}}]);
      });
      it("params: {x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.longPress({x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'longPress', options: {x:5, y: 10}}]);
      });
      it("params: {element: el} invalid element", function() {
        function fn() {
          var action = new wd.TouchAction();
          action.longPress({el: {value: 5}});  
        }
        fn.should.throw(/Invalid element or el/);
      });      
    });

    describe("moveTo", function() {
      it("no params", function() {
        var action = new wd.TouchAction();
        action.moveTo();
        action.gestures.should.deep.equal([{action: 'moveTo', options: {}}]);
      });
      it("params: {el: el}", function() {
        var action = new wd.TouchAction();
        action.moveTo({el: el5});
        action.gestures.should.deep.equal([{action: 'moveTo', options: {element: 5}}]);
      });
      it("params: {element: el}", function() {
        var action = new wd.TouchAction();
        action.moveTo({el: el5});
        action.gestures.should.deep.equal([{action: 'moveTo', options: {element: 5}}]);
      });
      it("params: {element: el, x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.moveTo({el: el5, x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'moveTo', options: {element: 5, x:5, y: 10}}]);
      });
      it("params: {x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.moveTo({x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'moveTo', options: {x:5, y: 10}}]);
      });
      it("params: {element: el} invalid element", function() {
        function fn() {
          var action = new wd.TouchAction();
          action.moveTo({el: {value: 5}});  
        }
        fn.should.throw(/Invalid element or el/);
      });      
    });

    describe("press", function() {
      it("no params", function() {
        var action = new wd.TouchAction();
        action.press();
        action.gestures.should.deep.equal([{action: 'press', options: {}}]);
      });
      it("params: {el: el}", function() {
        var action = new wd.TouchAction();
        action.press({el: el5});
        action.gestures.should.deep.equal([{action: 'press', options: {element: 5}}]);
      });
      it("params: {element: el}", function() {
        var action = new wd.TouchAction();
        action.press({el: el5});
        action.gestures.should.deep.equal([{action: 'press', options: {element: 5}}]);
      });
      it("params: {element: el, x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.press({el: el5, x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'press', options: {element: 5, x:5, y: 10}}]);
      });
      it("params: {x:x, y:y}", function() {
        var action = new wd.TouchAction();
        action.press({x:5, y: 10});
        action.gestures.should.deep.equal([{action: 'press', options: {x:5, y: 10}}]);
      });
      it("params: {element: el} invalid element", function() {
        function fn() {
          var action = new wd.TouchAction();
          action.press({el: {value: 5}});  
        }
        fn.should.throw(/Invalid element or el/);
      });
    });

    describe("release", function() {
      it("no params", function() {
        var action = new wd.TouchAction();
        action.release();
        action.gestures.should.deep.equal([{action: 'release', options: {}}]);
      });      
    });

    describe("wait", function() {
      it("no params", function() {
        var action = new wd.TouchAction();
        action.wait();
        action.gestures.should.deep.equal([{action: 'wait', options: {}}]);
      });      
      it("params: ms", function() {
        var action = new wd.TouchAction();
        action.wait(100);
        action.gestures.should.deep.equal([{action: 'wait', options: {ms: 100}}]);
      });      
     it("params: {ms: ms}", function() {
        var action = new wd.TouchAction();
        action.wait({ms: 100});
        action.gestures.should.deep.equal([{action: 'wait', options: {ms: 100}}]);
      });      
     });

    it("cancel", function() {
      var action = new wd.TouchAction();
      action.tap();
      action.gestures.should.deep.equal([{action: 'tap', options: {}}]);
      action.cancel();
      action.gestures.should.deep.equal([]);
    });

  });

  describe("MultiAction", function() {
    it("without element", function() {
      var m = new wd.MultiAction();
      var a1 = new wd.TouchAction();
      a1.tap({x: 100, y: 50}).release();
      var a2 = new wd.TouchAction();
      a2.press({x: 110, y: 55}).release();
      m.add(a1, a2);
      var expected = {"actions":[[{"action":"tap","options":{"x":100,"y":50}},{"action":"release","options":{}}],[{"action":"press","options":{"x":110,"y":55}},{"action":"release","options":{}}]]};
      m.toJSON().should.deep.equal(expected);
    });

    it("with element", function() {
      var element = new Element(5, {});
      var m = new wd.MultiAction(element);
      var a1 = new wd.TouchAction();
      a1.tap({x: 100, y: 50}).release();
      var a2 = new wd.TouchAction();
      a2.press({x: 110, y: 55}).release();
      m.add(a1, a2);
      var expected = {"elementId": 5, "actions":[[{"action":"tap","options":{"x":100,"y":50}},{"action":"release","options":{}}],[{"action":"press","options":{"x":110,"y":55}},{"action":"release","options":{}}]]};
      m.toJSON().should.deep.equal(expected);
    });

    it("cancel", function() {
      var element = new Element(5, {});
      var m = new wd.MultiAction(element);
      var a1 = new wd.TouchAction();
      a1.tap({x: 100, y: 50}).release();
      var a2 = new wd.TouchAction();
      a2.press({x: 110, y: 55}).release();
      m.add(a1, a2);
      var expected = {"elementId": 5, "actions":[[{"action":"tap","options":{"x":100,"y":50}},{"action":"release","options":{}}],[{"action":"press","options":{"x":110,"y":55}},{"action":"release","options":{}}]]};
      m.toJSON().should.deep.equal(expected);
      m.cancel();
      m.toJSON().should.deep.equal({elementId: 5, actions: []});
    });

  });

});
