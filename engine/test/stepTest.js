var assert = require('assert')
var step = require('../step')

describe(`Step Test`, function () {
    it(`should have a name`, function() {
        var step = StepTest.givenStep("step1")
        assert.equal(step.name(), "step1")
    })
    
    it(`should have a single parameter`, function() {
        var step = StepTest.givenStep("step1", ["a value"])
        assert.equal(step.params(), "a value")
    })

    it(`should have multiple parameters`, function() {
        var step = StepTest.givenStep("step1", ["a value", "another value"])
        assert.deepEqual(step.params(), ["a value", "another value"])
    })

    it(`should have parameters different type`, function() {
        var step = StepTest.givenStep("step1", ["a value", 0, true])
        assert.deepEqual(step.params(), ["a value", 0, true])
    })

    it(`should have parameters in correct order`, function() {
        var step = StepTest.givenStep("step1", ["a value", "another value"])
        assert.notDeepEqual(step.params(), ["another value", "a value"])
    })

    it(`should have browser command`, function() {
        var step = StepTest.givenStep("abrowsercommand", [])
        assert.equal(step.isBrowser(), true)
    })

    it(`should NOT have browser command`, function() {
        var step = StepTest.givenStep("stepX", [])
        assert.equal(step.isBrowser(), false)
    })

})

class StepTest{
    static givenStep(name, params = null){
        var raw = {"name": name}
        if (params != null && params.length>0){
            raw["params"] = params
        }
        var astep = new step(raw)
        return astep
    }
}

module.exports = StepTest
