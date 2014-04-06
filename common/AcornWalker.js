(function (mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
  if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
  mod(this.AcornScanJS || (this.AcornScanJS = {})); // Plain browser env
})(function (exports) {

  var ruleData = [
    {"name": ".foo", "type": "member", "target": "foo"},
    {"name": "foo=", "type": "assignment", "target": "foo"},
    {"name": "foo()", "type": "call", "target": "foo"}
  ];
  var rules;
  var aw_found = function (node) {
    console.log("Found node:", node)
  }

  var templateRules = {
    member: {
      nodeType: "MemberExpression",
      test: function (rule, node) {
        if (node.property.name == rule.param.property_name) {
          aw_found(rule, node);
        }
      }
    },
    call: {
      nodeType: "CallExpression",
      test: function (rule, node) {
        if (node.callee.name == rule.param.callee_name) {
          aw_found(rule, node);
        }
      }
    },
    assignment: {
      nodeType: "AssignmentExpression",
      test: function (rule, node) {
        if (node.left.name == rule.param.left_name) {
          aw_found(rule, node);
        }
      }
    },
    objmember: {
      nodeType: "MemberExpression",
      test: function (rule, node) {
        if (node.property.name == rule.param.property_name &&
          node.object.name == rule.param.object_name) {
          aw_found(rule, node);
        }
      }
    },
    objmembercall: {
      nodeType: "CallExpression",
      test: function (rule, node) {
        if (node.callee.type=='MemberExpression'&&
          node.callee.property.name == rule.param.callee_property_name &&
          node.callee.object.name == rule.param.callee_object_name) {
          aw_found(rule, node);
        }
      }
    }
  };

  function aw_loadRulesFile(rulesFile, callback) {

    var request = new XMLHttpRequest();

    request.open('GET', rulesFile, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        rulesData = JSON.parse(request.responseText);
        aw_loadRules(rulesData);
        callback(rules);
      } else {
        console.log('Error loading ' + rules)
      }
    };

    request.onerror = function () {
      console.log('Connection error while loading ' + rulesFile)
    };
    request.send();
  }

  function aw_loadRules(rulesData) {
    rules = {};

    //each node type may have multiple tests, so first create arrays of test funcs
    for (i in rulesData) {
      var rule = rulesData[i];
      //little hack that makes importing rules from spreadsheet easier
      //maybe remove once we have a proper rule manager/editor...
      rule.param = JSON.parse(rule.param.replace("'","\"","gi"));

      if (templateRules[rule.type]) {
        var nodeType = templateRules[rule.type].nodeType;
        if (!rules[nodeType]) {
          rules[nodeType] = [];
        }
        var test = templateRules[rule.type].test.bind(undefined, rule);
        console.log('adding test', test)
        rules[nodeType].push(test);
      }
    }

    //for each nodeType, convert the array of funcs to a single function, with the array as a bound parameter
    for (nodeType in rules) {
      console.log(nodeType)
      rules[nodeType] = function (tests, node) {
        console.log("testing", node);
        tests.forEach(function (arg) {
          arg.call(this, node);
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

  function aw_setCallback(found_callback) {
    aw_found = found_callback;
  }

  exports.scan = aw_scan;
  exports.loadRulesFile = aw_loadRulesFile;
  exports.loadRules = aw_loadRules;
  exports.setResultCallback = aw_setCallback;

});