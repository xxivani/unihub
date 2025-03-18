'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('news', [
      {
        news_title: "Newsletter Week 10",
        news_content: "This week's newsletter covers the latest updates from our organization. We're excited to announce our upcoming events and share some important information with our community.",
        news_thumbnail_url: "https://picsum.photos/200/150?random=1",
        news_pdf_url: "/uploads/pdfs/newsletter-week-10.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-03-10')
      },
      {
        news_title: "Newsletter Week 9",
        news_content: "In this week's newsletter, we discuss the results of our recent community survey and share plans for the upcoming quarter. We also highlight some of the amazing work our team has been doing.",
        news_thumbnail_url: "https://picsum.photos/200/150?random=2",
        news_pdf_url: "/uploads/pdfs/newsletter-week-9.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-03-03')
      },
      {
        news_title: "Newsletter Week 8",
        news_content: "Our eighth newsletter features interviews with key community members and important announcements about upcoming initiatives. Read about our progress and future plans.",
        news_thumbnail_url: "https://picsum.photos/200/150?random=3",
        news_pdf_url: "/uploads/pdfs/newsletter-week-8.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-02-24')
      },
      {
        news_title: "Newsletter Week 7",
        news_content: "This week we bring you updates on our recent successes and challenges. We also introduce new team members and share opportunities for involvement in our community projects.",
        news_thumbnail_url: "https://picsum.photos/200/150?random=4",
        news_pdf_url: "/uploads/pdfs/newsletter-week-7.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-02-17')
      },
      {
        news_title: "Newsletter Week 6",
        news_content: "The sixth edition of our newsletter includes a special feature on community achievements, updates on ongoing projects, and important dates for your calendar.",
        news_thumbnail_url: "/https://picsum.photos/200/150?random=5",
        news_pdf_url: "/uploads/pdfs/newsletter-week-6.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-02-10')
      },
      {
        news_title: "Newsletter Week 5",
        news_content: "In our fifth newsletter, read about the exciting developments in our organization, testimonials from community members, and announcements about upcoming events.",
        news_thumbnail_url: "https://picsum.photos/200/150?random=6",
        news_pdf_url: "/uploads/pdfs/newsletter-week-5.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-02-03')
      },
      {
        news_title: "Newsletter Week 4",
        news_content: "This week's edition highlights our recent achievements, introduces new initiatives, and provides valuable resources for our community members.",
        news_thumbnail_url: "https://picsum.photos/200/150?random=7",
        news_pdf_url: "/uploads/pdfs/newsletter-week-4.pdf",
        news_author: "Admin",
        news_created_at: new Date('2025-01-27')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('news', null, {});
  }
};