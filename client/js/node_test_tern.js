
var fs = require("fs");
var defs = {};
defs.browser = JSON.parse(fs.readFileSync('./lib/tern/defs/browser.json', { "encoding": "utf8"} ));
defs.ecma5 = JSON.parse(fs.readFileSync('./lib/tern/defs/ecma5.json', { "encoding": "utf8"} ));
defs.jquery = JSON.parse(fs.readFileSync('./lib/tern/defs/jquery.json', { "encoding": "utf8"} ));
var infer = require("./lib/tern/lib/infer");
var tern = require("./lib/tern/lib/tern");
var acorn = {'walk' : require("./lib/tern/node_modules/acorn/util/walk") }


ternHandler = function () {
  //  this and most other functions adopted/stolen from tern's codemirror glue
  this.addFile = function(name, text) {
    this.fileDict[name] = text;
    this.ternServer.addFile(name, text)
  };
  
  var self = this;
  this.fileDict = {}; // used as a cache..
  
  this.ternServer = new tern.Server({
    getFile: function(name, c) { return getFileFromDict(self, name, c) }, /*function(name, c) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", name, false);
      xhr.send();
      return xhr.responseText;
    }, */
    async: true,
    defs: [defs.browser], // [JSON.parse(defs)]
    plugins: {},
  });

  return this;
}
ternHandler.prototype = {

  getType: function(file, pos, cb) {
    this.ternServer.request({
      "query": { 
          "type": "type",
          "lineCharPositions":true,
          "end": { "line": 0, "ch": pos}, // yay.. :D
          "file": file
        },
      "files": []},
      cb);
  },
  doFoo: false,
  addFile: function() {
  }
}
function getFileFromDict(th, name, cb) {
  var text = th.fileDict[name];
  if (text)
    cb(text);
  //else if (ts.options.getFile)
  //  ts.options.getFile(name, c);
  else
    cb(null);
}
var th = new ternHandler();

function callback(error, data) {
        if (error) return -1;
        console.log("got type information: "+ JSON.stringify(data));
        console.log(data.type || "not found");
      }

var text ='var a=5; function x() { var a = "meh"; }; try {} catch(meh) { };'
// overwrite: 
text = fs.readFileSync('./node_test_tern.js', { "encoding": "utf8"});

th.addFile("test.js", text)
funcs = {
  // node, stack, callback for recursion
  VariableDeclaration: function(n,s,c) {
    //console.log(n);    
    for (var i=0; i<n.declarations.length; ++i) {
      s.push({
        type: "func",
        id: n.declarations[i].id.name,
        start: n.declarations[i].id.start,
        end: n.declarations[i].id.end
        });
      }
  },
  TryStatement: function(n,s,c) {
    //console.log(n);
    if (n.handler.param.type == "Identifier") { // what else could it be?
    s.push({
      type: "catchee",
      id: n.handler.param.name,
      start: n.handler.param.start,
      end: n.handler.param.end
      });
    }
  },
  FunctionDeclaration: function(n,s,c) {
    //console.log(n);    
    s.push({
      type: "func",
      id: n.id.name,
      start: n.id.start,
      stop: n.id.end
      });
    }
  }

var symTable=[];

var ast = th.ternServer.files[0].ast;
acorn.walk.recursive(ast, symTable, funcs);

for (var i=0; i < symTable.length; ++i) {
  e=symTable[i];
  th.getType("test.js", e.start, function(err, data) {
    if (err) {
      console.log(e.id +": could not get type");
    }
    else {
      console.log(e.id +": " + data.type, "("+ e.start+")");
    }
    });
  
}

debugger;
