// const { Budget, Expense, Category, BTevent, sequelize } = require('../../models');

const db = require('../../models');
const Budget = db.Budget;
const Expense = db.Expense;
const Category = db.Category;
const BTevent = db.BTevent;
const Event = db.Event;
const sequelize = db.sequelize;

console.log('Available models:', Object.keys(db));

const { Op } = require('sequelize');

// Get dashboard data (combined endpoint)
const getDashboardData = async (req, res) => {
  try {
    const { club_id } = req.query;
    console.log('Dashboard query params:', req.query);
    
    // Log and validate club_id
    console.log('Using club_id:', club_id);
    
    // Prepare where clause for Budget query
    const budgetWhereClause = club_id ? { club_id } : {};
    console.log('club_id from query:', club_id);
    console.log('Where clause:', budgetWhereClause);
    
    // Get latest budget for the club
    const latestBudget = await Budget.findOne({
      where: budgetWhereClause,
      order: [['createdAt', 'DESC']]
    });
    
    // Prepare where clause for Expense queries
    const expenseWhereClause = club_id ? { club_id } : {};
    
    // Get total spent - Now filtering by club_id
    const totalSpentResult = await Expense.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
      ],
      where: expenseWhereClause // Apply club_id filter
    });
    
    // Calculate budget values
    const totalBudget = latestBudget ? parseFloat(latestBudget.totalAmount) : 0;
    const totalSpent = totalSpentResult ? parseFloat(totalSpentResult.getDataValue('totalSpent') || 0) : 0;
    const remaining = totalBudget - totalSpent;
    
    // Get monthly expenses - Now filtering by club_id
    const monthlyExpensesQuery = await Expense.findAll({
      attributes: [
        [sequelize.fn('date_part', 'month', sequelize.col('date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: expenseWhereClause, // Apply club_id filter
      group: [sequelize.fn('date_part', 'month', sequelize.col('date'))]
    });
    
    // Format monthly expenses specifically for semesters
    const monthLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
    // Initialize monthlyExpenses with the format expected by frontend
    const monthlyExpenses = {
      labels: monthLabels,
      data: Array(10).fill(0)
    };
    
    // Map the database results to match the expected structure
    monthlyExpensesQuery.forEach(expense => {
      const month = parseInt(expense.getDataValue('month'));
      let index = -1;
      
      if (month >= 9 && month <= 12) {
        // Semester 1: Sep (9) to Dec (12)
        index = month - 9; // Convert to 0-3
      } else if (month >= 1 && month <= 6) {
        // Semester 2: Jan (1) to Jun (6)
        index = month + 3;
      }
      
      if (index >= 0 && index < 10) {
        monthlyExpenses.data[index] = parseFloat(expense.getDataValue('total') || 0);
      }
    });
    
    // Get all expenses for analysis - Now filtering by club_id
    const allExpenses = await Expense.findAll({
      where: expenseWhereClause // Apply club_id filter
    });
    
    // Get category breakdown - Now using JOIN with proper WHERE clause
    const categoryBreakdownQuery = await Category.findAll({
      attributes: [
        'id', 'name', 'color',
        [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total']
      ],
      include: [{
        model: Expense,
        as: 'expenses',
        attributes: [],
        where: expenseWhereClause, // Apply club_id filter to joined expenses
        required: false
      }],
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });
    
    // Format category data to match frontend expectations
    const expenseBreakdown = {
      labels: categoryBreakdownQuery.map(category => category.name),
      data: categoryBreakdownQuery.map(category => parseFloat(category.getDataValue('total') || 0)),
      colors: categoryBreakdownQuery.map(category => category.color || '#' + Math.floor(Math.random()*16777215).toString(16))
    };
    
    // Get latest events - Now includes general events by using the association
    const latestEventsQuery = club_id ?
      {
        where: { club_id },
        limit: 5,
        order: [['date', 'DESC']]
      } :
      {
        limit: 5,
        order: [['date', 'DESC']]
      };
    
    const latestEvents = await BTevent.findAll({
      ...latestEventsQuery,
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        },
        {
          model: Event,
          as: 'generalEvent'
        }
      ]
    });
    
    // Format latest events to match frontend expectations
    const formattedLatestEvents = latestEvents.map(event => {
      const rawEvent = event.get({ plain: true });
      
      // Calculate the total expense amount for this event
      const totalExpense = rawEvent.expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0), 0
      );
      
      return {
        id: rawEvent.id,
        name: rawEvent.name,
        totalExpense,
        amount: `AED ${totalExpense.toLocaleString()}`, // Pre-format to match frontend expectation
        general_event_id: rawEvent.general_event_id,
        // Include a flag to identify events from the general system
        is_general_event: !!rawEvent.general_event_id,
        // Include the original event title if it's from the general system
        original_title: rawEvent.generalEvent ? rawEvent.generalEvent.title : null
      };
    });
    
    // Compile dashboard data with the structure expected by frontend
    const dashboardData = {
      budgetSummary: {
        totalBudget,
        totalSpent,
        remaining,
        fiscalYear: latestBudget ? latestBudget.fiscalYear : 'N/A'
      },
      monthlyExpenses,
      expenseBreakdown,
      latestEvents: formattedLatestEvents,
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
    const { club_id } = req.query;
    
    // Prepare where clause based on club_id
    const whereClause = club_id ? { club_id } : {};
    
    // Get the current budget
    const budget = await Budget.findOne({
      where: whereClause,
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
      where: whereClause,
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
    const { fiscalYear, club_id } = req.query;

    // Prepare where clause
    const whereClause = club_id ? { club_id } : {};
    
    // Define semester months
    const semesterMonths = ['09', '10', '11', '12', '01', '02', '03', '04', '05', '06'];

    // Initialize result object with all months set to 0
    const monthlyExpenses = {
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: Array(10).fill(0)
    };

    // Add fiscal year filter if provided
    if (fiscalYear) {
      whereClause[sequelize.Op.and] = sequelize.literal(
        `(
          (EXTRACT(MONTH FROM date) >= 9 AND EXTRACT(YEAR FROM date) = ${parseInt(fiscalYear)}) OR 
          (EXTRACT(MONTH FROM date) <= 6 AND EXTRACT(YEAR FROM date) = ${parseInt(fiscalYear) + 1})
        )`
      );
    }

    // Query for expenses grouped by month
    const expenses = await Expense.findAll({
      attributes: [
        [sequelize.fn('date_part', 'month', sequelize.col('date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: whereClause,
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
    const { club_id } = req.query;
    
    // Prepare where clause for expenses
    const expenseWhereClause = club_id ? { club_id } : {};
    
    // Get all categories with their total expenses
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'color'],
      include: [
        {
          model: Expense,
          as: 'expenses',
          attributes: [],
          where: expenseWhereClause
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