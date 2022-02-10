'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Boom = require('@hapi/boom');
const axios = require('axios');
const Wreck = require('@hapi/wreck');

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {

    await server.register(Inert);

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
    // server.route({
    //   method: 'GET',
    //   path:'/wreck',
    //   handler: async (request, h) => {
    //     try {
    //       const res = await Wreck.request('get', 'https://api.github.com/search/repositories?q=nodejs&per_page=10&page=1');
    //       const body = await Wreck.read(res, {
    //         json: true
    //       });
    //       console.log(res);
    //       console.log(body);
    //       return  { body }
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    // })

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
      handler: (request, h) => {
  
        const payload = request.payload;
        if (!validatePayload(payload)) {
          console.log('!!!! Payload is incorrect format !!!!');
          console.log(JSON.stringify(payload));
          throw Boom.badData(`Level is incorrect format`);
        }

        let newJsonFormat = [];
        // Get keys level by desc
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
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();