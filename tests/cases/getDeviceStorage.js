(function() {
  describe('getDeviceStorage tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'var a  = "navigator.getDeviceStorage(storageName)";';
	it(good, function(){
	  chai.expect(AcornScanJS.scan(good,  document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'var instanceOfDeviceStorage = navigator.getDeviceStorage(storageName);';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var a = navigator; a.getDeviceStorage(storageName);';
	it(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	// issue 82 - https://github.com/mozilla/scanjs/issues/82
	var bad = 'window["navigator"]["getDeviceStorage"](storageName);';
	it.skip(bad, function(){
	  chai.expect(AcornScanJS.scan(bad,  document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
