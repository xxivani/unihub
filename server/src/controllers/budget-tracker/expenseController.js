const { Expense, Category, Event, sequelize } = require('../../models');
const { Op } = require('sequelize');

const getAllExpenses = async (req, res) => {
  try {
    const { club_id } = req.query;
    const expense_whereClause = club_id ? { club_id } : {};

    const expenses = await Expense.findAll({
      where: expense_whereClause,
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

const createExpense = async (req, res) => {
  try {
    const { amount, description, date, categoryId, eventId, club_id } = req.body;

    if (!amount || !categoryId) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }

    // Validate amount is not negative
    if (parseFloat(amount) < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative' });
    }

    if (!club_id) {
      return res.status(400).json({ message: 'Club ID is required' });
    }

    // Check if expense would exceed budget
    const budget = await Budget.findOne({ 
      where: { club_id },
      order: [['createdAt', 'DESC']]
    });

    if (budget) {
      const totalExpensesResult = await Expense.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
        ],
        where: { club_id },
        raw: true
      });

      const currentTotal = parseFloat(totalExpensesResult.totalSpent) || 0;
      const newExpenseAmount = parseFloat(amount);
      
      if (currentTotal + newExpenseAmount > budget.totalAmount) {
        return res.status(400).json({ 
          message: `Expense would exceed budget. Available: AED ${(budget.totalAmount - currentTotal).toFixed(2)}`,
          available: budget.totalAmount - currentTotal,
          budgetLimit: budget.totalAmount
        });
      }
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
    }

    const newExpense = await Expense.create({
      amount,
      description: description || '',
      date: date || new Date(),
      categoryId,
      eventId: eventId || null,
      club_id
    });

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


const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, categoryId, eventId, club_id } = req.body;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
    }

    await expense.update({
      amount: amount || expense.amount,
      description: description !== undefined ? description : expense.description,
      date: date || expense.date,
      categoryId: categoryId || expense.categoryId,
      eventId: eventId !== undefined ? eventId : expense.eventId,
      club_id: expense.club_id
    });

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

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.destroy();

    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
};

const getExpensesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

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

const getExpensesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

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

const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

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