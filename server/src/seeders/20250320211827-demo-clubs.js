'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('clubs', [
      {
        club_name: 'WiSTEM Society',
        club_description: 'A club for women in STEM',
        club_created_at: new Date(),
        club_thumbnail_url: 'https://picsum.photos/200/150?random=1',
        club_category: 'STEM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        club_name: 'PAWS',
        club_description: "Animal lover's club",
        club_created_at: new Date(),
        club_thumbnail_url: 'https://picsum.photos/200/150?random=2',
        club_category: 'Social',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        club_name: 'ACM',
        club_description: 'Association for Computing Machinery',
        club_created_at: new Date(),
        club_thumbnail_url: 'https://picsum.photos/200/150?random=3',
        club_category: 'Tech',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        club_name: 'Robotics Club',
        club_description: 'Build robots!',
        club_created_at: new Date(),
        club_thumbnail_url: 'https://picsum.photos/200/150?random=4',
        club_category: 'Engineering',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        club_name: 'Music Club',
        club_description: 'For music lovers',
        club_created_at: new Date(),
        club_thumbnail_url: 'https://picsum.photos/200/150?random=5',
        club_category: 'Arts',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clubs', null, {});
  }
};
