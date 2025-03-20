const { ExternalEvent } = require('../models');

// Create an event
const createExternalEvent = async (req, res) => {
  try {
    const event = await ExternalEvent.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events
const getAllExternalEvents = async (req, res) => {
  try {
    const events = await ExternalEvent.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single event by ID
const getExternalEventById = async (req, res) => {
  try {
    const event = await ExternalEvent.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event
const updateExternalEvent = async (req, res) => {
  try {
    const event = await ExternalEvent.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event
const deleteExternalEvent = async (req, res) => {
  try {
    const event = await ExternalEvent.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.destroy();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExternalEvent,
  getAllExternalEvents,
  getExternalEventById,
  updateExternalEvent,
  deleteExternalEvent
};
