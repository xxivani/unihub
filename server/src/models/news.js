'use strict';
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
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
    news_pdf_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'news',
    schema: 'public',
    timestamps: false,
    freezeTableName: true,
    underscored: true
  });
  return News;
};