// server/src/routes/committeeMemberPermissions.js
const express = require('express');
const router = express.Router();
const {
  updateCommitteeMemberPermissions,
  getPermissionsByCommitteeMemberId,
  getAllPermissions
} = require('../controllers/committeeMemberPermissionController');

router.get('/all-permissions', getAllPermissions);
/**
 * @swagger
 * /committee-member-permissions/{id}:
 *   put:
 *     summary: Update permissions for a committee member (except PRESIDENT)
 *     tags: [Committee Member Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Committee Member ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["CreateEvent", "UpdateLink"]
 *     responses:
 *       200:
 *         description: Permissions updated successfully.
 *       403:
 *         description: Cannot update permissions for PRESIDENT.
 *       404:
 *         description: Committee member not found.
 *       500:
 *         description: Server error.
 */
router.put('/:committee_member_id', updateCommitteeMemberPermissions);

router.get('/:committee_member_id', getPermissionsByCommitteeMemberId); 

module.exports = router;