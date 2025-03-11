'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedStudentPassword = await bcrypt.hash('studentpassword', 10);
    const hashedCommitteePassword = await bcrypt.hash('committeepassword', 10);
    const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);

    return queryInterface.bulkInsert('Users', [  
      {
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'student@example.com',
        password: hashedStudentPassword,
        role: 'student',
        studentName: 'John Doe',
        yearOfStudy: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'committee@example.com',
        password: hashedCommitteePassword,
        role: 'committee',
        committeeName: 'Jane Smith',
        club: 'Chess Club',
        committeeRole: 'VP',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});  // Also change here
  }
};
