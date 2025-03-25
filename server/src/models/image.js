'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class image extends Model {
        static associate(models) {
    }
  }


  image.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    URL: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    eventType: {
        type: DataTypes.ENUM('External', 'Internal'),
        allowNull: false
    },
    
    eventName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    
    thumbnail: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    position:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    brightness:{
        type: DataTypes.FLOAT,
        allowNull: true
    },

    saturation:{
        type: DataTypes.FLOAT,
        allowNull: true
    },

    blur:{
        type: DataTypes.FLOAT,
        allowNull: true
    },

    inversion:{
        type: DataTypes.FLOAT,
        allowNull: true
    },


  }, {
    sequelize,
    modelName: 'image',
    tableName: 'image',
    timestamps: false,
  });
  return image;
};