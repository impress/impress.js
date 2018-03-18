var mappingType = process.argv[2] || 'supported';

var fs = require("fs"),
    mu = require('mu2'),
    _ = require('lodash');

mu.root = __dirname;

var jsonWireFull = JSON.parse(fs.readFileSync('doc/jsonwire-full.json').toString());

var jsonDocs = [
  JSON.parse(fs.readFileSync('tmp/webdriver-dox.json').toString()),
  JSON.parse(fs.readFileSync('tmp/element-dox.json').toString()),
  JSON.parse(fs.readFileSync('tmp/commands-dox.json').toString()),
  JSON.parse(fs.readFileSync('tmp/element-commands-dox.json').toString()),
  JSON.parse(fs.readFileSync('tmp/main-dox.json').toString()),
  JSON.parse(fs.readFileSync('tmp/asserters-dox.json').toString())
];

var resMapping = [];

// main mapping
_(jsonWireFull).each(function (jw_v, jw_k) {
  var current = {
    jsonWire: {
      key: jw_k,
      method: jw_k.split(' ')[0],
      path: jw_k.split(' ')[1],
      url: "http://code.google.com/p/selenium/wiki/JsonWireProtocol#" + jw_k.replace(/\s/g, '_'),
      desc: jw_v
    },
    wd_doc: []
  };
  _(jsonDocs).each(function (jsonDoc) {
    _(jsonDoc).each(function (wd_v) {
      if( _(wd_v.tags).filter(function (t) {
         return (t.type === 'jsonWire') && (t.string === jw_k);
      }).size() > 0){
        var orderTag = _(wd_v.tags).filter(function (t) {
          return t.type === 'docOrder';
        }).value();
        var order = 1000000;
        if (orderTag.length > 0){
         order =  parseInt(orderTag[0].string, 10);
        }
        var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
          return l !== '';
        }).map(function (l) {
            return {line: l};
        }).value();
        current.wd_doc.push({
          'desc': desc,
          'order': order
        });
      }
    });
  });

  current.wd_doc = _(current.wd_doc).sortBy(function (docItem) {
    return docItem.order;
  }).value();
  current.wd_doc0 = current.wd_doc.length === 0;
  current.wd_doc1 = current.wd_doc.length === 1? current.wd_doc : null;
  current.wd_docN = current.wd_doc.length > 1? current.wd_doc: null;

  if( (mappingType === 'full') ||
      ((mappingType === 'supported') && (current.wd_doc.length > 0) ) ||
      ((mappingType === 'unsupported') && (current.wd_doc.length === 0) ) ) {

    resMapping.push(current);
  }
});

// extra section
_(jsonDocs).each(function (jsonDoc) {
  _(jsonDoc).each(function (wd_v) {
    if(_(wd_v.tags).filter(function (t) {
       return t.type === 'jsonWire' ||
              t.type === 'asserter' ||
              t.type === 'wd';
    }).size() === 0){
      var current = {
        extra: true,
        wd_doc: []
      };
      var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
        return  l !== '';
      }).map(function (l) {
        return {line: l};
      }).value();
      current.wd_doc.push({ 'desc': desc });
      current.wd_doc1 = current.wd_doc;

      if( (mappingType === 'full') ||
          (mappingType === 'supported') ) {
        resMapping.push(current);
      }
    }
  });
});

// asserter section
_(jsonDocs).each(function (jsonDoc) {
  _(jsonDoc).each(function (wd_v) {
    if(_(wd_v.tags).filter(function (t) {
       return t.type === 'asserter';
    }).size() > 0){
      var current = {
        asserter: true,
        wd_doc: []
      };
      var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
        return  l !== '';
      }).map(function (l) {
        return {line: l};
      }).value();
      current.wd_doc.push({ 'desc': desc });
      current.wd_doc1 = current.wd_doc;

      if( (mappingType === 'full') ||
          (mappingType === 'supported') ) {
        resMapping.push(current);
      }
    }
  });
});

// wd section
_(jsonDocs).each(function (jsonDoc) {
  _(jsonDoc).each(function (wd_v) {
    if(_(wd_v.tags).filter(function (t) {
       return t.type === 'wd';
    }).size() > 0){
      var current = {
        wd: true,
        wd_doc: []
      };
      var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
        return  l !== '';
      }).map(function (l) {
        return {line: l};
      }).value();
      current.wd_doc.push({ 'desc': desc });
      current.wd_doc1 = current.wd_doc;

      if( (mappingType === 'full') ||
          (mappingType === 'supported') ) {
        resMapping.push(current);
      }
    }
  });
});
// missing section, looking for errors
_(jsonDocs).each(function (jsonDoc) {
  _(jsonDoc).each(function (wd_v) {
    _(_(wd_v.tags).filter(function (t) {
       return t.type === 'jsonWire';
    })).each(function (t) {
      var tag = t.string;
      if(!jsonWireFull[tag]){
        var current = {
          missing: {
            key:tag
          },
          wd_doc: []
        };
        var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
          return  l !== '';
        }).map(function (l) {
          return {line: l};
        }).value();
        current.wd_doc.push({desc: desc});
        current.wd_doc1 = current.wd_doc;
        resMapping.push(current);
      }
    });
  });
});

var output = '';
mu.compileAndRender( 'mapping-template.htm', {mapping: resMapping})
  .on('data', function (data) {
    output += data.toString();
  })
  .on('end', function () {
    _(output.split('\n')).each(function (line) {
      line = line.trim();
      if(line !== '' ){
        process.stdout.write(line + '\n');
      }
    });
  });

