'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Skip seeding expenses - starting with no initial expense data
    console.log('Skipping expense seeding as requested');
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Expenses', null, {});
  }
};