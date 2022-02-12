'use strict';

const Hapi = require('@hapi/hapi');
const handlebars = require('handlebars');
const Vision = require('@hapi/vision');

// import routes
const routes = require('./../routes/index');

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// Routing
server.route(routes);

exports.init = async () => {

  // Register
  await server.register([
    Vision
  ]);

  // View config
  const context = {
    title: 'Github search result'
  };
  server.views({
    engines: {
        html: handlebars
    },
    relativeTo: __dirname,
    path: './../public',
    context
  });

  handlebars.registerHelper('ifObject', function (aString, options) {
    if(typeof aString === "object") {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  await server.initialize();
  return server;
};

exports.start = async () => {
  await server.start();
  console.log('Server running on %s', server.info.uri);
  return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Todo: Unit test
// Todo: Part 1 - Score: 2/5
// Todo: - Errors are handled from constants but there is a better method to have json creation as a reusable service instead

// Todo: Part 2 - Score: 2/5
// Todo: - Rate limiting not considered during development (All errors that will be thrown from API will be considered rate limiting invalidating the error shown to users)
// Todo: - No unit tests present to test functionality