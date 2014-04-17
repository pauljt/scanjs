describe('testing ../client/rules.json', function () {
  $.ajax({
    url: '../common/rules.json',
    async: false,
    dataType: 'json'
  }).done(function (ruleData) {

    ruleData.forEach(function (rule) {
      it(rule.name + " should match " + rule.testhit /*+"(details:"+rule.type+" "+rule.parameters+")"*/, function () {
        AcornScanJS.loadRules([rule]);
        var results = AcornScanJS.scan(rule.testhit);
        chai.expect(results.length).to.be.above(0);
        chai.expect(results[0].rule.name).to.equal(rule.name);
      });

      it(rule.name + " should not match " + rule.testmiss /*+"(details:"+rule.type+" "+rule.parameters+")"*/, function () {
        AcornScanJS.loadRules([rule]);
        var results = AcornScanJS.scan(rule.testmiss);
        chai.expect(results).to.have.length(0);
      });


    });
  });
})