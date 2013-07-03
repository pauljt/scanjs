/*jshint node:true*/

// This script is for using scanjs server side

var fs = require('fs');
var path = require('path');

var ScanJS = require(__dirname + '/common/scan');

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
  fs.writeFile(name, JSON.stringify(results, null, 2), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The scan results were saved to " + name);
    }
  });
};
//main starts here
var argv = require('optimist').usage('Usage: $node scanner.js -t [path/to/target] [options]').options({
  t : {
    alias : 'target'
  },
  o : {
    alias : 'name',
    'default' : 'scanresults.json'
  },
  r : {
    'alias' : 'rules',
    'default' : '/common/rules'
  }
}).demand(['t']).argv;

console.log("Running scan of " + argv.t + "using rule file: " + argv.r)
var results = {};
var reportname = argv.o;
var signatures = require(__dirname + argv.r);

//init results object - an array of result objects for each signature
for(i in signatures) {
  results[signatures[i].name] = []
}


dive(argv.t, function(file, fullpath) {
  var ext = path.extname(file.toString());

  if(ext == '.js') {
    var content = fs.readFileSync(fullpath, 'utf8');
    var newresult = ScanJS.scan(content, signatures, fullpath);
    for(i in signatures) {
      rule = signatures[i].name;
      results[rule]=results[rule].concat(newresult[rule]);
    }
  }
})
writeReport(results, reportname.toString());
//}