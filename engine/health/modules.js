'use strict'
const startedAt = require("./startedAt")
const scenarioStats = require("./scenarioStats")

class Modules{
    constructor(){
        this.modules = []
        this.modules.push(new startedAt())
        this.modules.push(new scenarioStats())
    }

    get(){
        return this.modules.map(x => x.get())
    }
}

module.exports = Modules
