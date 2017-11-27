const app = require('./app');

/* When testing the server via mocha or any other test framework, its nice to not have the server
automatically try to listen to an outside port. To solve that, I placed the 'listen' call into a separate file. */
const port = 3050;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
