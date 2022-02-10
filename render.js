'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const axios = require('axios');

const server = Hapi.server({
    port: 8080,
    host: 'localhost'
});

const init = async () => {

    // Register
    await server.register(require('@hapi/vision'));

    // Config render html path
    const context = {
      title: 'Github search result'
    };
    server.views({
      engines: {
          html: require('handlebars')
      },
      relativeTo: __dirname,
      path: './public',
      context
    });

    // Routes
    // server.route({
    //   method: 'GET',
    //   path: '/',
    //   handler: (req, h) => {
    //     return h.view('index');
    //   }
    // });
    const getPageNav = (headerLink) => {
      let result = { first: null, last: null, next: null, prev: null };

      const arrayLink = (headerLink).split(',').map(d => d.trim())
      arrayLink.forEach(link => {
        const urlLink = link.split(';').map(d => d.trim());
        
        // find rel type
        const relType = urlLink[1];

        // find page number
        const pageNumber = urlLink[0].substring(urlLink[0].indexOf('&page=') + 6, urlLink[0].length - 1)

        // Set result value
        if (relType === 'rel="first"') {
          result.first = pageNumber
        } else if (relType === 'rel="last"') {
          result.last = pageNumber
        } else if (relType === 'rel="next"') {
          result.next = pageNumber
        } else if (relType === 'rel="prev"') {
          result.prev = pageNumber
        }
      })
      return result;
    }
    server.route({
        method: 'GET',
        path: '/page/{page?}',
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
            const headerLink = getPageNav(respGithub.headers.link)
            return h.view('./index', {
              cntRecords: respGithub.data.items.length,
              searchResult: respGithub.data.items,
              navigate: headerLink,
              link: respGithub.headers.link,
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