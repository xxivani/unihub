require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerOptions');
const cors = require("cors");
const path = require('path');
const { healthCheck, connectWithRetry } = require('./db-connection');

app.use(express.json());
const corsOptions = {
  origin: [
    'https://team77.dev.bham.team',
    'https://team77.bham.team',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define health check endpoint only once
app.get('/api/health', healthCheck);

//user routes
const userRoutes = require('./src/routes/users');
app.use('/api/users', userRoutes);

//news routes
const newsRoutes = require('./src/routes/news');
app.use('/api/news', newsRoutes);

const startServer = async () => {
  try {
    await connectWithRetry();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();