// plugin=node

var fs = require("fs"), crypto = require("crypto"), tls = require("tls");

fs.readFileSync; //: fn(filename: string, encoding: string) -> Buffer

fs.stat("foobar", function(err, stats) {
  err; //: Error
  stats.isFile(); //: bool
});

var module = {};

crypto.getCiphers()[3]; //: string
crypto.createHash("sha1").digest().readUInt16BE(0); //: number

tls.createServer({}, function(stream) {
  // Has event emitter props
  stream.once; //: fn(event: string, listener: fn())
  // Writable stream props
  stream.write; //: fn(chunk: Buffer, encoding?: string, callback?: fn()) -> bool
  // Readable stream
  stream.read; //: fn(size?: number) -> Buffer
  // ClearTextStream
  stream.authorized; //: bool
});

var mymod = require("mymod");

mymod.foo; //: number
mymod.bar; //: string

require("./localfile").hello; //: fn() -> number

require("./foo/../exportfunc.js"); //: fn(a: number, b: number) -> number

require("./dir"); //:: {foo: string, rel: {abc: number, def: {xyz: string}}}

require("mod1").mainExport.x; //: number
require("mod1/secondfile").secondExport.u; //: number
require("mod1/dir1").foo.a; //: number

require("mod1/reassign_exports").funcPropExport; //loc: 2, 15

var doc = require("mod1/doc");
doc.f1; //doc: doc for f1
doc.f2; //doc: doc for f2

module.exports. //+
