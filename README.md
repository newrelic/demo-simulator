[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# demo-simulator

![Test](https://github.com/newrelic/demo-simulator/workflows/Test/badge.svg?event=push)

A NodeJS server allowing users to run simulation to drive traffic either to a REST API or a web site using selenium based commands.

## Installing
### Pre-requesite
- NPM version 6.4.1 or higher
- NodeJS version 10.14.2 or higher

### Init
After cloning the repository, run a "npm install" to pull all the needed dependencies.

## Running
For a developer, run "npm start" to start the server. This uses "nodemon" to watch for any changes on the local disk and restart the server.

For a production usage, run "node server.js".

Upon start, you should be able to hit http://localhost:3000/ to get the default index.html page.

## Testing
### Unit Tests
After cloning, run "npm test" to run all the unit tests.

### User Acceptance Tests
Click [here](user_acceptance_tests/README.md) for more information on our user acceptance tests.

## API
### /api/health
#### GET
This returns a list of health module status.
Current module list:
* StartedAt indicates in server local time when the application last started.
* Scenario reports all the scenario names currently in the server as well as their run statistics.


### /api/scenario
#### GET
This gets all the scenarios with their run statistics.
#### GET /[id]
This gets a specific scenario and its run statistics. If the scenario is not found, an empty JSON is returned.
#### PUT
This creates a new scenario. If a scenario with the same id was previously existing, it is stopped and replaced. If the scenario cannot be created, a response code of 400 with a JSON body response with a Message field will have more information regarding why the scenario could not be created.
#### POST
This updates a scenario. If a scenario is not found then it is created. If the scenario cannot be updated, a response code of 400 with a JSON body response with a Message field will have more information regarding why the scenario could not be updated.
#### DELETE /[id]
This stops and deletes a scenario. The operation returns 200 and the response body contains a text message indicating if the scenario was found and removed.

#### examples:
```
curl -i "http://18.220.11.30:5000/api/scenario"
curl -X POST -H "Content-Type: application/json" -d @/home/my-user/scenario.json http://18.220.11.30:5000/api/scenario
curl -i "http://18.220.11.30:5000/api/scenario/startScenario"
curl -X DELETE "http://18.220.11.30:5000/api/scenario/startScenario"
```

## Scenario
A scenario is defined by an "id" representing a unique string name, and a list of steps.

Optional, a scenario may have any of the following attributes

* rpm, as "scenario request per minute" defines a run frequency for launching the scenarios. This parameter cannot exceed a value of 10,000. If this parameter is omitted, a single execution of the scenario will be performed. 
* async is a boolean option (default true) specifying the launch of the scenario happens asynchronously, independently how long a scenario execute. Using the value false would ensure all the scenario are executed sequentially and would therefor limit the backpressure on the simulator in case a scenario external resource become overloaded.
* maxCount, is an optional integer to define how many times the scenario should be run before stopping. Note, this parameter can be used with rpm, higher rpm will reach the maxCount quicker.

### Scenario steps
* A step is a command defined as JSON: "name": string, "params": [string]
* The step commands are evaluated against a defined vocabulary (see previous prototype)
* A command executes within a simulator instance having an isolated data context. Some command may store result to be available in subsequent steps (previous http response content for example)
* A command may do some validation (http response contains). Alert notification channel TBD (not yet implemented)

```javascript
{
    "id": "mainScenario",
    "rpm": 3000,
    "maxCount": 10000,
    "steps": [
        {"name": "httpGet", "params": ["http://localhost:5000/api/inventory"]},
        {"name": "assertResponseContains", "params": ["Item_1"]},
        {"name": "sleepMs", "params": [100]},
        
        {"name": "httpGet", "params": ["http://localhost:5000/api/inventory/10"]},
        {"name": "assertResponseContains", "params": ["Item_10"]},
        {"name": "sleepMs", "params": [100]},
        
        {"name": "httpGet", "params": ["http://localhost:5000/api/validateMessage?message=blah"]},
        {"name": "assertResponseContains", "params": ["\"result\": true"]},
        {"name": "sleepMs", "params": [100]}
    ]
}
```

Other optional scenario attribute: cron, times

#### Driving Tron behaviors

Using the Simulator `header` command, it is possible to define some specific tron behaviors. For more information, see the [Behavior Documentation](https://github.com/newrelic/demo-deployer/tree/main/documentation/developer/behaviors)

#### Scenario Vocabulary

The full vocabulary to define steps is available in https://github.com/newrelic/demo-simulator/tree/main/engine/vocabulary.js

#### Browser web traffic

For browser related commands, they all start with the browser prefix.
A few commands have the ability to pass in a query which will be use as a selector by the browser (selenium/chrome). The query follow a css format. For example text prefixed with # will search for an element using the id value. The query prefixed with a . will search for the first element having a matching class name. Otherwise the query will follow a name match strategy.

Here is an example of browser simulated traffic
```json
{
  "id": "browsertest",
  "rpm": "5",
  "steps": [
    {
      "name": "browserStart",
      "params": []
    },
    {
      "name": "browserGoto",
      "params": ["http://www.google.com/ncr"]
    },
    {
      "name": "browserInputKeys",
      "params": ["q", "webdriver"]
    },
    {
      "name": "browserClick",
      "params": ["btnK"]
    },
    {
      "name": "browserWaitUntilVisible",
      "params": [".LC20lb", 10000]
    }
  ]
}
```

Here is another example of script driving traffic over a [demo-nodetron](https://github.com/newrelic/demo-nodetron)
```json
{
  "id": "browsertest",
  "rpm": "5",
  "steps": [
    {
      "name": "browserStart",
      "params": []
    },
    {
      "name": "browserGoto",
      "params": [
        "http://18.223.171.253:3002"
      ]
    },
    {
      "name": "browserClick",
      "params": [
        "#button"
      ]
    },
    {
      "name": "browserWaitUntilVisible",
      "params": [
        ".divTableRow",
        5000
      ]
    },
    {
      "name": "browserClick",
      "params": [
        ".divTableRow"
      ]
    },
    {
      "name": "browserWaitUntilVisible",
      "params": [
        "#inventoryItem",
        5000
      ]
    },
    {
      "name": "sleepMs",
      "params": [
        5000
      ]
    }
  ]
}
```

Please note the browser instance is automatically closed after each scenario execution. A new instance will be spawned upon starting the scenario.

##### Memory and performance consideration

Running selenium is not a lightweight operation. To ensure the proper memory management, scenarios that have any browser steps are run in a separate nodeJS process in a fire and forget manner.
Also, browser scenarios tend to use more resources. You'll want to make sure you have an instance type fitting the size of the load. Typically rpm up to a 60 can fit on a AWS/EC2 t3a.small. Beyond that, you'll want to scale out/up.

## NodeJS web server exposing /index.html
* Show list of all currently defined scenario (name, content)
* Can select a scenario by name and modify it. Modification are sent to the server
* Can create a new scenario (json input field)

## NodeJS commandline main.js
* Can execute a single scenario (sequence of steps and attributes)
### Start instruction
After cloning the repo, run the below steps in the /engine folder
```javascript
> npm install
> npm test
> node ./main.js ./config/scenario_example.json
```

## Demo-Deployer

`demo-simulator` can be also be deployed with the [demo-deployer](https://github.com/newrelic/demo-deployer), and supports Logging and Logging in Context.
Here is a deployer config example:

```json
{
  "services": [
    {
      "id": "simu1",
      "display_name": "Simulator",
      "destinations": ["host1"],
      "source_repository": "https://github.com/newrelic/demo-simulator.git",
      "deploy_script_path": "/deploy/linux/roles",
      "port": 3002
    }
  ],
  "resources": [
    {
      "id": "host1",
      "provider": "aws",
      "type": "ec2",
      "size": "t3a.small"
    }
  ],
  "instrumentations": {
    "services":[
      {
        "id": "nr_node_agent",
        "service_ids": ["simu1"],
        "provider": "newrelic",
        "source_repository": "https://github.com/newrelic/demo-newrelic-instrumentation.git",
        "deploy_script_path": "deploy/node/linux/roles",
        "version": "6.13.0"
      }
    ]
  }
}
```

## Cron jobs support

Cron jobs can be registered upon deployment using the demo-deployer Files configuration for the service. Here is an example for restarting a `node1` service every hour, at the 0 minute.

```json
{
  "services": [
    {
      "id": "simu1",
      "source_repository": "https://github.com/newrelic/demo-simulator.git",
      "deploy_script_path": "deploy/linux/roles",
      "port": 5001,
      "destinations": ["host"],
      "files": [
        {
          "destination_filepath": "engine/cronjob.json",
          "content": [
              {
                  "frequency": "0 * * * *",
                  "job": "/usr/bin/supervisorctl restart simu1",
                  "root": true
              }
          ]
        }
      ]
    }
  ]
}
```

## Contributing
We encourage your contributions to improve `demo-simulator`! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License
`demo-simulator` is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
>[If applicable: The `demo-simulator` also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.]
