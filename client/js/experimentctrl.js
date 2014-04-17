function ExperimentCtrl($scope) {
  $scope.codeMirror = undefined;
  $scope.results=[];
  $scope.ready=false;

  AcornScanJS.loadRulesFile("../common/rules.json",function onLoaded(rules){
    $scope.ready=true;
  });

  $scope.runManualScan = function (source, filename) {
    if(!$scope.ready){
      return;
    }
    $scope.results=[];
    code = $scope.codeMirror.getValue();
    //AcornScanJS.setResultCallback(found);
    $scope.results=AcornScanJS.scan(code);
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    var file = $scope.inputFiles.find(function(f){return f.name==filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };
  
}
