/* this makes sure that console.log can be used, even if it is undefined.
   We won't see the message though, since this kind of postMessage isn't handled in scanservice.js  */
if (typeof console === "undefined") {
  console = {};
  console.log = function consoleShim(mesg) {
    //postMessage({'type':'log', 'message': mesg});
  }
}

importScripts('lib/acorn.js',
  'lib/walk.js',
  'lib/acorn_loose.js',
  '../../common/scan.js',
  '../../common/AcornWalker.js');

AcornScanJS.loadRulesFile("../../common/rules.json")

onmessage = function (evt) {
  if (evt.data.call === 'scan') {
    var args = evt.data.arguments;
    var source = args[0];
    var rules;

    var file = args[1];
    var findings = AcornScanJS.scan(source,file);
    postMessage({"filename": file, "findings": findings});
  }
};
