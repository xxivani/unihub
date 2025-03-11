// server/src/routes/news.js
const express = require('express');
const router = express.Router();
const { createNewsPost, getAllNewsPosts, upload } = require('../controllers/newsController');

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

module.exports = router;
