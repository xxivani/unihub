const Event = require("../models/Event");

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, date, isExternal } = req.body;
    const newEvent = await Event.create({ title, description, date, isExternal });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
};

module.exports = { getAllEvents, createEvent };
