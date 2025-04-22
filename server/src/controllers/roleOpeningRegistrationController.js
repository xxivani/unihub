'use strict';
const { RoleOpeningRegistration, RoleOpening, sequelize } = require('../models');
const path = require('path');
const fs = require('fs');

// Get all role opening registrations
const getAllRoleOpeningRegistrations = async (req, res) => {
  try {
    const roleOpeningRegistrations = await RoleOpeningRegistration.findAll({
      order: [['role_opening_registration_application_date', 'DESC']]
    });

    res.status(200).json(roleOpeningRegistrations);
  } catch (error) {
    console.error('Error fetching role opening registrations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a role opening registration
const createRoleOpeningRegistration = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      role_opening_id: rawRoleOpeningId,
      user_id: rawUserId,
      user_name,
      user_phone,
      user_email,
      applicant_suitability
    } = req.body;

    const role_opening_id = parseInt(rawRoleOpeningId, 10);
    const user_id = parseInt(rawUserId, 10);

    console.log('Parsed role_opening_id:', role_opening_id);
    console.log('Parsed user_id:', user_id);
    console.log('Full req.body:', req.body);
    console.log('Uploaded file info:', req.files?.pdf?.[0]);

    if (isNaN(role_opening_id)) {
      return res.status(400).json({ message: 'Invalid role_opening_id' });
    }

    if (isNaN(user_id)) {
      return res.status(400).json({ message: 'Invalid user_id' });
    }

    // Validate required fields
    if (!user_name || !user_phone || !user_email || !applicant_suitability) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.files?.pdf || !req.files.pdf[0]) {
      return res.status(400).json({ message: 'CV (PDF) file is required' });
    }

    // const pdfFilename = req.files.pdf[0].filename;
    // const applicant_cv_url = `/uploads/pdfs/${pdfFilename}`;
    const pdfFile = req.files?.pdf?.[0];
    if (!pdfFile) {
      return res.status(400).json({ message: 'CV (PDF) file is required' });
    }
    const applicant_cv_url = `/uploads/pdfs/${pdfFile.filename}`;

    // Check if the role opening exists
    const roleOpening = await RoleOpening.findByPk(role_opening_id, { transaction: t });
    if (!roleOpening) {
      await t.rollback();
      return res.status(404).json({ message: 'Role opening not found' });
    }

    if (roleOpening.status === 'COMPLETED') {
      await t.rollback();
      return res.status(400).json({ message: 'Cannot register for a completed role opening' });
    }

    const roleOpeningRegistration = await RoleOpeningRegistration.create({
      role_opening_id,
      user_id,
      user_name,
      user_phone,
      user_email,
      applicant_suitability,
      applicant_cv_url,
      role_opening_registration_application_date: new Date()
    }, { transaction: t });

    const updatedCount = await RoleOpeningRegistration.count({
      where: { role_opening_id },
      transaction: t
    });

    await roleOpening.update({
      number_of_registrations: updatedCount
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Role opening registration created successfully',
      roleOpeningRegistration
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating role opening registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateRegistrationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const registration = await RoleOpeningRegistration.findByPk(id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    registration.status = status;
    await registration.save();

    res.status(200).json(registration);
  } catch (err) {
    console.error("Status update failed:", err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

module.exports = {
  getAllRoleOpeningRegistrations,
  createRoleOpeningRegistration,
  updateRegistrationStatus
};