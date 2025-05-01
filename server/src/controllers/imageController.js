const { image } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    try {
    if (file.fieldname === 'image') {
      uploadPath = path.join(__dirname, '../../uploads/imageM/images/');
    }
    
    fs.mkdirSync(uploadPath, { recursive: true });
    
    console.log(`Saving ${file.fieldname} to: ${uploadPath}`);
    
    cb(null, uploadPath);
    } catch (error) {
        console.error("Error uploading file:", error);
        cb(error, false);
    }
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'image') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|svg|xml|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    }
    cb(null, true);
  }
})

const createImage = async (req, res) => {
  try {
    const { eventType, eventName, position } = req.body;
    if (!eventType || !eventName || !position) {
      return res.status(400).json({ message: 'Some types are missing' });
    }
    
    const imageFilename = req.files?.image ? path.basename(req.files.image[0].path) : null;
    const imageUrl = imageFilename ? `/uploads/imageM/images/${imageFilename}` : null;
    
    const Image = await image.create({
      URL: imageUrl,
      eventType: eventType,
      eventName: eventName,
      eventType: eventType,
      position: position,
      brightness: 100,
      saturation: 100,
      blur: 0,
      inversion: 0,
      created_at: new Date(),
    });
    
    res.status(201).json({ 
      message: 'Image created successfully',
      Image
    });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await image.findAll();
    
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getImageById = async (req, res) => {
  try {
    const imageId = req.params.id;
    const images = await image.findByPk(imageId);
    
    if (!images) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const { URL, eventType, eventName, position, brightness, saturation, blur, inversion } = req.body;
    
    const images = await image.findByPk(imageId);
    
    if (!images) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const updateData = {
      URL,
      eventType,
      eventName,
      position,
      brightness,
      saturation,
      blur,
      inversion
    };
    
    if (req.files?.image) {
      updateData.URL = `/uploads/imageM/images/${path.basename(req.files.image[0].path)}`;
    }
    
    await images.update(updateData);
    
    res.status(200).json({ 
      message: 'Image updated successfully',
      images
    });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const images = await image.findByPk(imageId);
    
    if (!images) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (images.URL) {
      const basePath = fs.existsSync('/app/uploads') ? '/app' : path.resolve(__dirname, '../../');
      const imagePath = path.join(basePath, images.URL);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await images.destroy();
    
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
  upload
};