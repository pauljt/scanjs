importScripts("../../node_modules/acorn/acorn.js", "../../node_modules/acorn/acorn_loose.js", "../../node_modules/acorn/util/walk.js",
              "../../lib/signal.js", "../../lib/tern.js", "../../lib/def.js", "../../lib/infer.js",
              "../../plugin/requirejs.js", "../../plugin/doc_comment.js");

var server;

onmessage = function(e) {
  var data = e.data;
  switch (data.type) {
  case "defs": return startServer(data.data);
  case "add": return server.addFile(data.name, data.text);
  case "del": return server.delFile(data.name);
  case "req": return server.request(data.body, function(err, reqData) {
    postMessage({id: data.id, body: reqData, err: err && String(err)});
  });
  case "getFile":
    var c = pending[data.id];
    delete pending[data.id];
    return c(data.err, data.text);
  default: throw new Error("Unknown message type: " + data.type);
  }
};

var nextId = 0, pending = {};
function getFile(file, c) {
  postMessage({type: "getFile", name: file, id: ++nextId});
  pending[nextId] = c;
}

function startServer(defs) {
  server = new tern.Server({
    getFile: getFile,
    async: true,
    defs: defs,
    debug: true,
    plugins: {requirejs: {}}
  });
}

var console = {
  log: function(v) { postMessage({type: "debug", message: v}); }
};
