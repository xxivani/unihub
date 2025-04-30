const express = require('express');
const router = express.Router();
const { getClubBudgetStats } = require('../controllers/clubStatisticsController');

/**
 * @swagger
 * /club-stats/budget:
 *   get:
 *     summary: Get budget statistics for a specific club
 *     tags: [Club Statistics]
 *     parameters:
 *       - in: query
 *         name: club_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Club ID
 *     responses:
 *       200:
 *         description: Budget statistics retrieved successfully
 *       400:
 *         description: Club ID is required
 *       404:
 *         description: No budget found for this club
 *       500:
 *         description: Server error
 */
router.get('/budget', getClubBudgetStats);

module.exports = router;