const express = require('express');
const router = express.Router();
const {
  getCurrentBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getAllBudgets,
  testBudget,
  getBudgetByClubId
} = require('../controllers/budget-tracker/budgetController');

/**
 * @swagger
 * /budgets/current:
 *   get:
 *     summary: Get current budget
 *     tags: [Budget]
 *     responses:
 *       200:
 *         description: Current budget retrieved successfully.
 *       404:
 *         description: No budget found.
 *       500:
 *         description: Server error.
 */
router.get('/current', getCurrentBudget);

router.get('/club/:club_id', getBudgetByClubId);

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets (Admin only)
 *     tags: [Budget]
 *     responses:
 *       200:
 *         description: List of all budgets.
 *       500:
 *         description: Server error.
 */
router.get('/', getAllBudgets);

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budget]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 format: float
 *               fiscalYear:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - totalAmount
 *               - fiscalYear
 *     responses:
 *       201:
 *         description: Budget created successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post('/', createBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 format: float
 *               fiscalYear:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Budget updated successfully.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Budget not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', updateBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID
 *     responses:
 *       200:
 *         description: Budget deleted successfully.
 *       404:
 *         description: Budget not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteBudget);

module.exports = router;