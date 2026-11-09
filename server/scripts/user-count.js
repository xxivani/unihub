// Prints USER_COUNT=<n> so start.sh can decide whether the DB still needs seeding.
// On any error it prints USER_COUNT=error, which start.sh treats as "do not seed".
require('dotenv').config();
const db = require('../src/models');

db.User.count()
  .then((n) => {
    console.log('USER_COUNT=' + n);
    return db.sequelize.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message);
    console.log('USER_COUNT=error');
    process.exit(0);
  });
