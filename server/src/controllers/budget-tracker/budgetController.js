const { where } = require('sequelize');
const { Budget } = require('../../models/');

// Get current budget for a club or all clubs
const getCurrentBudget = async (req, res) => {
  try {
    const { club_id } = req.query;
    const whereClause = club_id ? { club_id } : {};

    const budget = await Budget.findOne({
      where: whereClause,
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

const createBudget = async (req, res) => {
  try {
    const { totalAmount, fiscalYear, description, club_id } = req.body;

    if (!totalAmount || !fiscalYear) {
      return res.status(400).json({ message: 'Total amount and fiscal year are required' });
    }

    const newBudget = await Budget.create({
      totalAmount,
      fiscalYear,
      description: description || '',
      club_id: club_id || null
    });

    return res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return res.status(500).json({ message: 'Failed to create budget', error: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount, fiscalYear, description } = req.body;

    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

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

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

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
    const { club_id } = req.query;
    const whereClause = club_id ? { club_id } : {};

    const budgets = await Budget.findAll({
      where: whereClause,
      order: [['fiscalYear', 'DESC']]
    });

    return res.status(200).json(budgets);
  } catch (error) {
    console.error('Error getting all budgets:', error);
    return res.status(500).json({ message: 'Failed to retrieve budgets', error: error.message });
  }
};

const createDefaultBudget = async (club_id, totalAmount) => {
  try {
    const defaultAmount = totalAmount;

    const budget = await Budget.create({
      totalAmount: defaultAmount,
      fiscalYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      description: `Default budget`,
      club_id
    });

    return budget;
  } catch (error) {
    console.error('Error creating default budget:', error);
    throw error;
  }
};

const getBudgetByClubId = async (req, res) => {
  try {
    const { club_id } = req.params;

    const budget = await Budget.findOne({
      where: { club_id },
      order: [['createdAt', 'DESC']]
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found for this club' });
    }

    return res.status(200).json(budget);
  } catch (error) {
    console.error('Error getting club budget:', error);
    return res.status(500).json({ message: 'Failed to retrieve club budget', error: error.message });
  }
};

module.exports = {
  getCurrentBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getAllBudgets,
  createDefaultBudget,
  getBudgetByClubId
};