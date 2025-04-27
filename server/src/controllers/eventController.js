const { Event } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { json } = require('sequelize');

//file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'image') {
      uploadPath = path.join(__dirname, '../../uploads/event/images/');
    } else if (file.fieldname === 'json') {
      uploadPath = path.join(__dirname, '../../uploads/event/json/');
    }
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Saving ${file.fieldname} to: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'image') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    } else if (file.fieldname === 'json') {
      if (!file.originalname.match(/\.json$/)) {
        return cb(new Error('Only JSON files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

//Create an event
const createEvent = async (req, res) => {
  try {
    const {title, image, description, location, time, club, date, deadline, capacity, followed, waiting, price, budget_required, budget, team, follower} = req.body;
    console.log('body:', req.body);
    const event = await Event.create({
      title,
      image: JSON.parse(image),
      description: description || "",
      location,
      time,
      club,
      date,
      deadline,
      capacity,
      followed,
      waiting,
      price,
      budget_required,
      budget: JSON.parse(budget),
      team: JSON.parse(team),
      follower: JSON.parse(follower),
      created: new Date(),
    });
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['title', 'ASC']]
    });
    const eventsData = events.map(event => event.get({ plain: true }));
    res.status(200).json(eventsData);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Get a event by ID
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Update an event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const {title, location, time, club, date, capacity, team} = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const updateData = {
      title: title || event.title,
      location: location || event.location,
      time: time || event.time,
      club: club || event.club,
      date: date || event.date,
      capacity: capacity || event.capacity,
      team: team || event.team,
      updatedAt: new Date(),
    };
    if (req.files?.image) {
      updateData.image[0] = `/uploads/event/images/${path.basename(req.files.image[0].path)}`;
    }
    await event.update(updateData);
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Delete an event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    /*if (event.image) {
      const imagePath = path.join(__dirname, '../../', event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }*/
    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const followEvent = async (req, res) => {
	const eventId = req.params.id;
	const { email, id } = req.body;
	try {
	  const event = await Event.findByPk(eventId);
	  if (!event) {
		return res.status(404).json({ error: 'Event not found' });
	  }
    let followers = [];
    try {
      followers = event.follower || '[]';
    } catch (err) {
      console.warn("Invalid JSON");
    }
    if (followers.some(f => f.id == id)) {
      return res.status(400).json({ error: 'Already followed event' });
    }
    if (event.followed >= event.capacity) {
    return res.status(400).json({ error: 'Event is full' });
    }
    followers.push({ email, id });
    event.follower = followers;
    event.changed('follower', true);
	  event.followed += 1;
    event.changed('followed', true);
	  await event.save();
    console.log('Saved follower:', event.follower);
	  res.status(200).json(event);
	} catch (error) {
	  console.error('Error signing up for event:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };

const unfollowEvent = async (req, res) => {
	const eventId = req.params.id;
	const { email, id } = req.body;
  
	try {
	  const event = await Event.findByPk(eventId);
	  if (!event) {
		return res.status(404).json({ error: 'Event not found' });
	  }
    let followers = [];
    try {
      followers = event.follower || '[]';
    } catch (err) {
      console.warn("Invalid JSON");
    }
	  if (followers.some(f => f.id == id)) {
      if (event.followed > 0) {
        followers = followers.filter(follower => follower.email !== email && follower.id !== id);
        event.follower = followers;
        event.changed('follower', true);
        event.followed -= 1;
        event.changed('followed', true);
        await event.save();
        } else {
        return res.status(400).json({ error: 'No attendees to remove' });
        }
      
        res.status(200).json(event);
    }
    else {
      return res.status(400).json({ error: 'Not following the event' });
    }
	} catch (error) {
	  console.error('Error unfollowing event:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  followEvent,
  unfollowEvent,
  upload
};
