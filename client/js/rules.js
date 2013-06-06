function RuleListCtrl($scope, ScanSvc) {
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
    localStorage.setItem('rules', JSON.stringify($scope.rules));
  }
  
  if(localStorage && localStorage.rules) {
    console.log('loading rules from localstorage')
  } else {
    console.log('loading rules from json')
    localStorage.setItem('rules', JSON.stringify(ScanJS.rules));
  }

  $scope.rules = JSON.parse(localStorage.getItem('rules'));

  ScanSvc.init($scope.rules);
}
