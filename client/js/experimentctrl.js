function ExperimentCtrl($scope) {
  $scope.codeMirror = undefined;
  $scope.results=[];
  $scope.ready=false;
  $scope.rule="eval()"
  var ruleData={
    "name": "manual rule",
    "source": $scope.rule,
    "testhit": $scope.rule,
    "testmiss": "",
    "desc": "Manual input.",
    "threat": "example"
  }

  AcornScanJS.loadRulesFile("../common/rules.json",function onLoaded(rules){
    $scope.ready=true;
  });

  $scope.runManualScan = function (source, filename) {
    if(!$scope.ready){
      return;
    }
    ruleData.source=$scope.rule;
    AcornScanJS.loadRules([ruleData]);

    $scope.results=[];
    code = $scope.codeMirror.getValue();
    //put ast on global variable for debugging purposes.
    try{
      window.ast=acorn.parse(code);
    }catch(e){

    }
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
