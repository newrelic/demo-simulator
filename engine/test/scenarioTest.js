var assert = require('assert')
var stepTest = require('../test/stepTest')
var scenario = require('../scenario')

describe(`Scenario Test`, function () {
    it(`should have an id`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario")
        assert.equal(scenario.id(), "mainScenario")
    })

    it(`should not have any rpm`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario")
        assert.equal(scenario.rpm(), undefined)
    })
    
    it(`should not have any wait when no rpm defined`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario")
        assert.equal(scenario.waitMs(), 0)
    })

    it(`should default to async when not specified`, function(){
        var scenario = ScenarioTest.givenScenario("mainScenario", 60)
        assert.equal(scenario.async(), true)
    })

    it(`rpm should be defined`, function(){
        var scenario = ScenarioTest.givenScenario("mainScenario", 60, true)
        assert.equal(scenario.rpm(), 60)
    })
    
    it(`should be async`, function(){
        var scenario = ScenarioTest.givenScenario("mainScenario", 60, true)
        assert.equal(scenario.async(), true)
    })
    
    it(`should not be async`, function(){
        var scenario = ScenarioTest.givenScenario("mainScenario", null, false)
        assert.equal(scenario.async(), false)
    })

    it(`should not have any steps`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario")
        assert.deepEqual(scenario.steps(), [])
    })

    it(`should have a single step`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario", null, null, [stepTest.givenStep("step1")])
        assert.equal(scenario.steps().length, 1)
    })
    
    it(`should have multiple steps`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario", null, null, [
            stepTest.givenStep("step1"),
            stepTest.givenStep("step2"),
            stepTest.givenStep("step3")])
        assert.equal(scenario.steps().length, 3)
    })

    it(`should have at least 1 step using browser command`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario", null, null, [
            stepTest.givenStep("step1"),
            stepTest.givenStep("abrowserstep"),
            stepTest.givenStep("step3")])
        assert.equal(scenario.hasAnyBrowserSteps(), true)
    })

    it(`should NOT have any step using browser command`, function() {
        var scenario = ScenarioTest.givenScenario("mainScenario", null, null, [
            stepTest.givenStep("step1"),
            stepTest.givenStep("step2"),
            stepTest.givenStep("step3")])
        assert.equal(scenario.hasAnyBrowserSteps(), false)
    })

})

class ScenarioTest{
    static givenScenario(id, rpm = null, async = null, steps = null){
        var raw = {"id": id}
        if (rpm != null){
            raw["rpm"] = rpm
        }
        if (async != null){
            raw["async"] = async
        }
        if (steps != null && steps.length>0){
            var raw_steps = []
            steps.forEach(step => {
                var raw_step = step.get_raw_copy()
                raw_steps.push(raw_step)
            });
            raw["steps"] = raw_steps
        }
        raw["maxCount"] = 10
        return new scenario(raw)
    }
}

module.exports = ScenarioTest
