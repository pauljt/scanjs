function ExperimentCtrl($scope) {
  $scope.codeMirror = undefined;
  $scope.results=[];

  $scope.runManualScan = function (source, filename) {
    code = $scope.codeMirror.getValue();
    aw_scan(code);
    //$scope.results=ScanJS.scan(code, ScanJS.rules, "ManualInput");
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    var file = $scope.inputFiles.find(function(f){return f.name==filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };
  
}
