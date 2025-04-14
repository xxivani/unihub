const express = require('express');
const router = express.Router();
const {
  getClubContact,
  updateClubContact
} = require('../controllers/clubContactController');

router.get('/:club_id', getClubContact);
router.post('/', updateClubContact);

module.exports = router;