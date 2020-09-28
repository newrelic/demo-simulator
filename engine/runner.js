'use strict'
const vocabulary = require("./vocabulary")
const util = require("./util")
var logger = require("./logger")
const fs = require("fs")
const tmp = require("tmp")
const { fork } = require("child_process")

class Runner{
    constructor(scenario, isChildProcessEnabled){
        this.scenario = scenario
        this.isChildProcessEnabled = isChildProcessEnabled

        logger.info(process.ppid, `Runner, creating instance for ${this.scenario.id()}`)
        this.vocabulary = new vocabulary(this.scenario.id())
        this.isEnded = false
        this.runCount = 0
    }

    async start(){
        this.isEnded = false
        this.runCount = 0
        if (this.scenario.hasRpm()){
            await this.run()
        }
        return Promise.resolve()
    }

    async stop(){
        this.isEnded = true
        return Promise.resolve()
    }

    isEnabled(){
        return this.isEnded == false
    }

    async run(){
        var waitMs = this.scenario.waitMs()
        var async = this.scenario.async()
        var isInfinite = false
        var maxCount = this.scenario.maxCount()
        if (maxCount == 0) {
            if (waitMs == 0){
                maxCount = 1
            }
            else{
                isInfinite = true
            }
        }
        logger.info(process.ppid, `Runner[${this.scenario.id()}], starting run isInfinite:${isInfinite} waitMs:${waitMs} maxCount:${maxCount} async:${async}`)
        while((isInfinite == true || this.runCount<maxCount) && this.isEnded == false){
            this.runCount++
            var promises = []
            if (waitMs > 0){
                promises.push(util.sleepMs(waitMs))
            }
            try{
                var promise = null
                if (this.isChildProcessEnabled == false || this.scenario.hasAnyBrowserSteps()==false){
                    promise = this.startScenario()
                } else{
                    // Starting in a new child process
                    promise = this.startChildProcess()
                }
                if (promise != null && async == false){
                    promises.push(promise)
                }
            }
            catch(error)
            {
                logger.error(process.ppid, `Runner[${this.scenario.id()}], ERROR while starting scenario detail:`, error)
            }
            try
            {
                await Promise.all(promises)
            }
            catch(error)
            {
                logger.error(process.ppid, `Runner[${this.scenario.id()}], ERROR while executing detail:`, error)
                if (waitMs > 0){
                    await util.sleepMs(waitMs)
                }
            }
            logger.info(process.ppid, `Runner[${this.scenario.id()}], run completed`)
        }
        logger.info(process.ppid, `Runner[${this.scenario.id()}], all run finished`)
        return Promise.resolve()
    }

    async startScenario(){
        logger.info(process.ppid, `Runner[${this.scenario.id()}], executing new scenario`)
        await this.vocabulary.onBeforeRun()
        var steps = this.scenario.steps()
        for (let i=0; i<steps.length; i++) {
          await this.runStep(steps[i])
        }
        await this.vocabulary.onAfterRun()
        return Promise.resolve()
    }

    async startChildProcess() {
        logger.info(`Runner[${this.scenario.id()}], launch child process`)
        try{
            var path = await this.writeTempScenarioConfig()
            logger.info(process.ppid, this.scenario.id(), `Config written to disk at ${path}`)
            await this.launchChildProcess(path)
        }
        catch(error){
            logger.error(process.ppid, this.scenario.id(), `ERROR while launching child process ${this.scenario.id()}`, error)
        }
        return Promise.resolve()
    }

    writeTempScenarioConfig() {
        var tmpFile = tmp.fileSync()
        var path = tmpFile.name        
        logger.info(process.ppid, this.scenario.id(), `File created at ${path}`)
        var json = this.scenario.get_raw_copy()
        json["maxCount"] = 1
        json["rpm"] = 1
        var data = JSON.stringify(json)
        fs.appendFileSync(path, data)
        return path
    }

    async launchChildProcess(path) {
        var args = []
        args.push(path)
        args.push(true)
        var child_process = fork('main.js', args, { detached: true })
        logger.info(process.ppid, `Runner[${this.scenario.id()}], child process started`, child_process.pid)
        return Promise.resolve()
    }

    async runStep(step){
        logger.info(process.ppid, `Runner[${this.scenario.id()}], execute step ${step.name()} with ${step.params()}`)
        try
        {
            await this.vocabulary[step.name()].apply(this.vocabulary, step.params())
        }
        catch(error)
        {
            logger.error(process.ppid, this.scenario.id(), `ERROR while executing step ${step.name()}`, error)
            return Promise.reject()
        }
        return Promise.resolve()
    }

}

module.exports = Runner
