'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {

          return 'Hello World!';
      }
    });

    // Challenges_1
/*
    server.route({
      method: 'GET',
      path: '/path1',
      handler: (request, h) => {
        let newJsonFormat = [];

        // Get keys level by desc
        const levels = Object.keys(appendix1Input);
        levels.sort((a, b) => b - a);

        levels.forEach(level => {
          const parentList = JSON.parse(JSON.stringify(appendix1Input[level]));
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
        })

        return newJsonFormat;
      }
    })
*/
    server.route({
      method: 'POST',
      path: '/path1',
      handler: function (request, h) {
  
        const payload = request.payload;
        let newJsonFormat = [];

        // Get keys level by desc
        const levels = Object.keys(payload);
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