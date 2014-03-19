var scanjsModule = angular.module('scanjs', ['ui.bootstrap']);

angular.element(document).ready(function() {
  // loading codeMirror requires the textArea


  var scanCtrlScope = angular.element(document.getElementById("input")).scope();
  scanCtrlScope.codeMirror = new CodeMirror(document.getElementById('codeMirrorDiv'), { mode: 'javascript',
    lineNumbers: true, theme: 'mdn-like', value: "", styleActiveLine: true});

  // Event handlers:
  var jsInput = document.getElementById("js-input");
  // same handler for both elements
  var fileHandler = angular.element(jsInput).scope().handleFileUpload;
  jsInput.addEventListener("change", function(evt) {
    fileHandler(this.files);
  });

 /* var jsonInput = document.getElementById("json-input");
  jsonInput.addEventListener("change", function(evt) {
    fileHandler(this.files);
  });*/
});
