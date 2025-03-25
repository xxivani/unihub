'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Skip seeding events - starting with no initial event data
    console.log('Skipping event seeding as requested');
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', null, {});
  }
};