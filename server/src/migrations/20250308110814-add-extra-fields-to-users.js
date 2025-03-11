'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'studentName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'yearOfStudy', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'committeeName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'club', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'committeeRole', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'studentName');
    await queryInterface.removeColumn('Users', 'yearOfStudy');
    await queryInterface.removeColumn('Users', 'committeeName');
    await queryInterface.removeColumn('Users', 'club');
    await queryInterface.removeColumn('Users', 'committeeRole');
  }
};
