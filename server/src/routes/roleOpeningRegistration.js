const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const {
  getAllRoleOpeningRegistrations,
  createRoleOpeningRegistration,
  updateRegistrationStatus
} = require('../controllers/roleOpeningRegistrationController');

/**
 * @swagger
 * /role-opening-registrations:
 *   get:
 *     summary: Get all role opening registrations
 *     tags: [Role Opening Registrations]
 *     responses:
 *       200:
 *         description: List of role opening registrations
 *       500:
 *         description: Server error
 */
router.get('/', getAllRoleOpeningRegistrations);

/**
 * @swagger
 * /role-opening-registrations:
 *   post:
 *     summary: Create a new role opening registration
 *     tags: [Role Opening Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_opening_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               user_phone:
 *                 type: string
 *               user_email:
 *                 type: string
 *               applicant_suitability:
 *                 type: string
 *               applicant_cv_url:
 *                 type: string
 *             required:
 *               - role_opening_id
 *               - user_name
 *               - user_phone
 *               - user_email
 *               - applicant_suitability
 *               - applicant_cv_url
 *     responses:
 *       201:
 *         description: Registration created
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Role opening not found
 *       500:
 *         description: Server error
 */
// router.post('/', createRoleOpeningRegistration);
router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }]), createRoleOpeningRegistration);

router.put('/:id', updateRegistrationStatus);

module.exports = router;