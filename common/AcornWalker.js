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
  var results = [];
  var current_source;

  var aw_found = function (rule, node) {

    results.push({
      type: 'finding',
      rule: rule,
      filename: results.filename,
      line: node.loc.start.line,
      col: node.loc.start.col,
      // node: node, // add a lot of cruft, removing by default
      //this adds a snippet based on lines. Not really useful unless source is prettified first
      snippet:current_source.split('\n').splice(node.loc.start.line-1,node.loc.start.line+1).join('\n')
    });

    aw_found_callback(rule, node);
  }
  var aw_found_callback = function () {
  };


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
    memberassignment: {
      nodeType: "AssignmentExpression",
      test: function (rule, node) {
        if (node.left.type == 'MemberExpression' && node.left.property.name == rule.param.left_property_name) {
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
        if (node.callee.type == 'MemberExpression' &&
          node.callee.property.name == rule.param.callee_property_name &&
          node.callee.object.name == rule.param.callee_object_name) {
          aw_found(rule, node);
        }
      }
    }
  };

  function aw_loadRulesFile(rulesFile, callback) {

    var request = new XMLHttpRequest();

    request.open('GET', rulesFile, false);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        rulesData = JSON.parse(request.responseText);
        aw_loadRules(rulesData);
        if (typeof callback == "function")
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
    var ruleTests = {};

    //each node type may have multiple tests, so first create arrays of test funcs
    //TODO test with multiple template tests which share the same expression type
    for (i in rulesData) {
      var rule = rulesData[i];

      //little hack that makes importing rules from spreadsheet easier
      //maybe remove once we have a proper rule manager/editor...
      if (!rule.param) {

        var json = rule.parameters.replace(/'/g, '"');
        rule.param = JSON.parse(json);
      }

      //rule is based on one of our templates
      if (templateRules[rule.type]) {
        var nodeType = templateRules[rule.type].nodeType;
        if (!ruleTests[nodeType]) {
          ruleTests[nodeType] = [];

        }
        var test = templateRules[rule.type].test.bind(undefined, rule);
        ruleTests[nodeType].push(test);
      }
      else {
        //todo add support for custom rules? Or maybe we can just add new things to the template?
      }
    }

    rules = {};
    //create a single function for each nodeType, which calls all the test functions
    for (nodeType in ruleTests) {
      rules[nodeType] = function (tests, node) {
        tests.forEach(function (arg) {
          arg.call(this, node);
        });
      }.bind(undefined, ruleTests[nodeType]);
    }
  }

  function aw_scan(source, filename) {
    results = [];
    results.filename = "Manual input"

    current_source=source;

    if (typeof filename != 'undefined') {
      results.filename = filename;
    }
    var ast;
    try{
      ast = acorn.parse(source, {
        locations: true
      });
    }catch(e){
      return [{
        type: 'error',
        name: e.name,
        pos: e.pos,
        loc: { column: e.loc.column, line: e.loc.line },
        message: e.message,
        filename: filename
      }];
    }


    if (!rules) {
      return [{
        type: 'error',
        name: 'RulesError',
        pos: 0,
        loc: { column: 0, line: 0 },
        message: "Could not scan with no rules loaded.",
        filename: filename
      }];
    }
    acorn.walk.simple(ast, rules);


    return results;
  }

  function aw_setCallback(found_callback) {
    aw_found_callback = found_callback;
  }

  exports.rules = aw_scan;
  exports.scan = aw_scan;
  exports.loadRulesFile = aw_loadRulesFile;
  exports.loadRules = aw_loadRules;
  exports.setResultCallback = aw_setCallback;

});