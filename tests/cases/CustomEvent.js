(function () {
  describe('CustomEvent tests - future rule?', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "CustomEvent";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'good.CustomEvent = "CustomEvent";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'obj.addEventListener("cat", function(e) { process(e.detail) }); var event = new CustomEvent("cat",  {"detail":{"hazcheeseburger":true}});  obj.dispatchEvent(event);';
        it.skip(bad, function () {
          chai.expect(ScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
