const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Driver = mongoose.model('Driver');

describe('Drivers controller', () => {
  it('should create a new driver when POST to /api/drivers', done => {
    /* A better test would be to check for the exact email if it's indeed the same; however, for practice
    count the number of drivers, then create a new driver, & check the count again. */
    Driver.count().then(count => {
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' })
        .end(() => {
          Driver.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('should edit an existing driver when PUT to /api/drivers/id', done => {
    const driver = new Driver({ email: 't@t.com', driving: false });

    driver.save().then(() => {
      // Use supertest to fake a request
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: 't@t.com' }).then(driver => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it('should delete a driver when DELETE to /api/drivers/id', done => {
    const driver = new Driver({ email: 'test@test.com' });

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: 'test@test.com' }).then(driver => {
            assert(driver === null);
            done();
          });
        });
    });
  });

  it('should find drivers in a location when GET to /api/drivers', done => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });

    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.191788, 25.761681] }
    });

    const hollywoodFlDriver = new Driver({
      email: 'hollywoodFl@test.com',
      geometry: { type: 'Point', coordinates: [-80.142967, 26.01128] }
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()]).then(() => {
      request(app)
        // User's location should be closest to the Miami driver
        .get('/api/drivers?lng=-80&lat=25')
        .end((err, response) => {
          assert(response.body.length === 1);
          assert(response.body[0].obj.email === 'miami@test.com');
          done();
        });
    });
  });
});
