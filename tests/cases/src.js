(function () {
  describe('src attribute tests', function () {
    context('ignores safe patterns', function () {
      context(null, function () {
        var good = 'var a = "something.src";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var src = "something";';
        it(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var src = img.src;';
        it(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
      context(null, function () {
        var good = 'var a = document.createElement("script"); a.src = "static string"; document.body.appendChild(a);';
        it.skip(good, function () {
          chai.expect(ScanJS.scan(good, document.location.pathname)).to.be.empty;
        });
      });
    });
    context('detects dangerous patterns', function () {
      context(null, function () {
        var bad = 'obj.src = "mystring";';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
      context(null, function () {
        var bad = 'var a = document.createElement("script"); a.src = variable; document.body.appendChild(a);';
        it(bad, function () {
          chai.expect(ScanJS.scan(bad, document.location.pathname)).not.to.be.empty;
        });
      });
    });
  });
})();
