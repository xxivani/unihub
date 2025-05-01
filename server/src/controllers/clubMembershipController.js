const { ClubMembership } = require('../models');


const joinClub = async (req, res) => {
  const { userId, clubId } = req.body;

  try {
    
    const existingMembership = await ClubMembership.findOne({
      where: { userId, clubId }
    });

    if (existingMembership) {
      return res.status(400).json({ error: "Already a member" });
    }

    
    await ClubMembership.create({ userId, clubId });
    res.status(201).json({ message: "Joined club successfully" });
  } catch (error) {
    console.error("Join club error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const leaveClub = async (req, res) => {
  const { userId, clubId } = req.body;

  try {
    const membership = await ClubMembership.findOne({
      where: { userId, clubId }
    });

    if (!membership) {
      return res.status(404).json({ error: "Membership not found" });
    }

    await membership.destroy();
    res.status(200).json({ message: "Left club successfully" });
  } catch (error) {
    console.error("Leave club error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const getUserMemberships = async (req, res) => {
  const { userId } = req.params;

  try {
    const memberships = await ClubMembership.findAll({
      where: { userId },
      attributes: ['clubId', 'createdAt'] 
    });

    res.json(memberships); 
  } catch (error) {
    console.error("Error fetching user memberships:", error);
    res.status(500).json({ error: "Failed to fetch memberships" });
  }
};


module.exports = {
  joinClub,
  leaveClub,
  getUserMemberships, 
};
