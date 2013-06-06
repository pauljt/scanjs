/*jshint node:true*/

// This script is for using scanjs server side

var fs = require('fs');
var path = require('path');
var esprima = require('esprima');

var ScanJS = require(__dirname + '/common/scan');
var signatures = require(__dirname + '/common/rules');

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