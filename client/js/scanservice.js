scanjsModule.factory('ScanSvc', function($rootScope) {
  var ScanService = {
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
      this.scanWorker.postMessage({call: 'scan', arguments: [source, this.rules, fileName]});
    },
    addResults: function(results) {
      $rootScope.$broadcast('NewResults', results);
    }
  };
  ScanService.scanWorker = new Worker("js/scanworker.js");
  ScanService.scanWorker.addEventListener("message", function (evt) {
    if (('findings' in evt.data) && ('filename' in evt.data)) {
      ScanService.addResults(evt.data);
    }
    else if ('error' in evt.data) {
      var exception = evt.data.error;
      if (e instanceof SyntaxError) {
        $rootsScope.$broadcast('ScanError', {name: exception.name, loc: exception.loc, message: exception.message })
      } else {
        throw e; // keep throwing unexpected things.
      }
    }
  });

  ScanService.scanWorker.onerror = function (e) { console.log('ScanWorker Error: ', e) };
  return ScanService;
});
