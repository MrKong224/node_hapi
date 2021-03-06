const { init } = require('../lib/server');
// const basicAPI = require('./../routes/basic')

describe('Basic API', () => {
  let server;

  beforeAll(async () => {
    server = await init();
  });

  const path1JsonTesting = {"0":
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
    "parent_id": 12}]}
  it('Test path1 response with new json format', async () => {
    const res = await server.inject({
      method: 'post',
      url:'/path1',
      payload: path1JsonTesting
    });
    expect(res.statusCode).toBe(200);
  })

  it('Test path2 response with html page', async () => {
    const res = await server.inject({
      method: 'get',
      url:'/path2/1',
      payload: path1JsonTesting
    });
    expect(res.statusCode).toBe(200);
  })

  afterAll(async () => {
    await server.stop();
  });
});