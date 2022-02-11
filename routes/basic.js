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
    method: 'GET',
    path: '/hello/{name}',
    handler: (req, h) => {
      return `Hi | ${req.params.name}`
    }
  },
  {
    method: 'POST',
    path: '/number/',
    options: {
      description: 'Swagger test payload',
      notes: 'Returns payload',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
            payloadType: 'form'
        }
      },
      validate: {
        payload: Joi.object({
          pageNo : Joi.number().required().description('test payload'),
        })
      },
      handler: (req, h) => {
        return req.payload
      }
    }
  },
  {
    method: 'POST',
    path: '/json/',
    options: {
      description: 'Swagger test payload',
      notes: 'Returns payload',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
            payloadType: 'form'
        }
      },
      validate: {
        payload: Joi.object({
          pageNo : Joi.number().required().description('test payload'),
        })
      },
      handler: (req, h) => {
        return req.payload
      }
    }
  }
]