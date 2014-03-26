$( document ).ready(function() {
  function clearActive() {
    $('.active').removeClass("active");
  }
  
  function hideAll() {
    $('#scan').hide()
    $('#rules').hide()
    $('#output').hide()
  }

  function scanHeader() {
    hideAll();
    $("#scan").show();
  }

  function rulesHeader() {
    hideAll();
    $("#rules").show();
  }

  function outputHeader() {
    hideAll();
    $("#output").show();
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

  function scanLanding() {
    clearActive();
    $("#scan-landing-sidebar").addClass("active")
    $("#scan-landing").show();
    $("#scan-manual").hide();
  }

  document.getElementById("scan-header").addEventListener("click", scanHeader);
  document.getElementById("rules-header").addEventListener("click", rulesHeader);
  document.getElementById("output-header").addEventListener("click", outputHeader);
  document.getElementById("reset").addEventListener("click", reset);
  document.getElementById("scan-manual-sidebar").addEventListener("click", manualInput);
  document.getElementById("manual-link").addEventListener("click", manualInput);
  document.getElementById("scan-landing-sidebar").addEventListener("click", scanLanding);
});
