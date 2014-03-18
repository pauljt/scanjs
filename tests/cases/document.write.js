(function() {
  describe('document.write tests', function() {
    context('ignores safe patterns', function() {
      context(null, function() {
	var good = 'good.write = "static string";';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
      context(null, function() {
	var good = 'good = "document.write";';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function() {
	var bad = 'document.write("Hello World!");';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function() {
	var bad = 'window.document.write("Hello World!");';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function() {
	var bad = 'var a = window.document; a.b = document.writeln; a.b("<h1>bad</h1>");';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
