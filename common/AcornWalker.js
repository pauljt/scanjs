var ruleData = [
  {"name": ".foo", "type": "member", "target": "foo"},
  {"name": "foo=", "type": "assignment", "target": "foo"},
  {"name": "foo()", "type": "call", "target": "foo"}
];
var rules;
var found = function (node) {
  console.log("Found node:", node)
}

var templateRules = {
  member: {
    nodeType: "MemberExpression",
    test: function (rule, node) {
      if (node.property.name == rule.target) {
        found(node);
      }
    }
  },
  call: {
    nodeType: "CallExpression",
    test: function (rule, node) {
      if (node.callee.name == rule.target) {
        found(node);
      }
    }
  },
  assignment: {
    nodeType: "AssignmentExpression",
    test: function (rule, node) {
      if (node.left.name == rule.target) {
        found(node);
      }
    }
  }
}

//todo move this to an init function, and only enable scanning once ready
aw_generateRules(ruleData);

function aw_loadRules(rulesFile) {

  var request = new XMLHttpRequest();

  request.open('GET', rulesFile, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      rulesData = JSON.parse(request.responseText);
      rules = createRules(rulesData);
    } else {
      console.log('Error loading ' + rulesFile)
    }
  };

  request.onerror = function () {
    console.log('Connection error while loading ' + rulesFile)
  };
  request.send();
}

function aw_generateRules(rulesData) {
  rules = {};

  //each node type may have multiple tests, so first create arrays of test funcs
  for (i in rulesData) {
    var rule = rulesData[i];
    if (templateRules[rule.type]) {
      var nodeType = templateRules[rule.type].nodeType;
      if (!rules[nodeType]) {
        rules[nodeType] = [];
      }
      var test = templateRules[rule.type].test.bind(undefined, rule);
      console.log('adding test',test)
      rules[nodeType].push(test);
    }
  }

  //for each nodeType, convert the array of funcs to a single function, with the array as a bound parameter
  for (nodeType in rules) {
    console.log(nodeType)
    rules[nodeType] = function (tests, node) {
      console.log("testing",node);
      tests.forEach(function (arg) {
        arg.call(this,node);
      });
    }.bind(undefined, rules[nodeType]);
  }
}

function aw_scan(code) {
  if (!rules) {
    console.log("Tried to run scan with no rules loaded.")
    return;
  }
  var ast = acorn.parse(code, {
    locations: true
  });
  console.log('scanning with ', rules)
  acorn.walk.simple(ast, rules);
}