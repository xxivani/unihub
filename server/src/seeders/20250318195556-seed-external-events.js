'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('external_events', [
      {
        external_event_name: "Student Rep Social",
        external_event_date: new Date('2025-02-20'),
        external_event_location: "Second floor quiet room",
        external_event_time: new Date('2025-02-20T15:30:00Z'), // Correct format with date and time
        external_event_description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better.",
        external_event_created_by: "Bob White",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 10, // Price in AED
        external_event_max_number_of_attendees: 150,
		external_event_category: "SOCIAL_GATHERING",
        external_event_organizer: "Bob White",
        external_event_corganizer: "David Pinkman",
        external_event_manager: "Jake Schrader",
        external_event_speaker: "Kanye Goodman",
      },
      {
        external_event_name: "UoBDMUN'25 Conference",
        external_event_date: new Date('2025-02-25'),
        external_event_location: "Main auditorium",
        external_event_time: new Date('2025-02-25T12:00:00Z'), // Correct format with date and time
        external_event_description: "A dynamic conference where delegates engage in impactful debates, tackle global issues, and refine their diplomacy skills.",
        external_event_created_by: "John Smith",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 15, // Price in AED
        external_event_max_number_of_attendees: 200,
		external_event_category: "WORKSHOP",
        external_event_organizer: "John Smith",
        external_event_corganizer: "Emily Davis",
        external_event_manager: "Michael Johnson",
        external_event_speaker: "Sarah Williams",
      },
      {
        external_event_name: "Intra-Uni Dance Competition",
        external_event_date: new Date('2025-03-01'),
        external_event_location: "Second floor quiet room",
        external_event_time: new Date('2025-03-01T17:00:00Z'), // Correct format with date and time
        external_event_description: "Show off your moves, compete with the best, and set the stage on fire! Open to all university students.",
        external_event_created_by: "Lisa Johnson",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 5, // Price in AED
        external_event_max_number_of_attendees: 100,
		external_event_category: "SPORTS",
        external_event_organizer: "Lisa Johnson",
        external_event_corganizer: "Mark Brown",
        external_event_manager: "Sophie Taylor",
        external_event_speaker: null,
      },
      {
        external_event_name: "Matcha Morning",
        external_event_date: new Date('2025-03-05'),
        external_event_location: "First floor meeting room",
        external_event_time: new Date('2025-03-05T09:00:00Z'), // Correct format with date and time
        external_event_description: "Have a cup of matcha and join together for a discussion of your new year plan and meet new friends.",
        external_event_created_by: "James Wilson",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 10, // Price in AED
        external_event_max_number_of_attendees: 50,
		external_event_category: "SOCIAL_GATHERING",
        external_event_organizer: "James Wilson",
        external_event_corganizer: null,
        external_event_manager: "Emma Roberts",
        external_event_speaker: null,
      },
      {
        external_event_name: "Plant and Animal Social",
        external_event_date: new Date('2025-03-10'),
        external_event_location: "Room 120B",
        external_event_time: new Date('2025-03-10T14:00:00Z'), // Correct format with date and time
        external_event_description: "Come join us at the PAWS social to unwind with some games, connect with fellow students, and learn more about our society!",
        external_event_created_by: "Bob White",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 8, // Price in AED
        external_event_max_number_of_attendees: 75,
		external_event_category: "SOCIAL_GATHERING",
        external_event_organizer: "Bob White",
        external_event_corganizer: "David Pinkman",
        external_event_manager: "Jake Schrader",
        external_event_speaker: "Kanye Goodman",
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('external_events', null, {});
  }
};
