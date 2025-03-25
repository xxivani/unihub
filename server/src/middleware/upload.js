// server/src/middleware/upload.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Helper function to ensure the directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === "image") {
      uploadPath = path.join(__dirname, '../../uploads/images');
    } else if (file.fieldname === "pdf") {
      uploadPath = path.join(__dirname, '../../uploads/pdfs');
    }
    // Ensure the target directory exists
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance with the defined storage
const upload = multer({ storage: storage });

module.exports = { upload };