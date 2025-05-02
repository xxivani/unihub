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
      BTevent.belongsTo(models.Club, {
        foreignKey: 'club_id',
        
      });
      BTevent.belongsTo(models.Event, {
        foreignKey: 'general_event_id',
        as: 'generalEvent'
      })
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
    },
    club_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'clubs',
        key: 'club_id'
      }
    },
    general_event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Event',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'BTevent',
    // tableName: "Events"
    tableName: "BTEvents",

    indexes: [
      {
        unique: true,
        fields: ['club_id', 'general_event_id']
      }
    ]
  });
  
  return BTevent;
};