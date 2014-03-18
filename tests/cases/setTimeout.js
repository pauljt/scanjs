(function() {
  describe('setTimeout tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'var a = "window.setTimeout";';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'setTimeout("console.log(1)", 500);';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var intervalID = window.setTimeout("console.log(2)", 500);';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'something.setTimeout("console.log(3)", 500);';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var a = window.setTimeout; a("console.log(4)", 300);';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var a = "setTimeout"; window[a]("console.log(5)", 300);';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
