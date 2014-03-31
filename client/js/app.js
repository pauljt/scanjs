$( document ).ready(function() {
  function clearActive() {
    $('.active').removeClass("active");
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

});
