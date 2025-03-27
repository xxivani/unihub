'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Expense extends Model {
    static associate(models) {
      // An expense belongs to a category
      Expense.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
      
      // An expense can belong to an event (optional)
      Expense.belongsTo(models.BTevent, {
        foreignKey: 'eventId',
        as: 'event'
      });
    }
  }
  
  Expense.init({
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01,
        notNull: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
        notNull: true
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Events',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Expense',
    // underscored: true,
  });
  
  return Expense;
};