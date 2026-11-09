require('dotenv').config();

// Shared production settings. Works with either:
//  - DATABASE_URL (Railway / Heroku style), or
//  - the original POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB / DB_HOST / DB_PORT vars
//    (what the university docker-compose deployment uses).
const productionBase = {
  dialect: 'postgres',

  dialectOptions: {
    useUTC: false,
    prependSearchPath: true,
    // Only needed when connecting to Railway through the PUBLIC proxy URL. Set DB_SSL=true then.
    ...(process.env.DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {})
  },

  searchPath: 'public',

  define: {
    freezeTableName: true,
    underscored: false
  },
  logging: false
};

module.exports = {
  development: {
    username: process.env.POSTGRES_USER     || 'team77',
    password: process.env.POSTGRES_PASSWORD || 'team77',
    database: process.env.POSTGRES_DB       || 'team77',
    host:     process.env.DB_HOST           || '127.0.0.1',
    port:     process.env.DB_PORT           || 5432,
    dialect:  'postgres',

    dialectOptions: {
      useUTC:            false,
      prependSearchPath: true
    },


    searchPath: 'public',

    define: {
      freezeTableName: true,
      underscored:     false
    },
    logging: console.log
  },

  test: {
    username: process.env.POSTGRES_USER     || 'team77',
    password: process.env.POSTGRES_PASSWORD || 'team77',
    database: process.env.POSTGRES_DB       || 'team77',
    host:     process.env.DB_HOST           || '127.0.0.1',
    port:     process.env.DB_PORT           || 5433,
    dialect:  'postgres',

    dialectOptions: {
      useUTC:            false,
      prependSearchPath: true
    },

    searchPath: 'public',

    define: {
      freezeTableName: true,
      underscored:     false
    }
  },

  production: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
        ...productionBase
      }
    : {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        ...productionBase
      }
};
