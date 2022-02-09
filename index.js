'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

const appendix1Input = {"0":
[{"id": 10,
  "title": "House",
  "level": 0,
  "children": [],
  "parent_id": null}],
"1":
[{"id": 12,
  "title": "Red Roof",
  "level": 1,
  "children": [],
  "parent_id": 10},
 {"id": 18,
  "title": "Blue Roof",
  "level": 1,
  "children": [],
  "parent_id": 10},
 {"id": 13,
  "title": "Wall",
  "level": 1,
  "children": [],
  "parent_id": 10}],
"2":
[{"id": 17,
  "title": "Blue Window",
  "level": 2,
  "children": [],
  "parent_id": 12},
 {"id": 16,
  "title": "Door",
  "level": 2,
  "children": [],
  "parent_id": 13},
 {"id": 15,
  "title": "Red Window",
  "level": 2,
  "children": [],
  "parent_id": 12},
  {"id": 19,
  "title": "SNK WRONG PARENT",
  "level": 2,
  "children": [],
  "parent_id": 10}]};

const appendix2Result = [{"id": 10,
"title": "House",
"level": 0,
"children":
 [{"id": 12,
   "title": "Red Roof",
   "level": 1,
   "children":
    [{"id": 17,
      "title": "Blue Window",
      "level": 2,
      "children": [],
      "parent_id": 12},
     {"id": 15,
      "title": "Red Window",
      "level": 2,
      "children": [],
      "parent_id": 12}],
   "parent_id": 10},
  {"id": 18,
   "title": "Blue Roof",
   "level": 1,
   "children": [],
   "parent_id": 10},
  {"id": 13,
   "title": "Wall",
   "level": 1,
   "children":
    [{"id": 16,
      "title": "Door",
      "level": 2,
      "children": [],
      "parent_id": 13}],
   "parent_id": 10}],
"parent_id": null}]

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

        return {
          newJsonFormat,
          appendix2Result
        };
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