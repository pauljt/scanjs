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
    newScan: function(source, file) {
      
      console.log('running scan')
      try {
        this.results= ScanJS.scan(source, this.rules, file || 'inline','#');
        $rootScope.$broadcast('NewResults', this.results);
      } catch(e) {
      if (e instanceof SyntaxError) { // e.g., parse failure
          $rootScope.$broadcast('ScanError', {name: e.name, loc: e.loc,message: e.message });
          } else {
          // if not, throw.
          throw e;
        }
      }
    },
    addResults: function(results) {
      this.results = results;
      $rootScope.$broadcast('NewResults', results);
    }
  };
});
