var scanjsModule = angular.module('scanjs', ['ui.bootstrap']);

angular.element(document).ready(function() {
  // loading codeMirror requires the textArea
  var scanCtrlScope = angular.element(document.getElementById("input")).scope();
  scanCtrlScope.codeMirror = new CodeMirror(document.getElementById('codeMirrorDiv'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'mdn-like',
    value: "",
    readOnly:true,
    tabsize: 2,
    styleActiveLine: true
  });

  scanCtrlScope.codeMirrorResults = new CodeMirror(document.getElementById('codeMirrorDivResults'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'mdn-like',
    value: "Click links below to view",
    readOnly:true,
    tabsize: 2,
    styleActiveLine: true
  });

  scanCtrlScope.codeMirrorManual = new CodeMirror(document.getElementById('codeMirrorDivManual'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'mdn-like',
    tabsize: 2,
    value: "",
  });

  // Event handlers:
  var jsInput = document.getElementById("js-input");
  // same handler for both elements
  var fileHandler = angular.element(jsInput).scope().handleFileUpload;
  jsInput.addEventListener("change", function(evt) {
    $("#scan-files-selected").show();
    $("#scan-manual-sidebar").hide();
    fileHandler(this.files);
    $("#start-scan-files").show();
  });
});
