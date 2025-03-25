// server/src/routes/committeeMember.js
const express = require('express');
const router = express.Router();

const {
  createCommitteeMember,
  getAllCommitteeMembers,
  deleteCommitteeMember,
  getCommitteeMemberByUserId
} = require('../controllers/committeeMemberController');

/**
 * @swagger
 * /committee-members:
 *   post:
 *     summary: Create a new committee member
 *     tags: [Committee Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               committee_member_name:
 *                 type: string
 *               committee_member_email:
 *                 type: string
 *               committee_member_description:
 *                 type: string
 *               committee_member_position:
 *                 type: string
 *               club_id:
 *                 type: integer
 *             required:
 *               - user_id
 *               - committee_member_name
 *               - committee_member_email
 *               - committee_member_description
 *               - committee_member_position
 *               - club_id
 *     responses:
 *       201:
 *         description: Committee member created.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post('/', createCommitteeMember);

/**
 * @swagger
 * /committee-members:
 *   get:
 *     summary: Get all committee members with their permissions
 *     tags: [Committee Members]
 *     responses:
 *       200:
 *         description: A list of committee members.
 *       500:
 *         description: Server error.
 */
router.get('/', getAllCommitteeMembers);

/**
 * @swagger
 * /committee-members/{id}:
 *   put:
 *     summary: Update a committee member
 *     tags: [Committee Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Committee member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               committee_member_name:
 *                 type: string
 *               committee_member_email:
 *                 type: string
 *               committee_member_description:
 *                 type: string
 *               committee_member_position:
 *                 type: string
 *               club_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Committee member updated successfully.
 *       404:
 *         description: Committee member not found.
 *       500:
 *         description: Server error.
 */
// router.put('/:id', updateCommitteeMember);

/**
 * @swagger
 * /committee-members/{id}:
 *   delete:
 *     summary: Delete a committee member
 *     tags: [Committee Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Committee member ID
 *     responses:
 *       200:
 *         description: Committee member deleted successfully.
 *       404:
 *         description: Committee member not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteCommitteeMember);

router.get('/by-user/:userId', getCommitteeMemberByUserId);

module.exports = router;