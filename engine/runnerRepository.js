'use strict'
const runner = require("./runner");

class RunnerRepository{
    constructor(isChildProcessEnabled = true){
        this.runners = []
        this.isChildProcessEnabled = isChildProcessEnabled
    }

    createOrUpdate(scenario){
        var runnerInstance = new runner(scenario, this.isChildProcessEnabled)
        var previous = this.findById(scenario.id())
        this.stopAndRemove(previous)
        this.runners.push(runnerInstance)
        return runnerInstance
    }

    delete(id){
        var runnerInstance = this.findById(id)
        var result = this.stopAndRemove(runnerInstance)
        return result
    }

    findById(id) {
        if (id != null){
            return this.runners.find(runnerInstance => runnerInstance.scenario.id() == id)
        }
        return null
    }

    findAll(){
        return this.runners
    }
    
    stopAndRemove(runner){
        if (runner != null){
            var index = this.runners.indexOf(runner);
            if (index > -1) {
                var removed = this.runners.splice(index, 1);
                if (removed != null){
                    runner.stop()
                    return `DELETED`
                }
            }
            return `ALREADY DELETED`
        }
        return `NOT FOUND`
    }

}
RunnerRepository.Instance = new RunnerRepository()

module.exports = RunnerRepository
