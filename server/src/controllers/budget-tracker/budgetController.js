const { Budget } = require('../../models/');

// Get current budget
const getCurrentBudget = async (req, res) => {
  try {
    // Get the most recent budget (assuming one budget per fiscal year)
    const budget = await Budget.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }

    return res.status(200).json(budget);
  } catch (error) {
    console.error('Error getting current budget:', error);
    return res.status(500).json({ message: 'Failed to retrieve budget', error: error.message });
  }
};

// Create new budget
const createBudget = async (req, res) => {
  try {
    const { totalAmount, fiscalYear, description } = req.body;

    // Validate input
    if (!totalAmount || !fiscalYear) {
      return res.status(400).json({ message: 'Total amount and fiscal year are required' });
    }

    // Create new budget
    const newBudget = await Budget.create({
      totalAmount,
      fiscalYear,
      description: description || ''
    });

    return res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return res.status(500).json({ message: 'Failed to create budget', error: error.message });
  }
};

// Update existing budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount, fiscalYear, description } = req.body;

    // Find budget by ID
    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Update budget
    await budget.update({
      totalAmount: totalAmount || budget.totalAmount,
      fiscalYear: fiscalYear || budget.fiscalYear,
      description: description !== undefined ? description : budget.description
    });

    return res.status(200).json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return res.status(500).json({ message: 'Failed to update budget', error: error.message });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    // Find budget by ID
    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Delete budget
    await budget.destroy();

    return res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return res.status(500).json({ message: 'Failed to delete budget', error: error.message });
  }
};

// Get all budgets (for admin)
const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      order: [['fiscalYear', 'DESC']]
    });

    return res.status(200).json(budgets);
  } catch (error) {
    console.error('Error getting all budgets:', error);
    return res.status(500).json({ message: 'Failed to retrieve budgets', error: error.message });
  }
};


const testBudget = async (req, res) => {
  try {
    console.log('Testing Budget model...');
    const allBudgets = await Budget.findAll();
    return res.status(200).json({ 
      message: 'Budget model test', 
      count: allBudgets.length,
      budgets: allBudgets
    });
  } catch (error) {
    console.error('Error testing budget:', error);
    return res.status(500).json({ 
      message: 'Failed to test budget', 
      error: error.message 
    });
  }
};


module.exports = {
  getCurrentBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getAllBudgets,
  testBudget
};