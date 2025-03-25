'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('image', [
      {
        URL: '/assets/images/picnic.webp',
        eventType: 'Internal',
        eventName: 'Picnic',
        thumbnail: true,
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
        thumbnail: false,
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
        thumbnail: false,
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
        thumbnail: true,
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
        thumbnail: true,
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
        thumbnail: false,
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
