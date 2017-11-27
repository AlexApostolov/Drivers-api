const DriversController = require('../controllers/drivers_controller');

module.exports = app => {
  app.get('/api', DriversController.greeting);

  app.post('/api/drivers', DriversController.create);

  app.put('/api/drivers/:id', DriversController.edit);

  app.delete('/api/drivers/:id', DriversController.delete);

  // Traditionally the route handler that returns a list of records is called "index"
  app.get('/api/drivers', DriversController.index);
};
