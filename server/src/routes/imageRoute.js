const express = require('express');
const router = express.Router();
const { 
  createImage, 
  getAllImages, 
  getImageById, 
  updateImage, 
  deleteImage,
  upload 
} = require('../controllers/imageController');


router.post(
  '/',
  upload.fields([
    { name: "image", maxCount: 8 }
  ]),
  createImage
);


router.get('/', getAllImages);


router.get('/:id', getImageById);


router.put(
  '/:id',
  upload.fields([
    { name: "image", maxCount: 8 },
  ]),
  updateImage
);

router.delete('/:id', deleteImage);

module.exports = router;