'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role_openings', [
      {
        // role_opening_id: 1,
        club_id: 1,
        role_opening_created_at: new Date(),
        position: "Operations Head",
        description: "Handles operations for the club.",
        eligibility_criteria: "Minimum 5 years of experience in a leadership role.",
        due_date: new Date('2025-05-15'),
        number_of_registrations: 0,
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
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        // role_opening_id: 4,
        club_id: 1,
        role_opening_created_at: new Date(),
        position: "Treasurer",
        description: "Manages finances and budgets.",
        eligibility_criteria: "Should be an economics student.",
        due_date: new Date('2025-03-29'),
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        // role_opening_id: 1,
        club_id: 2,
        role_opening_created_at: new Date(),
        position: "President",
        description: "Leads the organization and represents it at official functions.",
        eligibility_criteria: "Minimum 5 years of experience in a leadership role.",
        due_date: new Date('2025-06-17'),
        number_of_registrations: 0,
        status: "ONGOING"
      },
      {
        // role_opening_id: 2,
        club_id: 2,
        role_opening_created_at: new Date(),
        position: "Vice President",
        description: "Assists the President and oversees specific projects.",
        eligibility_criteria: "Minimum 3 years of experience in management.",
        due_date: new Date('2025-02-15'),
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        // role_opening_id: 3,
        club_id: 2,
        role_opening_created_at: new Date(),
        position: "Secretary",
        description: "Manages documentation and handles communication tasks.",
        eligibility_criteria: "Proficiency in organization and communication skills.",
        due_date: new Date('2025-02-15'),
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        club_id: 3,
        role_opening_created_at: new Date(),
        position: "Treasurer",
        description: "Handles all financial records and budgeting.",
        eligibility_criteria: "Experience in financial planning or accounting.",
        due_date: new Date('2025-04-10'),
        number_of_registrations: 0,
        status: "ONGOING"
      },
      {
        club_id: 3,
        role_opening_created_at: new Date(),
        position: "Operations Head",
        description: "Manages club's communication and outreach.",
        eligibility_criteria: "Strong writing and public speaking skills.",
        due_date: new Date('2025-03-01'),
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        club_id: 4,
        role_opening_created_at: new Date(),
        position: "Vice President",
        description: "Leads the creative team and oversees visual design.",
        eligibility_criteria: "Portfolio of creative works required.",
        due_date: new Date('2025-05-01'),
        number_of_registrations: 0,
        status: "ONGOING"
      },
      {
        club_id: 4,
        role_opening_created_at: new Date(),
        position: "President",
        description: "Leads the organization and represents it at official functions.",
        eligibility_criteria: "Good organizational skills and experience in event management.",
        due_date: new Date('2024-09-20'),
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        club_id: 4,
        role_opening_created_at: new Date(),
        position: "Social Media Manager",
        description: "Handles all social media accounts and content creation.",
        eligibility_criteria: "Familiarity with social platforms and content tools.",
        due_date: new Date('2025-10-02'),
        number_of_registrations: 0,
        status: "COMPLETED"
      },
      {
        club_id: 5,
        role_opening_created_at: new Date(),
        position: "Social Media Manager",
        description: "Handles all social media accounts and content creation.",
        eligibility_criteria: "Familiarity with social platforms and content tools.",
        due_date: new Date('2025-04-15'),
        number_of_registrations: 0,
        status: "ONGOING"
      },
      {
        club_id: 5,
        role_opening_created_at: new Date(),
        position: "Events Officer",
        description: "Plans and executes club events smoothly.",
        eligibility_criteria: "Past experience in event organization preferred.",
        due_date: new Date('2025-03-10'),
        number_of_registrations: 0,
        status: "COMPLETED"
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role_openings', null, {});
  }
};
