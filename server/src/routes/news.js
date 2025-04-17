const express = require('express');
const router = express.Router();
const { 
  createNewsPost, 
  getAllNewsPosts, 
  getNewsPostById, 
  updateNewsPost, 
  deleteNewsPost 
} = require('../controllers/newsController');
const { upload } = require('../middleware/upload');

router.post('/', upload, createNewsPost);
router.get('/', getAllNewsPosts);
router.get('/:id', getNewsPostById);
router.put('/:id', upload, updateNewsPost);
router.delete('/:id', deleteNewsPost);

module.exports = router;