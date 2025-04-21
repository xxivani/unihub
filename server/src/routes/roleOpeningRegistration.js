const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const {
  getAllRoleOpeningRegistrations,
  createRoleOpeningRegistration,
  updateRegistrationStatus
} = require('../controllers/roleOpeningRegistrationController');

router.get('/', getAllRoleOpeningRegistrations);
router.post('/', upload, createRoleOpeningRegistration);
// router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }]), createRoleOpeningRegistration);
router.put('/:id', updateRegistrationStatus);

module.exports = router;