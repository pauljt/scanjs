(function () {
  describe('generateCRMFRequest tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'generateCRMFRequest = "static string";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = "generateCRMFRequest";';
        it(good, function () {
          chai.expect(AcornScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'crypto.generateCRMFRequest("CN=0", 0, 0, null, "console.log(1)", 384, null, "rsa-dual-use");;';
        it(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        // issue 76 - https://github.com/mozilla/scanjs/issues/76
        var bad = 'var a = crypto; a.generate = crypto.generateCRMFRequest; a.generate("CN=0", 0, 0, null, "console.log(1)", 384, null, "rsa-dual-use");';
        it.skip(bad, function () {
          chai.expect(AcornScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
