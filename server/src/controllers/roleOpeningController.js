'use strict';
const { RoleOpening, RoleOpeningRegistration } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

// Create a role opening
const createRoleOpening = async (req, res) => {
  try {
    const { position, description, eligibility_criteria, due_date, club_id } = req.body;

    if (!position || !description || !eligibility_criteria || !due_date) {
      return res.status(400).json({ message: 'Position, description, eligibility criteria, and due date are required' });
    }

    const roleOpening = await RoleOpening.create({
      position,
      description,
      eligibility_criteria,
      due_date: new Date(due_date),
      club_id: club_id || 1,
      number_of_registrations: 0, // Default value
      status: 'ONGOING', // Default value
      role_opening_created_at: new Date()
    });

    res.status(201).json({
      message: 'Role opening created successfully',
      roleOpening
    });
  } catch (error) {
    console.error('Error creating role opening:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all role openings
const getAllRoleOpenings = async (req, res) => {
  try {
    const roleOpenings = await RoleOpening.findAll({
      order: [
        [sequelize.literal(`CASE WHEN status = 'ONGOING' THEN 0 ELSE 1 END`), 'ASC'],
        ['role_opening_created_at', 'DESC']
      ]
    });
    
    for (const role of roleOpenings) {
      const count = await RoleOpeningRegistration.count({
        where: { role_opening_id: role.role_opening_id }
      });

      // Update only if out of sync
      if (role.number_of_registrations !== count) {
        await role.update({ number_of_registrations: count });
      }
    }

    res.status(200).json(roleOpenings);
  } catch (error) {
    console.error('Error fetching role openings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a role opening
const updateRoleOpening = async (req, res) => {
  try {
    const roleOpeningId = req.params.id;
    const { description, eligibility_criteria, due_date } = req.body;

    // Find the role opening
    const roleOpening = await RoleOpening.findByPk(roleOpeningId);

    if (!roleOpening) {
      return res.status(404).json({ message: 'Role opening not found' });
    }

    // Prevent updates if status is "COMPLETED"
    if (roleOpening.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Cannot update a role opening with completed status' });
    }

    // Allow updating only description, eligibility criteria, and postponing the due date
    if (due_date && new Date(due_date) < roleOpening.due_date) {
      return res.status(400).json({ message: 'Due date can only be postponed' });
    }

    const updateData = {
      description: description || roleOpening.description,
      eligibility_criteria: eligibility_criteria || roleOpening.eligibility_criteria,
      due_date: due_date ? new Date(due_date) : roleOpening.due_date
    };

    await roleOpening.update(updateData);

    res.status(200).json({
      message: 'Role opening updated successfully',
      roleOpening
    });
  } catch (error) {
    console.error('Error updating role opening:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a role opening
const deleteRoleOpening = async (req, res) => {
  try {
    const roleOpeningId = req.params.id;

    // Find the role opening
    const roleOpening = await RoleOpening.findByPk(roleOpeningId);

    if (!roleOpening) {
      return res.status(404).json({ message: 'Role opening not found' });
    }

    await roleOpening.destroy();

    res.status(200).json({ message: 'Role opening deleted successfully' });
  } catch (error) {
    console.error('Error deleting role opening:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRoleOpeningById = async (req, res) => {
  try {
    const roleOpening = await RoleOpening.findByPk(req.params.id);
    if (!roleOpening) return res.status(404).json({ error: "Role opening not found" });

    res.status(200).json(roleOpening);
  } catch (err) {
    console.error("Error fetching role opening by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createRoleOpening,
  getAllRoleOpenings,
  updateRoleOpening,
  deleteRoleOpening,
  getRoleOpeningById
};