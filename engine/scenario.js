'use strict'
var step = require("./step")
var logger = require("./logger")

class Scenario{
    constructor(raw, maxCountOverride = 0) {
        this.raw = raw
        this.maxCountOverride = maxCountOverride
    }

    get_raw_copy(){
        var json = JSON.parse(JSON.stringify(this.raw))
        return json
    }

    id(){
        return this.raw["id"]
    }

    rpm(){
        return this.raw["rpm"]
    }

    hasRpm(){
        try{
            var rpm = this.rpm()
            if (rpm != undefined && rpm > 0)
            return true
        }
        catch(error){
            logger.error(`ERROR, while getting rpm(), detail:${error}`)
        }
        return false
    }

    maxCount(){
        if (this.maxCountOverride > 0) {
            return this.maxCountOverride
        }
        var maxCount = this.raw["maxCount"]
        if (maxCount != undefined && maxCount > 0) {
            return maxCount
        }
        return 0
    }

    waitMs(){
        if (this.hasRpm()){
            return (60*1000)/this.rpm()
        }
        return 0
    }

    async(){
        if (this.maxCount()<=1){
            return false
        }
        if (this.waitMs() == 0){
            return false
        }
        return !(this.raw["async"] == false || this.raw["async"] == "false")
    }

    steps(){
        if (this.raw["steps"] != undefined){
            return this.raw["steps"].map(x => new step(x))
        }
        return []
    }

    hasAnyBrowserSteps(){
        return this.steps().some(step => step.isBrowser())
    }
}

module.exports = Scenario
