function RuleListCtrl($scope, ScanSvc) {
  $scope.rulesFile="../common/rules.json";
  $scope.rules=[]; //JSON rules object

  loadRulesFile($scope.rulesFile);

  function loadRulesFile(rulesFile) {
    var request = new XMLHttpRequest();
    request.open('GET', rulesFile, false);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        $scope.rules = JSON.parse(request.responseText);
      } else {
        console.log('Error loading ' + rules)
      }
    };

    request.onerror = function () {
      console.log('Connection error while loading ' + rulesFile)
    };
    request.send();
  }
}
