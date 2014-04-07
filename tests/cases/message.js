(function() {
  describe('message tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'var a = "message";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'var message = "static string";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'function receiveMessage() { console.log(1); }';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'function message() { console.log(1); }';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'window.addEventListener("message", receiveMessage, false);';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
