'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('external_events', {
      external_event_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      external_event_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      external_event_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      external_event_location: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      external_event_time: {
        type: Sequelize.DATE,  // Keep as TIMESTAMP equivalent
        allowNull: false
      },
      external_event_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      external_event_created_by: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      external_event_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      external_event_ticket_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      external_event_max_number_of_attendees: {
        type: Sequelize.INTEGER,
        allowNull: true, // Adjust if needed
        validate: {
          min: 1
        }
      },
      external_event_organizer: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      external_event_corganizer: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      external_event_manager: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      external_event_speaker: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('external_events');
  }
};
