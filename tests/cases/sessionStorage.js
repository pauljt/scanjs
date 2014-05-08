(function () {
  describe('sessionStorage tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "sessionStorage";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'window.sessionStorage.setItem("username", "John");';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'sessionStorage.setItem("username", "John");';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'var a = sessionStorage; a.setItem("username", "John");';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
