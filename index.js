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

    server.route({
      method: 'GET',
      path: '/error',
      handler: (request, h) => {

          throw Boom.notFound('Page not found');
      }
    });

    // Challenges_1

    server.route({
      method: 'GET',
      path: '/path1',
      handler: (request, h) => {
        let newJsonFormat = [];
        console.log(newJsonFormat);

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
              const parent = parentList.find(p => p.id === child.parent_id)
              if (parent) {
                parent.children.push(child)
              } else {
                console.log(child)
                console.log('!!!! Error not found parent !!!!')
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

    // server.route({
    //   method: 'GET',
    //   path: '/path1',
    //   handler: (request, h) => {
    //     let newJsonFormat = [];
    //     const keys = Object.keys(appendix1Input);
    //     keys.sort((a, b) => a-b);
    //     keys.forEach(k => {
    //       const objByLevel = appendix1Input[k];
    //       if (newJsonFormat.length === 0) {
    //         newJsonFormat.push(...objByLevel);
    //       } else if (+k === 1) {
    //         console.log(`objByLevel : `, objByLevel);
    //         objByLevel.forEach(child => {
    //           const parent = newJsonFormat.find(p => p.id === child.parent_id)
    //           parent.children.push(child);
    //           console.log(`child : `, child);
    //           console.log(`parent : `, parent);
    //           console.log(' ------- ')
    //         })
    //       } else {
    //         console.log(k);
    //       }
    //     });
    //     return {
    //       keys: keys,
    //       newJsonFormat
    //     };
    //   }
    // })

    // server.route({
    //   method: 'GET',
    //   path: '/path1',
    //   handler: (request, h) => {
    //       const keys = Object.keys(appendix1Input);
    //       let sourceJsonData = [];
    //       let newFormat = [];

    //       // Deconstruct source data
    //       keys.forEach(k => {
    //         // console.log(`${k} | ${appendix1Input[k].length}`)
    //         for (let i = 0; i < appendix1Input[k].length; i++) {
    //           const { id, title, level, children, parent_id } = appendix1Input[k][i]
    //           sourceJsonData.push({
    //             id,
    //             title,
    //             level,
    //             children,
    //             parent_id
    //           })
    //         }
    //       })

    //       // Get total level and sort asc
    //       const totalLevel = [...new Set(sourceJsonData.map(tL => tL.level))]
    //       totalLevel.sort((a, b) => a - b)

    //       totalLevel.forEach(level => {
    //         const objEachLevel = sourceJsonData.filter(d => d.level === level)
    //         objEachLevel.forEach(obj => {
    //           if (level === 0) {
    //             newFormat.push(obj)
    //           } 
    //         })
    //         // newFormat.push(objEachLevel)
    //       })

    //       return {
    //         keys: keys,
    //         newFormat,
    //         totalLevel,
    //         sourceJsonData,
    //       };

    //       // // Count parent
    //       // const totalParentId = [...new Set(sourceJsonData.map(tp => tp.parent_id))]
    //       // let cntParent = [];
    //       // totalParentId.forEach(p => { 
    //       //   const obj = sourceJsonData.filter(d => d.parent_id === p)
    //       //   cntParent.push({
    //       //     parentId: p,
    //       //     cnt: obj.length
    //       //   })
    //       // })
    //       // // Sort asc
    //       // const sortParentId = cntParent.sort((a, b) => a.cnt - b.cnt)

    //       // Set new json format
    //       // const mainParent = sourceJsonData.filter(mp => { return mp.parent_id === null })
    //       // totalParentId.forEach(pid => {
    //       //   if (pid) {
    //       //     const parentObj = sourceJsonData.find(d => { return d.id === pid })
    //       //     const childArray = sourceJsonData.find(d => { return d.id === pid })
    //       //     console.log(pid);
    //       //     console.log(parentObj);
    //       //     console.log(' ------- ')
    //       //   }
    //       // })
    //   }
    // });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();