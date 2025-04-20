'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE "Event"
      SET "deadline" = NULL
      WHERE "deadline" = 'Invalid date'
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Event"
      ALTER COLUMN "deadline"
      TYPE TIMESTAMPTZ
      USING "deadline"::TIMESTAMPTZ
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Event"
      ALTER COLUMN "deadline"
      TYPE VARCHAR(255)
    `);
  }
};
