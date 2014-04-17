(function() {
  describe('eval tests', function() {
    context('ignores safe patterns', function() {
      context(null, function() {
	var good = 'var a = "eval(alert(1));";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
      context(null, function() {
	var good = 'var a = {}; a.eval = "somstring";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function() {
	var bad = 'eval("alert(0);");;';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function() {
	// issue 76 - https://github.com/mozilla/scanjs/issues/76
	var bad = 'var a = eval; a("alert(0);");';
	it.skip(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
