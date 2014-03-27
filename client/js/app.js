$( document ).ready(function() {
  function clearActive() {
    $('.active').removeClass("active");
  }
  
  function hideAll() {
    $('#scan').hide()
    $('#rules').hide()
    $('#results').hide()
    $("#scan-landing").hide();
    $("#scan-manual").hide();
    $("#codeMirrorDiv").hide();
  }

  function scanHeader() {
    hideAll();
    clearActive();
    $("#scan").show();;
    $("#scan-intro").show();
    $("#scan-landing").show();
    $("#scan-landing-sidebar").addClass("active")
    $("#scan-manual").hide();
    $("#scan-files-selected").show();
  }

  function rulesHeader() {
    hideAll();
    $("#rules").show();
  }

  function outputHeader() {
    hideAll();
    $("#results").show();
  }

  function reset() {
    confirm("This will delete all results and clear currently loaded input data");
    $("#scan-manual-sidebar").show();
  }

  function manualInput() {
    clearActive();
    $("#scan-manual-sidebar").addClass("active")
    $("#scan-landing").hide();
    $("#scan-manual").show();
  }

  document.getElementById("scan-header").addEventListener("click", scanHeader);
  document.getElementById("rules-header").addEventListener("click", rulesHeader);
  document.getElementById("output-header").addEventListener("click", outputHeader);
  document.getElementById("manual-link").addEventListener("click", manualInput);

});
