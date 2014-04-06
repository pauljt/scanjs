function ExperimentCtrl($scope) {
  $scope.codeMirror = undefined;
  $scope.results=[];
  $scope.ready=false;

  AcornScanJS.loadRulesFile("rules.json",function onLoaded(rules){
    console.log("loaded rules:",rules)
    $scope.ready=true;
  });

  function found(rule,node){
    $scope.results.push({
      rule : rule,
      filename : "manual input",
      line : node.loc.start.line,
      col : node.loc.start.col,
      node : node
      //this adds a snippet based on lines. need to prettify first if going to use this.
      //snippet:content.split('\n').splice(node.loc.start.line-1,node.loc.start.line+1).join('\n')
    });
  }

  $scope.runManualScan = function (source, filename) {
    if(!$scope.ready){
      return;
    }
    $scope.results=[];
    code = $scope.codeMirror.getValue();
    AcornScanJS.setResultCallback(found);
    AcornScanJS.scan(code);
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    var file = $scope.inputFiles.find(function(f){return f.name==filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };
  
}
