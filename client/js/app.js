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
  
  document.getElementById("scan-header").addEventListener("click", scanHeader);
  document.getElementById("rules-header").addEventListener("click", rulesHeader);
  document.getElementById("output-header").addEventListener("click", outputHeader);
});
