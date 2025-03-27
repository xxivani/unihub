const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getBudgetSummary,
  getMonthlyExpenses,
  getExpenseBreakdown
} = require('../controllers/budget-tracker/bt_dashboardController');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get all dashboard data (combined endpoint)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: All dashboard data retrieved successfully.
 *       404:
 *         description: No budget found.
 *       500:
 *         description: Server error.
 */
router.get('/', getDashboardData);

/**
 * @swagger
 * /dashboard/budget-summary:
 *   get:
 *     summary: Get budget summary (total, spent, remaining)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Budget summary retrieved successfully.
 *       404:
 *         description: No budget found.
 *       500:
 *         description: Server error.
 */
router.get('/budget-summary', getBudgetSummary);

/**
 * @swagger
 * /dashboard/monthly-expenses:
 *   get:
 *     summary: Get monthly expenses for chart
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: fiscalYear
 *         schema:
 *           type: string
 *         description: Fiscal year to filter expenses (e.g., 2023)
 *     responses:
 *       200:
 *         description: Monthly expenses retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get('/monthly-expenses', getMonthlyExpenses);

/**
 * @swagger
 * /dashboard/expense-breakdown:
 *   get:
 *     summary: Get expense breakdown by category
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Expense breakdown retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get('/expense-breakdown', getExpenseBreakdown);

module.exports = router;