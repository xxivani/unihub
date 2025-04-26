// Migration file
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('BTEvents', 'club_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'clubs',
        key: 'club_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BTEvents', 'club_id');
  }
};