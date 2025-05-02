const express = require('express');
const router = express.Router();
const {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub
} = require('../controllers/clubController');

const { upload } = require('../middleware/upload'); 

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Club management
 */

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Create a new club
 *     tags: [Clubs]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               club_name:
 *                 type: string
 *               club_description:
 *                 type: string
 *               club_category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Club created successfully
 *       500:
 *         description: Server error
 */
router.post('/', upload, createClub);

/**
 * @swagger
 * /clubs:
 *   get:
 *     summary: Get all clubs
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
 *   get:
 *     summary: Get a single club by ID
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Club data
 *       404:
 *         description: Club not found
 */
router.get('/:id', getClubById);

/**
 * @swagger
 * /clubs/{id}:
 *   put:
 *     summary: Update a club
 *     tags: [Clubs]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               club_name:
 *                 type: string
 *               club_description:
 *                 type: string
 *               club_category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Club updated successfully
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
router.put('/:id', upload, updateClub);

/**
 * @swagger
 * /clubs/{id}:
 *   delete:
 *     summary: Delete a club
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Club deleted
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteClub);

module.exports = router;
