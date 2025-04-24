const express = require('express');
const router = express.Router();
const { 
    createRoleOpening,
    getAllRoleOpenings,
    updateRoleOpening,
    deleteRoleOpening,
    getRoleOpeningById
} = require('../controllers/roleOpeningController');
const { upload } = require('../middleware/upload');

/**
 * @swagger
 * /role-openings:
 *   post:
 *     summary: Create a role opening (President & VP only)
 *     tags: [Role Openings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *               description:
 *                 type: string
 *               eligibility_criteria:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *             required:
 *               - position
 *               - description
 *               - eligibility_criteria
 *               - due_date
 *     responses:
 *       201:
 *         description: Role opening created successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post('/', upload, createRoleOpening);

/**
 * @swagger
 * /role-openings:
 *   get:
 *     summary: Retrieve all role openings
 *     tags: [Role Openings]
 *     responses:
 *       200:
 *         description: A list of role openings.
 *       500:
 *         description: Server error.
 */
router.get('/', getAllRoleOpenings);

/**
 * @swagger
 * /role-openings/{id}:
 *   put:
 *     summary: Update a role opening (President & VP only)
 *     tags: [Role Openings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role opening ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               eligibility_criteria:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Role opening updated successfully.
 *       400:
 *         description: Bad request or update conditions not met.
 *       404:
 *         description: Role opening not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', upload, updateRoleOpening);

/**
 * @swagger
 * /role-openings/{id}:
 *   delete:
 *     summary: Delete a role opening (President & VP only)
 *     tags: [Role Openings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role opening ID
 *     responses:
 *       200:
 *         description: Role opening deleted successfully.
 *       404:
 *         description: Role opening not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteRoleOpening);

router.get('/:id', getRoleOpeningById);

module.exports = router;