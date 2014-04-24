describe('Testing rule templates (tests.json)', function () {
  $.ajax({
    url: 'tests.json',
    async: false,
    dataType: 'json'
  }).done(function (ruleData) {

    ruleData.forEach(function (rule) {
      describe('Rule: ' + rule.name, function () {
        rule.testhit.split(";").forEach(function (testhit) {
          it(rule.source + " should match " + testhit, function () {
            AcornScanJS.loadRules([rule]);
            console.log(rule.source,testhit,AcornScanJS.scan(testhit))
            var results = AcornScanJS.scan(testhit);

            chai.expect(results.length).to.equal(1);
            chai.expect(results[0].rule.name).to.equal(rule.name);
          });
        });

        it(rule.name + " should not match " + rule.testmiss, function () {
          AcornScanJS.loadRules([rule]);
          var results = AcornScanJS.scan(rule.testmiss);
          chai.expect(results).to.have.length(0);
        });
      });
    });
  });
})