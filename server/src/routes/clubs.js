// server/src/routes/clubs.js
const express = require('express');
const router = express.Router();
const {
  createClub,
  getAllClubs,
  updateClub,
  deleteClub
} = require('../controllers/clubController');

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Club management endpoints
 */

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Create a new club (Admin only)
 *     tags: [Clubs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               club_name:
 *                 type: string
 *               club_description:
 *                 type: string
 *               club_thumbnail_url:
 *                 type: string
 *               club_category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Club created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', createClub);

/**
 * @swagger
 * /clubs:
 *   get:
 *     summary: Retrieve all clubs
 *     tags: [Clubs]
 *     responses:
 *       200:
 *         description: A list of clubs
 *       500:
 *         description: Server error
 */
router.get('/', getAllClubs);

/**
 * @swagger
 * /clubs/{id}:
 *   put:
 *     summary: Update a club by ID (Admin only)
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Club ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               club_name:
 *                 type: string
 *               club_description:
 *                 type: string
 *               club_thumbnail_url:
 *                 type: string
 *               club_category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Club updated successfully
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateClub);

/**
 * @swagger
 * /clubs/{id}:
 *   delete:
 *     summary: Delete a club by ID (Admin only)
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Club ID
 *     responses:
 *       200:
 *         description: Club deleted successfully
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteClub);

module.exports = router;
