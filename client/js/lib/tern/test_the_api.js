

var tern = require("./lib/tern");

var ternServer = new tern.Server();

ast = {"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":4},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":3},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":1,"column":2},"end":{"line":1,"column":3},"source":null},"type":"Literal","value":5}}}]}; // "a=5"


ternServer.addFile({})

reqobj = {
  	"type":"type",
	file:"foo",
	'end':'4',
	'variable':'a',
	files:[
		{'type':'full','name':'foo','text':'a=5;   '}
		],
 };

