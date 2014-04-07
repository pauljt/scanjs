(function () {
  describe('setTimeout tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "window.setTimeout";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'setTimeout("console.log(1)", 500);';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'var intervalID = window.setTimeout("console.log(2)", 500);';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'something.setTimeout("console.log(3)", 500);';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 76 - https://github.com/mozilla/scanjs/issues/76
        var bad = 'var a = window.setTimeout; a("console.log(4)", 300);';
        it.skip(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 82 - https://github.com/mozilla/scanjs/issues/82
        var bad = 'var a = "setTimeout"; window[a]("console.log(5)", 300);';
        it.skip(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
