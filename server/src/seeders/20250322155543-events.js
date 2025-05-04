'use strict';

const { Json } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Event', null, {});
    return queryInterface.bulkInsert('Event', [
      {
        title: "Introduction to Harmonica",
        image: JSON.stringify({"thumbnail": "/assets/images/social.jpeg", "prev": "/assets/images/picnic.webp"}),
        description: "Join our Introduction to Harmonica Event to learn the great instrument Harmonica and connect with other students interested in it.",
        location: "Second floor quiet room",
        time: "15:30 - 17:00",
        club: "Music Club",
        date: "2025-03-22",
        deadline: "2025-07-20T12:00:00.000Z", 
        capacity: 20,
        followed: 6,
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
        title: "Robotics Icebreaker Event",
        image: JSON.stringify({"thumbnail": "/assets/images/mun.jpg", "prev": "/assets/images/picnic.webp"}),
        description: "An event welcoming anyone who is interested in robots, mechanics, or simply wants to social. We have fun activities and games planned to keep you engaged and get to know other students as you play. There are also free snacks and drinks for grab!",
        location: "Second floor quiet room",
        time: "12:00 - 14:00",
        club: "Robotics Club",
        date: "2025-02-12",
        deadline: "2025-08-10T12:00:00.000Z", 
        capacity: 75,
        followed: 71,
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
        title: "Music Club Festival",
        image: JSON.stringify({"thumbnail": "/assets/images/dance.jpeg", "prev": "/assets/images/picnic.webp"}),
        description: "An event open for all university students. You can enjoy the music as an audience or come up on stage and show off your talented voice! The stage is yours!",
        location: "Main auditorium",
        time: "17:00 - 18:00",
        club: "Music Club",
        date: "2024-11-02",
        deadline: "2025-07-01T12:00:00.000Z", 
        capacity: 100,
        followed: 57,
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
        title: "Tea Party",
        image: JSON.stringify({"thumbnail": "/assets/images/matcha.webp", "prev": "/assets/images/picnic.webp"}),
        description: "Have a cup of tea and join together for a discussion of your lovely pets and meet new friends.",
        location: "First floor meeting room",
        time: "9:00 - 10:00",
        club: "PAWS",
        date: "2024-10-18",
        deadline: "2025-08-16T12:00:00.000Z", 
        capacity: 20,
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
        title: "Introduction to PAWS",
        image: JSON.stringify({"thumbnail": "/assets/images/paws.jpeg", "prev": "/assets/images/picnic.webp"}),
        description: "Come join us at the PAWS social to unwind with some games, connect with fellow students, and learn more about our society!",
        location: "Room 1208",
        time: "14:00 - 15:30",
        club: "PAWS",
        date: "2024-12-02",
        deadline: "2025-08-01T12:00:00.000Z", 
        capacity: 25,
        followed: 8,
        waiting: 0/*2147483647*/,
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
        date: "2025-01-22",
        deadline: "2025-08-20T12:00:00.000Z", 
        capacity: 30,
        followed: 12,
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
      },
      {
        title: "WiSTEM Welcome Event",
        image: JSON.stringify({"thumbnail": "/assets/images/president.jpg", "prev": "/assets/images/picnic.webp"}),
        description: "Come join us for some games, connect with fellow members, and learn more about the WiSTEM society!",
        location: "Room 1208",
        time: "13:00 - 14:45",
        club: "WiSTEM Society",
        date: "2024-09-25",
        deadline: "2025-08-23T12:00:00.000Z", 
        capacity: 25,
        followed: 0,
        waiting: 0,
        price: 0,
        team: JSON.stringify([
          { role: "Organizer", name: "Bob White" },
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
