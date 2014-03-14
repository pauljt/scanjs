importScripts('lib/tern/node_modules/acorn/acorn.js',
              'lib/tern/node_modules/acorn/util/walk.js',
              'lib/tern/node_modules/acorn/acorn_loose.js',
              '../../common/scan.js',
              '../../common/rules.js');

onmessage = function (evt) {
  if (evt.data.call == 'scan') {
    var args = evt.data.arguments;
    var source = args[0];
    var rules;
    if (args[1].length == 0) {
      // empty string or empty array -> default to standard rules.
      rules = ScanJS.rules;
    } else {
     rules = args[1];
    }
    var file = args[2];
    var findings = ScanJS.scan(source, rules, file);
    postMessage({"filename": file, "findings": findings});
  }
};
