const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Nested data is usually best left to subdocuments. Create subdocument to handle the nested GeoJSON data,
see http://geojson.org/ for standard info. */
const PointSchema = new Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    // Coordinates in GeoJSON are represented as an array of longitude & latitude numbers
    type: [Number],
    // MongoDB you are using a 2D sphere instead of a 2D plane
    index: '2dsphere'
  }
});

const DriverSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  driving: {
    type: Boolean,
    default: false
  },
  geometry: PointSchema
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
