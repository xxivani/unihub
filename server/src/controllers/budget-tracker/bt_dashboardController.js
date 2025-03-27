// const { Budget, Expense, Category, BTevent, sequelize } = require('../../models');

const db = require('../../models');
const Budget = db.Budget;
const Expense = db.Expense;
const Category = db.Category;
const BTevent = db.BTevent;
const sequelize = db.sequelize;

console.log('Available models:', Object.keys(db));


const { Op } = require('sequelize');

// Get dashboard data (combined endpoint)
const getDashboardData = async (req, res) => {
  try {
    // Get budget summary
    const budget = await Budget.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }

    // Get total expenses
    const totalExpensesResult = await Expense.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
      ],
      raw: true
    });

    // In your controller
    const totalBudget = parseFloat(budget.totalAmount).toFixed(2);
    const totalSpent = parseFloat(totalExpensesResult.totalSpent || 0).toFixed(2);
    const remaining = (totalBudget - totalSpent).toFixed(2);

    // Define semester months (September to April)
    const semesterMonths = ['09', '10', '11', '12', '01', '02', '03', '04'];
    
    // Initialize monthly expenses
    const monthlyExpenses = {
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      data: Array(8).fill(0)
    };

    // Query for expenses grouped by month
    const expenses = await Expense.findAll({
      attributes: [
        [sequelize.fn('date_part', 'month', sequelize.col('date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: [sequelize.fn('date_part', 'month', sequelize.col('date'))],
      raw: true
    });
    // Add this debug code temporarily to your controller
    const allexpenses = await Expense.findAll({
      attributes: ['id', 'amount', 'description', 'date'],
      raw: true
    });
   

    // Get total expenses - add a console.log
    const totalsResult = await Expense.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
      ],
      raw: true
    });

    // Map the database results to our monthlyExpenses structure
    expenses.forEach(expense => {
      const monthNum = expense.month.toString().padStart(2, '0');
      const monthIndex = semesterMonths.indexOf(monthNum);
      
      if (monthIndex !== -1) {
        monthlyExpenses.data[monthIndex] = parseFloat(expense.total);
      }
    });

    // Get expense breakdown by category
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'color'],
      include: [
        {
          model: Expense,
          as: 'expenses',
          attributes: []
        }
      ],
      group: ['Category.id'],
      order: [['name', 'ASC']],
      raw: true,
      nest: false,
      includeIgnoreAttributes: false,
      attributes: [
        'id', 'name', 'color',
        [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total']
      ]
    });

    // Format the data for the doughnut chart
    const expenseBreakdown = {
      labels: categories.map(category => category.name),
      data: categories.map(category => parseFloat(category.total) || 0),
      colors: categories.map(category => category.color)
    };

    // Get latest events
    const latestEvents = await BTevent.findAll({
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ],
      order: [['date', 'DESC']], // Order by date instead of createdAt
      limit: 3
    });

    // Calculate total expenses for each event
    const eventsWithTotals = latestEvents.map(event => {
      const rawEvent = event.get({ plain: true });
      
      // Calculate total expenses
      const totalExpense = rawEvent.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      
      return {
        ...rawEvent,
        totalExpense
      };
    });

    // Combine all data for the dashboard
    const dashboardData = {
      budgetSummary: {
        totalBudget,
        totalSpent,
        remaining,
        fiscalYear: budget.fiscalYear
      },
      monthlyExpenses,
      expenseBreakdown,
      latestEvents: eventsWithTotals
    };


    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    return res.status(500).json({ message: 'Failed to retrieve dashboard data', error: error.message });
  }
};

// Get budget summary (total, spent, remaining)
const getBudgetSummary = async (req, res) => {
  try {
    // Get the current budget
    const budget = await Budget.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }

    // Get total expenses
    const totalExpensesResult = await Expense.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
      ],
      raw: true
    });

    const totalBudget = parseFloat(budget.totalAmount);
    const totalSpent = parseFloat(totalExpensesResult.totalSpent) || 0;
    const remaining = totalBudget - totalSpent;

    return res.status(200).json({
      totalBudget,
      totalSpent,
      remaining,
      fiscalYear: budget.fiscalYear
    });
  } catch (error) {
    console.error('Error getting budget summary:', error);
    return res.status(500).json({ message: 'Failed to retrieve budget summary', error: error.message });
  }
};

// Get monthly expenses for chart
const getMonthlyExpenses = async (req, res) => {
  try {
    const fiscalYear = req.query.fiscalYear;
    
    // Define semester months (September to April)
    const semesterMonths = ['09', '10', '11', '12', '01', '02', '03', '04'];
    
    // Initialize result object with all months set to 0
    const monthlyExpenses = {
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      data: Array(8).fill(0)
    };

    // Query for expenses grouped by month
    const expenses = await Expense.findAll({
      attributes: [
        [sequelize.fn('date_part', 'month', sequelize.col('date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: sequelize.literal(
        fiscalYear 
          ? `(
              (EXTRACT(MONTH FROM date) >= 9 AND EXTRACT(YEAR FROM date) = ${parseInt(fiscalYear)}) OR 
              (EXTRACT(MONTH FROM date) <= 4 AND EXTRACT(YEAR FROM date) = ${parseInt(fiscalYear) + 1})
            )`
          : '1=1'
      ),
      group: [sequelize.fn('date_part', 'month', sequelize.col('date'))],
      raw: true
    });

    // Map the database results to our monthlyExpenses structure
    expenses.forEach(expense => {
      const monthNum = expense.month.toString().padStart(2, '0');
      const monthIndex = semesterMonths.indexOf(monthNum);
      
      if (monthIndex !== -1) {
        monthlyExpenses.data[monthIndex] = parseFloat(expense.total);
      }
    });

    return res.status(200).json(monthlyExpenses);
  } catch (error) {
    console.error('Error getting monthly expenses:', error);
    return res.status(500).json({ message: 'Failed to retrieve monthly expenses', error: error.message });
  }
};

// Get expense breakdown by category
const getExpenseBreakdown = async (req, res) => {
  try {
    // Get all categories with their total expenses
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'color'],
      include: [
        {
          model: Expense,
          as: 'expenses',
          attributes: []
        }
      ],
      group: ['Category.id'],
      order: [['name', 'ASC']],
      raw: true,
      nest: false,
      includeIgnoreAttributes: false,
      attributes: [
        'id', 'name', 'color',
        [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total']
      ]
    });

    // Format the data for the doughnut chart
    const expenseBreakdown = {
      labels: categories.map(category => category.name),
      data: categories.map(category => parseFloat(category.total) || 0),
      colors: categories.map(category => category.color)
    };

    return res.status(200).json(expenseBreakdown);
  } catch (error) {
    console.error('Error getting expense breakdown:', error);
    return res.status(500).json({ message: 'Failed to retrieve expense breakdown', error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getBudgetSummary,
  getMonthlyExpenses,
  getExpenseBreakdown
};