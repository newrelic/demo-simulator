'use strict';

module.exports = function(app) {
  var controller = require('./controller');

  app.route('/api/scenario')
    .get(controller.getScenarios)

  app.route('/api/scenario/:id/start')
    .get(controller.startScenario)
  app.route('/api/scenario/:id/stop')
    .get(controller.stopScenario)
  app.route('/api/scenario/:id')
  .get(controller.getScenario)

  app.route('/api/scenario')
    .put(controller.createOrUpdateScenario)
    .post(controller.createOrUpdateScenario)
    
  app.route('/api/scenario/:id')
    .delete(controller.deleteScenario)
}
