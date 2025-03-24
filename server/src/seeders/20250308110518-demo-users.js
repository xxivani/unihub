'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedStudentPassword = await bcrypt.hash('5echApr0Truq8bUda2we', 10);
    const hashedCommitteePassword = await bcrypt.hash('fLW6tlTR3PrIzedrEyax', 10);
    const hashedAdminPassword = await bcrypt.hash('T2gltlchi3ey4spEXo68', 10);

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
      {
        email: 'committee1@example.com',
        password: hashedCommitteePassword,
        role: 'committee',
        committeeName: 'Ava Thompson',
        club: 'Chess Club',
        committeeRole: 'PRESIDENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'committee2@example.com',
        password: hashedCommitteePassword,
        role: 'committee',
        committeeName: 'Liam Patel',
        club: 'Chess Club',
        committeeRole: 'TREASURER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});  
  }
};
