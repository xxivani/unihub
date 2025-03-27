const { Expense, Category, Event, sequelize } = require('../../models');
const { Op } = require('sequelize');

// Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Event, as: 'event' }
      ],
      order: [['date', 'DESC']]
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error getting all expenses:', error);
    return res.status(500).json({ message: 'Failed to retrieve expenses', error: error.message });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Event, as: 'event' }
      ]
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error('Error getting expense by ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve expense', error: error.message });
  }
};

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const { amount, description, date, categoryId, eventId } = req.body;

    // Validate input
    if (!amount || !categoryId) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if event exists if eventId is provided
    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
    }

    // Create new expense
    const newExpense = await Expense.create({
      amount,
      description: description || '',
      date: date || new Date(),
      categoryId,
      eventId: eventId || null
    });

    // Get the created expense with its relations
    const createdExpense = await Expense.findByPk(newExpense.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Event, as: 'event' }
      ]
    });

    return res.status(201).json(createdExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ message: 'Failed to create expense', error: error.message });
  }
};

// Update existing expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, categoryId, eventId } = req.body;

    // Find expense by ID
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if category exists if categoryId is provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Check if event exists if eventId is provided
    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
    }

    // Update expense
    await expense.update({
      amount: amount || expense.amount,
      description: description !== undefined ? description : expense.description,
      date: date || expense.date,
      categoryId: categoryId || expense.categoryId,
      eventId: eventId !== undefined ? eventId : expense.eventId
    });

    // Get the updated expense with its relations
    const updatedExpense = await Expense.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Event, as: 'event' }
      ]
    });

    return res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find expense by ID
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Delete expense
    await expense.destroy();

    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
};

// Get expenses by event
const getExpensesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get expenses for the event
    const expenses = await Expense.findAll({
      where: { eventId },
      include: [
        { model: Category, as: 'category' }
      ],
      order: [['date', 'DESC']]
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error getting expenses by event:', error);
    return res.status(500).json({ message: 'Failed to retrieve expenses', error: error.message });
  }
};

// Get expenses by category
const getExpensesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get expenses for the category
    const expenses = await Expense.findAll({
      where: { categoryId },
      include: [
        { model: Event, as: 'event' }
      ],
      order: [['date', 'DESC']]
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error getting expenses by category:', error);
    return res.status(500).json({ message: 'Failed to retrieve expenses', error: error.message });
  }
};

// Get expenses by date range
const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    // Get expenses within the date range
    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        { model: Category, as: 'category' },
        { model: Event, as: 'event' }
      ],
      order: [['date', 'DESC']]
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error getting expenses by date range:', error);
    return res.status(500).json({ message: 'Failed to retrieve expenses', error: error.message });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByEvent,
  getExpensesByCategory,
  getExpensesByDateRange
};