defs = {};
// XXX ugly ----v
function getJSON(nme, loc) {
  var x = new XMLHttpRequest();
  x.open("GET", loc, true);
  x.send()
  x.onload = function() {
    defs[nme] = JSON.parse(x.response);
  }
}
getJSON('browser', 'js/lib/tern/defs/browser.json');
getJSON('ecma5', 'js/lib/tern/defs/ecma5.json');
getJSON('jquery', 'js/lib/tern/defs/jquery.json');

var scanjsModule=angular.module('scanjs', ['ui.bootstrap']);
function ScanCtrl($scope, ScanSvc) {

  $scope.sourceinput = 'dangerous.innerHTML=document.location;\n' + 
  'element[\'innerHTML\']=something+"we can catch calls to literal members;"\n' + 
  'var foo=\'innerHTML\';element[foo]="but not dynamically referenced ones"\n' + 
  'safe.innerHTML="a static string will never result in dom-based XSS";\n' + 
  'doesntFlagFalsePositives="eval(\'alert(1)\')"+"element.innerHTML=danger";'

  $scope.run = function() {
    $scope.results=[];
    ScanSvc.newScan($scope.sourceinput, 'inline');
  }

  $scope.$on('NewResults', function(event, results) {
    var ruleNames = ScanJS.rules.map(function(el) { return el.name; }) // list of rule names
    if (ruleNames.indexOf(Object.keys(results)[0]) !== -1) {
      // we get the results without a file name, this must come from inline checks
      // layout: results = { rule: results, rule2: results2, ..}
      var resultsWithFile = {'inline': results};
      console.log(resultsWithFile);
      $scope.results = resultsWithFile;
    }
    else { // layout: results = {file1: {rule:results, ..}, file2: { rule:results, .. } }
      console.log(results);
      $scope.results = results;
    }
  });
  
  $scope.filterEmpty = function(item) {
  alert(1)
    return (item.length>0)
  }

  $scope.handleFiles = function handleFiles(fileList) {
    for (var i = 0; i < fileList.length; i++) { // This should really just take 1 file
      var file = fileList[i];
      console.log("File: ", file.name, " Filetype: "+ file.type);
      var acceptedType = /(application\/json)|(text\/plain)/;

      if (!file.type.match(acceptedType)) {
        continue;
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        console.log("read file..");
        try {
          var resultObj = JSON.parse(e.target.result);
          ScanSvc.addResults(resultObj);
        } catch(e) { // gotta catch them all
          alert("Could not parse JSON"); //XXX better UI..
          console.log("couldnt parse json ://", e)
        }

      };
      reader.readAsText(file);
    }

  }
}