var expect = chai.expect;
var rules = ScanJS.rules;
rules.forEach(function(rule){
  if(rule.name == '.innerHTML') {
    this.rule = rule;
  }
});
var rules = [ this.rule ];

describe(".innerHTML", function() {
  it("safe input", function() {
    var good = 'good.innerHTML = "static string";';
    var results = ScanJS.scan(good, rules, 'tests/cases/innerhtml.js');
    expect(results).to.be.empty;
  });

  it("dangerous input", function() {
    var bad = 'bad.innerHTML = window.location.hash;';
    var results = ScanJS.scan(bad, rules, 'tests/cases/innerhtml.js');
    expect(results).not.to.be.empty;
  });
});

