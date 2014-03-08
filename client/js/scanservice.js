scanjsModule.factory('ScanSvc', function($rootScope) {
  var ScanService = {};
  return {
    //results:[],
    ready:false,
    rules:null,
    init:function(rules){
      this.rules=rules;
      this.ready=true;
    },
    newScan: function(file,source) {
      console.log('running scan');
      var fileName = file || 'inline';
      try {
        var findings= ScanJS.scan(source, this.rules, fileName);
        $rootScope.$broadcast('NewResults', {"filename":fileName,"findings":findings});
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
