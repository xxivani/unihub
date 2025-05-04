const { Club, Budget } = require('../models');
const { createDefaultBudget } = require('./budget-tracker/budgetController');
const path = require('path');
const fs = require('fs');

const createClub = async (req, res) => {
  try {
    console.log(req.body);
    const { club_name, club_description, club_category, club_budget } = req.body;
    const imageFile = req.files?.image?.[0];

    const club_thumbnail_url = imageFile
      ? `/uploads/images/${imageFile.filename}`
      : '/uploads/images/default.jpg';

      const newClub = await Club.create({
        club_name,
        club_description,
        club_thumbnail_url,
        club_category,
        club_created_at: new Date(),
      });
      
      
      await createDefaultBudget(newClub.club_id, club_budget);

    res.status(201).json({
      message: 'Club created successfully',
      club: newClub
    });
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ message: 'Failed to create club', error: error.message });
  }
};

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({ order: [['club_created_at', 'DESC']] });
    res.status(200).json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ message: 'Failed to retrieve clubs' });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ message: 'Failed to retrieve club' });
  }
};

const updateClub = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const { club_name, club_description, club_category } = req.body;

    const updateData = {
      club_name: club_name || club.club_name,
      club_description: club_description || club.club_description,
      club_category: club_category || club.club_category
    };

    if (req.files?.image) {

      const oldImagePath = path.join(__dirname, '../../', club.club_thumbnail_url.replace(/^\/+/, ''));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.club_thumbnail_url = `/uploads/images/${req.files.image[0].filename}`;
    }

    await club.update(updateData);

    res.status(200).json({
      message: 'Club updated successfully',
      club
    });
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ message: 'Failed to update club', error: error.message });
  }
};

const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    
    const imagePath = path.join(__dirname, '../../', club.club_thumbnail_url.replace(/^\/+/, ''));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await club.destroy();
    await Budget.destroy({ where: { club_id: req.params.id } });

    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ message: 'Failed to delete club', error: error.message });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub
};
