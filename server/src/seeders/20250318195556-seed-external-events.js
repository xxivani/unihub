'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('external_events', [
      {
        external_event_name: 'Tech Conference 2025',
        external_event_date: new Date('2025-06-10'),
        external_event_location: 'Abu Dhabi, UAE',
        external_event_time: new Date('2025-06-10T09:00:00Z'),
        external_event_description: 'A conference about future technology trends.',
        external_event_created_by: 'admin',
        external_event_created_at: new Date(),
        external_event_ticket_amount: 100,
        external_event_max_number_of_attendees: 500,
        external_event_organizer: 'Tech Corp',
        external_event_corganizer: 'Innovate Hub',
        external_event_manager: 'John Doe',
        external_event_speaker: 'Jane Smith',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('external_events', null, {});
  }
};
