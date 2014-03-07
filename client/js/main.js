angular.element(document).ready(function() {
  // loading codeMirror requires the textArea
  var initialValue = 'dangerous.innerHTML=document.location;\n' +
    'element[\'innerHTML\']=something+"we can catch calls to literal members;"\n' +
    'var foo=\'innerHTML\';element[foo]="but not dynamically referenced ones"\n' +
    'safe.innerHTML="a static string will never result in dom-based XSS";\n' +
    'doesntFlagFalsePositives="eval(\'alert(1)\')"+"element.innerHTML=danger";';

  var scanCtrlScope = angular.element(document.getElementById("input")).scope();
  scanCtrlScope.codeMirror = new CodeMirror(document.getElementById('codeMirrorDiv'), { mode: 'javascript',
    lineNumbers: true, theme: 'mdn-like', value: initialValue,
    styleActiveLine: true});

  // Event handlers:
  var jsInput = document.getElementById("js-input");
  // same handler for both elements
  var fileHandler = angular.element(jsInput).scope().handleFileUpload;
  jsInput.addEventListener("change", function(evt) {
    fileHandler(this.files);
  });
  var jsonInput = document.getElementById("json-input");
  jsonInput.addEventListener("change", function(evt) {
    fileHandler(this.files);
  });
});