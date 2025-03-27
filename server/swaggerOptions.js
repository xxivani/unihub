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
//         url: 'http://localhost:5000/api' // 🔥 hardcoded for testing
//       }
//     ]
        url: process.env.NODE_ENV === 'production' 
          ? 'https://team77.bham.team/api' 
          : process.env.NODE_ENV === 'development'
            ? 'https://team77.dev.bham.team/api'
            : process.env.NODE_ENV === 'test'
              ? 'http://localhost:5000/api'
              : 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
