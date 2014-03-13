var ruleName = '.innerHTML';
var good = 'good.innerHTML = "static string";';
var bad = 'bad.innerHTML = window.location.hash;';

var expect = chai.expect;
var rules = new Array;
for(i=0; i< ScanJS.rules.length; i++){
  if(ScanJS.rules[i].name == ruleName) {
    rules.push(ScanJS.rules[i]);
    break;
  }
}
describe(ruleName, function() {
  it("found the rule", function() {
    expect(rules).to.have.length.above(0);
  });
  it("safe input", function() {
    var results = ScanJS.scan(good, rules, document.location.pathname);
    expect(results).to.be.empty;
  });
  it("dangerous input", function() {
    var results = ScanJS.scan(bad, rules, document.location.pathname);
    expect(results).not.to.be.empty;
  });
});

