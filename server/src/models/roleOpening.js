'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleOpening extends Model {
    static associate(models) {
      // Example: if you want to associate RoleOpening with the Club model
      RoleOpening.belongsTo(models.Club, { foreignKey: 'club_id' });
    }
  }
  RoleOpening.init({
    role_opening_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    club_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'clubs',
        key: 'club_id'
      }
    },
    role_opening_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    eligibility_criteria: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    number_of_registrations: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['ONGOING', 'COMPLETED']]
      }
    //   type: DataTypes.ENUM('ONGOING', 'COMPLETED'),
    }
  }, {
    sequelize,
    modelName: 'RoleOpening',
    tableName: 'role_openings',
    timestamps: false
  });

  RoleOpening.addHook('beforeSave', (roleOpening) => {
    const currentDate = new Date();
    roleOpening.status = currentDate < roleOpening.due_date ? 'ONGOING' : 'COMPLETED';
  });

  RoleOpening.addHook('beforeUpdate', (roleOpening) => {
    const currentDate = new Date();
    roleOpening.status = currentDate < roleOpening.due_date ? 'ONGOING' : 'COMPLETED';
  });

  return RoleOpening;
};
