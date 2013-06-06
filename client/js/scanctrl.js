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
