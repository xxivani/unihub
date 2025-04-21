require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || 'team77',
    password: process.env.POSTGRES_PASSWORD || 'team77',
    database: process.env.POSTGRES_DB || 'UniHub',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      useUTC: false,
      prependSearchPath: true
    },
    define: {
      freezeTableName: true,
      underscored: true
    },
    logging: console.log
  },
  test: {
    username: process.env.POSTGRES_USER || 'team77',
    password: process.env.POSTGRES_PASSWORD || 'team77',
    database: process.env.POSTGRES_DB || 'UniHub',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5433,
    dialect: "postgres",
    dialectOptions: {
      useUTC: false,
      prependSearchPath: true
    },
    define: {
      freezeTableName: true,
      underscored: true
    },
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      useUTC: false,
      prependSearchPath: true
    },
    define: {
      freezeTableName: true,
      underscored: true
    },
  }
};