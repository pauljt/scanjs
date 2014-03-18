(function() {
  describe('ote tests', function() {
    context('ignores safe patterns', function() {
      context(null, function() {
	var good = 'good.innerHTML = "static string";';
	it.skip(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function() {
	var bad = 'dangerous.innerHTML=document.location;';
	it.skip(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function() {
	var bad = 'div.innerHTML = "static string" + someVariable;';
	it.skip(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
