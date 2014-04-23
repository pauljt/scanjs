(function () {
  describe('addEventListener tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "addEventListener";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var addEventListener = "variable with name";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'var el = document.getElementById("outside");el.addEventListener("click", modifyText, false);';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'addEventListener("click", errorPageEventHandler, true, false);';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'tab.linkedBrowser.addEventListener("load", function (event) {console.log(1);});';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
