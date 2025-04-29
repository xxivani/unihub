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
//         url: 'http://localhost:5001/api' // Below code should now work instead, if it doesn't uncomment this, only for testing purposes
//       }
//     ]
        url: process.env.NODE_ENV === 'production' 
          ? 'https://team77.bham.team/api' 
          : process.env.NODE_ENV === 'development'
            ? 'https://team77.dev.bham.team/api'
            : process.env.NODE_ENV === 'test'
              ? 'http://localhost:5001/api'
              : 'http://localhost:5001/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
