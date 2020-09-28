require('dotenv').config()

const runnerRepository = require("./runnerRepository")
const scenario = require("./scenario")
const fs = require("fs")

var logger = require("./logger")
logger.init()

var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000,
  scenarioFile = process.env.START_SCENARIO,
  bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', express.static('public'))
app.use('/api', express.static('public'))

var healthRoute = require('./api/health/route')
healthRoute(app)
var scenarioRoute = require('./api/scenario/route')
scenarioRoute(app)

app.listen(port)

scenarioFile = process.env.START_SCENARIO
if (scenarioFile != null && scenarioFile != "") {
  logger.info(`Reading scenario file ${scenarioFile}`)
  fs.readFile(scenarioFile, 'utf8', function (err, data){
    if (err){
        logger.error(`Could not read file ${scenarioFile}`, err.message)
        return
    }
    else{
      var json = JSON.parse(data)
      console.log(`Starting scenario ${scenarioFile}`)
      createAndWait(json)
    }
  })
}

console.log('RESTful API server started on: ' + port)

async function createAndWait(json){
  if (Array.isArray(json)){
    json.forEach(element => {
      var scenarioInstance = new scenario(element)
      var runnerInstance = runnerRepository.Instance.createOrUpdate(scenarioInstance)
      runnerInstance.start()
    })
  }
  else{
    var scenarioInstance = new scenario(json)
    var runnerInstance = runnerRepository.Instance.createOrUpdate(scenarioInstance)
    runnerInstance.start()
  }
}
