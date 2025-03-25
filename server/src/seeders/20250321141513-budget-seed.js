'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Budgets', [
      {
        totalAmount: 2000.00,
        fiscalYear: '2024-2025',
        description: 'Annual club budget allocation',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Budgets', null, {});
  }
};