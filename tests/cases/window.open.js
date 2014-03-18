(function() {
  describe('window.open tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'var open = "string window.open";';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'var a = {}; a.open = "string"; ';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'var a = {}; a.open = function () { alert(1); }; a.open("1", "2", a);';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'win = window.open("http://www.mozilla.org", "name", fets);';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'var o = window.open; o("http://www.mozilla.org", "name", {});';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
