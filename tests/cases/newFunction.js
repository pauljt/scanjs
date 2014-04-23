(function() {
  describe('new Function() tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'var Function = "static string";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'new Function("alert(0)")();';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	// issue 76 - https://github.com/mozilla/scanjs/issues/76
	var bad = 'var a = Function; new a("alert(0)")();';
	it.skip(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
