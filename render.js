'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const axios = require('axios');
const handlebars = require('handlebars');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = Hapi.server({
    port: 8080,
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

  // Path1
  function validatePayload(payload) {
    let flg = true;

    const levels = Object.keys(payload).map(lv => +lv);

    if (!levels.includes(0)) {
      flg = false;
      return flg;
    }

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const dataList = payload[level];
      const incorrectData = dataList.filter(d => d.level !== level);
      if (incorrectData.length > 0) {
        flg = false;
        break;
      }
    }
    
    return flg;
  }
  server.route({
    method: 'POST',
    path: '/path1',
    options: {
      description: 'Re-organize json format parent and child',
      notes: 'Returns correct json format',
      tags: ['api'],
      handler: async (req, h) => {
  
        const payload = req.payload;
        if (!validatePayload(payload)) {
          console.log('!!!! Payload is incorrect format !!!!');
          console.log(JSON.stringify(payload));
          throw Boom.badData(`Level is incorrect format`);
        }
  
        let newJsonFormat = [];
  
        // Get keys level and orderby desc
        const levels = Object.keys(payload).map(lv => +lv);
        levels.sort((a, b) => b - a);
  
        levels.forEach(level => {
          const parentList = payload[level];
          if (newJsonFormat.length === 0) {
            newJsonFormat.push(...parentList);
          } else {   
            const childrenList = newJsonFormat;
            childrenList.forEach(child => {
              const parent = parentList.find(p => p.id === child.parent_id);
              if (parent) {
                parent.children.push(child);
              } else {
                console.log('!!!! Error not found parent !!!!');
                console.log('Error data : ', child);
                throw Boom.badData(`Data id ${child.id} not found parent [patent_id: ${child.parent_id}]. Please check your data`);
              }
            })
            newJsonFormat = parentList;   
          }
  
          if (level === 0) {
            const cntParentId = parentList.filter(p => !!p.parent_id)
            if (cntParentId.length > 0) {
              console.log('!!!! Error root parent is incorrect !!!!');
              console.log('Error data : ', cntParentId);
              throw Boom.badData(`There are some data at level 0 is incorrect. Please check your data`);
            }
          }
        })
  
        return newJsonFormat;
  
      }
    },
  });

  // Path2
  // Config render html path
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
      path: '/path2/{page?}',
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
            curPage: page,
            cntRecords: respGithub.data.items.length,
            searchResult: respGithub.data.items,
            navigate: headerLink,
            link: respGithub.headers.link,
          });
        } catch (error) {
          if (error.code === 'ENOTFOUND') {
            console.log(error);
            throw Boom.badData(error.message);
          } else {
            console.log(error.response.data);
            throw Boom.badData(JSON.stringify(error.response.data));
          }
        }
      }
  });

  // Start server
  try {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.log(err);
  }

};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();