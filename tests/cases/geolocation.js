(function() {
  describe('geolocation tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'var a  = "navigator.geolocation.getCurrentPosition(success, error);";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'navigator.geolocation.getCurrentPosition(showPosition);';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var a = navigator.geolocation; a.getCurrentPosition(showPosition);';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var a = navigator; a.geolocation.getCurrentPosition(showPosition);';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
