'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_opening_registrations', {
      role_opening_registration_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      role_opening_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'role_openings',
          key: 'role_opening_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // user_id: {
      //   type: Sequelize.BIGINT,
      //   allowNull: false,
      //   references: {
      //     model: 'Users', // Reference to users table
      //     key: 'id'
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE'
      // },
      role_opening_registration_application_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      user_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      user_phone: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      user_email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      applicant_suitability: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      applicant_cv_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role_opening_registrations');
  }
};