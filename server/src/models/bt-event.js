'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BTevent extends Model {
    static associate(models) {
      // An event can have many expenses
      BTevent.hasMany(models.Expense, {
        foreignKey: 'eventId',
        as: 'expenses'
      });
    }
  }
  
  BTevent.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    status: {
      type: DataTypes.ENUM('ONGOING', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'ONGOING',
      validate: {
        isIn: [['ONGOING', 'COMPLETED']]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BTevent',
    tableName: "Events"
  });
  
  return BTevent;
};