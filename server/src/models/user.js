'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }

    validPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'committee', 'admin'),
      allowNull: false,
      defaultValue: 'student',
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'studentname' 
    },
    yearOfStudy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'year_of_study'
    },
    committeeName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'committee_name'
    },
    club: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    committeeRole: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'committee_role'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true, 
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};