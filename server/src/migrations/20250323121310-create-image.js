'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('image', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    URL: {
        type: Sequelize.STRING(255),
        allowNull: false
    },

    eventType: {
        type: Sequelize.ENUM('External', 'Internal'),
        allowNull: false
    },
    
    eventName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    
    thumbnail: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },

    position:{
        type: Sequelize.INTEGER,
        allowNull: false
    },

    brightness:{
        type: Sequelize.FLOAT,
        allowNull: true
    },

    saturation:{
        type: Sequelize.FLOAT,
        allowNull: true
    },

    blur:{
        type: Sequelize.FLOAT,
        allowNull: true
    },

    inversion:{
        type: Sequelize.FLOAT,
        allowNull: true
    },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('image');
  }
};