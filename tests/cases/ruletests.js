describe('Testing rule templates (tests.json)', function () {
  $.ajax({
    url: 'tests.json',
    async: false,
    dataType: 'json'
  }).done(function (ruleData) {

    ruleData.forEach(function (rule) {
      describe('Rule: ' + rule.name, function () {
        rule.testhit.split(";").forEach(function (testsplit) {

          it(rule.name + " should match template " + rule.name, function () {
            var template=AcornScanJS.parseRule(rule);
            chai.expect(template).to.equal(rule.name);
          });

          if(testsplit.trim()!=""){
            it(rule.source + " should match " + testsplit, function () {
              AcornScanJS.loadRules([rule]);
              var results = AcornScanJS.scan(testsplit);
              chai.expect(results.length).to.equal(1);
            });
          }
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