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
      { committee_member_id: 3, permission: 'UpdateBudget' },

      { committee_member_id: 4, permission: 'CreateEvent' },
      { committee_member_id: 4, permission: 'ListRoleOpening' },
      { committee_member_id: 4, permission: 'UpdateLink' },
      { committee_member_id: 4, permission: 'AssignPosition' },
      { committee_member_id: 4, permission: 'UpdateBudget' },

      { committee_member_id: 5, permission: 'CreateEvent' },
      { committee_member_id: 5, permission: 'UpdateLink' },
      { committee_member_id: 5, permission: 'UpdateBudget' },

      { committee_member_id: 6, permission: 'CreateEvent' },
      { committee_member_id: 6, permission: 'UpdateLink' },

      { committee_member_id: 7, permission: 'CreateEvent' },
      { committee_member_id: 7, permission: 'ListRoleOpening' },
      { committee_member_id: 7, permission: 'UpdateLink' },
      { committee_member_id: 7, permission: 'AssignPosition' },
      { committee_member_id: 7, permission: 'UpdateBudget' },

      { committee_member_id: 8, permission: 'CreateEvent' },
      { committee_member_id: 8, permission: 'UpdateLink' },
      { committee_member_id: 8, permission: 'UpdateBudget' },

      { committee_member_id: 9, permission: 'CreateEvent' },

      { committee_member_id: 10, permission: 'CreateEvent' },
      { committee_member_id: 10, permission: 'ListRoleOpening' },
      { committee_member_id: 10, permission: 'UpdateLink' },
      { committee_member_id: 10, permission: 'AssignPosition' },
      { committee_member_id: 10, permission: 'UpdateBudget' },

      { committee_member_id: 11, permission: 'CreateEvent' },
      { committee_member_id: 11, permission: 'UpdateLink' },
      { committee_member_id: 11, permission: 'UpdateBudget' },

      { committee_member_id: 12, permission: 'UpdateLink' },

      { committee_member_id: 13, permission: 'CreateEvent' },
      { committee_member_id: 13, permission: 'ListRoleOpening' },
      { committee_member_id: 13, permission: 'UpdateLink' },
      { committee_member_id: 13, permission: 'AssignPosition' },
      { committee_member_id: 13, permission: 'UpdateBudget' },

      { committee_member_id: 14, permission: 'CreateEvent' },
      { committee_member_id: 14, permission: 'UpdateLink' },
      { committee_member_id: 14, permission: 'UpdateBudget' },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('committee_member_permissions', null, {});
  }
};
