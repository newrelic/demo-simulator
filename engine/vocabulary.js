'use strict'
const util = require("./util")
var logger = require("./logger")
const uuidv4 = require('uuid/v4')
const browser = require("./browser");

class Vocabulary{
    constructor(scenarioName){
        this.scenarioName = scenarioName
        this.scope = {}
    }

    async browserStart(){
        logger.info(this.scenarioName, 'browserStart')
        await this.scope.browser.start()
        .then(x => {
            logger.info(this.scenarioName, 'browser started')
        })
        return Promise.resolve()
    }

    async browserStop(){
        logger.info(this.scenarioName, 'browserStop')
        await this.scope.browser.stop()
        .then(x => {
            logger.info(this.scenarioName, 'browser stopped')
        })
        return Promise.resolve()
    }

    async browserGoto(site) {
        logger.info(this.scenarioName, 'browserGoto', site)
        await this.scope.browser.goto(site)
        .then(x => {
            logger.info(this.scenarioName, 'browser goto completed')
        })
        return Promise.resolve()
    }

    async browserInputKeys(query, keys) {
        logger.info(this.scenarioName, 'browserInputKeys', query)
        await this.scope.browser.inputKeys(query, keys)
        .then(x => {
            logger.info(this.scenarioName, 'browser input keys completed')
        })
        return Promise.resolve()
    }

    async browserWaitUntilVisible(query, timeoutMs) {
        logger.info(this.scenarioName, 'browserWaitUntilVisible', query, timeoutMs)
        await this.scope.browser.waitUntilVisible(query, timeoutMs)
        .then(x => {
            logger.info(this.scenarioName, 'browser wait until visible completed')
        })
        return Promise.resolve()
    }

    async browserClick(query) {
        logger.info(this.scenarioName, 'browserClick', query)
        await this.scope.browser.click(query)
        .then(x => {
            logger.info(this.scenarioName, 'browser click completed')
        })
        return Promise.resolve()
    }

    async httpGet(url) {
        logger.info(this.scenarioName, 'httpGet', url)
        await this.getText(`${url}`)
        return Promise.resolve()
    }
    
    async httpPostJson(url, json) {
        logger.info(this.scenarioName, 'httpPost', url)
        await this.postJson(`${url}`, json)
        return Promise.resolve()
    }

    assertResponseContains(message){
        logger.info(this.scenarioName, 'assertResponseContains', message)
        if (this.scope.lastResponse == null || this.scope.lastResponse.includes(message)==false){
            logger.error(this.scenarioName, `ERROR: assertResponseContains("${message}") is false, response was "${this.scope.lastResponse}"`)
        }
    }

    header(key, value){
        if (value.toLowerCase() == "newguid"){
            value = uuidv4()
        }
        logger.info(this.scenarioName, 'header', key, value)
        this.scope.headers.push({key: key, value: value})
    }
  
    trace(){
        logger.info(this.scenarioName, 'trace')
        this.scope.headers.push({key: 'X-DEMOTRON-TRACE', value: '1'})
    }
  
    async sleepMs(ms) {
        logger.info(this.scenarioName, 'sleepMs', ms)
        await util.sleepMs(ms)
        return Promise.resolve()
    }

    async getText(url) {
        this.scope.lastResponse = null
        var response = await util.fetchAsText(url, null, this.scope.headers)
        this.scope.lastResponse = response
        logger.info(this.scenarioName, `get(${url}) responseLength:${this.scope.lastResponse.length}`)
        return Promise.resolve()
    }
    
    async postJson(url, json) {
        this.scope.lastResponse = null
        var response = await util.postAsJson(url, json, this.scope.headers)
        this.scope.lastResponse = JSON.stringify(response)
        logger.info(this.scenarioName, `postJson(${url}) responseLength:${this.scope.lastResponse.length}`)
        return Promise.resolve()
    }

    async onBeforeRun(){
        logger.info(this.scenarioName, 'onBeforeRun')
        this.scope = {}
        this.scope.headers = []
        this.scope.browser = new browser(this.scenarioName)
        return Promise.resolve()
    }
    
    async onAfterRun(){
        logger.info(this.scenarioName, 'onAfterRun')
        await this.scope.browser.stop()
        return Promise.resolve()
    }
}

module.exports = Vocabulary
