function RuleListCtrl($scope, $http, ScanSvc) {
  //if copy of rules in localStorage use that, else load from original
  $scope.current={};
  editing=-1;
  $scope.rules=[];
  
  $scope.editRule=function(ruleid){
    editing=ruleid;
    $scope.current=$scope.rules[ruleid];
  }
  $scope.saveRule=function(){
    if(editing){
      $scope.rules[editing]={
        type:current.type,
        name:current.name,
        test:current.test,
        desc:current.desc,
        rec:current.rec
      }
    }
    localStorage.rules = JSON.stringify($scope.rules);
  }
  
  if(localStorage && localStorage.rules) {
    console.log('loading rules from localstorage')
    $scope.rules = JSON.parse(localStorage.rules);
    ScanSvc.init($scope.rules);
  } else {
    try {
      console.log('loading rules from json')
      $http.get('./rules.json').then(function(res) {
        ScanSvc.init(res.data);
        localStorage.rules = JSON.stringify(res.data);
        $scope.rules = res.data;
      });
    } catch(e) {

    }
  }
}



