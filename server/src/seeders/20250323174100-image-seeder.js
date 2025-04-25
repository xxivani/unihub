'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('image', [
      {
        URL: '/assets/images/picnic.webp',
        eventType: 'Internal',
        eventName: 'Picnic',
        position: 1,
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0
      },
      {
        URL: '/assets/images/paws.jpeg',
        eventType: 'Internal',
        eventName: 'Picnic',
        position: 3,
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0
      },
      {
        URL: '/assets/images/social.jpeg',
        eventType: 'External',
        eventName: 'Zoo',
        position: 2,
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0
      },
      {
        URL: '/assets/images/panda.jpg',
        eventType: 'External',
        eventName: 'Zoo',
        position: 1,
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0
      },
      {
        URL: '/assets/images/social.jpeg',
        eventType: 'Internal',
        eventName: 'Social gathering',
        position: 1,
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0
      },
      {
        URL: '/assets/images/social.jpeg',
        eventType: 'Internal',
        eventName: 'Social gathering',
        position: 4,
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('image', null, {});
  }
};
