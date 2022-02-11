'use strict';

const Hapi = require('@hapi/hapi');
const handlebars = require('handlebars');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

// import routes
const routes = require('./routes/index');



const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {

  // Config Swagger
  const swaggerOptions = {
    info: {
      title: 'Test API Documentation',
      version: Pack.version,
    },
  };

  // Register
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
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
    path: './public',
    context
  });

  handlebars.registerHelper('ifObject', function (aString, options) {
    if(typeof aString === "object") {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

  // Testing
  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();