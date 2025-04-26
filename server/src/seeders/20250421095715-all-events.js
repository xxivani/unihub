'use strict';

const { Json } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AllEvents', null, {});
   
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('AllEvents', null, {});
  }
};
