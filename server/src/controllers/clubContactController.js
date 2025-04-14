const { ClubContact } = require('../models');

// GET /api/club-contacts/:club_id
const getClubContact = async (req, res) => {
  const { club_id } = req.params;

  try {
    const contact = await ClubContact.findOne({ where: { club_id } });

    if (!contact) {
      return res.status(200).json({}); // Return empty if not found
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching club contact:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/club-contacts
const updateClubContact = async (req, res) => {
  const { club_id, phone, email, instagram, whatsapp } = req.body;

  if (!club_id) {
    return res.status(400).json({ message: "club_id is required" });
  }

  try {
    const [contact, created] = await ClubContact.upsert({
      club_id,
      phone,
      email,
      instagram,
      whatsapp,
      updated_at: new Date()
    });

    return res.status(200).json({
      message: created ? "Contact created" : "Contact updated",
      data: contact
    });
  } catch (error) {
    console.error("Error saving club contact:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getClubContact,
  updateClubContact
};