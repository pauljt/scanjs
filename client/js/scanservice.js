scanjsModule.factory('ScanSvc', function($rootScope) {
  var ScanService = {};
  return {
    results:[],
    ready:false,
    rules:null,
    init:function(rules){
      this.rules=rules;
      this.ready=true;
    },
    newScan: function(source,file) {
      
      console.log('running scan')
      //try{
    	  this.results=ScanJS.scan(source,this.rules,'inline','#');
    
    	$rootScope.$broadcast('NewResults', this.results);
    	//}catch(e){
    	//  console.log(e);
    	//$rootScope.$broadcast('NewResults', {error:[{line:e.lineNumber,rule:{name:e.description}}]});
    	//}
    },
    addResults: function(results) {
      this.results = {};
      for (fileName in results) {
        this.results = results[fileName]; // we basically override and just take last file -.-
      }
      $rootScope.$broadcast('NewResults', this.results);
    }
  };
});
