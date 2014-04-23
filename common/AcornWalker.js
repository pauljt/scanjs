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
        var testNode=rule.statement.expression;
        if (node.property.name == testNode.property.name) {
          aw_found(rule, node);
        }
      }
    },
    objmember: {
      nodeType: "MemberExpression",
      test: function (rule, node) {
        var testNode=rule.statement.expression;
        if (node.property.name == testNode.property.name &&
          node.object.name == testNode.object.name) {
          aw_found(rule, node);
        }
      }
    },
    call: {
      nodeType: "CallExpression",
      test: function (rule, node) {
        var testNode=rule.statement.expression;
        if (node.callee.name == testNode.callee.name) {
          aw_found(rule, node);
        }
      }
    },
    membercall: {
      nodeType: "CallExpression",
      test: function (rule, node) {
        var testNode=rule.statement.expression;
        if (node.callee.type == 'MemberExpression' &&
          node.callee.property.name == testNode.callee.property.name &&
          node.callee.object.name == "$") {
          aw_found(rule, node);
        }
      }
    },
    objmembercall: {
      nodeType: "CallExpression",
      test: function (rule, node) {
        var testNode=rule.statement.expression;
        if (node.callee.type == 'MemberExpression' &&
          node.callee.property.name == testNode.callee.property.name &&
          node.callee.object.name == testNode.callee.object.name) {
          aw_found(rule, node);
        }
      }
    },
    callwithargs: {
      nodeType: "CallExpression",
      test: function (rule, node) {
        var testNode = rule.statement.expression;
        if (node.callee.name == testNode.callee.name && node.arguments.length>0 ) {
          var matching = true;
          var index = 0;
          while (matching && index < testNode.arguments.length) {
            var testArg=testNode.arguments[index];
            //ensure each literal argument matches
            if (testArg.type == "Literal") {
              if (node.arguments[index].type != "Literal" || testArg.value != node.arguments[index].value) {
                matching = false;
              }
            }
            index++;
          }
          if (matching) {
            aw_found(rule, node);
          }
        }
      }
    },
    assignment: {
      nodeType: "AssignmentExpression",
      test: function (rule, node) {
        var testNode=rule.statement.expression;
        if (node.left.name == rule.statement.expression.left.name) {
          aw_found(rule, node);
        }
      }
    },
    memberassignment: {
      nodeType: "AssignmentExpression",
      test: function (rule, node) {
        var testNode=rule.statement.expression;
        if (node.left.type == 'MemberExpression' && node.left.property.name == rule.statement.expression.left.property.name) {
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

    var nodeTests = {};
    //each node type may have multiple tests, so first create arrays of test funcs
    //TODO test with multiple template tests which share the same expression type
    for (i in rulesData) {
      var rule = rulesData[i];
      //parse rule source
      try {
        var program = acorn.parse(rule.source);
        //each rule must contain exactly one javascript statement
        if(program.body.length!=1){
          console.log("Rule "+ rule.name+ "contains too many statements, skipping. ",rule.source );
          continue;
        }
        rule.statement=program.body[0]
      } catch (e) {
        console.log("Can't parse rule:" + rule.name +". Rule skipped.");
        continue;
      }

      var template;

      //member, objmember
      if (rule.statement.expression.type == "MemberExpression") {
        if (rule.statement.expression.object.name == "$") {
          //rule is $.foo, this is a member rule
          template = templateRules.member;
        } else {
          template = templateRules.objmember;
        }
      }
      //call, membercall,objmembercall or callwithargs
      else if (rule.statement.expression.type == "CallExpression") {
        if (rule.statement.expression.callee.type == "Identifier") {
          if (rule.statement.expression.arguments.length > 0) {
            template = templateRules.callwithargs
          } else {
            template = templateRules.call;
          }
        } else if (rule.statement.expression.callee.type == "MemberExpression") {
          //callee is member expression, so either membercall, or objmembercall
          if (rule.statement.expression.callee.object.name == "$") {
            template = templateRules.membercall;
          } else {
            template = templateRules.objmembercall;
          }
        }
      }
      //assignment or memberassignment
      else if (rule.statement.expression.type == "AssignmentExpression") {
        if (rule.statement.expression.left.type == "MemberExpression") {
          template = templateRules.memberassignment;
        } else {
          template = templateRules.assignment;
        }
      }
      //console.log("SANITITY CHECK", rule.name, template == templateRules[rule.type])

      if (!nodeTests[template.nodeType]) {
        nodeTests[template.nodeType] = [];
      }
      nodeTests[template.nodeType].push(template.test.bind(undefined, rule));
    }

    rules = {};
    //create a single function for each nodeType, which calls all the test functions
    for (nodeType in nodeTests) {
      rules[nodeType] = function (tests, node) {
        tests.forEach(function (arg) {
          arg.call(this, node);
        });
      }.bind(undefined, nodeTests[nodeType]);
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