'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClubContact extends Model {
    static associate(models) {
      ClubContact.belongsTo(models.Club, { foreignKey: 'club_id' });
    }
  }

  ClubContact.init({
    club_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      unique: true,
      references: {
        model: 'clubs',
        key: 'club_id'
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ClubContact',
    tableName: 'club_contacts',
    timestamps: false
  });

  // Hook to update `updated_at` timestamp before save
  ClubContact.addHook('beforeSave', (contact) => {
    contact.updated_at = new Date();
  });

  ClubContact.addHook('beforeUpdate', (contact) => {
    contact.updated_at = new Date();
  });

  return ClubContact;
};