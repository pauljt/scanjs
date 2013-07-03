var ScanJS = {

  // ScanJS supports the following rule types. To search for a:
  // identifier: just use plain words e.g. foo
  // member:  prefix identifier with a . e.g. .foo
  // literal: wrap  in single quotes e.g. 'foo'
  // call: append () e.g. foo()
  // memberCall: write as foo.bar()
  // function: start rule with function()
  template : {
    identifier : "var node=arguments[0]; return node.type == 'Identifier' && node.name == '$1$';",
    member : "var node=arguments[0]; return node.type == 'MemberExpression' && node.property.name == '$1$';",
    literal : "var node=arguments[0]; return node.type == 'Literal' && node.value == '$1$';",
    call : "var node=arguments[0]; return node.type == 'CallExpression' && node.callee.name == '$1$';",
    memberCall : "var node=arguments[0]; return node.type == 'CallExpression' &&" + "node.callee.type == 'MemberExpression' &&" + "node.callee.object.name=='$1$' && " + "node.callee.property.name=='$2$';",
    generate : function(rule) {
      var type = ''
      var body;
      if(rule[0] == '\'' || rule[0] == '"') {
        type = 'literal'
        rule = rule.replace('\'', '').replace('\"', '');
        body = this[type].replace('$1$', rule)
      } else if(rule[0] == '.') {
        type = 'member'
        rule = rule.replace('.', '');
        body = this[type].replace('$1$', rule)
      } else if(rule.match(/\..*\(\)/)) {
        type = 'memberCall';
        rule1 = rule.split('.')[0];
        rule2 = rule.split('.')[1].replace('()', '');
        body = this[type].replace('$1$', rule1).replace('$2$', rule2)
      } else if(rule.match(/\(\)/)) {
        type = 'call';
        rule = rule.replace("()", "");
        body = this[type].replace('$1$', rule)
      } else {
        //todo check for valid identifier
        type = 'identifier';
        body = this[type].replace('$1$', rule)
      }
      return new Function(body);
    }
  },
  traverse : function(object, visitor) {
    var key, child;

    if(visitor.call(null, object) === false) {
      return;
    }
    for(key in object) {
      if(object.hasOwnProperty(key)) {
        child = object[key];
        if( typeof child === 'object' && child !== null) {
          ScanJS.traverse(child, visitor);
        }
      }
    }
  },
  scan : function(content, signatures, filename) {
    console.log(content);
    console.log(signatures);
    scanresults = {};
    this.testNumber = 0;
    this.testTotal = signatures.length;
    if(this.Total <= 0) {
      console.log('Error: signatures array is 0 length')
      return;
    }
    try{
      
      ast = esprima.parse(content, {
      loc : true
    });
      
    }catch (e){
      return;
      console.log('Error: unable to parse '+ filename)
    }
    

    //run all the rules against content.
    //console.log('Running tests against ' + filename);
    for(key in signatures) {

      this.testNumber
      var rule = signatures[key];
      scanresults[rule.name] = [];
      var testFunc;
      if(rule.test.match(/^function/)) {
        testFunc = eval("(" + rule.test + ")");
      } else {
        testFunc = ScanJS.template.generate(rule.test);
      }

      ScanJS.traverse(ast, function(node) {
        var result = testFunc.call(this, node);
        if(result) {
          scanresults[rule.name].push({
            rule : rule,
            filename : filename,
            line : node.loc.start.line,
            col : node.loc.start.col,
           // node : node
          });
        }
      });
    }
    //console.log(filename + ' had ' + scanresults.length + ' findings in it.');
    return scanresults;
  }
}


if (typeof module != 'undefined') {
  var esprima = require('esprima');
  module.exports = ScanJS;
  
} else {
  ScanJS.rules = rules;
}
