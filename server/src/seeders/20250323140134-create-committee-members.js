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
      },
      {
        user_id: 6,
        committee_member_name: 'Sameer Roy',
        committee_member_email: 'committee3@example.com',
        committee_member_description: 'Electronics hobbyist and robotics lead.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'PRESIDENT',
        club_id: 2
      },
      {
        user_id: 7,
        committee_member_name: 'Emily Nguyen',
        committee_member_email: 'committee4@example.com',
        committee_member_description: 'Art lover and design lead of the club.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'VICE_PRESIDENT',
        club_id: 2
      },
      {
        user_id: 8,
        committee_member_name: 'Carlos Mendez',
        committee_member_email: 'committee5@example.com',
        committee_member_description: 'Handles all our event logistics!',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'OPERATIONS_HEAD',
        club_id: 2
      },
      {
        user_id: 9,
        committee_member_name: 'Hina Sato',
        committee_member_email: 'committee6@example.com',
        committee_member_description: 'Music enthusiast and club vocalist.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'PRESIDENT',
        club_id: 3
      },
      {
        user_id: 10,
        committee_member_name: 'Marcus Lee',
        committee_member_email: 'committee7@example.com',
        committee_member_description: 'Handles sponsorships and outreach.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'VICE_PRESIDENT',
        club_id: 3
      },
      {
        user_id: 11,
        committee_member_name: 'Sara Ibrahim',
        committee_member_email: 'committee8@example.com',
        committee_member_description: 'Passionate about planning and execution.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'EVENTS_OFFICER',
        club_id: 3
      },
      {
        user_id: 12,
        committee_member_name: 'Zane Malik',
        committee_member_email: 'committee9@example.com',
        committee_member_description: 'Writes and directs all our club plays.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'PRESIDENT',
        club_id: 4
      },
      {
        user_id: 13,
        committee_member_name: 'Priya Sharma',
        committee_member_email: 'committee10@example.com',
        committee_member_description: 'Coordinates workshops and meets.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'VICE_PRESIDENT',
        club_id: 4
      },
      {
        user_id: 14,
        committee_member_name: 'Noah Walker',
        committee_member_email: 'committee11@example.com',
        committee_member_description: 'Keeps all the books balanced.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'SOCIAL_MEDIA_MANAGER',
        club_id: 4
      },
      {
        user_id: 15,
        committee_member_name: 'Fatima Zahra',
        committee_member_email: 'committee12@example.com',
        committee_member_description: 'Club’s spokesperson and organizer.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'PRESIDENT',
        club_id: 5
      },
      {
        user_id: 16,
        committee_member_name: 'Liam O’Connor',
        committee_member_email: 'committee13@example.com',
        committee_member_description: 'Media and publicity coordinator.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'VICE_PRESIDENT',
        club_id: 5
      },
      {
        user_id: 17,
        committee_member_name: 'Jade Liu',
        committee_member_email: 'committee14@example.com',
        committee_member_description: 'In charge of budgeting and fundraising.',
        committee_member_assigned_at: new Date(),
        committee_member_position: 'STUDENT_ENGAGEMENT_OFFICER',
        club_id: 5
      }
    ], {});
  },  

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('committee_members', null, {});
  }
};
