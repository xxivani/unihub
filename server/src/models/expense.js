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

      Expense.belongsTo(models.Club, {
        foreignKey: 'club_id',
      })
    }
  }
  
  Expense.init({
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
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
        model: 'BTEvents',
        key: 'id'
      }
    },
    club_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'clubs',
        key: 'club_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: "Expenses"
    // underscored: true,
  });
  
  return Expense;
};