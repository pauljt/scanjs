var review = function () {

  var results = [];
  var resultCodeView;
  var fileList;

  var initialValue = 'dangerous.innerHTML=document.location;\n' +
    'element[\'innerHTML\']=something+"we can catch calls to literal members;"\n' +
    'var foo=\'innerHTML\';element[foo]="but not dynamically referenced ones"\n' +
    'safe.innerHTML="a static string will never result in dom-based XSS";\n' +
    'doesntFlagFalsePositives="eval(\'alert(1)\')"+"element.innerHTML=danger";';

  function _init() {
    resultCodeView = new CodeMirror(document.querySelector('#results-code-view'), { mode: 'javascript',
      lineNumbers: true, theme: 'mdn-like', value: initialValue,
      styleActiveLine: true});

    fileList = document.querySelector('#file-list')
    fileList.addEventListener('change', _loadFiles)
  }

  function _loadFiles(evt) {
    var files = evt.files;
    if (files.length == 1) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function () {
        var zip = new JSZip(this.result);
        runScan(zip);
      };

    } else {
      console.log("Not a zip file")
    }
  }

  function _runScan(zip) {
    scripts = zip.file(/\.js$/);
    //ScanJS.scan(scripts[0].asText(), ScanJS.rules, scripts[0].name, scripts[0].name);

    scripts.forEach(function (scriptFile, i) {
      console.log(i);
      results[scriptFile.name] = ScanJS.scan(scriptFile.asText(), ScanJS.rules, scriptFile.name);
    });
  }

  window.addEventListener('load', _init);

  return {
    "runScan": _runScan
  }
}()

