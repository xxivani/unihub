const express = require('express');
const router = express.Router();
const { joinClub, leaveClub, getUserMemberships } = require('../controllers/clubMembershipController');

/**
 * @swagger
 * tags:
 *   name: ClubMembership
 *   description: Endpoints for joining and leaving clubs
 */

/**
 * @swagger
 * /club-memberships:
 *   post:
 *     summary: Join a club
 *     tags: [ClubMembership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - clubId
 *             properties:
 *               userId:
 *                 type: integer
 *               clubId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Joined club successfully
 *       400:
 *         description: Already joined
 *       500:
 *         description: Server error
 */
router.post('/', joinClub);

/**
 * @swagger
 * /club-memberships/leave:
 *   post:
 *     summary: Leave a club
 *     tags: [ClubMembership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - clubId
 *             properties:
 *               userId:
 *                 type: integer
 *               clubId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Left club successfully
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Server error
 */
router.post('/leave', leaveClub);

/**
 * @swagger
 * /club-memberships/user/{userId}:
 *   get:
 *     summary: Get all club IDs that a user has joined
 *     tags: [ClubMembership]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of club IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', getUserMemberships);



module.exports = router;
