'use strict';
const { CommitteeMember, CommitteeMemberPermission } = require('../models');

// CREATE a new committee member
const createCommitteeMember = async (req, res) => {
  try {
    const {
      user_id,
      committee_member_name,
      committee_member_email,
      committee_member_description,
      committee_member_position,
      club_id
    } = req.body;

    if (
      !user_id || !committee_member_name || !committee_member_email ||
      !committee_member_description || !committee_member_position || !club_id
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMember = await CommitteeMember.create({
      user_id,
      committee_member_name,
      committee_member_email,
      committee_member_description,
      committee_member_position,
      club_id
    });

    res.status(201).json({ message: 'Committee member created.', data: newMember });
  } catch (error) {
    console.error('Error creating committee member:', error);
    res.status(500).json({ error: error.message });
  }
};

// READ all committee members
const getAllCommitteeMembers = async (req, res) => {
  try {
    const members = await CommitteeMember.findAll({
      include: [{ model: CommitteeMemberPermission, as: 'permissions' }]
    });
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching committee members:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE a committee member
const deleteCommitteeMember = async (req, res) => {
  try {
    const id = req.params.id;
    const member = await CommitteeMember.findByPk(id);

    if (!member) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    await member.destroy();
    res.status(200).json({ message: 'Committee member deleted' });
  } catch (error) {
    console.error('Error deleting committee member:', error);
    res.status(500).json({ error: error.message });
  }
};

const getCommitteeMemberByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const member = await CommitteeMember.findOne({
        where: { user_id: userId },
        include: [{ model: CommitteeMemberPermission, as: 'permissions' }]
      });
  
      if (!member) {
        return res.status(404).json({ message: 'Committee member not found' });
      }
  
      res.status(200).json(member);
    } catch (error) {
      console.error('Error fetching committee member by userId:', error);
      res.status(500).json({ error: error.message });
    }
};

// Get committee members by club ID
const getCommitteeMembersByClubId = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    if (!clubId) {
      return res.status(400).json({ message: 'Club ID is required' });
    }
    
    const members = await CommitteeMember.findAll({
      where: { club_id: clubId },
      include: [{ model: CommitteeMemberPermission, as: 'permissions' }]
    });
    
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching committee members by club ID:', error);
    res.status(500).json({ error: error.message });
  }
};
  
module.exports = {
  createCommitteeMember,
  getAllCommitteeMembers,
  deleteCommitteeMember,
  getCommitteeMemberByUserId,
  getCommitteeMembersByClubId
};