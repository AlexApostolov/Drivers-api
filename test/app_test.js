const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('The express app', () => {
  it('should handle a GET request to /api', done => {
    // supertest faking a request
    request(app)
      .get('/api')
      .end((err, response) => {
        assert(response.body.hi === 'there');
        done();
      });
  });
});
