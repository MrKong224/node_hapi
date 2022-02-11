const Joi = require('joi');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return 'Hello Hapi'
    }
  },
  {
    method: 'POST',
    path: '/number',
    handler: (req, h) => {
      return req.payload
    }
  }
]