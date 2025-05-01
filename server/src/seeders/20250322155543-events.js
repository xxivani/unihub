'use strict';

const { Json } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Event', null, {});
    return queryInterface.bulkInsert('Event', [
      {
        title: "Student Rep Social",
        image: JSON.stringify({"thumbnail": "/assets/images/social.jpeg", "prev": "/assets/images/picnic.webp"}),
        description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better.",
        location: "Second floor quiet room",
        time: "15:30 - 17:00",
        club: "Music Club",
        date: "2025-07-22",
        deadline: "2025-07-20T12:00:00.000Z", 
        capacity: 150,
        followed: 138,
        waiting: 0,
        price: 10,
        team: JSON.stringify([
          { role: "Organizer", name: "Bob White" },
          { role: "Co-Organizer", name: "David Pinkman" },
          { role: "Manager", name: "Jake Schrader" },
          { role: "Speaker", name: "Kanye Goodman" }
        ]),
        follower: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "UoBDMUN'25 Conference",
        image: JSON.stringify({"thumbnail": "/assets/images/mun.jpg", "prev": "/assets/images/picnic.webp"}),
        description: "A dynamic conference where delegates engage in impactful debates, tackle global issues, and refine their diplomacy skills.",
        location: "Main auditorium",
        time: "12:00 - 14:00",
        club: "Robotics Club",
        date: "2025-08-12",
        deadline: "2025-08-10T12:00:00.000Z", 
        capacity: 200,
        followed: 12,
        waiting: 0,
        price: 15,
        team: JSON.stringify([
          { role: "Organizer", name: "John Smith" },
          { role: "Co-Organizer", name: "Emily Davis" },
          { role: "Manager", name: "Michael Johnson" },
          { role: "Speaker", name: "Sarah Williams" }
        ]),
        follower: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Intra-Uni Dance Competition",
        image: JSON.stringify({"thumbnail": "/assets/images/dance.jpeg", "prev": "/assets/images/picnic.webp"}),
        description: "Show off your moves, compete with the best, and set the stage on fire! Open to all university students.",
        location: "Second floor quiet room",
        time: "17:00 - 18:00",
        club: "Music Club",
        date: "2025-07-02",
        deadline: "2025-07-01T12:00:00.000Z", 
        capacity: 100,
        followed: 5,
        waiting: 0,
        price: 5,
        team: JSON.stringify([
          { role: "Organizer", name: "Lisa Johnson" },
          { role: "Co-Organizer", name: "Mark Brown" },
          { role: "Manager", name: "Sophie Taylor" }
        ]),
        follower: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Matcha Morning",
        image: JSON.stringify({"thumbnail": "/assets/images/matcha.webp", "prev": "/assets/images/picnic.webp"}),
        description: "Have a cup of matcha and join together for a discussion of your new year plan and meet new friends.",
        location: "First floor meeting room",
        time: "9:00 - 10:00",
        club: "PAWS",
        date: "2025-08-18",
        deadline: "2025-08-16T12:00:00.000Z", 
        capacity: 50,
        followed: 2,
        waiting: 0,
        price: 10,
        team: JSON.stringify([
          { role: "Organizer", name: "James Wilson" },
          { role: "Manager", name: "Emma Roberts" }
        ]),
        follower: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Plant and Animal Social",
        image: JSON.stringify({"thumbnail": "/assets/images/paws.jpeg", "prev": "/assets/images/picnic.webp"}),
        description: "Come join us at the PAWS social to unwind with some games, connect with fellow students, and learn more about our society!",
        location: "Room 120B",
        time: "14:00 - 15:30",
        club: "PAWS",
        date: "2025-08-02",
        deadline: "2025-08-01T12:00:00.000Z", 
        capacity: 75,
        followed: 75,
        waiting: 2147483647,
        price: 8,
        team: JSON.stringify([
          { role: "Organizer", name: "Bob White" },
          { role: "Co-Organizer", name: "David Pinkman" },
          { role: "Manager", name: "Jake Schrader" },
          { role: "Speaker", name: "Kanye Goodman" }
        ]),
        follower: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "ACM Welcome Event",
        image: JSON.stringify({"thumbnail": "/assets/images/president.jpg", "prev": "/assets/images/picnic.webp"}),
        description: "Come join us for computing machinery with some games, connect with fellow members, and learn more about our society!",
        location: "Room 2208",
        time: "16:00 - 17:30",
        club: "ACM",
        date: "2025-08-22",
        deadline: "2025-08-20T12:00:00.000Z", 
        capacity: 40,
        followed: 22,
        waiting: 0,
        price: 0,
        team: JSON.stringify([
          { role: "Organizer", name: "Bob White" },
          { role: "Co-Organizer", name: "David Pinkman" },
          { role: "Speaker", name: "Kanye Goodman" }
        ]),
        follower: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Event', null, {});
  }
};
