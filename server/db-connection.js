const { Sequelize } = require('sequelize');
const retry = require('retry');

const dbUrl = process.env.DATABASE_URL || 
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

console.log('Connecting to database with URL pattern:', 
  dbUrl.replace(/postgres:\/\/.*:(.*)@/, 'postgres://[username]:[password-hidden]@'));

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectWithRetry = async () => {
  const operation = retry.operation({
    retries: 10,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 60000,
    randomize: true,
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        console.log(`Database connection attempt ${currentAttempt}...`);
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        resolve();
      } catch (err) {
        console.error(`Database connection attempt ${currentAttempt} failed:`, err.message);
        
        if (operation.retry(err)) {
          console.log(`Retrying... (${currentAttempt}/${operation._timeouts.length})`);
          return;
        }
        
        reject(new Error(`Could not connect to database after ${currentAttempt} attempts: ${err.message}`));
      }
    });
  });
};

const healthCheck = async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      status: 'success', 
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  sequelize,
  connectWithRetry,
  healthCheck
};