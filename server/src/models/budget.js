'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      // A budget belongs to a fiscal period, if you want to track budgets by period
    }
  }
  
  Budget.init({
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
        notNull: true
      }
    },
    fiscalYear: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Budget',
  });
  
  return Budget;
};