'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommitteeMemberPermission extends Model {
    static associate(models) {
        CommitteeMemberPermission.belongsTo(models.CommitteeMember, {
            foreignKey: 'committee_member_id',
            targetKey: 'committee_member_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          });          
    }
  }

  CommitteeMemberPermission.init({
    committee_member_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    permission: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      validate: {
        isIn: [[
          'CreateEvent',
          'ListRoleOpening',
          'UpdateLink',
          'AssignPosition',
          'UpdateBudget'
        ]]
      }
    }
  }, {
    sequelize,
    modelName: 'CommitteeMemberPermission',
    tableName: 'committee_member_permissions',
    timestamps: false
  });

  return CommitteeMemberPermission;
};