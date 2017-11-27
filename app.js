const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber');
}

// Assume any incoming request body is JSON & parse it
app.use(bodyParser.json());
routes(app);

// Middleware to handle errors
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

module.exports = app;
