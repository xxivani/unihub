// server/src/routes/news.js
const express = require('express');
const router = express.Router();
const { 
  createNewsPost, 
  getAllNewsPosts, 
  getNewsPostById, 
  updateNewsPost, 
  deleteNewsPost,
  upload 
} = require('../controllers/newsController');

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a news post (Admin only)
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               pdf:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - body
 *               - pdf
 *     responses:
 *       201:
 *         description: News post created successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post(
  '/',
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  createNewsPost
);

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Retrieve all news posts
 *     tags: [News]
 *     responses:
 *       200:
 *         description: A list of news posts.
 *       500:
 *         description: Server error.
 */
router.get('/', getAllNewsPosts);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get a single news post by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: News post ID
 *     responses:
 *       200:
 *         description: News post retrieved successfully.
 *       404:
 *         description: News post not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', getNewsPostById);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update a news post (Admin only)
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: News post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: News post updated successfully.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: News post not found.
 *       500:
 *         description: Server error.
 */
router.put(
  '/:id',
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  updateNewsPost
);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news post (Admin only)
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: News post ID
 *     responses:
 *       200:
 *         description: News post deleted successfully.
 *       404:
 *         description: News post not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteNewsPost);

module.exports = router;