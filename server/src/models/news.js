'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
    }
  }
  News.init({
    news_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    news_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    news_content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    news_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    news_thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    news_author: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    // Add this field for the newsletter PDF
    news_pdf_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'News',
    tableName: 'news',
    timestamps: false // Disabling Sequelize's default timestamps
  });
  return News;
};