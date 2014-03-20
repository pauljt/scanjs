(function() {
  describe('indexedDB tests', function() {
    context('ignores safe patterns', function() {
      context(null, function() {
	var good = 'var a  = "indexedDB.open(abase)";';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function() {
	var bad = 'var request = indexedDB.open("MyTestDatabase");';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function() {
	// issue 82 - https://github.com/mozilla/scanjs/issues/82
	var bad = 'var a = "indexedDB"; window[a].open(3);';
	it.skip(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
