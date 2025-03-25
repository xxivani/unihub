const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniHub API',
      version: '1.0.0',
      description: 'API documentation for UniHub application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api' // 🔥 hardcoded for testing
      }
    ]
  },
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
