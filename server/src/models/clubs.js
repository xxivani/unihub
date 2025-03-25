'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Club extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Club.init({
    club_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    club_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    club_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    club_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    club_thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    club_category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Club',
    tableName: 'clubs',
    timestamps: true
  });

  return Club;
};
