'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define categories with names and colors
    const categories = [
      { name: 'Catering', color: '#2d4526' },
      { name: 'Materials', color: '#1C2833' },
      { name: 'Prize', color: '#6b6969' },
      { name: 'Venue', color: '#d98248' },
      { name: 'Transportation', color: '#8C5E3C' }
    ];
    
    // Check if categories already exist to avoid duplicates
    const existingCategories = await queryInterface.sequelize.query(
      'SELECT name FROM "Categories"',
      { type: Sequelize.QueryTypes.SELECT }
    ).catch(() => []);
    
    const existingCategoryNames = existingCategories.map(c => c.name);
    
    // Filter out categories that already exist
    const newCategories = categories.filter(category => 
      !existingCategoryNames.includes(category.name)
    );
    
    // Add timestamps for each new category
    const categoriesToInsert = newCategories.map(category => ({
      name: category.name,
      color: category.color,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    if (categoriesToInsert.length === 0) {
      console.log('All categories already exist, skipping seed');
      return Promise.resolve();
    }
    
    return queryInterface.bulkInsert('Categories', categoriesToInsert);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};