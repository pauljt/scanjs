function ScanCtrl($scope, ScanSvc) {
  $scope.codeMirror = undefined;
  $scope.codeMirrorManual = undefined;
  $scope.inputFiles = [];
  $scope.results=[];
  $scope.manualResults=[];
  $scope.inputFilename="";

  var selectedFile = 0;
  var codeMirror_index = 0;
  $scope.loadPossible = false;
  localforage.length(function(len) {
    $scope.loadPossible = (len == 3);
  });

  $scope.run = function (source, filename) {
    //empty last scan
    $scope.results=[];
    $scope.inputFiles.forEach(function (scriptFile, i) {
      if (document.getElementById('doScan_'+i).checked) {
        ScanSvc.newScan(scriptFile.name,scriptFile.asText());
      }
    });

    //update UI
    document.querySelector("#scan-input").classList.toggle("hidden",true);
    document.querySelector("#scan-results").classList.toggle("hidden",false);

    //update navbar
    document.querySelector("#scan-input-nav").classList.toggle("active",false);
    document.querySelector("#scan-output-nav").classList.toggle("active",true);
  }

  $scope.runManualScan = function (source, filename) {
    code = $scope.codeMirrorManual.getValue();
    $scope.manualResults=ScanJS.scan(source, rules, file);
    $scope.$apply();
  }

  $scope.navBarClick= function(evt){
    var showInput=evt.target.text=="input";
    document.querySelector("#scan-input").classList.toggle("hidden",!showInput);
    document.querySelector("#scan-results").classList.toggle("hidden",showInput);
  }

  $scope.handleFileUpload = function handleFileUpload(fileList) {
    //enable fileselect div
    //document.querySelector("#scan-intro").classList.toggle("hidden",true);
    document.querySelector("#scan-files-selected").classList.toggle("hidden",false);

    if (fileList.length == 1 && /\.zip$/.test(fileList[0].name)) {
      //packaged app case
      var reader = new FileReader();
      $scope.inputFilename=fileList[0].name;
      reader.readAsArrayBuffer(fileList[0]);
      reader.onload = function () {
        var zip = new JSZip(this.result);
        $scope.inputFiles = zip.file(/\.js$/);
        $scope.$apply();
      };
    }
    else {
      //uploading individual js file(s) case
      $scope.inputFilename="Multiple files"
      var jsType = /(text\/javascript|application\/javascript|application\/x-javascript)/;
      var zip = new JSZip(); //create a jszip to manage the files

      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        console.log('adding file:',file.name)
        if (!file.type.match(jsType)) {
          console.log("Ignoring non-js file:" + file.name + "(" + file.type + ")")
        }
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (function (file) {
          var fileName = file.name;
          return function(e){
            //add file to zip
            zip.file(fileName, e.target.result)
            $scope.inputFiles = zip.file(/.*/); //returns an array of files
            $scope.$apply();

          };
        })(file)

        reader.onerror = function (e) {
          $scope.error = "Could not read file";
          $scope.$apply();
        }

      }
    }
  }

  $scope.showFile = function (index) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    if($scope.inputFiles.length<1){
      return;
    }
    if(!index){
      index=0;
    }
    if ($scope.inputFiles.length > 0) {
      $scope.codeMirror.setValue($scope.inputFiles[index].asText());
    }
    codeMirror_index = index;
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    var file = $scope.inputFiles.find(function(f){return f.name==filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };

  $scope.saveState = function() {
    var includedAttributes = ['line','filename','rule', 'desc', 'name', 'rec','type'];
    /* A list of attributes we want include. Example:
    line: ..
    filename: ..
    rule: {
      desc: ..
      name: ..
      rec: ..
      type: ..
      }
    }
     */
    var serializedResults = JSON.stringify($scope.results, includedAttributes);
    localforage.setItem('results', serializedResults, function() { });

    var serializedInputFiles = $scope.inputFiles.map( function(el) { return {data: el.asText(), name: el.name }; });
    localforage.setItem("inputFiles", JSON.stringify(serializedInputFiles), function(r) { });

    var checkboxes = [];
    var ln = angular.element($('#js-input')).scope().inputFiles.length;
    for (var i=0; i < ln; i++) {
      checkboxes.push(document.getElementById("doScan_" + i).checked);
    }
    localforage.setItem("checkboxes", JSON.stringify(checkboxes));
    localforage.setItem("cm_index", JSON.stringify(codeMirror_index));
  };

  //TODO loadstate isn't called anymore, need to make it work with new workflow
  $scope.loadState = function() {
    // restore results as is
    localforage.getItem('results', function (results_storage) {
      if(!results_storage){
        alert('No previous scan found.')
      }
      $scope.results = JSON.parse(results_storage);
      $scope.$apply();
      });
    // restore files, by creating JSZip things :)
    localforage.getItem("inputFiles", function(inputFiles_storage) {
      // mimic behavior from handleFileUpload
      var files = JSON.parse(inputFiles_storage);
      var zip = new JSZip();
      files.forEach(function(file) {
        zip.file(file.name, file.data);
      });
      $scope.inputFiles = zip.file(/.*/);

      // nest checkbox import into the one for files, so we ensure the "inputFiles.length" check succeeds.
      localforage.getItem("checkboxes", function (checkboxes_storage) {
        var checkboxes = JSON.parse(checkboxes_storage);

        var ln = angular.element($('#js-input')).scope().inputFiles.length
        for (var i=0; i < ln; i++) {
          document.getElementById("doScan_" + i).checked = checkboxes[i];
        }
      });
      $scope.$apply();
    });
  };

  $scope.selectAll = function () {
    var element;
    var i = $scope.inputFiles.length-1;
    while (element=document.getElementById('doScan_'+i)) {
      element.checked = true;
      i--;
    }
  };
  $scope.selectNone = function () {
    var element;
    var i = $scope.inputFiles.length-1;
    while (element=document.getElementById('doScan_'+i)) {
      element.checked = false;
      i--;
    }
  };
  $scope.getSnippet = function (filename,line,numLines) {
    var file = $scope.inputFiles.find(function (f) {
      return f.name == filename
    });
    var content=file.asText();
    return content.split('\n').splice(line,line+numLines).join('\n');
  }

  $scope.$on('NewResults', function (event, result) {
    if (Object.keys(result).length == 0) {
      $scope.error = "Empty result set (this can also be a good thing, if you test a simple file)";
      return
    }
    $scope.results=$scope.results.concat(result.findings);
    $scope.error = "";
    /* this is likely a bug in angular or how we use it: the HTML template sometimes does not update
       when we change the $scope variables without it noticing. $scope.$apply() enforces this. */
    $scope.$apply();
    $scope.saveState();
  });

  $scope.$on('ScanError', function (event, exception) {
    $scope.error = exception.name + " at Line " + exception.loc.line + ", Column " + exception.loc.column + ": " + exception.message;
  });
}
