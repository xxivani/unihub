'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Event', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      image: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      club: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deadline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      followed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      waiting: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      budget_required: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      budget: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      team: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      follower: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Event');
  }
};
