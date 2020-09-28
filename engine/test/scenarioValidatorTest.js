var assert = require('assert')
var scenario = require('../scenario')
var scenarioValidator = require('../scenarioValidator')
var scenarioTest = require('../test/scenarioTest')

describe(`Scenario Validator Test`, function () {
    it(`should validate happy path`, function() {
        var scenario = scenarioTest.givenScenario("mainScenario")
        var validator = new scenarioValidator(scenario)        
        assert.equal(validator.isValid(), true)
        assert.equal(validator.errors.length, 0)
    })

    it(`should not have rpm more than max value`, function() {
        var scenario = scenarioTest.givenScenario("mainScenario", 100000)
        var validator = new scenarioValidator(scenario)        
        assert.equal(validator.isValid(), false)
        assert.equal(validator.errors.some(function(error){ return error.includes("rpm cannot exceed")}), true)
    })
    
    it(`should have valid rpm`, function() {
        var scenario = scenarioTest.givenScenario("mainScenario", 10)
        var validator = new scenarioValidator(scenario)        
        assert.equal(validator.isValid(), true)
    })
    
    it(`rpm should be a positive number`, function(){
        var scenario = scenarioTest.givenScenario("mainScenario", -3, true)
        var validator = new scenarioValidator(scenario)        
        assert.equal(validator.isValid(), false)
    })
    
    it(`rpm can be 0`, function(){
        var scenario = scenarioTest.givenScenario("mainScenario", 0, true)
        var validator = new scenarioValidator(scenario)
        assert.equal(validator.isValid(), true)
    })
    
    it(`scenario should have an id`, function() {
        var validator = new scenarioValidator(new scenario({}))        
        assert.equal(validator.isValid(), false)
        assert.equal(validator.errors.some(function(error){ return error.includes("a scenario must have a defined string id")}), true)
    })

})

var include = function(message, substring){
    return message.indexOf(substring) >= 0
}