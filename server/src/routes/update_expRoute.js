const express = require('express');
const router = express.Router();
const {
  updateCategoryExpenses,
  updateMonthlyExpenses,
  updateTotalBudget,
  updateTotalSpent
} = require('../controllers/budget-tracker/update_exp_ctgController');

/**
 * @swagger
 * /expense-updates/categories:
 *   post:
 *     summary: Update expenses by category
 *     tags: [Budget Tracker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categories:
 *                 type: object
 *                 description: Key-value pairs of category names and their new amounts
 *     responses:
 *       200:
 *         description: Category expenses updated successfully
 *       400:
 *         description: No category data provided
 *       500:
 *         description: Server error
 */
router.post('/categories', updateCategoryExpenses);

/**
 * @swagger
 * /expense-updates/monthly:
 *   post:
 *     summary: Update monthly expenses
 *     tags: [Budget Tracker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 description: Month name (e.g., 'Jan', 'Feb')
 *               amount:
 *                 type: number
 *                 description: New total amount for the month
 *               semester:
 *                 type: number
 *                 description: Semester number (1 or 2)
 *     responses:
 *       200:
 *         description: Monthly expenses updated successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/monthly', updateMonthlyExpenses);

/**
 * @swagger
 * /expense-updates/budget:
 *   post:
 *     summary: Update total budget
 *     tags: [Budget Tracker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 description: New total budget amount
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       400:
 *         description: Total budget amount is required
 *       404:
 *         description: No budget found
 *       500:
 *         description: Server error
 */
router.post('/budget', updateTotalBudget);

// In your expenseUpdateRoutes.js file
/**
 * @swagger
 * /expense-updates/spent:
 *   post:
 *     summary: Update total spent amount
 *     tags: [Budget Tracker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalSpent:
 *                 type: number
 *                 description: New total spent amount
 *     responses:
 *       200:
 *         description: Total spent updated successfully
 *       400:
 *         description: Total spent amount is required
 *       404:
 *         description: No categories found to allocate expense
 *       500:
 *         description: Server error
 */
router.post('/spent', updateTotalSpent);

module.exports = router;