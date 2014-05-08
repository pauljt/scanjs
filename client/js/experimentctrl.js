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

  ScanJS.loadRulesFile("../common/rules.json",function onLoaded(rules){
    $scope.ready=true;
  });

  $scope.runManualScan = function () {
    if(!$scope.ready){
      return;
    }
    ruleData.source=$scope.rule;
    ScanJS.loadRules([ruleData]);

    $scope.results=[];
    code = $scope.codeMirror.getValue();
    //put ast on global variable for debugging purposes.
    try{
      window.ast=acorn.parse(code);
    }catch(e){

    }
    //ScanJS.setResultCallback(found);
    $scope.results=ScanJS.scan(code);
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    var file = $scope.inputFiles.find(function(f){return f.name==filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };
  
}
