'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('committee_members', {
      committee_member_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      committee_member_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      committee_member_email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      committee_member_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      committee_member_assigned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      committee_member_position: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      club_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        // references: {
        //   model: 'clubs',
        //   key: 'club_id'
        // },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('committee_members');
  }
};
