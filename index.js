/*jshint node:true*/

// This script is for using scanjs server side

var fs = require('fs');
var path = require('path');
global.acorn = require(__dirname + '/client/js/lib/tern/node_modules/acorn/acorn.js');
global.tern = require('tern');
global.defs = {};
// XXX ugly ----v
defs.browser = JSON.parse(fs.readFileSync('client//js/lib/tern/defs/browser.json', 'utf8' ));
defs.ecma5 = JSON.parse(fs.readFileSync('client/js/lib/tern/defs/ecma5.json', 'utf8' ));
defs.jquery = JSON.parse(fs.readFileSync('client/js/lib/tern/defs/jquery.json', 'utf8' ));

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

        /*copy to report dir
        TODO: createOption to copy content to report - copying to file system doesn't work if we want a self-contained report format
        var copiedName = fullpath.substr(argv.t.length).replace(/\//g,"_");
        fs.createReadStream(fullpath).pipe(fs.createWriteStream(reportname + '_files/' + copiedName));
        */
        var content = fs.readFileSync(fullpath, 'utf8');
        try {
          results[fullpath] = ScanJS.scan(content, signatures, fullpath);
        } catch(e) {
          if (e instanceof SyntaxError) { // e.g., parse failure
            //XXX this might be easy to overlook when scanning a big folder
            console.log("SKIPPING FILE: SyntaxError in "+ fullpath+", at Line "+ e.loc.line +", Column "+e.loc.column+ ": " + e.message);
          } else {
            throw e;
          }
        }
      }
    });
    // Flatten report file to remove files with no findings and tests with no results (i.e. empty arr)
    // TODO: Don't even store empty unless --overly-verbose or so..
    for (var testedFile in results) {
      for (var testCase in results[testedFile]) {
        if (results[testedFile][testCase].length == 0) {
          delete(results[testedFile][testCase]);
        }
      }
      if (Object.keys(results[testedFile]).length == 0) {
        delete(results[testedFile]);
      }
    }
    writeReport(results, reportname + '.JSON');
  }
} else {
  console.log('usage: $ node scan.js path/to/app ')
}