var fs = require('fs');
var expect = require('chai').expect;
var parse = require('../index');

describe('Comment string parsing', function() {

  /**
   * Source lines numeration:
   *
   * 0 function() {
   * 1  // source with comments
   * 2 }
   *
   */

  function parsed(func, opts) {
    var str = func.toString();
    return parse(str.slice(
      str.indexOf('{') + 1,
      str.lastIndexOf('}')
    ), opts);
  }

  it('should parse doc block with description', function() {
    expect(parsed(function(){
      /**
       * Description
       */
    })[0])
      .to.eql({
        description : 'Description',
        source      : 'Description',
        line        : 1,
        tags        : []
      });
  });

  it('should skip surrounding empty lines while preserving line numbers', function() {
    expect(parsed(function(){
      /**
       *
       *
       * Description first line
       *
       * Description second line
       *
       */
      var a;
    })[0])
      .eql({
        description : 'Description first line\n\nDescription second line',
        source      : 'Description first line\n\nDescription second line',
        line        : 1,
        tags        : []
      });
  });

  it('should skip empty blocks', function() {

    expect(parsed(function(){
      /**
       *
       */
      var a;
    }).length)
      .to.eq(0);
  });

  it('should parse multiple doc blocks', function() {
    var p = parsed(function(){
      /**
       * Description first line
       */
      var a;

      /**
       * Description second line
       */
      var b;
    });

    expect(p.length)
      .to.eq(2);

    expect(p[0])
      .to.eql({
        description : 'Description first line',
        source      : 'Description first line',
        line        : 1,
        tags        : []
      });

    expect(p[1])
      .to.eql({
        description : 'Description second line',
        source      : 'Description second line',
        line        : 6,
        tags        : []
      });
  });

  it('should parse one line block', function() {
    expect(parsed(function(){
      /** Description */
      var a;
    })[0])
      .to.eql({
        description : 'Description',
        source      : 'Description',
        line        : 1,
        tags        : []
      });
  });

  it('should skip `/* */` comments', function() {
    expect(parsed(function(){
      /*
       *
       */
      var a;
    }).length)
      .to.eq(0);
  });

  it('should skip `/*** */` comments', function() {
    expect(parsed(function(){
      /*
       *
       */
      var a;
    }).length)
      .to.eq(0);
  });

  it('should preserve empty lines and indentation with `opts.trim = false`', function() {
    expect(parsed(function(){
      /**
       *
       *
       *   Description first line
       *     second line
       *
       *       third line
       */
      var a;
    }, {
      trim: false
    })[0])
      .eql({
        description : '\n\n\n  Description first line\n    second line\n\n      third line\n',
        source      : '\n\n\n  Description first line\n    second line\n\n      third line\n',
        line        : 1,
        tags        : []
      });
  });

  it('should parse one line block with tag', function() {
    expect(parsed(function(){
      /** @tag */
      var a;
    })[0])
      .to.eql({
        description : '',
        line        : 1,
        source      : '@tag',
        tags        : [{
          tag         : 'tag',
          type        : '',
          name        : '',
          description : '',
          line        : 1,
          optional    : false,
          source      : '@tag'
        }]
      });
  });

  it('should parse `@tag`', function() {
      expect(parsed(function(){
        /**
         *
         * @my-tag
         */
        var a;
      })[0])
        .to.eql({
          line        : 1,
          source      : '@my-tag',
          description : '',
          tags: [{
            line        : 3,
            tag         : 'my-tag',
            source      : '@my-tag',
            type        : '',
            name        : '',
            optional    : false,
            description : ''
          }]
        });
  });

  it('should parse `@tag {my.type}`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type}
         */
        var a;
      })[0])
        .to.eql({
          line        : 1,
          source      : '@my-tag {my.type}',
          description : '',
          tags: [{
            line        : 2,
            tag         : 'my-tag',
            type        : 'my.type',
            name        : '',
            source      : '@my-tag {my.type}',
            optional    : false,
            description : ''
          }]
        });
  });

  it('should parse tag with name only `@tag name`', function() {
      expect(parsed(function(){
        /**
         * @my-tag name
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@my-tag name',
          tags: [{
            line        : 2,
            tag         : 'my-tag',
            type        : '',
            name        : 'name',
            source      : '@my-tag name',
            optional    : false,
            description : ''
          }]
        });
  });

  it('should parse tag with type and name `@tag {my.type} name`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type} name
         */
      })[0])
        .to.eql({
          line        : 1,
          source      : '@my-tag {my.type} name',
          description : '',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : 'my.type',
            name        : 'name',
            source      : '@my-tag {my.type} name',
            description : '',
            optional    : false
          }]
        });
  });

  it('should parse tag with type, name and description `@tag {my.type} name description`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type} name description
         */
      })[0])
        .to.eql({
          line        : 1,
          source      : '@my-tag {my.type} name description',
          description : '',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : 'my.type',
            name        : 'name',
            source      : '@my-tag {my.type} name description',
            description : 'description',
            optional    : false
          }]
        });
  });

  it('should parse tag with multiline description', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type} name description line 1
         * description line 2
         * description line 3
         */
      })[0])
        .to.eql({
          line        : 1,
          source      : '@my-tag {my.type} name description line 1\ndescription line 2\ndescription line 3',
          description : '',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : 'my.type',
            name        : 'name',
            source      : '@my-tag {my.type} name description line 1\ndescription line 2\ndescription line 3',
            description : 'description line 1\ndescription line 2\ndescription line 3',
            optional    : false
          }]
        });
  });

  it('should parse tag with type and optional name `@tag {my.type} [name]`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type} [name]
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@my-tag {my.type} [name]',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : 'my.type',
            name        : 'name',
            description : '',
            source      : '@my-tag {my.type} [name]',
            optional    : true
          }]
        });
  });

  it('should parse tag with type and optional name with default value `@tag {my.type} [name=value]`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type} [name=value]
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@my-tag {my.type} [name=value]',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : 'my.type',
            name        : 'name',
            default     : 'value',
            source      : '@my-tag {my.type} [name=value]',
            description : '',
            optional    : true
          }]
        });
  });

  it('should tolerate default value with whitespces `@tag {my.type} [name=John Doe]`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {my.type} [name=John Doe]
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@my-tag {my.type} [name=John Doe]',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : 'my.type',
            name        : 'name',
            description : '',
            source      : '@my-tag {my.type} [name=John Doe]',
            optional    : true,
            default     : 'John Doe'
          }]
        });
  });

  it('should tolerate quoted default value `@tag [name="yay!"]`', function() {
      expect(parsed(function(){
        /**
         * @tag {t} [name="yay!"]
         */
      })[0])
        .to.eql({
          line: 1,
          source: '@tag {t} [name="yay!"]',
          description: '',
          tags: [{
            tag         : 'tag',
            line        : 2,
            type        : 't',
            name        : 'name',
            source      : '@tag {t} [name="yay!"]',
            default     : 'yay!',
            optional    : true,
            description : ''
          }]
        });
  });

  it('should keep value as is if quotes are mismatched `@tag [name="yay\']`', function() {
      expect(parsed(function(){
        /**
         * @tag {t} [name="yay!'] desc
         */
      })[0])
        .to.eql({
          line: 1,
          description: '',
          source     : '@tag {t} [name="yay!\'] desc',
          tags: [{
            tag         : 'tag',
            line        : 2,
            type        : 't',
            name        : 'name',
            source      : '@tag {t} [name="yay!\'] desc',
            default     : '"yay!\'',
            optional    : true,
            description : 'desc'
          }]
        });
  });

  it('should parse rest names `@tag ...name desc`', function() {
      expect(parsed(function(){
        /**
         * @tag {t} ...name desc
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@tag {t} ...name desc',
          tags: [{
            tag         : 'tag',
            line        : 2,
            type        : 't',
            name        : '...name',
            optional    : false,
            source      : '@tag {t} ...name desc',
            description : 'desc'
          }]
        });
  });

  it('should parse optional rest names `@tag [...name] desc`', function() {
      expect(parsed(function(){
        /**
         * @tag {t} [...name] desc
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@tag {t} [...name] desc',
          tags: [{
            tag         : 'tag',
            line        : 2,
            type        : 't',
            name        : '...name',
            optional    : true,
            source      : '@tag {t} [...name] desc',
            description : 'desc'
          }]
        });
  });

  it('should parse multiple tags', function() {
      expect(parsed(function(){
        /**
         * Description
         * @my-tag1
         * @my-tag2
         */
      })[0])
        .to.eql({
          line        : 1,
          description : 'Description',
          source      : 'Description\n@my-tag1\n@my-tag2',
          tags        : [{
            tag         : 'my-tag1',
            line        : 3,
            type        : '',
            name        : '',
            optional    : false,
            source      : '@my-tag1',
            description : ''
          }, {
            tag         : 'my-tag2',
            line        : 4,
            type        : '',
            name        : '',
            optional    : false,
            source      : '@my-tag2',
            description : ''
          }]
        });
  });

  it('should parse nested tags', function() {
      expect(parsed(function(){
        /**
         * Description
         * @my-tag name
         * @my-tag name.sub-name
         * @my-tag name.sub-name.sub-sub-name
         */
      }, {dotted_names: true})[0])
        .to.eql({
          line        : 1,
          description : 'Description',
          source      : "Description\n@my-tag name\n@my-tag name.sub-name\n@my-tag name.sub-name.sub-sub-name",
          tags        : [{
            tag         : 'my-tag',
            line        : 3,
            type        : '',
            name        : 'name',
            source      : '@my-tag name',
            optional    : false,
            description : '',
            tags        : [{
              tag         : 'my-tag',
              line        : 4,
              type        : '',
              name        : 'sub-name',
              optional    : false,
              source      : '@my-tag name.sub-name',
              description : '',
              tags        : [{
                tag         : 'my-tag',
                line        : 5,
                type        : '',
                name        : 'sub-sub-name',
                optional    : false,
                source      : '@my-tag name.sub-name.sub-sub-name',
                description : ''
              }]
            }]
          }]
        });
  });

  it('should parse complex types `@tag {{a: type}} name`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {{a: number}} name
         */
      })[0])
        .to.eql({
          line        : 1,
          source      : '@my-tag {{a: number}} name',
          description : '',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : '{a: number}',
            name        : 'name',
            source      : '@my-tag {{a: number}} name',
            optional    : false,
            description : ''
          }]
        });
  });

  it('should gracefully fail on syntax errors `@tag {{a: type} name`', function() {
      expect(parsed(function(){
        /**
         * @my-tag {{a: number} name
         */
      })[0])
        .to.eql({
          line        : 1,
          description : '',
          source      : '@my-tag {{a: number} name',
          tags: [{
            tag         : 'my-tag',
            line        : 2,
            type        : '',
            name        : '',
            description : '',
            source      : '@my-tag {{a: number} name',
            optional    : false,
            errors      : ['parse_type: Invalid `{type}`, unpaired curlies']
          }]
        });
  });

  it('parses $ in description`', function() {
    expect(parsed(function(){
      /**
       * @my-tag {String} name description with $ char
       */
    })[0])
      .to.eql({
        line        : 1,
        source      : '@my-tag {String} name description with $ char',
        description : '',
        tags: [{
          tag         : 'my-tag',
          line        : 2,
          type        : 'String',
          name        : 'name',
          source      : '@my-tag {String} name description with $ char',
          optional    : false,
          description : 'description with $ char'
        }]
      });
  });
});
