'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role_opening_registrations', [
      // Registrations for role_opening_id: 1
      {
        role_opening_id: 1,
        user_id: 5,
        role_opening_registration_application_date: new Date(),
        user_name: 'Alice Johnson',
        user_phone: '1234567890',
        user_email: 'student3@example.com',
        applicant_suitability: 'Strong leadership skills and 6 years of operational experience.',
        applicant_cv_url: '/uploads/pdfs/alice_johnson.pdf',
        status: 'UNDER_REVIEW'
      },
      {
        role_opening_id: 1,
        user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: 'Bob Smith',
        user_phone: '9876543210',
        user_email: 'student@example.com',
        applicant_suitability: 'Managed logistics for 3 different clubs.',
        applicant_cv_url: '/uploads/pdfs/bob_smith.pdf',
        status: 'SELECTED'
      },

      // Registrations for role_opening_id: 2
      {
        role_opening_id: 2,
        user_id: 3,
        role_opening_registration_application_date: new Date(),
        user_name: 'Carol Wang',
        user_phone: '1122334455',
        user_email: 'student1@example.com',
        applicant_suitability: 'Extensive background in student leadership.',
        applicant_cv_url: '/uploads/pdfs/carol_wang.pdf',
        status: 'REJECTED'
      },

      // Registrations for role_opening_id: 3
      {
        role_opening_id: 3,
        user_id: 4,
        role_opening_registration_application_date: new Date(),
        user_name: 'Daniel Li',
        user_phone: '9988776655',
        user_email: 'student2@example.com',
        applicant_suitability: 'Economics major with finance experience.',
        applicant_cv_url: '/uploads/pdfs/daniel_li.pdf',
        status: 'UNDER_REVIEW'
      },
      {
        role_opening_id: 3,
        user_id: 5,
        role_opening_registration_application_date: new Date(),
        user_name: 'Eva Chen',
        user_phone: '4433221100',
        user_email: 'student3@example.com',
        applicant_suitability: 'Worked as treasurer for school club.',
        applicant_cv_url: '/uploads/pdfs/eva_chen.pdf',
        status: 'UNDER_REVIEW'
      },
      {
        role_opening_id: 3,
        user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: 'Frank White',
        user_phone: '1112223333',
        user_email: 'student@example.com',
        applicant_suitability: 'Budget management experience.',
        applicant_cv_url: '/uploads/pdfs/frank_white.pdf',
        status: 'SELECTED'
      },

      // Registrations for role_opening_id: 4
      {
        role_opening_id: 4,
        user_id: 1,
        role_opening_registration_application_date: new Date(),
        user_name: 'Grace Lee',
        user_phone: '7778889999',
        user_email: 'admin@example.com',
        applicant_suitability: 'Proven leadership in university clubs.',
        applicant_cv_url: '/uploads/pdfs/grace_lee.pdf',
        status: 'UNDER_REVIEW'
      },

      // Registrations for role_opening_id: 5
      {
        role_opening_id: 5,
        user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: 'Henry Ford',
        user_phone: '8889990000',
        user_email: 'student@example.com',
        applicant_suitability: 'Experienced in managing VP responsibilities.',
        applicant_cv_url: '/uploads/pdfs/henry_ford.pdf',
        status: 'REJECTED'
      },
      {
        role_opening_id: 5,
        user_id: 4,
        role_opening_registration_application_date: new Date(),
        user_name: 'Isla Noor',
        user_phone: '1119998888',
        user_email: 'student2@example.com',
        applicant_suitability: 'Dynamic and committed team leader.',
        applicant_cv_url: '/uploads/pdfs/isla_noor.pdf',
        status: 'UNDER_REVIEW'
      },

      // Registrations for role_opening_id: 6
      {
        role_opening_id: 6,
        user_id: 5,
        role_opening_registration_application_date: new Date(),
        user_name: 'Jack Patel',
        user_phone: '1231231234',
        user_email: 'student3@example.com',
        applicant_suitability: 'Organizational skills and fluent communicator.',
        applicant_cv_url: '/uploads/pdfs/jack_patel.pdf',
        status: 'SELECTED'
      },

      // Registrations for role_opening_id: 7
      {
        role_opening_id: 7,
        user_id: 3,
        role_opening_registration_application_date: new Date(),
        user_name: 'Katherine Zhu',
        user_phone: '3213214321',
        user_email: 'student1@example.com',
        applicant_suitability: 'Finance background and keen eye for numbers.',
        applicant_cv_url: '/uploads/pdfs/katherine_zhu.pdf',
        status: 'UNDER_REVIEW'
      },
      {
        role_opening_id: 7,
        user_id: 1,
        role_opening_registration_application_date: new Date(),
        user_name: 'Leo Sharma',
        user_phone: '5556667777',
        user_email: 'admin@example.com',
        applicant_suitability: 'Interned in accounting firm.',
        applicant_cv_url: '/uploads/pdfs/leo_sharma.pdf',
        status: 'UNDER_REVIEW'
      },

      // Registrations for role_opening_id: 8
      {
        role_opening_id: 8,
        user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: 'Mira Dsouza',
        user_phone: '4445556666',
        user_email: 'student@example.com',
        applicant_suitability: 'Highly active in outreach activities.',
        applicant_cv_url: '/uploads/pdfs/mira_dsouza.pdf',
        status: 'REJECTED'
      },

      // Registrations for role_opening_id: 9
      {
        role_opening_id: 9,
        user_id: 3,
        role_opening_registration_application_date: new Date(),
        user_name: 'Nathan Roy',
        user_phone: '9998887777',
        user_email: 'student1@example.com',
        applicant_suitability: 'Creative lead in multiple campaigns.',
        applicant_cv_url: '/uploads/pdfs/nathan_roy.pdf',
        status: 'SELECTED'
      },
      {
        role_opening_id: 9,
        user_id: 5,
        role_opening_registration_application_date: new Date(),
        user_name: 'Olivia Brown',
        user_phone: '2223334444',
        user_email: 'student3@example.com',
        applicant_suitability: 'Skilled in graphic design and branding.',
        applicant_cv_url: '/uploads/pdfs/olivia_brown.pdf',
        status: 'UNDER_REVIEW'
      },

      // Registrations for role_opening_id: 10
      {
        role_opening_id: 10,
        user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: 'Peter Grant',
        user_phone: '1113335555',
        user_email: 'student@example.com',
        applicant_suitability: 'Event organizer for university fests.',
        applicant_cv_url: '/uploads/pdfs/peter_grant.pdf',
        status: 'UNDER_REVIEW'
      },

      // Registrations for role_opening_id: 11
      {
        role_opening_id: 11,
        user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: 'Queenie Yeo',
        user_phone: '5554443333',
        user_email: 'student@example.com',
        applicant_suitability: 'Excellent content strategy experience.',
        applicant_cv_url: '/uploads/pdfs/queenie_yeo.pdf',
        status: 'SELECTED'
      },

      // Registrations for role_opening_id: 12
      {
        role_opening_id: 12,
        user_id: 4,
        role_opening_registration_application_date: new Date(),
        user_name: 'Rafael Mendes',
        user_phone: '6667778888',
        user_email: 'student2@example.com',
        applicant_suitability: 'Organized TEDx and cultural night.',
        applicant_cv_url: '/uploads/pdfs/rafael_mendes.pdf',
        status: 'REJECTED'
      },
      {
        role_opening_id: 12,
        user_id: 3,
        role_opening_registration_application_date: new Date(),
        user_name: 'Sasha Noorani',
        user_phone: '9990001111',
        user_email: 'student1@example.com',
        applicant_suitability: 'Known for managing big events efficiently.',
        applicant_cv_url: '/uploads/pdfs/sasha_noorani.pdf',
        status: 'UNDER_REVIEW'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role_opening_registrations', null, {});
  }
};