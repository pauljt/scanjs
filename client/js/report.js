var module = angular.module('reportviewer',[]);

module.directive('file', function(){
    return {
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file ? file.name : undefined;
                scope.$apply();
            });
        }
    };
});

function ResultListCtrl($scope, $http) {
  //if copy of results in localStorage use that, else load from original
  $scope.report = {};
  $scope.report.file='scan.json' //load this by default
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
  
  $scope.loadReport=function(){
    try {
      console.log('loading results from '+$scope.report.file)
      $http.get($scope.report.file).then(function(res) {
        localStorage.results = JSON.stringify(res.data);
       
        $scope.results = res.data;
        console.log('loaded results' +$scope.results.length)
        console.log($scope.results)
      });
    } catch(e) {

    }
  }
}
