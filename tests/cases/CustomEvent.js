(function () {
  describe('CustomEvent tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "CustomEvent";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'good.CustomEvent = "CustomEvent";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'obj.addEventListener("cat", function(e) { process(e.detail) }); var event = new CustomEvent("cat",  {"detail":{"hazcheeseburger":true}});  obj.dispatchEvent(event);';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
