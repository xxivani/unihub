'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('committee_member_permissions', [
      // PRESIDENT (all permissions)
      { committee_member_id: 1, permission: 'CreateEvent' },
      { committee_member_id: 1, permission: 'ListRoleOpening' },
      { committee_member_id: 1, permission: 'UpdateLink' },
      { committee_member_id: 1, permission: 'AssignPosition' },
      { committee_member_id: 1, permission: 'UpdateBudget' },

      // VICE_PRESIDENT
      { committee_member_id: 2, permission: 'CreateEvent' },
      { committee_member_id: 2, permission: 'UpdateLink' },
      { committee_member_id: 2, permission: 'UpdateBudget' },

      // TREASURER
      { committee_member_id: 3, permission: 'UpdateBudget' }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('committee_member_permissions', null, {});
  }
};
