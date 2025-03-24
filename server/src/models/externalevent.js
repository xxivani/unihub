'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExternalEvent extends Model {
    static associate(models) {
    }
  }

  ExternalEvent.init(
    {
      external_event_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      external_event_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      external_event_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      external_event_location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      external_event_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      external_event_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      external_event_created_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      external_event_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      external_event_ticket_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      external_event_max_number_of_attendees: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
        },
      },
      external_event_organizer: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      external_event_corganizer: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      external_event_manager: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      external_event_speaker: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ExternalEvent',
      tableName: 'external_events', // Ensuring correct table mapping
      timestamps: false, // Set to true if you want `createdAt` and `updatedAt` fields
    }
  );

  return ExternalEvent;
};
