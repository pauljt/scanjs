$( document ).ready(function() {
  function clearActive() {
    $('.active').removeClass("active");
  }
  
  function hideAllDivs() {
    $('#scan').hide()
    $('#rules-div').hide()
    $('#output').hide()
  }

  function ruleLayout() {
    clearActive();
    hideAllDivs();
    $("#rules-div").show()
    $("#rule-nav")[0].setAttribute("class", "active");
  }

  function scanLayout() {
    clearActive();
    hideAllDivs();
    $("#scan").show()
    $("#scan-nav")[0].setAttribute("class", "active");
  }

  function outputLayout() {
    clearActive();
    hideAllDivs();
    $("#output").show()
    $("#output-nav")[0].setAttribute("class", "active");
  }
  
  document.getElementById("rule-nav").addEventListener("click", ruleLayout);
  document.getElementById("scan-nav").addEventListener("click", scanLayout);
  document.getElementById("output-nav").addEventListener("click", outputLayout);
});
