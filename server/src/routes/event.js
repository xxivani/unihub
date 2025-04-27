// server/src/routes/event.js
const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent,
  followEvent, 
  unfollowEvent,
  upload 
} = require('../controllers/eventController');

router.post(
  '/',
  upload.single("image"),
  createEvent
);

router.get('/', getAllEvents);

router.get('/:id', getEventById);

router.put(
  '/:id',
  upload.fields([
    { name: "image", maxCount: 8 },
    { name: "json", maxCount: 1 }
  ]),
  updateEvent
);

router.delete('/:id', deleteEvent);

router.post('/follow/:id', followEvent);

router.post('/unfollow/:id', unfollowEvent);

module.exports = router;
