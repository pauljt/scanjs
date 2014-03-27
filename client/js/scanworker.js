/* this makes sure that console.log can be used, even if it is undefined.
   We won't see the message though, since this kind of postMessage isn't handled in scanservice.js  */
if (typeof console === "undefined") {
  console = {};
  console.log = function consoleShim(mesg) {
    postMessage({'type':'log', 'message': mesg});
  }
}

importScripts('lib/acorn.js',
              'lib/walk.js',
              'lib/acorn_loose.js',
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
