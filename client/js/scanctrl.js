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
  $scope.codeMirror = undefined;

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
    if (Object.keys(results).length == 0) {
      $scope.error = "Empty result set (this can also be a good thing, if you test a simple file)"
      $scope.apply();
      return
    }
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
    $scope.error = "";
    $scope.$apply(); // apply changes to view
  });
  
  $scope.filterEmpty = function(item) {
  alert(1)
    return (item.length>0)
  }

  $scope.handleFileUpload = function handleFileUpload(fileList) {
    for (var i = 0; i < fileList.length; i++) { // This should really just take 1 file
      var file = fileList[i];
      console.log("File: ", file.name, " Filetype: "+ file.type);
      var jsonType = /(application\/json)/;
      var jsType = /(text\/javascript|application\/javascript|application\/x-javascript)/;
      var curFileType;
      if (file.type.match(jsType)) {
        curFileType = "js"
      } else if (file.type.match(jsonType)) {
        curFileType = "json"
      } else {
        $scope.error = "Error: Unknown file type. Expected JavaScript or JSON.";
        $scope.$apply();
        break;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        if (curFileType == "json") {
          try {
            var resultObj = JSON.parse(e.target.result);
            ScanSvc.addResults(resultObj);
          } catch(e) { // gotta catch them all
            $scope.error = "Could not parse JSON";
            $scope.$apply();
          }
        } else if (curFileType == "js") {
          // code mirror stuff
          if ($scope.codeMirror === undefined) {
          $scope.codeMirror = new CodeMirror(function(elt) {
                                                             var ta=document.getElementById('jsTextarea');
                                                             ta.parentNode.replaceChild(elt, ta);
                                              }, { mode: 'javascript', lineNumbers: true, readOnly: false,
                                              value: e.target.result});
          } else {
            $scope.codeMirror.setValue(e.target.result);
          }

          $scope.sourceinput = e.target.result;
          $scope.run();
        }
      };
      reader.onerror = function(e) {
        $scope.error = "Could not read file";
        $scope.$apply();
      }
      reader.readAsText(file);
    }
  }
  $scope.setCursor = function (l, c) {
    // use line-1, because editor lines start at 0?!?!?!?? :D
    $scope.codeMirror.setCursor(l-1, c || 0);
    $scope.codeMirror.focus();
  }
  $scope.codegen = function(n) { return escodegen.generate(n); };
}