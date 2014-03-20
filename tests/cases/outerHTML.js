(function() {
  describe('outerHTML tests', function() {
    context('ignores safe patterns', function() {
      context(null, function () {
	var good = 'good.outerHTML = "static string";';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'var a = document.createElement("div"); a.setAttribute("outerHTML", "<h1>bad</h1>"); document.body.appendChild(a);';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = 'var getInnerHtml = document.getElementById("node").outerHTML;';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
      context(null, function () {
	var good = '//div.outerHTML = this is a comment';
	it(good, function(){
	  chai.expect(ScanJS.scan(good, ScanJS.rules, document.location.pathname)).to.be.empty;
	});
      });
    });
    context('detects dangerous patterns', function() {
      context(null, function () {
	var bad = 'dangerous.outerHTML=document.location;';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
      context(null, function () {
	var bad = 'div.outerHTML = "static string" + someVariable;';
	it(bad, function(){
	  chai.expect(ScanJS.scan(bad, ScanJS.rules, document.location.pathname)).not.to.be.empty;
	});
      });
    });
  });
})();
