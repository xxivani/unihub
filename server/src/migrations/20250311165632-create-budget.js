'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn('Events', 'totalBudget', {
    //   type: Sequelize.DECIMAL(10, 2),
    //   allowNull: true,
    //   defaultValue: 0.00
    // });
    
    // You could add other budget-related fields as needed
    await queryInterface.addColumn('Events', 'budgetStatus', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: true,
      defaultValue: 'PENDING'
    });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('Events', 'totalBudget');
    await queryInterface.removeColumn('Events', 'budgetStatus');
  }
};