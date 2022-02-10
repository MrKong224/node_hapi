'use strict';

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const handlebars = require('handlebars');
const Boom = require('@hapi/boom');
const axios = require('axios');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {

    // Register
    await server.register(Vision);

    // Config render html path
    server.views({
      engines: {
          html: handlebars
      },
      relativeTo: __dirname,
      path: 'public'
    });

    // Routes
    server.route({
        method: 'GET',
        path: '/index/{page?}',
        handler: async (req, h) => {
          const page = req.params.page || 1;
          try {
            const respGithub = await axios({
              method: 'GET',
              url: `https://api.github.com/search/repositories?q=nodejs&per_page=10&page=${page}`,
            });
            if (respGithub.status !== 200) {
              console.log('!!!! Error during call github api !!!!');
              console.log('Error data : ', respGithub.statusText);
              throw Boom.badData(respGithub);
            }
            const headerLink = (respGithub.headers.link).split(',')
            return h.view('index', {
              title: `Table source page: ${page}`,
              message: respGithub.data.items,
              nav: headerLink
            });
          } catch (error) {
            console.log(error.response.data);
            throw Boom.badData(JSON.stringify(error.response.data));
          }
        }
    });
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();