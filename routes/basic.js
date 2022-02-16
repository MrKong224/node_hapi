
const basicGet = {
  method: 'GET',
  path: '/',
  handler: (req, h) => {
    return 'Hello Hapi'
  }
}
const basicPost = {
  method: 'POST',
  path: '/number',
  handler: (req, h) => {
    return req.payload
  }
}

// module.exports.basicGet = basicGet
// module.exports.basicPost = basicPost
module.exports.totalRoutes = [
  basicGet,
  basicPost
]