'use strict'
var logger = require("./logger")
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

class Browser{
    constructor(scenarioName){
        this.scenarioName = scenarioName
        this.browser = null
    }

    async start(){
        if (this.browser != null){
            await this.stop()
        }
        logger.info(this.scenarioName, 'building browser ...')
        let options = new chrome.Options()
        options.addArguments("--no-sandbox")
        options.addArguments("--disable-dev-shm-usage")
        options.addArguments("--ignore-certificate-errors")
        options.headless()

        this.browser = new webdriver.Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .build()

        logger.info(this.scenarioName, 'browser built')
        return Promise.resolve()
    }

    async stop(){
        if (this.browser != null) {
            logger.info(this.scenarioName, 'destroying browser ...')
            await this.browser.quit()
            .then(() => {
                logger.info(this.scenarioName, 'browser destroyed')
            })
            .catch(error => {
                logger.error(this.scenarioName, 'exception while destroying browser', error)
            })
            this.browser = null
        }
        return Promise.resolve()
    }

    async goto(site) {
        logger.info(this.scenarioName, 'going to get page ...', site)
        await this.ensureBrowserPageCreated()
        await this.browser.get(site)
        .then(() => {
            logger.info(this.scenarioName, 'page found')
        })
        .catch(error => {
            logger.error(this.scenarioName, 'exception while browser goto', site, error)
            return Promise.reject()
        })
        return Promise.resolve()
    }

    getByElement(query){
        if (query.startsWith('#')) {
            var subquery = query.substr(1)
            logger.info(this.scenarioName, 'Lookup element using by id strategy with', subquery)
            return webdriver.By.id(subquery)
        }
        if (query.startsWith('.')) {
            var subquery = query.substr(1)
            logger.info(this.scenarioName, 'Lookup element using by class name strategy with', subquery)
            return webdriver.By.className(query.substr(1))
        }
        logger.info(this.scenarioName, 'Lookup element using by name strategy with', query)
        return webdriver.By.name(query)
    }

    async findElement(query){
        logger.info(this.scenarioName, 'Finding element with query', query)
        await this.ensureBrowserPageCreated()
        let by = this.getByElement(query)
        var found = await this.browser.findElements(by)
        if (found.length > 0) {
            logger.info(this.scenarioName, 'Element found', query)
            return found[0]
        }
        return null
    }

    async inputKeys(query, keys) {
        logger.info(this.scenarioName, 'Inputing keys', query)
        await this.ensureBrowserPageCreated()
        var element = await this.findElement(query)
        if (element != null){
            logger.info(this.scenarioName, 'Sending keys ...')
            element.sendKeys(keys, webdriver.Key.RETURN)
            return Promise.resolve()
        }
        return Promise.reject(`element not found with query ${query}`)
    }

    async waitUntilVisible(query, timeoutMs) {
        await this.ensureBrowserPageCreated()
        let by = this.getByElement(query)
        await this.browser.wait(webdriver.until.elementLocated(by), timeoutMs)
        return Promise.resolve()
    }

    async click(query) {
        logger.info(this.scenarioName, 'Click on element', query)
        await this.ensureBrowserPageCreated()
        var element = await this.findElement(query)
        if (element != null){
            logger.info(this.scenarioName, 'Clicking ...')
            element.click()
            return Promise.resolve()
        }
        return Promise.reject(`element not found with query ${query}`)
    }

    async ensureBrowserPageCreated(){
        if (this.browser == null) {
            logger.error(this.scenarioName, 'browser is not defined. Caller must call browser start() first.')
            return Promise.reject()
        }
        return Promise.resolve()
    }
}

module.exports = Browser
