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
      const { id } = req.params;
      const updateData = req.body;

      console.log("Incoming ID:", id);
      console.log("Incoming update data:", updateData);

      if (!Object.keys(updateData).length) {
          return res.status(400).json({ message: "No update data provided." });
      }

      const [updatedRows] = await ExternalEvent.update(updateData, {
          where: { external_event_id: id },
      });

      if (updatedRows === 0) {
          return res.status(404).json({ message: "Event not found." });
      }

      const updatedEvent = await ExternalEvent.findByPk(id);
      res.status(200).json(updatedEvent);
  } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
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

const signupForExternalEvent = async (req, res) => {
	const { id } = req.params;
	const { name, studentId, year, email, userId } = req.body;
  
	try {
	  // Find the event
	  const event = await ExternalEvent.findByPk(id);
	  if (!event) {
		return res.status(404).json({ error: 'Event not found' });
	  }
  
	  // Check if capacity is reached
	  if (event.external_event_number_of_attendees >= event.external_event_max_number_of_attendees) {
		return res.status(400).json({ error: 'Event is full' });
	  }
  
	  // Increment the number of attendees
	  event.external_event_number_of_attendees = (event.external_event_number_of_attendees || 0) + 1;
	  await event.save();
  
	  // Optionally, save signup details to a separate table (e.g., EventSignups)
	  // await EventSignup.create({ eventId: id, userId, name, studentId, year, email });
  
	  res.status(200).json(event);
	} catch (error) {
	  console.error('Error signing up for event:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };

  const unfollowExternalEvent = async (req, res) => {
	const { eventId, userId } = req.body;
  
	try {
	  const event = await ExternalEvent.findByPk(eventId);
	  if (!event) {
		return res.status(404).json({ error: 'Event not found' });
	  }
  
	  // For simplicity, decrease attendees if > 0
	  if (event.external_event_number_of_attendees > 0) {
		event.external_event_number_of_attendees -= 1;
		await event.save();
	  } else {
		return res.status(400).json({ error: 'No attendees to remove' });
	  }
  
	  res.status(200).json(event);
	} catch (error) {
	  console.error('Error unfollowing event:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };

module.exports = {
  createExternalEvent,
  getAllExternalEvents,
  getExternalEventById,
  updateExternalEvent,
  deleteExternalEvent,
  signupForExternalEvent,
  unfollowExternalEvent,
};
