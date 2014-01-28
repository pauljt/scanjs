defs = {};
// XXX ugly ----v
function getJSON(nme, loc) {
  var x = new XMLHttpRequest();
  x.open("GET", loc, true);
  x.send()
  x.onload = function() {
    defs[nme] = x.response;
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
    console.log(results)
    $scope.results=[];
    $scope.results = results
  });
  
  $scope.filterEmpty = function(item) {
  alert(1)
    return (item.length>0)
  }
}
