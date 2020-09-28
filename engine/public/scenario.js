scenario = window.scenario || {};

scenario.refreshMs = 1000

scenario._scriptInputElement = null
scenario._script = {}
scenario._default_script = {
    "id": "testScenario",
    "rpm": 30,
    "steps": [
        {"name": "sleepMs", "params": [50]}
        ,{"name": "header", "params": ["X-DEMOTRON-TRACE", "1"]}
        ,{"name": "httpGet", "params": ["http://localhost:5000/api/inventory/10"]}
    ]
}

scenario.init = function (scriptInputElement, submitElement) {
    scenario._scriptInputElement = scriptInputElement
    submitElement.onclick = scenario.submit
    scriptInputElement.onchange = scenario.onChange
    scenario.load_by_id('startScenario', scenario._default_script)
    scenario.refreshLoop()
}

scenario.getScript = function(){
    var script = scenario._script
    script.rpm = slider.current
    return script
}

scenario.display = function() {
    scenario._scriptInputElement.value = JSON.stringify(scenario.getScript(), null, 2)
};

scenario.onUpdate = function(){
    scenario.display()
}

scenario.onChange = function(){
    json = JSON.parse(scenario._scriptInputElement.value)
    updateScenario(json)
}

function updateScenario(script){
    scenario._script = script
    slider.set_current(scenario._script.rpm)
}

scenario.addStep = function(name, params){
    var step = {"name": name, "params": params}
    scenario._script.steps.push(step)
    scenario.display()
}

scenario.submit = function(){
    var op = JSON.stringify(scenario.getScript())
    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: op
    }
    fetch('/api/scenario', options)
    .then(response => response.json())
    .then(function (response) {
    });
}

scenario.refreshLoop = async function () {
    while (true) {
        scenario.refresh()
        await scenario.sleepMs(scenario.refreshMs)
    }
}

scenario.sleepMs = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

scenario.toggle = async function (scenario_id, isEnabled) {
    const options = {
        method: "GET",
        body: null
    }
    fetch(`/api/scenario/${scenario_id}/${ isEnabled ? 'stop' : 'start' }`, options)
}

scenario.refresh = function(){
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: null
    }
    fetch('/api/scenario', options)
    .then(response => response.json())
    .then(function (response) {
        response = response.sort((a, b) => a.id.localeCompare(b.id))
        controlpanel.display(response)
    });
}

scenario.load_by_id = function(scenario_id, default_scenario = null){
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: null
    }
    fetch(`/api/scenario/${scenario_id}`, options)
    .catch( () => {
        updateScenario(default_scenario)
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {
                updateScenario(json)
                scenario.display()
            })
        }
        else {
            updateScenario(default_scenario)
            scenario.display()
        }
    });
}
