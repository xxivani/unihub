// swaggerOptions.js
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
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // path where your API documentation is defined in comments
};

const specs = swaggerJsdoc(options);
module.exports = specs;
