function ScanCtrl($scope, ScanSvc) {
  $scope.codeMirror = undefined;
  $scope.inputFiles = [];
  $scope.results=[];

  var selectedFile = 0;

  $scope.run = function (source, filename) {
    if ($scope.inputFiles.length<1)
    {
      alert('Load some js files, or a App package(zip) first!');
      return;
    }
    //empty last scan
    $scope.results=[];
    console.log("start of run;", $scope.inputFiles[0].name);
    $scope.inputFiles.forEach(function (scriptFile, i) {
      ScanSvc.newScan(scriptFile.name,scriptFile.asText());
    });
    console.log("end of run;", $scope.inputFiles[0].name);

  }

  $scope.handleFileUpload = function handleFileUpload(fileList) {
    if (fileList.length == 1 && /\.zip$/.test(fileList[0].name)) {
      //packaged app case
      var reader = new FileReader();
      reader.readAsArrayBuffer(fileList[0]);
      reader.onload = function () {
        var zip = new JSZip(this.result);
        $scope.inputFiles = zip.file(/\.js$/);
        $scope.$apply();
      };
    }
    else {
      //uploading individual js file(s) case
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
            console.log("reading",file.name, e.target.result.split(0,10))
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


  $scope.updateCodeMirror = function (index) {
    if($scope.inputFiles.length<1){
      return;
    }
    if(!index){
      index=0;
    }
    if ($scope.inputFiles.length > 0) {
      $scope.codeMirror.setValue($scope.inputFiles[index].asText());
    }
  }

  $scope.setCursor = function (filename,line, col) {
    // use line-1, because editor lines start at 0?!?!?!?? :D

    var file = $scope.inputFiles.find(function(f){return f.name==filename});
    $scope.codeMirror.setValue(file.asText());
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  }

  $scope.getSnippt = function (filename,line,numLines) {
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
    console.log("on results;", $scope.inputFiles[0].name)
    $scope.results.push(result);
    $scope.error = "";
    console.log("results",$scope.results);
  });

  $scope.$on('ScanError', function (event, exception) {
    $scope.error = exception.name + " at Line " + exception.loc.line + ", Column " + exception.loc.column + ": " + exception.message;
  });


}
