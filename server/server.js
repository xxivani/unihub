require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerOptions');
const cors = require("cors");
const path = require('path');

// localhost:5000/api-docs

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



//user routes
const userRoutes = require('./src/routes/users');
app.use('/api/users', userRoutes);

//news routes
const newsRoutes = require('./src/routes/news');
app.use('/api/news', newsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
