'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      //new
      Event.hasOne(models.BTevent, {
        foreignKey: 'general_event_id',
        as: 'budgetEvent'
      });
    }
  }

  Event.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    club: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deadline: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    waiting: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    budget_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    budget: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    team: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    follower: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Event'
  });
  return Event;
};
