function ResultListCtrl($scope, $http) {
  //if copy of results in localStorage use that, else load from original
  $scope.current={};
  editing=-1;
  $scope.results=[];
  
  $scope.editResult=function(resultid){
     console.log(2)
    editing=resultid;
    $scope.current=$scope.results[resultid];
  }
  
  $scope.showResult=function(resultid){
    console.log(1)
    editing=resultid;
    $scope.current=$scope.results[resultid];
  }
  
  $scope.saveResult=function(){
    if(editing){
      $scope.results[editing]={
        type:current.type,
        name:current.name,
        test:current.test,
        desc:current.desc,
        rec:current.rec
      }
    }
    localStorage.results = JSON.stringify($scope.results);
  }
  
  if(localStorage && localStorage.results) {
    console.log('loading results from localstorage')
    $scope.results = JSON.parse(localStorage.results);
  } else {
    try {
      console.log('loading results from json')
      $http.get('./results.json').then(function(res) {
        localStorage.results = JSON.stringify(res.data);
        $scope.results = res.data;
      });
    } catch(e) {

    }
  }
}