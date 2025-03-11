'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsPost extends Model {
    static associate(models) {
    }
  }
  NewsPost.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    thumbnailImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/assets/images/img.jpeg' 
    },
    newsletterPdf: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  }, {
    sequelize,
    modelName: 'NewsPost',
  });
  return NewsPost;
};
