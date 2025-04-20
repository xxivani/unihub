'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM ('student', 'committee', 'admin');
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" TYPE "enum_Users_role" 
      USING role::"enum_Users_role";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'student';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" TYPE TEXT USING role::TEXT;
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Users_role";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'student';
    `);
  }
};
