const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// The upload mount has already been configured in the newsController, so not sure if this should exist as a seperate file, needs to be checked ***


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === "image") {
      uploadPath = path.join(__dirname, '../../uploads/images');
    } else if (file.fieldname === "pdf") {
      uploadPath = path.join(__dirname, '../../uploads/pdfs');
    }
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = { upload };