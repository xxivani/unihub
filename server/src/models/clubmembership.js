'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClubMembership extends Model {
    static associate(models) {
      ClubMembership.belongsTo(models.User, { foreignKey: 'userId' });
      ClubMembership.belongsTo(models.Club, { foreignKey: 'clubId' });
    }
  }

  ClubMembership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clubId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'ClubMembership',
    tableName: 'ClubMemberships', 
  });

  return ClubMembership;
};
