const db = require('../models');
const Budget = db.Budget;
const Expense = db.Expense;
const sequelize = db.sequelize;
const { Op } = require('sequelize');

/**
 * Get budget statistics for a specific club
 * This API is designed to provide data for the ClubStatistics component
 */
const getClubBudgetStats = async (req, res) => {
    try {
        const { club_id } = req.query;

        if (!club_id) {
            return res.status(400).json({ message: 'Club ID is required' });
        }

        console.log('Getting budget stats for club:', club_id);

        const whereClause = club_id ? { club_id } : {};

        // Get the latest budget for the club
        const budget = await Budget.findOne({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        if (!budget) {
            return res.status(404).json({ message: 'No budget found for this club' });
        }

        // Get total expenses
        // const totalSpentResult = await Expense.findOne({
        //   attributes: [
        //     [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
        //   ],
        //   where: whereClause,
        //   raw: true
        // });

        const totalExpensesResult = await Expense.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
            ],
            where: whereClause,
            raw: true
        });

        const totalBudget = parseFloat(budget.totalAmount);
        // const totalSpent = totalSpentResult ? parseFloat(totalSpentResult.getDataValue('totalSpent') || 0) : 0;
        const totalSpent = parseFloat(totalExpensesResult.totalSpent) || 0;

        const remaining = totalBudget - totalSpent;

        // Get recent monthly expenses (last 3 months)
        // First, determine which months to include based on current date
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

        // Get the 3 most recent months (including current month)
        const recentMonths = [];
        for (let i = 0; i < 3; i++) {
            // Calculate month number (handling wrapping around to previous year)
            const monthNum = ((currentMonth - i) <= 0)
                ? 12 + (currentMonth - i)
                : (currentMonth - i);
            recentMonths.push(monthNum);
        }

        // Get expense data for recent months
        const monthlyExpensesQuery = await Expense.findAll({
            attributes: [
                [sequelize.fn('date_part', 'month', sequelize.col('date')), 'month'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total']
            ],
            where: {
                club_id,
                date: {
                    // Look at expenses from the last 6 months to ensure we capture the data
                    [Op.gte]: new Date(now.getFullYear(), now.getMonth() - 5, 1)
                }
            },
            group: [sequelize.fn('date_part', 'month', sequelize.col('date'))]
        });

        // Map month numbers to month names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize expenses data for the 3 recent months
        const monthlyExpenses = {
            labels: recentMonths.map(m => monthNames[m - 1]).reverse(), // Reverse to show oldest first
            data: Array(3).fill(0)
        };

        // Fill in data from the database
        monthlyExpensesQuery.forEach(expense => {
            const month = parseInt(expense.getDataValue('month'));
            const monthIndex = recentMonths.indexOf(month);

            if (monthIndex !== -1) {
                // We need to reverse the index since we reversed the labels
                const reversedIndex = 2 - monthIndex;
                monthlyExpenses.data[reversedIndex] = parseFloat(expense.getDataValue('total') || 0);
            }
        });

        // Format response
        const response = {
            budgetSummary: {
                totalBudget,
                totalSpent,
                remaining,
                fiscalYear: budget.fiscalYear
            },
            recentExpenses: monthlyExpenses
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error getting club budget stats:', error);
        return res.status(500).json({
            message: 'Failed to retrieve club budget statistics',
            error: error.message
        });
    }
};

module.exports = {
    getClubBudgetStats
};