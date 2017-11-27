const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/muber_test');
  mongoose.connection.once('open', () => done()).on('error', err => {
    console.warn('Warning', err);
  });
});

beforeEach(done => {
  const { drivers } = mongoose.connection.collections;
  drivers
    .drop()
    /* Before any of the tests are ran, ensure that an index is in place over the geometry.coordinates property
    on the drivers collection, i.e. recreate the index after dropping the collection. */
    .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
    .then(() => done())
    .catch(() => done());
});
