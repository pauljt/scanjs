var static = require("node-static");
var file = new static.Server('.', {
  headers: {
    "Content-Security-Policy": "default-src 'self'; object-src 'none'; img-src 'self' data:; script-src 'self' 'unsafe-eval",
  }
});

require ('http').createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
}).listen(4000);

console.log("> node-static is listening on http://127.0.0.1:4000");
