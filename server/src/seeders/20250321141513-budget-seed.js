'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Budgets', [
      {
        totalAmount: 2000.00,
        fiscalYear: '2024-2025',
        description: 'Annual club budget allocation',
        club_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        totalAmount: 2200.00,
        fiscalYear: '2024-2025',
        description: 'Annual club budget allocation',
        club_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        totalAmount: 2050.00,
        fiscalYear: '2024-2025',
        description: 'Annual club budget allocation',
        club_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        totalAmount: 3000.00,
        fiscalYear: '2024-2025',
        description: 'Annual club budget allocation',
        club_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        totalAmount: 2400.00,
        fiscalYear: '2024-2025',
        description: 'Annual club budget allocation',
        club_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Budgets', null, {});
  }
};