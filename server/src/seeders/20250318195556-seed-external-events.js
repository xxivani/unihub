'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('external_events', [
      {
        external_event_name: "Student Rep Social",
        external_event_date: new Date('2025-07-20'),
        external_event_location: "Room 141A",
        external_event_time: new Date('2025-02-20T15:30:00Z'), // Correct format with date and time
        external_event_description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better.",
        external_event_created_by: "Bob White",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 10, // Price in AED
        external_event_max_number_of_attendees: 150,
		external_event_category: "SOCIAL_GATHERING",
        external_event_organizer: "Bob White",
        external_event_corganizer: "David Pinkman",
        external_event_manager: "Jake Schrader",
        external_event_speaker: "Kanye Goodman",
      },
	  {
		external_event_name: "LinkedIn & Personal Branding for Students",
		external_event_date: new Date('2025-06-25'),
		external_event_location: "Business School Auditorium",
		external_event_time: new Date('2025-04-25T11:00:00Z'),
		external_event_description: "Build your student profile and stand out to recruiters with tips from a career development expert.",
		external_event_created_by: "Sarah Wilson",
		external_event_created_at: new Date(),
		external_event_ticket_amount: 50,
		external_event_max_number_of_attendees: 100,
		external_event_category: "CAREER",
		external_event_organizer: "Sarah Wilson",
		external_event_corganizer: "William Smith",
		external_event_manager: "Michael O'Brien",
		external_event_speaker: "Alex Tan, LinkedIn Career Coach",
	  },
      {
        external_event_name: "UoBDMUN'25 Diplomacy Skills Workshop",
        external_event_date: new Date('2025-05-25'),
        external_event_location: "Main Auditorium",
        external_event_time: new Date('2025-02-25T12:00:00Z'), // Correct format with date and time
        external_event_description: "Join this hands-on workshop designed to build your diplomacy, negotiation, and public speaking skills through MUN-style simulations and expert-led sessions.",
        external_event_created_by: "John Smith",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 150, // Price in AED
        external_event_max_number_of_attendees: 200,
		external_event_category: "WORKSHOP",
        external_event_organizer: "John Smith",
        external_event_corganizer: "Emily Davis",
        external_event_manager: "Michael Johnson",
        external_event_speaker: "Sarah Williams",
      },
      {
        external_event_name: "Intra-Uni Athletics Championship",
        external_event_date: new Date('2025-06-01'),
        external_event_location: "DIAC Park",
        external_event_time: new Date('2025-03-01T17:00:00Z'), // Correct format with date and time
        external_event_description: "Gear up for a day of friendly competition! Join fellow students in track and field events to test your speed, strength, and spirit.",
        external_event_created_by: "Lisa Johnson",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 0, // Price in AED
        external_event_max_number_of_attendees: 100,
		external_event_category: "SPORTS",
        external_event_organizer: "Lisa Johnson",
        external_event_corganizer: "Mark Brown",
        external_event_manager: "Sophie Taylor",
        external_event_speaker: null,
      },
	  {
		external_event_name: "Coffee & Canvas: Guided Art Night",
		external_event_date: new Date('2025-05-15'),
		external_event_location: "Art Studio Room 3",
		external_event_time: new Date('2025-05-15T18:00:00Z'),
		external_event_description: "Unleash your creativity with a relaxing evening of guided painting led by a local artist. All materials provided — including canvas, paints, brushes, and coffee!",
		external_event_created_by: "Ella Ray",
		external_event_created_at: new Date(),
		external_event_ticket_amount: 25, // Price in AED
		external_event_max_number_of_attendees: 30,
		external_event_category: "SOCIAL_GATHERING",
		external_event_organizer: "Ella Ray",
		external_event_corganizer: "Tariq Al Mansoori",
		external_event_manager: "Hana Youssef",
		external_event_speaker: "Layla Saeed",
	  },
      {
        external_event_name: "The Greenroom Gathering",
        external_event_date: new Date('2025-07-10'),
        external_event_location: "Room 120B",
        external_event_time: new Date('2025-03-10T14:00:00Z'), // Correct format with date and time
        external_event_description: "Come join us to unwind with some games, connect with fellow students, and learn more about plants!",
        external_event_created_by: "Bob White",
        external_event_created_at: new Date(),
        external_event_ticket_amount: 20, // Price in AED
        external_event_max_number_of_attendees: 75,
		external_event_category: "SOCIAL_GATHERING",
        external_event_organizer: "Bob White",
        external_event_corganizer: "David Pinkman",
        external_event_manager: "Jake Schrader",
        external_event_speaker: "Kanye Goodman",
      },
	  {
		external_event_name: "Clean-Up for a Cause",
		external_event_date: new Date('2025-05-15'),
		external_event_location: "Corniche Beachfront",
		external_event_time: new Date('2025-03-15T08:00:00Z'),
		external_event_description: "Join fellow students for a morning of meaningful impact as we clean up the beachfront area. Gloves, bags, and refreshments will be provided. Let’s give back to our community, one step at a time.",
		external_event_created_by: "Aisha Rahman",
		external_event_created_at: new Date(),
		external_event_ticket_amount: 0, // Free event
		external_event_max_number_of_attendees: 100,
		external_event_category: "VOLUNTEERING",
		external_event_organizer: "Aisha Rahman",
		external_event_corganizer: "Maaz Nuaimi",
		external_event_manager: "Fatima Saeed",
		external_event_speaker: null,
	  },
	  {
		external_event_name: "CodeSprint 2025 Hackathon",
		external_event_date: new Date('2025-06-12'),
		external_event_location: "Innovation Lab, Tech Building",
		external_event_time: new Date('2025-04-12T10:00:00Z'),
		external_event_description: "Join the ultimate 24-hour coding challenge where creativity meets technology! Form teams, build innovative solutions, and compete for exciting prizes. Open to all students with a passion for tech.",
		external_event_created_by: "Noura Al Maktoum",
		external_event_created_at: new Date(),
		external_event_ticket_amount: 0, // Free entry
		external_event_max_number_of_attendees: 120,
		external_event_category: "HACKATHON",
		external_event_organizer: "Noura Al Maktoum",
		external_event_corganizer: "Ali Reza",
		external_event_manager: "Khaled Mansoor",
		external_event_speaker: "Dr. Leila Hassan",
	  },
	  {
		external_event_name: "The Psychology of Motivation",
		external_event_date: new Date('2025-06-22'),
		external_event_location: "Seminar Room B",
		external_event_time: new Date('2025-04-22T11:00:00Z'),
		external_event_description: "Join Dr. Leila Haddad for a talk on what drives human behavior, how to stay motivated during challenging times, and practical strategies for student success.",
		external_event_created_by: "Nina Clarke",
		external_event_created_at: new Date(),
		external_event_ticket_amount: 0,
		external_event_max_number_of_attendees: 80,
		external_event_category: "GUEST_LECTURE",
		external_event_organizer: "Nina Clarke",
		external_event_corganizer: "Ali Mansoor",
		external_event_manager: "Farah Khalid",
		external_event_speaker: "Dr. Leila Haddad",
	  }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('external_events', null, {});
  }
};
