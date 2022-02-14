
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

// module.exports.test = {basicGet, basicPost}
module.exports = [
  basicGet,
  basicPost
]