// in directory of tern (master branch)
var fs = require("fs");
var defs = fs.readFileSync('./defs/browser.json', { "encoding": "utf8"} )

var infer = require("./lib/infer");
var cx = new infer.Context([JSON.parse(defs)])
x = infer.withContext( cx, function() { return infer.analyze("a=5;", "myfilename");  } )
console.log(x);

// undefined
