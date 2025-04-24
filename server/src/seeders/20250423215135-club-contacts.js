'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('club_contacts', [
      {
        club_id: 1,
        phone: '+971 989898989',
        email: 'wistem@gmail.com',
        instagram: 'wistem_society123',
        whatsapp: 'chat.whatsapp.com/wistem-society',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        club_id: 3,
        phone: '+971 55116661666',
        email: 'acm@gmail.com',
        instagram: 'acm_123',
        whatsapp: 'chat.whatsapp.com/acm-club',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        club_id: 5,
        phone: '+971 999999955',
        email: 'musicclub@gmail.com',
        instagram: 'music_club_uobd',
        whatsapp: 'chat.whatsapp.com/music-club',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        club_id: 2,
        phone: '+971 995566779',
        email: 'bhampaws@gmail.com',
        instagram: 'pawsociety',
        whatsapp: 'chat.whatsapp.com/paws',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        club_id: 4,
        phone: '+971 563998123',
        email: 'robotics.club@gmail.com',
        instagram: 'robotics.club',
        whatsapp: 'chat.whatsapp.com/robotics-club',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('club_contacts', {
      club_id: { [Sequelize.Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};