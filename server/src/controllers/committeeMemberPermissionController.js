'use strict';
const { CommitteeMember, CommitteeMemberPermission } = require('../models');

// Update committee member permissions (not allowed for PRESIDENT)
const updateCommitteeMemberPermissions = async (req, res) => {
  try {
    const { committee_member_id } = req.params;
    const { permissions } = req.body; // Expecting array of permission strings

    // Validate input
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Permissions must be an array.' });
    }

    const member = await CommitteeMember.findByPk(committee_member_id);
    if (!member) {
      return res.status(404).json({ message: 'Committee member not found.' });
    }

    if (member.committee_member_position === 'PRESIDENT') {
      return res.status(403).json({ message: 'Cannot modify permissions for PRESIDENT.' });
    }

    // Delete old permissions
    await CommitteeMemberPermission.destroy({
      where: { committee_member_id }
    });

    // Insert new permissions
    const newPermissions = permissions.map(permission => ({
      committee_member_id,
      permission
    }));

    await CommitteeMemberPermission.bulkCreate(newPermissions);

    res.status(200).json({ message: 'Permissions updated successfully.', permissions });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ error: error.message });
  }
};

const getPermissionsByCommitteeMemberId = async (req, res) => {
    try {
      const { committee_member_id } = req.params;
  
      const permissions = await CommitteeMemberPermission.findAll({
        where: { committee_member_id }
      });
  
      res.status(200).json(permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ error: error.message });
    }
};

const getAllPermissions = (req, res) => {
  try {
    const allPermissions = CommitteeMemberPermission.rawAttributes.permission.validate.isIn[0];
    res.status(200).json(allPermissions);
  } catch (error) {
    console.error("Error fetching all permissions:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateCommitteeMemberPermissions,
  getPermissionsByCommitteeMemberId,
  getAllPermissions
};