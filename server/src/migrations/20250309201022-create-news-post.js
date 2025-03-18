'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('news', {
      news_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      news_title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      news_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      news_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      news_thumbnail_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      news_author: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      news_pdf_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('news');
  }
};