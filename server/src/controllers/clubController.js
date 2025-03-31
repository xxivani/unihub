const { Club } = require('../models');


const createClub = async (req, res) => {
  try {
    const {
      club_name,
      club_description,
      club_thumbnail_url,
      club_category
    } = req.body;

    if (!club_name || !club_description || !club_category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newClub = await Club.create({
      club_name,
      club_description,
      club_thumbnail_url,
      club_category,
      club_created_at: new Date()
    });

    res.status(201).json({ message: "Club created successfully", club: newClub });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      order: [['club_created_at', 'DESC']]
    });
    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    const club = await Club.findByPk(id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    await club.update(req.body);
    res.status(200).json({ message: "Club updated successfully", club });
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    const club = await Club.findByPk(id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    await club.destroy();
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getClubById = async (req, res) => {
  try {
      const clubId = req.params.id;
      const club = await Club.findByPk(clubId);

      if (!club) {
          return res.status(404).json({ error: "Club not found" });
      }

      res.status(200).json(club);
  } catch (error) {
      console.error("Error fetching club by ID:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  updateClub,
  deleteClub,
  getClubById
};
