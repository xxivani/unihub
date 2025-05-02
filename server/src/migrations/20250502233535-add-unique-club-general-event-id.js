module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('BTEvents', {
      fields: ['club_id', 'general_event_id'],
      type: 'unique',
      name: 'unique_club_general_event'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('BTEvents', 'unique_club_general_event');
  }
};