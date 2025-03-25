'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommitteeMember extends Model {
    static associate(models) {
    //   CommitteeMember.belongsTo(models.Club, { foreignKey: 'club_id' });
    CommitteeMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    CommitteeMember.hasMany(models.CommitteeMemberPermission, {
        foreignKey: 'committee_member_id',
        as: 'permissions', // alias for clarity
        onDelete: 'CASCADE'
    });
    }
  }

  CommitteeMember.init({
    committee_member_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    committee_member_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },      
    committee_member_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    committee_member_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    committee_member_assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    committee_member_position: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [[
          'PRESIDENT',
          'VICE_PRESIDENT',
          'TREASURER',
          'STUDENT_ENGAGEMENT_OFFICER',
          'SOCIAL_MEDIA_MANAGER',
          'OPERATIONS_HEAD',
          'EVENTS_OFFICER'
        ]]
      }
    },
    club_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CommitteeMember',
    tableName: 'committee_members',
    timestamps: false
  });

  return CommitteeMember;
};