require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerOptions');
const cors = require("cors");
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
console.log(`Running in ${process.env.NODE_ENV} environment`);

app.use(express.json());
const corsOptions = {
  origin: [
    'https://team77.dev.bham.team',
    'https://team77.bham.team',
    'http://localhost:3000',
    'http://localhost:5173'  
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

const userRoutes = require('./src/routes/users');
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

const newsRoutes = require('./src/routes/news');
app.use('/api/news', newsRoutes);
app.use('/news', newsRoutes);

const externalEventsRoutes = require('./src/routes/externalEvents');
app.use('/api/external-events', externalEventsRoutes);
app.use('/external-events', externalEventsRoutes);


//Newly added.
const roleOpeningRoutes = require('./src/routes/roleOpening');
app.use('/api/role-openings', roleOpeningRoutes);

const roleOpeningRegistrationRoutes = require('./src/routes/roleOpeningRegistration');
app.use('/api/role-opening-registrations', roleOpeningRegistrationRoutes);

const committeeMemberRoutes = require('./src/routes/committeeMember');
app.use('/api/committee-members', committeeMemberRoutes);

const committeeMemberPermissionRoutes = require('./src/routes/committeeMemberPermission');
app.use('/api/committee-member-permissions', committeeMemberPermissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});