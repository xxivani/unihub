'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoleOpeningRegistration extends Model {
    static associate(models) {
      RoleOpeningRegistration.belongsTo(models.RoleOpening, {
        foreignKey: 'role_opening_id',
        onDelete: 'CASCADE'
      });
      // RoleOpeningRegistration.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  RoleOpeningRegistration.init({
    role_opening_registration_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    role_opening_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'role_openings',
        key: 'role_opening_id'
      }
    },
    // user_id: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   references: {
    //     model: 'users',
    //     key: 'user_id'
    //   }
    // },
    role_opening_registration_application_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    applicant_suitability: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    applicant_cv_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RoleOpeningRegistration',
    tableName: 'role_opening_registrations',
    timestamps: false
  });

  return RoleOpeningRegistration;
};