'use strict'
require("./scenario")

class ScenarioValidator{
    constructor(scenario){
        this.scenario = scenario
        this.errors = []
    }

    isValid(){
        if (this.scenario.rpm() > 10000){
            this.errors.push('rpm cannot exceed 10000')
        }
        if (this.scenario.rpm() != null && this.scenario.rpm()<0){
            this.errors.push('rpm should be greater than or equal to 0')
        }
        if (this.scenario.id() == null){
            this.errors.push('a scenario must have a defined string id')
        }
        return this.errors.length == 0
    }

}

module.exports = ScenarioValidator
