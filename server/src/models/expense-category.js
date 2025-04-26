'use strict'

const {Model} = require ('sequelize'); // this model requires sequelize

module.exports = (sequelize, DataTypes) => { 
    //This creates a module that exports a function. 
    // Sequelize will call this function with the sequelize instance and DataTypes object.
    class Category extends Model{
        static associate(models) { //mention the association
            Category.hasMany(models.Expense, { // hasMany means one-to-many relationship. Category can have 
                foreignKey: 'categoryId', //Creates a foreign key relationship to another table.
                as: 'expenses' //The as option lets you name the relationship when you're accessing it (like category.expenses).
            });
        }
    }

    Category.init ({
        name: {
            type: DataTypes.STRING,
            allowNull: false, //Determines if NULL values are permitted. false means the field is required.
            validate: {
                notEmpty: true
            }
            //Built-in Sequelize validators ensure data meets specific criteria:
            // notEmpty: Field can't be an empty string
            // isDecimal: Must be a valid decimal number
            // min: Must be at least this value
            // isDate: Must be a valid date
            // isIn: Value must be in the provided array
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '#bdd6a8', //Sets a default value when no value is provided.
            validate: {
                notEmpty: true
            }
        }

    }, {
        sequelize,
        modelName: 'Category',
        tableName: "Categories"
        //sequelize: The Sequelize instance
        // modelName: Defines the model name in Sequelize (table name will be plural by default)
    });

    return Category;
};
