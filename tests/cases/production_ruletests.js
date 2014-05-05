describe('Testing production rules (common/rules.json)', function () {
  $.ajax({
    url: '../common/rules.json',
    async: false,
    dataType: 'json'
  }).done(function (ruleData) {

    ruleData.forEach(function (rule) {
      describe('Rule: ' + rule.name, function () {

        rule.testhit.split(";").forEach(function (testsplit) {
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