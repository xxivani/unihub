'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_openings', {
      role_opening_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      club_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'clubs',
          key: 'club_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role_opening_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      eligibility_criteria: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      number_of_registrations: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role_openings');
  }
};
