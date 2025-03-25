const { Category, Expense, sequelize } = require('../../models');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting all categories:', error);
    return res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('Error getting category by ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve category', error: error.message });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Create new category
    const newCategory = await Category.create({
      name,
      color: color || '#bdd6a8' // Use default color if none provided
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// Update existing category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    // Find category by ID
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update category
    await category.update({
      name: name || category.name,
      color: color || category.color
    });

    return res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category by ID
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is used in any expenses
    const usedInExpenses = await Expense.findOne({
      where: { categoryId: id }
    });

    if (usedInExpenses) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is used in expenses. Please reassign expenses first.' 
      });
    }

    // Delete category
    await category.destroy();

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

// Get categories with expense totals
const getCategoriesWithTotals = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Expense,
          as: 'expenses',
          attributes: []
        }
      ],
      attributes: [
        'id', 
        'name', 
        'color',
        [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('expenses.id')), 'expenseCount']
      ],
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories with totals:', error);
    return res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithTotals
};