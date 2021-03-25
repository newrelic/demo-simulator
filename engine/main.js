// This is a command line entry point to allow the execution fo a single scenario
'use strict';
const runnerRepository = require("./runnerRepository")
const scenario = require("./scenario")
const fs = require("fs")

var logger = require("./logger")
logger.init()

if (process.argv.length<3){
    logger.error(`a scenario file is expected, please run as: node ./main.js [path_to_scenario.json]`)
}
else{
    var scenarioFile = process.argv[2]
    var isDelete = getOptionalDelete(process.argv)
    execute(scenarioFile, isDelete)
}

async function execute(scenarioFile, isDelete) {
    logger.info('Running scenario', scenarioFile)
    fs.readFile(scenarioFile, 'utf8', function(err,data) { onFileRead(err, data, isDelete) })
}

async function onFileRead(err, data, isDelete) {
    if (err){
        logger.error(`Could not read file ${scenarioFile}`, err.message)
        return
    }
    var json = JSON.parse(data)
    await createAndRun(json)
    if (isDelete) {
        logger.info('Deleting file', scenarioFile)
        fs.unlinkSync(scenarioFile)
    }
    return Promise.resolve()
}

function getOptionalDelete(argv) {
    var option = false
    if (argv.length >= 4) {
        var raw = argv[3]
        option = (raw === 'true')
    }
    return option
}

async function createAndRun(body){
    var scenarioInstance = new scenario(body)
    var runnerInstance = new runnerRepository(false).createOrUpdate(scenarioInstance)
    await runnerInstance.start()
    return Promise.resolve()
}
