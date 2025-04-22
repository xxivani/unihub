const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { upload, uploadMiddleware } = require('../middleware/upload');

router.get('/', newsController.getAllNewsPosts);

router.get('/last-modified', newsController.getLastModified);

router.get('/:id', newsController.getNewsPostById);

router.post('/', uploadMiddleware.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), newsController.createNewsPost);

router.put('/:id', uploadMiddleware.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), newsController.updateNewsPost);

router.delete('/:id', newsController.deleteNewsPost);

module.exports = router;