const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('PostgreSQL Connected:', data.value);
  })
  .catch((error) => {
    console.log(' Database Connection Error:', error);
  });

module.exports = db;
