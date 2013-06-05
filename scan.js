var ScanJS = {

  template : {
    identifier : "var node=arguments[0]; return node.type == 'Identifier' && node.name == '$1$';",
    member : "var node=arguments[0]; return node.type == 'MemberExpression' && node.property.name == '$1$';",
    literal : "var node=arguments[0]; return node.type == 'Literal' && node.value == '$1$';",
    call : "var node=arguments[0]; return node.type == 'CallExpression' && node.callee.name == '$1$';",
    memberCall : "var node=arguments[0]; return node.type == 'CallExpression' &&" + "node.callee.type == 'MemberExpression' &&" + "node.callee.object.name=='$1$' && " + "node.callee.property.name=='$2$';",
    generate : function(rule) {

      // ScanJS supports the following rule types. To search for a:
      // identifier: just use plain words e.g. foo
      // member:  prefix identifier with a . e.g. .foo
      // literal: wrap  in single quotes e.g. 'foo'
      // call: append () e.g. foo()
      // memberCall: write as foo.bar()
      // function: start rule with function()
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
  scan : function(content, signatures, filename,copiedname) {
    scanresults = {};
    this.testNumber = 0;
    this.testTotal = signatures.length;
    if(this.Total <= 0) {
      console.log('Error: signatures array is 0 length')
      return;
    }
    ast = esprima.parse(content, {
      loc : true
    });

    //run all the rules against content.
    console.log('Running tests against ' + filename);
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
            copiedname : filename,
            line : node.loc.start.line,
            col : node.loc.start.col,
            node : node
          });
        }
      });
    }
    console.log(filename + ' had ' + scanresults.length + ' findings in it.');
    return scanresults;
  }
}

// if no require, assume in node, and run against file system.
if( typeof (require) != 'undefined') {
  var fs = require('fs');
  var path = require('path');
  var esprima = require('esprima');
  var signatures = require('rules.json')
  var argv = require('optimist').usage('Usage: $node scan.js -t [path/to/app] -o [resultFile.json]').demand(['t']).argv;

  var dive = function(dir, action) {
    if( typeof action !== 'function') {
      action = function(error, file) {
        console.log(">" + file)
      };
    }
    list = fs.readdirSync(dir);
    list.forEach(function(file) {
      var fullpath = dir + '/' + file;
      var stat = fs.statSync(fullpath);
      if(stat && stat.isDirectory()) {
        dive(fullpath, action);
      } else {
        action(file, fullpath);
      }
    });
  };
  var report = function(results) {
    for(filename in results) {
      console.log("Issue:" + issue);
      instances = results[issue];
      for( i = 0; i < instances.length; i++) {
        console.log("Found item in" + instances[i].filename + ":" + instances[i].line + "-" + isntance[i].rule.name)
      }
    }

  };
  var writeReport = function(results, name) {
    if(fs.existsSync(name)) {
      console.log("Error:output file already exists (" + name + "). Supply a different name using: -o [filename]")
    }
    fs.writeFile(name, JSON.stringify(results), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("The scan results were saved to " + name);
      }
    });
  };
  if( typeof process != 'undefined' && process.argv[2]) {
    results = {};
    reportname = argv.o ? argv.o : 'scanresults';
    reportdir = reportname + "_files";
    if(fs.existsSync(reportname) || fs.existsSync(reportdir)) {
      console.log("Error:output file or dir already exists (" + reportname + "). Supply a different name using: -o [filename]")

    } 
    else {
      fs.mkdirSync(reportdir);
      dive(argv.t, function(file, fullpath) {
        var ext = path.extname(file.toString());

        if(ext == '.js') {
          //copy to report dir
          var copiedName = fullpath.substr(argv.t.length).replace(/\//g,"_");
          fs.createReadStream(fullpath).pipe(fs.createWriteStream(reportname + '_files/' + copiedName));

          var content = fs.readFileSync(fullpath, 'utf8');
          results[fullpath] = ScanJS.scan(content, signatures, fullpath,copiedName);
        }
      })
      writeReport(results, reportname + '.JSON');
    }
  } else {
    console.log('usage: $ node scan.js path/to/app ')
  }
}