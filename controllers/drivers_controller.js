const Driver = require('../models/driver');

module.exports = {
  greeting(req, res) {
    res.send({ hi: 'there' });
  },

  // The request object is going to contain the longitude & latitude from the user
  index(req, res, next) {
    // Save query string from URL of GET request
    const { lng, lat } = req.query;

    /* geoNear is a Mongoose query that can take GeoJSON data. Pass it options "spherical" to use a 2D sphere,
    & "maxDistance" to limit the number of meters radius to the user. */
    Driver.geoNear(
      /* Express thinks that the "lng" & "lat" in the query are strings instead of numbers,
      so they need to be converted to a full decimal value using JavaScrupt's parseFloat */
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      { spherical: true, maxDistance: 200000 }
    )
      .then(drivers => res.send(drivers))
      .catch(next);
  },

  create(req, res, next) {
    const driverProps = req.body;

    /* "create" Mongoose function instantiates & persists the record to the DB with a single call, whereas "save" is used on
    an existing instance model. "save" is best used if you want to do some computation or validation prior to saving it. */
    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next);
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    // Pass in the Id of the record to update, & the properties to update it with.
    Driver.findByIdAndUpdate(driverId, driverProps)
      /* NOTE: unfortunately findByIdAndUpdate .then() isn't called with the driver updated
      but an object with statistics on what objects were updated by default.
      So we use the options object "new" set to "true". Now we don't need the extra line
      .then(() => Driver.findById({ _id: driverId })) */
      .then(driver => res.send(driver))
      .catch(next);
  },

  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndRemove({ _id: driverId })
      // Choose to send back what was deleted to help on the front-end
      .then(driver => res.status(204).send(driver))
      .catch(next);
  }
};
