'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Event"
      ALTER COLUMN "deadline"
      TYPE TIMESTAMPTZ
      USING (NULLIF("deadline", 'Invalid date')::TIMESTAMPTZ)
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
