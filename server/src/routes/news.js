const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

router.get('/', newsController.getAllNewsPosts);

router.get('/last-modified', newsController.getLastModified);

router.get('/:id', newsController.getNewsPostById);

router.post('/', authenticateJWT, isAdmin, newsController.upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), newsController.createNewsPost);

router.put('/:id', authenticateJWT, isAdmin, newsController.upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), newsController.updateNewsPost);

router.delete('/:id', authenticateJWT, isAdmin, newsController.deleteNewsPost);

module.exports = router;