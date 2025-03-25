'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('committee_members', [
      {
        // committee_member_id: 1,
        user_id: 3,
        committee_member_name: 'Ariana Patel',
        committee_member_email: 'committee@example.com',
        committee_member_description: 'I am an psychology student and love to dance.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'PRESIDENT',
        club_id: 1
      },
      {
        // committee_member_id: 2,
        user_id: 4,
        committee_member_name: 'David Chen',
        committee_member_email: 'committee1@example.com',
        committee_member_description: 'Hey! I love to create apps and games and am obviously a CS student ;).',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'VICE_PRESIDENT',
        club_id: 1
      },
      {
        // committee_member_id: 3,
        user_id: 5,
        committee_member_name: 'Leila Hassan',
        committee_member_email: 'committee2@example.com',
        committee_member_description: 'I am an economics student and love to handle the budget for my club!',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'TREASURER',
        club_id: 1
      }
    ], {});
  },  

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('committee_members', null, {});
  }
};
