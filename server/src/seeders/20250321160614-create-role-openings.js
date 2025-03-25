'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role_openings', [
      {
        // role_opening_id: 1,
        club_id: 1,
        role_opening_created_at: new Date(),
        position: "President",
        description: "Leads the organization and represents it at official functions.",
        eligibility_criteria: "Minimum 5 years of experience in a leadership role.",
        due_date: new Date('2025-02-15'),
        number_of_registrations: 20,
        status: "ONGOING"
      },
      {
        // role_opening_id: 2,
        club_id: 1,
        role_opening_created_at: new Date(),
        position: "Vice President",
        description: "Assists the President and oversees specific projects.",
        eligibility_criteria: "Minimum 3 years of experience in management.",
        due_date: new Date('2025-02-15'),
        number_of_registrations: 30,
        status: "ONGOING"
      },
      {
        // role_opening_id: 3,
        club_id: 1,
        role_opening_created_at: new Date(),
        position: "Secretary",
        description: "Manages documentation and handles communication tasks.",
        eligibility_criteria: "Proficiency in organization and communication skills.",
        due_date: new Date('2025-02-15'),
        number_of_registrations: 27,
        status: "COMPLETED"
      },
      {
        // role_opening_id: 4,
        club_id: 1,
        role_opening_created_at: new Date(),
        position: "Treasurer",
        description: "Manages finances and budgets.",
        eligibility_criteria: "Should be an economics student.",
        due_date: new Date('2025-03-31'),
        number_of_registrations: 27,
        status: "ONGOING"
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role_openings', null, {});
  }
};
