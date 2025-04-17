const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    if (file.fieldname === 'image') {
      uploadPath = '/app/uploads/images/';
    } else if (file.fieldname === 'pdf') {
      uploadPath = '/app/uploads/pdfs/';
    } else {
      uploadPath = '/app/uploads/misc/';
    }
    
    ensureDirectoryExists(uploadPath);
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
    } else if (file.fieldname === 'pdf') {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('Only PDF files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

module.exports = { upload };