'use strict';
const runnerRepository = require("../../runnerRepository");
const scenario = require("../../scenario");
const scenarioValidator = require("../../scenarioValidator");
const errorMessage = require("../errorMessage");
var logger = require("../../logger")

exports.getScenarios = function(req, res) {
    logger.info('/scenario', 'get')
    var data = runnerRepository.Instance.findAll().map(x => ({'id': x.scenario.id(), 'runCount': x.runCount, 'isEnabled': x.isEnabled()}))
    returnOkJson(res, null, data)
}

exports.getScenario = function(req, res) {
    var id = req.params.id
    logger.info('/scenario', 'get')
    var runnerInstance = runnerRepository.Instance.findById(id)
    if (runnerInstance != null){
        returnOkJson(res, `scenario ${id} is fetched`, runnerInstance.scenario.raw)
        return
    }
    returnError(res, `scenario ${id} is not found while fetching`, 400)
}

exports.startScenario = function(req, res) {
    var id = req.params.id
    logger.info(`/scenario/${id}/start`, 'get')
    var runnerInstance = runnerRepository.Instance.findById(id)
    if (runnerInstance != null){
        var raw = runnerInstance.scenario.get_raw_copy()
        var rpm = req.query.rpm
        if (rpm!=null || rpm!=undefined){
            raw['rpm'] = rpm
        }
        var scenarioInstance = new scenario(raw)
        runnerInstance = runnerRepository.Instance.createOrUpdate(scenarioInstance)
        runnerInstance.start()
        returnOkJson(res, `scenario ${id} is started`, scenarioInstance)
        return
    }
    returnError(res, `scenario ${id} is not found while starting`, 400)
}

exports.stopScenario = function(req, res) {
    var id = req.params.id
    logger.info(`/scenario/${id}/stop`, 'get')
    var runnerInstance = runnerRepository.Instance.findById(id)
    if (runnerInstance != null){
        runnerInstance.stop()
        returnOkJson(res, `scenario ${id} is stopped`, '')
        return
    }
    returnError(res, `scenario ${id} is not found while stoping`, 400)
}

exports.createOrUpdateScenario = function(req, res) {
    logger.info('/scenario', 'createOrUpdateScenario')
    var body = req.body
    var scenarioInstance = new scenario(body)
    var validator = new scenarioValidator(scenarioInstance)
    if (validator.isValid()==false){
        returnError(res, `scenario is not valid: ${validator.errors.join(', ')}`, 400)
        return
    }
    var runnerInstance = runnerRepository.Instance.createOrUpdate(scenarioInstance)
    runnerInstance.start()
    returnOkJson(res, `scenario ${scenarioInstance.id()} is created/updated and started`, scenarioInstance)
}

exports.deleteScenario = function(req, res){
    var id = req.params.id
    logger.info(`/scenario/${id}`, 'delete')
    var runnerInstance = runnerRepository.Instance.findById(id)
    if (runnerInstance != null){
        var result = runnerRepository.Instance.delete(id)
        returnOkJson(res, `scenario ${id} is deleted, result:${result}`, '')
        return
    }
    returnError(res, `scenario ${id} is not found`, 400)
}

function returnOkJson(res, output, data){
    if (output != null) {
        logger.info(output)
    }
    res.json(data)
}

function returnError(res, output, code){
    logger.error(output)
    var response = new errorMessage(output)
    res.status(code).json(response)
}