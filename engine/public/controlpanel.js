controlpanel = window.controlpanel || {};

var markup = []
var scenarios = []
var _div = null

controlpanel.init = function(div){
    _div = div
}

controlpanel.display = function (scenarios) {
    scenarios = scenarios
    _div.innerHTML = controls(scenarios)
}

function controls(scenarios) {
  markup = scenarios.map(s => scenarioTile(s, s.id === scenario.getScript().id))
  if (markup.length >0) {
    return `<h4>Current<h4/><div id="scenarios">${markup.join("\n")}</div>`
  }
  return null
}

function scenarioTile(raw, isEditing) {
  const id = raw.id
  const runCount = (raw.runCount && raw.isEnabled) ? raw.runCount : '--'
  const isEnabled = raw.isEnabled || false
  const playBtnDisabled = isEnabled ? 'disabled' : ''
  const stopBtnDisabled = !isEnabled ? 'disabled' : ''
  const editing = isEditing ? '<span style="color:red;font-weight:bold;margin-right:2px;">*</span>' : ''

  return `
    <div class="scenario-card">
      <div class="vertically-centered-row" style="margin-bottom:1.5rem;">
        <div class="contained-text">
          <span class="title">${editing}${id}</span>
        </div>
        <button onclick="onScenarioClick('${id}')" type="button" class="icon-button edit" style="margin-left:auto;" title="Edit scenario">
          <i class="material-icons">edit</i>
        </button>
      </div>
      <div class="vertically-centered-row">
        <div class="container-text">
          <span class="count">${runCount}</span>
        </div>
        <div style="margin-left:auto;">
          <button onclick="onScenarioStateClick('${id}', ${isEnabled})" ${playBtnDisabled} class="${playBtnDisabled} icon-button play" type="button" title="Play scenario">
            <i class="material-icons">play_arrow</i>
          </button>
          <button onclick="onScenarioStateClick('${id}', ${isEnabled})" ${stopBtnDisabled} class="${stopBtnDisabled} icon-button stop" title="Stop scenario">
            <i class="material-icons">stop</i>
          </button>
        </div>
      </div>
    </div>
  `
}

function onScenarioClick(scenarioId) {
  scenario.load_by_id(scenarioId)
}

function onScenarioStateClick(scenarioId, isEnabled) {
  scenario.toggle(scenarioId, isEnabled)
}
