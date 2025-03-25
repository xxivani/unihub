'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role_opening_registrations', [
      {
        // role_opening_registration_id: 1,
        role_opening_id: 1,
        // user_id: 1,
        role_opening_registration_application_date: new Date(),
        user_name: "Abreil Johnson",
        user_phone: "+971 999999999",
        user_email: "abreiljohnson@gmail.com",
        applicant_suitability: "I have extensive experience in event management and leadership.",
        applicant_cv_url: "/uploads/Abreil_Johnson_CV.pdf"
      },
      {
        // role_opening_registration_id: 2,
        role_opening_id: 1,
        // user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: "Michael Lee",
        user_phone: "+971 777777777",
        user_email: "michaellee@gmail.com",
        applicant_suitability: "I have strong organizational skills and have previously managed several successful events.",
        applicant_cv_url: "/uploads/Michael_Lee_CV.pdf"
      },
      {
        // role_opening_registration_id: 3,
        role_opening_id: 2,
        // user_id: 1,
        role_opening_registration_application_date: new Date(),
        user_name: "Sophia Wilson",
        user_phone: "+971 666666666",
        user_email: "sophiawilson@gmail.com",
        applicant_suitability: "My experience in marketing and event planning makes me a great fit for this role.",
        applicant_cv_url: "/uploads/Sophia_Wilson_CV.pdf"
      },
      {
        // role_opening_registration_id: 4,
        role_opening_id: 2,
        // user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: "David Brown",
        user_phone: "+971 555555555",
        user_email: "davidbrown@gmail.com",
        applicant_suitability: "I have a background in budget management and logistics, which are key skills for this role.",
        applicant_cv_url: "/uploads/David_Brown_CV.pdf"
      },
      {
        // role_opening_registration_id: 5,
        role_opening_id: 3,
        // user_id: 1,
        role_opening_registration_application_date: new Date(),
        user_name: "Emily Carter",
        user_phone: "+971 444444444",
        user_email: "emilycarter@gmail.com",
        applicant_suitability: "I have led several student organizations and am confident in my ability to manage this role.",
        applicant_cv_url: "/uploads/Emily_Carter_CV.pdf"
      },
      {
        // role_opening_registration_id: 6,
        role_opening_id: 3,
        // user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: "Chris Evans",
        user_phone: "+971 333333333",
        user_email: "chrisevans@gmail.com",
        applicant_suitability: "My experience in logistics and operations will help streamline committee activities.",
        applicant_cv_url: "/uploads/Chris_Evans_CV.pdf"
      },
      {
        // role_opening_registration_id: 7,
        role_opening_id: 4,
        // user_id: 1,
        role_opening_registration_application_date: new Date(),
        user_name: "Nina Patel",
        user_phone: "+971 222222222",
        user_email: "ninapatel@gmail.com",
        applicant_suitability: "With a background in public relations, I bring valuable communication skills to the role.",
        applicant_cv_url: "/uploads/Nina_Patel_CV.pdf"
      },
      {
        // role_opening_registration_id: 8,
        role_opening_id: 4,
        // user_id: 2,
        role_opening_registration_application_date: new Date(),
        user_name: "Omar Farouk",
        user_phone: "+971 111111111",
        user_email: "omarfarouk@gmail.com",
        applicant_suitability: "My volunteer experience in event execution and leadership will benefit the club.",
        applicant_cv_url: "/uploads/Omar_Farouk_CV.pdf"
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role_opening_registrations', null, {});
  }
};
