'use strict'
const runnerRepository = require("../runnerRepository");

class ScenarioStats{
    get(){
        return runnerRepository.Instance.findAll().map(x => `[${x.scenario.id()}] ${x.runCount}`).join(' ')
    }
}

module.exports = ScenarioStats
