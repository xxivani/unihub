const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://team77:team77@localhost:5433/UniHub')

db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })