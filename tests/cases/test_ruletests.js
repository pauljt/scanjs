describe('Testing rule templates (common/template_rules.json)', function () {
  $.ajax({
    url: '../common/template_rules.json',
    async: false,
    dataType: 'json'
  }).done(function (ruleData) {

    ruleData.forEach(function (rule) {
      describe('Rule: ' + rule.name, function () {
        it(rule.name + " should match template " + rule.name, function () {
          var template=ScanJS.parseRule(rule);
          chai.expect(template).to.equal(rule.name);
        });

        rule.testhit.split(";").forEach(function (testsplit) {
          if(testsplit.trim()!=""){
            it(rule.source + " should match " + testsplit, function () {
              ScanJS.loadRules([rule]);
              var results = ScanJS.scan(testsplit);
              chai.expect(results.length).to.equal(1);
            });
          }
        });

        it(rule.name + " should not match " + rule.testmiss, function () {
          ScanJS.loadRules([rule]);
          var results = ScanJS.scan(rule.testmiss);
          chai.expect(results).to.have.length(0);
        });
      });
    });
  });
})