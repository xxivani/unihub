'use strict'

const {Model} = require ('sequelize');

module.exports = (sequelize, DataTypes) => { 
    class Category extends Model{
        static associate(models) { 
            Category.hasMany(models.Expense, { 
                foreignKey: 'categoryId', 
                as: 'expenses'
            });
        }
    }

    Category.init ({
        name: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '#bdd6a8', 
            validate: {
                notEmpty: true
            }
        }

    }, {
        sequelize,
        modelName: 'Category',
        tableName: "Categories"
    });

    return Category;
};
