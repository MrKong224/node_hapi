'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const handlebars = require('handlebars');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');

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

    // Testing
    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
          return 'Hello World!';
      }
    });
    server.route({
      method: 'GET',
      path:'/index/{page?}',
      handler: (request, h) => {
        console.log(request.params.page)
        return h.file('./public/index.html')
      }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();