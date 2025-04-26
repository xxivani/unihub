'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Event can belong to a club
      Event.belongsTo(models.Club, {
        foreignKey: 'club_id',
        as: 'club'
      });
      
      // Event can have many expenses
      Event.hasMany(models.Expense, {
        foreignKey: 'eventId',
        as: 'expenses'
      });
    }
  }

  Event.init({
    // Basic event information
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Event logistics
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    // Attendance information
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    followed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    waiting: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    
    // Club information
    club_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'clubs',
        key: 'club_id'
      }
    },
    
    // Budget-tracking fields
    status: {
      type: DataTypes.ENUM('ONGOING', 'COMPLETED'),
      allowNull: true,
    },
    budget_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    
    // Additional event details
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    
    // Media & display
    image: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    
    // Event team
    team: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Events',
    tableName: 'AllEvents',
    timestamps: true
  });
  
  return Event;
};